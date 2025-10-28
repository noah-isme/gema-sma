import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { QuizSessionStatus } from '@prisma/client'

type RouteContext = {
  params: Promise<{
    code: string
  }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const quizSession = await prisma.quizSession.findUnique({
      where: { code: params.code },
      include: {
        quiz: { select: { id: true, defaultPoints: true, title: true } },
        currentQuestion: { select: { id: true, order: true } },
      },
    })

    if (!quizSession || quizSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (quizSession.status !== QuizSessionStatus.ACTIVE) {
      return NextResponse.json({ error: 'Session is not active' }, { status: 400 })
    }

    const now = new Date()
    const currentOrder = quizSession.currentQuestion?.order ?? -1

    const nextQuestion = await prisma.quizQuestion.findFirst({
      where: {
        quizId: quizSession.quizId,
        order: { gt: currentOrder },
      },
      orderBy: { order: 'asc' },
    })

    if (!nextQuestion) {
      const completed = await prisma.quizSession.update({
        where: { id: quizSession.id },
        data: {
          status: QuizSessionStatus.COMPLETED,
          finishedAt: now,
          currentQuestionId: null,
          currentQuestionStartedAt: null,
        },
        include: {
          quiz: { select: { id: true, title: true, defaultPoints: true } },
          currentQuestion: true,
        },
      })

      await prisma.quizSessionEvent.create({
        data: {
          sessionId: quizSession.id,
          type: 'FINISHED',
          actorId: session.user.id,
          actorName: session.user.name ?? null,
        },
      })

      const response = NextResponse.json({ session: completed, hasMoreQuestions: false })
      response.headers.set('Cache-Control', 'private, no-store')
      return response
    }

    const advanced = await prisma.quizSession.update({
      where: { id: quizSession.id },
      data: {
        currentQuestionId: nextQuestion.id,
        currentQuestionStartedAt: now,
      },
      include: {
        quiz: { select: { id: true, title: true, defaultPoints: true } },
        currentQuestion: true,
      },
    })

    await prisma.quizSessionEvent.create({
      data: {
        sessionId: quizSession.id,
        type: 'QUESTION_ADVANCED',
        actorId: session.user.id,
        actorName: session.user.name ?? null,
        payload: {
          questionId: nextQuestion.id,
          order: nextQuestion.order,
        },
      },
    })

    const response = NextResponse.json({ session: advanced, hasMoreQuestions: true })
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    console.error('Failed to advance session', error)
    return NextResponse.json({ error: 'Failed to advance session' }, { status: 500 })
  }
}
