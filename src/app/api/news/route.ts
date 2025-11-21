import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

// GET /api/news - Get all news articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];

    // Build filter object
    const where: Record<string, unknown> = {};

    // Filter by news category (berita or news)
    where.category = {
      in: ['news', 'berita', 'News', 'Berita']
    };

    // Status filter
    if (status === 'all') {
      where.status = 'published';
    } else if (status) {
      where.status = status;
    } else {
      where.status = 'published';
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Tag filtering
    if (tagsArray.length > 0) {
      where.tags = {
        hasSome: tagsArray
      };
    }

    // Pagination
    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const articles = await prisma.article.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take,
      skip,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        tags: true,
        author: true,
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

    // Get total count for pagination
    const totalCount = await prisma.article.count({ where });

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        total: totalCount,
        page: page ? parseInt(page) : 1,
        limit: take || totalCount,
        totalPages: take ? Math.ceil(totalCount / take) : 1
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST /api/news - Create new news article (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      tags,
      status = 'draft',
      featured = false,
      imageUrl,
      readTime
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: finalSlug }
    });

    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        category: 'berita', // Set category as berita
        tags: tags ? JSON.stringify(tags) : null,
        author: admin.name,
        authorId: admin.id,
        status,
        featured,
        imageUrl,
        readTime,
        publishedAt: status === 'published' ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      data: article,
      message: 'News article created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}
