import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { QuizQuestionType } from '@prisma/client'
import { clampPoints, normalizeJson, sanitizeText } from '@/lib/quiz/utils'

const QUESTION_TYPES = new Set<string>(Object.values(QuizQuestionType))

type NormalizedQuestion = {
  id?: string
  type: QuizQuestionType
  order: number
  prompt: string
  options?: Prisma.InputJsonValue
  correctAnswers?: Prisma.InputJsonValue
  competencyTag: string | null
  explanation: string | null
  difficulty: string | null
  points: number
  timeLimitSeconds: number | null
}

function ensureQuestionType(value: unknown): QuizQuestionType | null {
  if (typeof value !== 'string') {
    return null
  }

  const upper = value.toUpperCase()
  return QUESTION_TYPES.has(upper) ? (upper as QuizQuestionType) : null
}

function sanitizeSlug(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return cleaned || null
}

function sanitizeTags(value: unknown): string[] | undefined {
  if (!value) {
    return undefined
  }

  const tagsArray = Array.isArray(value) ? value : normalizeJson<unknown[]>(value)
  if (!Array.isArray(tagsArray)) {
    return undefined
  }

  const tags = tagsArray
    .map(tag => (typeof tag === 'string' ? sanitizeText(tag, 40) : ''))
    .filter(Boolean)

  return tags.length > 0 ? tags : undefined
}

function normalizeQuestion(input: Record<string, unknown>, index: number, defaultPoints: number): NormalizedQuestion {
  const type = ensureQuestionType(input.type)
  const prompt = sanitizeText(input.prompt, 4000)

  if (!type) {
    throw new Error(`Invalid question type at index ${index}`)
  }

  if (!prompt) {
    throw new Error(`Question prompt is required at index ${index}`)
  }

  const orderRaw = Number(input.order)
  const order = Number.isFinite(orderRaw) ? Math.max(0, Math.floor(orderRaw)) : index + 1

  const points = clampPoints(
    typeof input.points === 'number' ? input.points : Number.parseInt(String(input.points ?? ''), 10),
    defaultPoints
  )

  const timeLimitSeconds =
    typeof input.timeLimitSeconds === 'number'
      ? Math.max(0, Math.floor(input.timeLimitSeconds))
      : null

  const options = normalizeJson<Prisma.InputJsonValue>(input.options)
  const correctAnswers = normalizeJson<Prisma.InputJsonValue>(input.correctAnswers)

  return {
    id: typeof input.id === 'string' ? input.id : undefined,
    type,
    order,
    prompt,
    options,
    correctAnswers,
    competencyTag: sanitizeText(input.competencyTag, 120) || null,
    explanation: sanitizeText(input.explanation, 2000) || null,
    difficulty: sanitizeText(input.difficulty, 40) || null,
    points,
    timeLimitSeconds,
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const onlyPublic = searchParams.get('publicOnly') === 'true'
  const query = searchParams.get('q')

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(onlyPublic ? { isPublic: true } : {}),
        ...(query
          ? {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        tags: true,
        isPublic: true,
        defaultPoints: true,
        publishedAt: true,
        timePerQuestion: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { questions: true },
        },
      },
    })

    const response = NextResponse.json(quizzes)
    if (onlyPublic && (!session || session.user?.userType !== 'admin')) {
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    } else {
      response.headers.set('Cache-Control', 'private, no-store')
    }

    return response
  } catch (error) {
    console.error('Failed to list quizzes', error)
    return NextResponse.json({ error: 'Failed to list quizzes' }, { status: 500 })
  }
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
    const title = sanitizeText(payload.title, 200)
    const description = sanitizeText(payload.description, 4000) || null

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const defaultPoints = clampPoints(
      typeof payload.defaultPoints === 'number'
        ? payload.defaultPoints
        : Number.parseInt(String(payload.defaultPoints ?? ''), 10),
      1
    )

    const questionsRaw = Array.isArray(payload.questions)
      ? payload.questions
      : normalizeJson<unknown[]>(payload.questions)

    if (!Array.isArray(questionsRaw) || questionsRaw.length === 0) {
      return NextResponse.json({ error: 'At least one question is required' }, { status: 400 })
    }

    const questions = questionsRaw.map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Invalid question payload at index ${index}`)
      }
      return normalizeQuestion(item as Record<string, unknown>, index, defaultPoints)
    })

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        slug: sanitizeSlug(payload.slug),
        tags: sanitizeTags(payload.tags),
        isPublic: payload.isPublic === true,
        timePerQuestion:
          typeof payload.timePerQuestion === 'number'
            ? Math.max(0, Math.floor(payload.timePerQuestion))
            : null,
        defaultPoints,
        createdBy: session.user.id,
        questions: {
          create: questions.map(({ id: _id, ...question }) => question),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('Failed to create quiz', error)
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
  }
}
