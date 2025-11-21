import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/news/[slug] - Get single news article by slug
export async function GET(
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

    const article = await prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        category: true,
        tags: true,
        author: true,
        authorId: true,
        status: true,
        featured: true,
        imageUrl: true,
        readTime: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'News article not found' },
        { status: 404 }
      );
    }

    // Check if article is a news article
    const category = article.category?.toLowerCase();
    if (category !== 'news' && category !== 'berita') {
      return NextResponse.json(
        { success: false, error: 'This is not a news article' },
        { status: 404 }
      );
    }

    // Only show published articles to public
    if (article.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'News article not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('Error fetching news article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news article' },
      { status: 500 }
    );
  }
}
