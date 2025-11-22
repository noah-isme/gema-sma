import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Student dashboard API called')

    // Get student ID from query parameters
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching data for student:', studentId)

    // First, get student internal ID (search by studentId OR username)
    const studentInfo = await prisma.student.findFirst({
      where: {
        OR: [
          { studentId: studentId },
          { username: studentId }
        ]
      },
      select: {
        id: true,
        studentId: true,
        username: true,
        fullName: true,
        class: true,
        email: true,
        createdAt: true
      }
    })

    if (!studentInfo) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    const internalStudentId = studentInfo.id

    // Calculate date ranges for time-based analysis
    const now = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(now.getDate() - 7)
    
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(now.getMonth() - 1)

    // Execute all queries in parallel for optimal performance
    const [
      // Student specific data (using internal ID)
      studentSubmissionsCount,
      studentFeedbacksCount,
      studentActivitiesCount,
      
      // Assignment and learning progress
      totalAssignments,
      completedAssignments,
      pendingAssignments,
      overdueAssignments,
      
      // Coding Lab data
      codingLabSubmissions,
      codingLabTasks,
      
      // Recent activities and engagement
      recentSubmissions,
      recentFeedbacks,
      weeklyProgress,
      
      // General statistics for context
      totalStudents,
      totalTutorialArticles,
      
      // Roadmap progress (from localStorage will be handled client-side)
      roadmapStages
    ] = await Promise.all([
      // Student submissions (using internal ID)
      prisma.submission.count({
        where: { studentId: internalStudentId }
      }),

      // Student feedbacks given (using internal ID)
      prisma.articleFeedback.count({
        where: { studentId: internalStudentId }
      }),

      // Student activity count (generic activity tracking)
      prisma.event.count({
        where: { 
          AND: [
            { description: { contains: studentId } },
            { createdAt: { gte: oneMonthAgo } }
          ]
        }
      }),

      // Assignment statistics
      prisma.assignment.count(),
      
      prisma.assignment.count({
        where: {
          submissions: {
            some: { studentId: internalStudentId }
          }
        }
      }),

      prisma.assignment.count({
        where: {
          AND: [
            { dueDate: { gte: now } },
            {
              NOT: {
                submissions: {
                  some: { studentId: internalStudentId }
                }
              }
            }
          ]
        }
      }),

      prisma.assignment.count({
        where: {
          AND: [
            { dueDate: { lt: now } },
            {
              NOT: {
                submissions: {
                  some: { studentId: internalStudentId }
                }
              }
            }
          ]
        }
      }),

      // Coding Lab data (using internal ID)
      prisma.codingLabSubmission.count({
        where: { studentId: internalStudentId }
      }),

      prisma.codingLabTask.count(),

      // Recent activities (using internal ID)
      prisma.submission.count({
        where: {
          AND: [
            { studentId: internalStudentId },
            { submittedAt: { gte: oneWeekAgo } }
          ]
        }
      }),

      prisma.articleFeedback.count({
        where: {
          AND: [
            { studentId: internalStudentId },
            { createdAt: { gte: oneWeekAgo } }
          ]
        }
      }),

      // Weekly progress comparison (using internal ID)
      prisma.submission.count({
        where: {
          AND: [
            { studentId: internalStudentId },
            { submittedAt: { gte: oneWeekAgo } }
          ]
        }
      }),

      // Context data
      prisma.student.count(),
      
      prisma.article.count({
        where: { status: 'published' }
      }),

      // Coding Lab tasks as learning stages
      prisma.codingLabTask.count()
    ])

    // Calculate completion percentage
    const completionPercentage = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 0

    // Calculate learning streak (days with activity)
    const learningStreak = Math.min(
      Math.floor((studentSubmissionsCount + studentFeedbacksCount) / 2), 
      30
    ) // Max 30 days

    // Calculate engagement score
    const engagementScore = Math.min(
      Math.round(((studentSubmissionsCount * 2) + (studentFeedbacksCount * 1.5) + (studentActivitiesCount * 1)) / 3),
      100
    )

    // Prepare dashboard statistics
    const dashboardStats = {
      // Student personal data
      student: studentInfo,
      
      // Learning progress
      totalAssignments,
      completedAssignments,
      pendingAssignments,
      overdueAssignments,
      completionPercentage,
      
      // Engagement metrics
      totalSubmissions: studentSubmissionsCount,
      totalFeedbacks: studentFeedbacksCount,
      codingLabSubmissions,
      codingLabTasks,
      
      // Recent activity
      recentSubmissions,
      recentFeedbacks,
      weeklyProgress,
      
      // Achievement metrics
      learningStreak,
      engagementScore,
      
      // Context and ranking
      totalStudents,
      totalTutorialArticles,
      roadmapStages,
      
      // Performance indicators
      isActiveThisWeek: (recentSubmissions + recentFeedbacks) > 0,
      hasOverdueAssignments: overdueAssignments > 0,
      codingLabProgress: codingLabTasks > 0 ? Math.round((codingLabSubmissions / codingLabTasks) * 100) : 0,
      
      // Weekly comparison
      weeklyGrowth: weeklyProgress > 0 ? 'increasing' : 'stable',
      
      // Status indicators
      status: {
        assignments: overdueAssignments > 0 ? 'needs_attention' : pendingAssignments > 0 ? 'in_progress' : 'up_to_date',
        codingLab: codingLabSubmissions === 0 ? 'needs_start' : codingLabSubmissions < codingLabTasks ? 'in_progress' : 'complete',
        engagement: engagementScore >= 70 ? 'high' : engagementScore >= 40 ? 'medium' : 'low'
      }
    }

    console.log('Dashboard stats prepared:', {
      studentId,
      totalAssignments,
      completedAssignments,
      completionPercentage,
      engagementScore
    })

    return NextResponse.json({
      success: true,
      data: dashboardStats
    })

  } catch (error) {
    console.error('Student dashboard API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}