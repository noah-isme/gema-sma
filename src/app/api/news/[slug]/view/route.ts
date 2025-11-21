import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/news/[slug]/view - Increment view count
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Find article by slug
    const article = await prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        category: true,
        views: true,
      }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'News article not found' },
        { status: 404 }
      );
    }

    // Check if it's a news article
    const category = article.category?.toLowerCase();
    if (category !== 'news' && category !== 'berita') {
      return NextResponse.json(
        { success: false, error: 'This is not a news article' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.article.update({
      where: { id: article.id },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'View count incremented',
      views: article.views + 1
    });

  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}
