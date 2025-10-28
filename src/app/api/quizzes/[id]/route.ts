import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { clampPoints, normalizeJson, sanitizeText } from '@/lib/quiz/utils'
import { QuizQuestionType } from '@prisma/client'
import type { Prisma } from '@prisma/client'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.userType === 'admin'

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    const sanitizedQuiz = {
      ...quiz,
      questions: quiz.questions.map(question => {
        if (isAdmin) {
          return question
        }

        // Remove sensitive answer fields for non-admin consumers
        const { correctAnswers, explanation, ...rest } = question
        return {
          ...rest,
          explanation: null,
          correctAnswers: null,
        }
      }),
    }

    const response = NextResponse.json(sanitizedQuiz)
    if (quiz.isPublic && !isAdmin) {
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    } else {
      response.headers.set('Cache-Control', 'private, no-store')
    }
    return response
  } catch (error) {
    console.error('Failed to fetch quiz', error)
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
  }
}

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

function normalizeQuestion(
  input: Record<string, unknown>,
  index: number,
  defaultPoints: number
): NormalizedQuestion {
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

  const richContent = normalizeJson<Prisma.InputJsonValue>(input.richContent)
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

export async function PUT(request: NextRequest, context: RouteContext) {
  const params = await context.params
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
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: { questions: true },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

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

    const normalizedQuestions = questionsRaw.map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Invalid question payload at index ${index}`)
      }
      return normalizeQuestion(item as Record<string, unknown>, index, defaultPoints)
    })

    await prisma.$transaction(async (tx) => {
      await tx.quiz.update({
        where: { id: quiz.id },
        data: {
          title,
          description,
          isPublic: payload.isPublic === true,
          timePerQuestion:
            typeof payload.timePerQuestion === 'number'
              ? Math.max(0, Math.floor(payload.timePerQuestion))
              : null,
          defaultPoints,
        },
      })

      const existingIds = new Set(quiz.questions.map((question) => question.id))
      const incomingIds = new Set<string>()

      for (const normalized of normalizedQuestions) {
        const { id: questionId, ...questionData } = normalized

        if (questionId && existingIds.has(questionId)) {
          incomingIds.add(questionId)
          await tx.quizQuestion.update({
            where: { id: questionId },
            data: questionData,
          })
        } else {
          const created = await tx.quizQuestion.create({
            data: {
              ...questionData,
              quizId: quiz.id,
            },
          })
          incomingIds.add(created.id)
        }
      }

      const toDelete = quiz.questions
        .map((question) => question.id)
        .filter((id) => !incomingIds.has(id))

      if (toDelete.length > 0) {
        await tx.quizQuestion.deleteMany({
          where: { id: { in: toDelete } },
        })
      }
    })

    const updatedQuiz = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        questions: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json(updatedQuiz)
  } catch (error) {
    console.error('Failed to update quiz', error)
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 })
  }
}
