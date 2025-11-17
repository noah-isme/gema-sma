import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { studentAuth } from '@/lib/student-auth';

// GET /api/tutorial/reading-progress - Get reading progress for articles
export async function GET(request: NextRequest) {
  try {
    const session = studentAuth.getSession();
    
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (articleId) {
      // Get progress for specific article
      const progress = await prisma.readingProgress.findUnique({
        where: {
          studentId_articleId: {
            studentId: session.id,
            articleId
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: progress
      });
    } else {
      // Get all reading progress for user
      const progressList = await prisma.readingProgress.findMany({
        where: {
          studentId: session.id
        },
        orderBy: {
          lastReadAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        data: progressList
      });
    }

  } catch (error) {
    console.error('Error fetching reading progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reading progress' },
      { status: 500 }
    );
  }
}

// POST /api/tutorial/reading-progress - Update reading progress
export async function POST(request: NextRequest) {
  try {
    const session = studentAuth.getSession();
    
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { articleId, progress, lastPosition, timeSpent, completed } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Upsert reading progress
    const readingProgress = await prisma.readingProgress.upsert({
      where: {
        studentId_articleId: {
          studentId: session.id,
          articleId
        }
      },
      create: {
        studentId: session.id,
        articleId,
        progress: progress || 0,
        lastPosition: lastPosition || 0,
        timeSpent: timeSpent || 0,
        completed: completed || false,
        lastReadAt: new Date()
      },
      update: {
        progress: progress !== undefined ? progress : undefined,
        lastPosition: lastPosition !== undefined ? lastPosition : undefined,
        timeSpent: timeSpent !== undefined ? { increment: timeSpent } : undefined,
        completed: completed !== undefined ? completed : undefined,
        lastReadAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: readingProgress
    });

  } catch (error) {
    console.error('Error updating reading progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reading progress' },
      { status: 500 }
    );
  }
}
