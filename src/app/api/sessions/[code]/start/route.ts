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
        quiz: {
          select: { id: true, defaultPoints: true, title: true },
        },
        currentQuestion: {
          select: { id: true, order: true },
        },
      },
    })

    if (!quizSession || quizSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (quizSession.status === QuizSessionStatus.COMPLETED) {
      return NextResponse.json({ error: 'Session already completed' }, { status: 400 })
    }

    if (quizSession.status === QuizSessionStatus.ACTIVE) {
      const response = NextResponse.json(quizSession)
      response.headers.set('Cache-Control', 'private, no-store')
      return response
    }

    const firstQuestion = await prisma.quizQuestion.findFirst({
      where: { quizId: quizSession.quizId },
      orderBy: { order: 'asc' },
    })

    const now = new Date()

    const updatedSession = await prisma.quizSession.update({
      where: { id: quizSession.id },
      data: {
        status: QuizSessionStatus.ACTIVE,
        startedAt: quizSession.startedAt ?? now,
        currentQuestionId: firstQuestion?.id ?? null,
        currentQuestionStartedAt: firstQuestion ? now : null,
      },
      include: {
        currentQuestion: true,
        quiz: {
          select: { id: true, title: true, defaultPoints: true },
        },
      },
    })

    await prisma.quizSessionEvent.create({
      data: {
        sessionId: quizSession.id,
        type: 'STARTED',
        actorId: session.user.id,
        actorName: session.user.name ?? null,
        payload: {
          currentQuestionId: firstQuestion?.id ?? null,
        },
      },
    })

    const response = NextResponse.json(updatedSession)
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    console.error('Failed to start session', error)
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 })
  }
}
