import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { QuizSessionMode, QuizSessionStatus } from '@prisma/client'
import { normalizeJson, sanitizeDisplayName } from '@/lib/quiz/utils'

type RouteContext = {
  params: Promise<{
    code: string
  }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const authSession = await getServerSession(authOptions)

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const displayName = sanitizeDisplayName(payload.displayName, 80)
  if (!displayName) {
    return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
  }

  try {
    const quizSession = await prisma.quizSession.findUnique({
      where: { code: params.code },
      include: {
        participants: {
          where: { displayName },
        },
      },
    })

    if (!quizSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const now = new Date()

    if (quizSession.mode === QuizSessionMode.HOMEWORK) {
      if (quizSession.homeworkWindowStart && now < quizSession.homeworkWindowStart) {
        return NextResponse.json({ error: 'Homework window has not started yet' }, { status: 403 })
      }

      if (quizSession.homeworkWindowEnd && now > quizSession.homeworkWindowEnd) {
        return NextResponse.json({ error: 'Homework window has ended' }, { status: 403 })
      }
    } else if (quizSession.mode === QuizSessionMode.LIVE) {
      const allowedStatuses = new Set<QuizSessionStatus>([
        QuizSessionStatus.DRAFT,
        QuizSessionStatus.SCHEDULED,
        QuizSessionStatus.ACTIVE,
        QuizSessionStatus.PAUSED,
      ])
      if (!allowedStatuses.has(quizSession.status)) {
        return NextResponse.json({ error: 'Session is no longer available' }, { status: 403 })
      }
    }

    let studentId: string | null = null
    if (authSession?.user?.userType === 'student') {
      studentId = authSession.user.id
    } else if (typeof payload.studentId === 'string' && payload.studentId) {
      const student = await prisma.student.findFirst({
        where: {
          OR: [
            { id: payload.studentId },
            { studentId: payload.studentId },
          ],
        },
        select: { id: true },
      })
      studentId = student?.id ?? null
    }

    const existingParticipant = quizSession.participants[0]
    if (existingParticipant) {
      if (existingParticipant.isKicked) {
        return NextResponse.json(
          { error: 'You have been removed from this session' },
          { status: 403 }
        )
      }

      const participant = await prisma.quizParticipant.update({
        where: { id: existingParticipant.id },
        data: {
          lastSeenAt: now,
          studentId: studentId ?? existingParticipant.studentId ?? undefined,
          metadata: {
            ...normalizeJson<Record<string, unknown>>(existingParticipant.metadata),
            rejoinedAt: now.toISOString(),
          },
        },
      })

      const response = NextResponse.json({
        participant: {
          id: participant.id,
          displayName: participant.displayName,
          sessionId: participant.sessionId,
          studentId: participant.studentId,
        },
        session: {
          id: quizSession.id,
          code: quizSession.code,
          status: quizSession.status,
          mode: quizSession.mode,
        },
      })
      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    const participant = await prisma.quizParticipant.create({
      data: {
        sessionId: quizSession.id,
        displayName,
        studentId,
        joinedAt: now,
        lastSeenAt: now,
        metadata: {
          joinedAt: now.toISOString(),
          from: request.headers.get('x-forwarded-for') ?? 'unknown',
        },
      },
    })

    const response = NextResponse.json({
      participant: {
        id: participant.id,
        displayName: participant.displayName,
        sessionId: participant.sessionId,
        studentId: participant.studentId,
      },
      session: {
        id: quizSession.id,
        code: quizSession.code,
        status: quizSession.status,
        mode: quizSession.mode,
      },
    })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('Failed to join session', error)
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 })
  }
}
