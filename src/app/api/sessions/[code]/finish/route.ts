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
        quiz: { select: { id: true, title: true, defaultPoints: true } },
      },
    })

    if (!quizSession || quizSession.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (quizSession.status === QuizSessionStatus.COMPLETED) {
      const response = NextResponse.json(quizSession)
      response.headers.set('Cache-Control', 'private, no-store')
      return response
    }

    const now = new Date()

    const finished = await prisma.quizSession.update({
      where: { id: quizSession.id },
      data: {
        status: QuizSessionStatus.COMPLETED,
        finishedAt: now,
        currentQuestionId: null,
        currentQuestionStartedAt: null,
      },
      include: {
        quiz: { select: { id: true, title: true, defaultPoints: true } },
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

    const response = NextResponse.json(finished)
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    console.error('Failed to finish session', error)
    return NextResponse.json({ error: 'Failed to finish session' }, { status: 500 })
  }
}
