import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

type RouteContext = {
  params: Promise<{
    code: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.userType === 'admin'

  try {
    const quizSession = await prisma.quizSession.findUnique({
      where: { code: params.code },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
        participants: {
          orderBy: [
            { score: 'desc' },
            { responseCount: 'desc' },
            { joinedAt: 'asc' },
          ],
        },
        currentQuestion: true,
      },
    })

    if (!quizSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const sanitizedQuestions = quizSession.quiz.questions.map(question => {
      if (isAdmin) {
        return question
      }

      const { correctAnswers, explanation, ...rest } = question
      return {
        ...rest,
        correctAnswers: null,
        explanation: null,
      }
    })

    const leaderboard = quizSession.participants
      .filter(participant => !participant.isKicked)
      .map((participant, index) => ({
        id: participant.id,
        rank: index + 1,
        displayName: participant.displayName,
        score: participant.score,
        accuracy: participant.accuracy,
        responseCount: participant.responseCount,
        joinedAt: participant.joinedAt,
        lastSeenAt: participant.lastSeenAt,
        avatarColor: participant.avatarColor,
      }))

    const currentQuestion =
      quizSession.currentQuestionId != null
        ? sanitizedQuestions.find(question => question.id === quizSession.currentQuestionId) ?? null
        : null

    const response = NextResponse.json({
      session: {
        id: quizSession.id,
        code: quizSession.code,
        mode: quizSession.mode,
        status: quizSession.status,
        title: quizSession.title,
        description: quizSession.description,
        quizId: quizSession.quizId,
        startedAt: quizSession.startedAt,
        finishedAt: quizSession.finishedAt,
        scheduledStart: quizSession.scheduledStart,
        scheduledEnd: quizSession.scheduledEnd,
        homeworkWindowStart: quizSession.homeworkWindowStart,
        homeworkWindowEnd: quizSession.homeworkWindowEnd,
        currentQuestionId: quizSession.currentQuestionId,
        currentQuestionStartedAt: quizSession.currentQuestionStartedAt,
        hostId: isAdmin ? quizSession.hostId : undefined,
      },
      quiz: {
        id: quizSession.quiz.id,
        title: quizSession.quiz.title,
        description: quizSession.quiz.description,
        defaultPoints: quizSession.quiz.defaultPoints,
        timePerQuestion: quizSession.quiz.timePerQuestion,
        questions: sanitizedQuestions,
      },
      leaderboard,
      currentQuestion,
      isHostView: isAdmin,
    })

    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('Failed to fetch session by code', error)
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 })
  }
}
