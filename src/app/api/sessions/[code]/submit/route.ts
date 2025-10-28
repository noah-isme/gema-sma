import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { QuizQuestionType, QuizSessionMode, QuizSessionStatus } from '@prisma/client'
import { gradeAnswer } from '@/lib/quiz/grading'
import { consumeRateLimit } from '@/lib/quiz/rate-limit'
import { normalizeJson, sanitizeDisplayName, sanitizeText } from '@/lib/quiz/utils'

type RouteContext = {
  params: Promise<{
    code: string
  }>
}

function getClientIp(request: NextRequest): string {
  const header = request.headers.get('x-forwarded-for')
  if (header) {
    const [first] = header.split(',')
    if (first) {
      return first.trim()
    }
  }
  return 'unknown'
}

function sanitizeAnswer(type: QuizQuestionType, raw: unknown): Prisma.InputJsonValue | null {
  switch (type) {
    case 'MULTIPLE_CHOICE':
    case 'SHORT_ANSWER':
      return sanitizeText(raw, 1000) || null
    case 'TRUE_FALSE': {
      if (typeof raw === 'boolean') {
        return raw
      }
      if (typeof raw === 'string') {
        const value = raw.trim().toLowerCase()
        if (value === 'true' || value === 'false') {
          return value === 'true'
        }
      }
      return null
    }
    case 'MULTI_SELECT': {
      const values = Array.isArray(raw) ? raw : normalizeJson<unknown[]>(raw)
      if (!Array.isArray(values)) {
        return []
      }
      return values
        .map(value => sanitizeText(value, 1000))
        .filter(Boolean)
    }
    case 'NUMERIC':
    case 'SCALE': {
      const value =
        typeof raw === 'number' && Number.isFinite(raw)
          ? raw
          : Number(typeof raw === 'string' ? raw.trim() : raw)
      return Number.isFinite(value) ? value : null
    }
    default:
      return normalizeJson<Prisma.InputJsonValue>(raw) ?? null
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const authSession = await getServerSession(authOptions)

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const questionId = typeof payload.questionId === 'string' ? payload.questionId : null
  if (!questionId) {
    return NextResponse.json({ error: 'questionId is required' }, { status: 400 })
  }

  try {
    const quizSession = await prisma.quizSession.findUnique({
      where: { code: params.code },
      include: {
        quiz: { select: { id: true, defaultPoints: true } },
        currentQuestion: { select: { id: true } },
      },
    })

    if (!quizSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const now = new Date()

    if (quizSession.mode === QuizSessionMode.HOMEWORK) {
      if (quizSession.homeworkWindowStart && now < quizSession.homeworkWindowStart) {
        return NextResponse.json({ error: 'Submission window has not started' }, { status: 403 })
      }
      if (quizSession.homeworkWindowEnd && now > quizSession.homeworkWindowEnd) {
        return NextResponse.json({ error: 'Submission window has ended' }, { status: 403 })
      }

      if (
        quizSession.status === QuizSessionStatus.SCHEDULED &&
        quizSession.homeworkWindowStart &&
        now >= quizSession.homeworkWindowStart
      ) {
        await prisma.quizSession.update({
          where: { id: quizSession.id },
          data: {
            status: QuizSessionStatus.ACTIVE,
            startedAt: quizSession.startedAt ?? now,
          },
        })
        quizSession.status = QuizSessionStatus.ACTIVE
        quizSession.startedAt = quizSession.startedAt ?? now
      }
    }

    if (quizSession.mode === QuizSessionMode.LIVE && quizSession.status !== QuizSessionStatus.ACTIVE) {
      return NextResponse.json({ error: 'Session is not active' }, { status: 409 })
    }

    if (
      quizSession.mode === QuizSessionMode.LIVE &&
      quizSession.currentQuestion &&
      quizSession.currentQuestion.id !== questionId
    ) {
      return NextResponse.json({ error: 'Question is not currently active' }, { status: 409 })
    }

    const question = await prisma.quizQuestion.findFirst({
      where: {
        id: questionId,
        quizId: quizSession.quizId,
      },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found for this session' }, { status: 404 })
    }

    const sanitizedAnswer = sanitizeAnswer(question.type, payload.answer)
    if (sanitizedAnswer === null) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 })
    }

    const ip = getClientIp(request)
    const nowIso = now.toISOString()

    let participantId =
      typeof payload.participantId === 'string' && payload.participantId ? payload.participantId : null

    let participant = participantId
      ? await prisma.quizParticipant.findUnique({ where: { id: participantId } })
      : null

    if (participant && participant.sessionId !== quizSession.id) {
      return NextResponse.json({ error: 'Participant invalid for this session' }, { status: 403 })
    }

    let studentRecordId: string | null = null
    if (authSession?.user?.userType === 'student') {
      studentRecordId = authSession.user.id
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
      studentRecordId = student?.id ?? null
    }

    if (!participant) {
      const incomingName =
        typeof payload.displayName === 'string' && payload.displayName
          ? payload.displayName
          : authSession?.user?.name

      const displayName = sanitizeDisplayName(incomingName, 80)
      if (!displayName) {
        return NextResponse.json({ error: 'Participant name is required' }, { status: 400 })
      }

      participant = await prisma.quizParticipant.upsert({
        where: {
          sessionId_displayName: {
            sessionId: quizSession.id,
            displayName,
          },
        },
        update: {
          lastSeenAt: now,
          studentId: studentRecordId ?? undefined,
        },
        create: {
          sessionId: quizSession.id,
          displayName,
          studentId: studentRecordId,
          joinedAt: now,
          lastSeenAt: now,
          metadata: {
            joinedFromIp: ip,
            joinedAt: nowIso,
          },
        },
      })

      participantId = participant.id
    } else {
      participant = await prisma.quizParticipant.update({
        where: { id: participant.id },
        data: {
          lastSeenAt: now,
          studentId: studentRecordId ?? participant.studentId ?? undefined,
        },
      })
    }

    const rateLimitKey = `${quizSession.id}:${participant.id}:${ip}`
    const rate = consumeRateLimit(rateLimitKey, 6, 10_000)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions, please slow down' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rate.retryAfter / 1000).toString(),
          },
        }
      )
    }

    const existingResponse = await prisma.quizResponse.findUnique({
      where: {
        participantId_questionId_sessionId: {
          participantId: participant.id,
          questionId,
          sessionId: quizSession.id,
        },
      },
    })

    const nextAttempt = (existingResponse?.attempt ?? 0) + 1
    if (
      quizSession.maxAttemptsPerQuestion &&
      nextAttempt > quizSession.maxAttemptsPerQuestion
    ) {
      return NextResponse.json(
        { error: 'Maximum attempts reached for this question' },
        { status: 429 }
      )
    }

    const grade = gradeAnswer(
      {
        id: question.id,
        type: question.type,
        points: question.points,
        correctAnswers: question.correctAnswers,
      },
      sanitizedAnswer,
      quizSession.quiz.defaultPoints ?? 1
    )

    const latencyMs =
      typeof payload.latencyMs === 'number' && Number.isFinite(payload.latencyMs)
        ? Math.max(0, Math.floor(payload.latencyMs))
        : null

    const metadata = normalizeJson<Prisma.InputJsonValue>(payload.metadata)

    const responseRecord = existingResponse
      ? await prisma.quizResponse.update({
          where: { id: existingResponse.id },
          data: {
            answer: sanitizedAnswer,
            score: grade.score,
            maxScore: grade.maxScore,
            isCorrect: grade.isCorrect,
            gradedAt: grade.requiresManual ? null : now,
            gradedBy: null,
            feedback: null,
            attempt: nextAttempt,
            submittedAt: now,
            latencyMs,
            metadata,
          },
        })
      : await prisma.quizResponse.create({
          data: {
            sessionId: quizSession.id,
            participantId: participant.id,
            questionId,
            answer: sanitizedAnswer,
            score: grade.score,
            maxScore: grade.maxScore,
            isCorrect: grade.isCorrect,
            gradedAt: grade.requiresManual ? null : now,
            attempt: nextAttempt,
            submittedAt: now,
            latencyMs,
            metadata,
          },
        })

    const [scoreSum, totalCount, correctCount] = await Promise.all([
      prisma.quizResponse.aggregate({
        _sum: { score: true },
        where: { participantId: participant.id },
      }),
      prisma.quizResponse.count({
        where: { participantId: participant.id },
      }),
      prisma.quizResponse.count({
        where: { participantId: participant.id, isCorrect: true },
      }),
    ])

    const totalScore = scoreSum._sum.score ?? 0
    const accuracy =
      totalCount > 0 ? Math.round((correctCount / totalCount) * 10000) / 10000 : null

    const updatedParticipant = await prisma.quizParticipant.update({
      where: { id: participant.id },
      data: {
        score: totalScore,
        responseCount: totalCount,
        accuracy,
        lastSeenAt: now,
      },
    })

    const response = NextResponse.json({
      response: responseRecord,
      participant: updatedParticipant,
      grade,
      manualReviewRequired: grade.requiresManual,
    })

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error('Failed to submit quiz response', error)
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 })
  }
}
