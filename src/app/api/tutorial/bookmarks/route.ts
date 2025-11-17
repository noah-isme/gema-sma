import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { studentAuth } from '@/lib/student-auth';

// GET /api/tutorial/bookmarks - Get user's bookmarked articles
export async function GET() {
  try {
    const session = studentAuth.getSession();
    
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookmarks = await prisma.articleBookmark.findMany({
      where: {
        studentId: session.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        articleId: true,
        createdAt: true,
      }
    });

    // Fetch article details
    const articleIds = bookmarks.map(b => b.articleId);
    const articles = await prisma.article.findMany({
      where: {
        id: { in: articleIds },
        status: 'published'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        tags: true,
        imageUrl: true,
        readTime: true,
        views: true,
        publishedAt: true,
      }
    });

    // Combine bookmark info with article data
    const result = bookmarks.map(bookmark => {
      const article = articles.find(a => a.id === bookmark.articleId);
      return {
        bookmarkId: bookmark.id,
        bookmarkedAt: bookmark.createdAt,
        article
      };
    }).filter(item => item.article); // Remove bookmarks for deleted articles

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

// POST /api/tutorial/bookmarks - Add bookmark
export async function POST(request: NextRequest) {
  try {
    const session = studentAuth.getSession();
    
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Create bookmark (or return existing)
    const bookmark = await prisma.articleBookmark.upsert({
      where: {
        studentId_articleId: {
          studentId: session.id,
          articleId
        }
      },
      create: {
        studentId: session.id,
        articleId
      },
      update: {}, // No update needed, just return existing
      select: {
        id: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: bookmark,
      message: 'Article bookmarked successfully'
    });

  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}

// DELETE /api/tutorial/bookmarks - Remove bookmark
export async function DELETE(request: NextRequest) {
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

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Delete bookmark
    await prisma.articleBookmark.deleteMany({
      where: {
        studentId: session.id,
        articleId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully'
    });

  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}
