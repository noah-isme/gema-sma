import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { QuizSessionMode, QuizSessionStatus } from '@prisma/client'
import { generateSessionCode, normalizeJson, sanitizeText } from '@/lib/quiz/utils'

const SESSION_MODES = new Set<string>(Object.values(QuizSessionMode))

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quizId') ?? undefined
  const limitRaw = Number.parseInt(searchParams.get('limit') ?? '', 10)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 25

  try {
    const sessions = await prisma.quizSession.findMany({
      where: {
        hostId: session.user.id,
        ...(quizId ? { quizId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            participants: true,
            responses: true,
          },
        },
      },
    })

    const payload = sessions.map((item) => ({
      id: item.id,
      code: item.code,
      quizId: item.quizId,
      quizTitle: item.quiz.title,
      mode: item.mode,
      status: item.status,
      title: item.title,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      startedAt: item.startedAt,
      finishedAt: item.finishedAt,
      scheduledStart: item.scheduledStart,
      scheduledEnd: item.scheduledEnd,
      homeworkWindowStart: item.homeworkWindowStart,
      homeworkWindowEnd: item.homeworkWindowEnd,
      participantCount: item._count.participants,
      responseCount: item._count.responses,
      currentQuestionId: item.currentQuestionId,
    }))

    const response = NextResponse.json({ data: payload })
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    console.error('Failed to list quiz sessions', error)
    return NextResponse.json({ error: 'Failed to load sessions' }, { status: 500 })
  }
}

function ensureMode(value: unknown): QuizSessionMode | null {
  if (typeof value !== 'string') {
    return null
  }

  const upper = value.toUpperCase()
  return SESSION_MODES.has(upper) ? (upper as QuizSessionMode) : null
}

function parseDate(value: unknown): Date | null {
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date
    }
  }
  return null
}

async function createUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = generateSessionCode(6)
    const exists = await prisma.quizSession.count({ where: { code: candidate } })
    if (exists === 0) {
      return candidate
    }
  }

  throw new Error('Failed to allocate unique session code')
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  try {
    const quizId = typeof payload.quizId === 'string' ? payload.quizId : null
    const mode = ensureMode(payload.mode)

    if (!quizId || !mode) {
      return NextResponse.json({ error: 'quizId and mode are required' }, { status: 400 })
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, createdBy: session.user.id },
      select: { id: true, title: true },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found or not owned by host' }, { status: 404 })
    }

    const code = await createUniqueCode()
    const now = new Date()

    const scheduledStart = parseDate(payload.scheduledStart)
    const scheduledEnd = parseDate(payload.scheduledEnd)
    const homeworkWindowStart = mode === 'HOMEWORK' ? parseDate(payload.homeworkWindowStart) : null
    const homeworkWindowEnd = mode === 'HOMEWORK' ? parseDate(payload.homeworkWindowEnd) : null

    let status: QuizSessionStatus = QuizSessionStatus.DRAFT
    let startedAt: Date | null = null

    if (mode === 'HOMEWORK') {
      if (homeworkWindowStart && homeworkWindowEnd && homeworkWindowStart >= homeworkWindowEnd) {
        return NextResponse.json(
          { error: 'Homework window end time must be after the start time' },
          { status: 400 }
        )
      }

      if (homeworkWindowStart && homeworkWindowStart > now) {
        status = QuizSessionStatus.SCHEDULED
      } else {
        status = QuizSessionStatus.ACTIVE
        startedAt = now
      }
    }

    const maxAttempts =
      typeof payload.maxAttemptsPerQuestion === 'number'
        ? Math.max(1, Math.floor(payload.maxAttemptsPerQuestion))
        : null

    const newSession = await prisma.quizSession.create({
      data: {
        quizId,
        hostId: session.user.id,
        code,
        title: sanitizeText(payload.title, 160) || `${quiz.title} Session`,
        description: sanitizeText(payload.description, 4000) || null,
        mode,
        status,
        scheduledStart,
        scheduledEnd,
        homeworkWindowStart,
        homeworkWindowEnd,
        startedAt,
        maxAttemptsPerQuestion: maxAttempts,
        metadata: normalizeJson<Prisma.InputJsonValue>(payload.metadata),
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            defaultPoints: true,
          },
        },
      },
    })

    await prisma.quizSessionEvent.create({
      data: {
        sessionId: newSession.id,
        type: 'CREATED',
        actorId: session.user.id,
        actorName: session.user.name ?? null,
        payload: {
          mode,
          scheduledStart,
          scheduledEnd,
        },
      },
    })

    const response = NextResponse.json(newSession, { status: 201 })
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    console.error('Failed to create session', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
