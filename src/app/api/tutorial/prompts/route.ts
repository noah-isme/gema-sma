import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tutorial/prompts - Get all prompts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schemaId = searchParams.get('schemaId');
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Build filter object
    const where: {
      status?: string;
      schemaId?: string;
      featured?: boolean;
    } = {};

    // Add status filter only if not 'all'
    if (status && status !== 'all') {
      where.status = status;
    }

    if (schemaId) {
      where.schemaId = schemaId;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Pagination
    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take,
      skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.prompt.count({ where });

    return NextResponse.json({
      success: true,
      data: prompts,
      pagination: {
        total: totalCount,
        page: page ? parseInt(page) : 1,
        limit: take || totalCount,
        totalPages: take ? Math.ceil(totalCount / take) : 1
      }
    });

  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

// POST /api/tutorial/prompts - Create new prompt (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication later
    const body = await request.json();

    const prompt = await prisma.prompt.create({
      data: {
        schemaId: body.schemaId,
        title: body.title,
        titleShort: body.titleShort,
        slug: body.slug,
        level: body.level,
        durasiMenit: body.durasiMenit,
        prasyarat: body.prasyarat || [],
        tujuanPembelajaran: body.tujuanPembelajaran || [],
        tags: body.tags || [],
        starterZip: body.starterZip,
        gambarContoh: body.gambarContoh,
        roleDeskripsi: body.roleDeskripsi,
        roleFokus: body.roleFokus,
        taskTujuan: body.taskTujuan || [],
        taskInstruksi: body.taskInstruksi,
        contextSituasi: body.contextSituasi || [],
        reasoningPrinsip: body.reasoningPrinsip,
        reasoningStruktur: body.reasoningStruktur || {},
        reasoningStrategi: body.reasoningStrategi || [],
        outputBentuk: body.outputBentuk || [],
        outputTugasSiswa: body.outputTugasSiswa,
        stopKriteria: body.stopKriteria || [],
        tipsAksesibilitas: body.tipsAksesibilitas || [],
        tipsKesalahanUmum: body.tipsKesalahanUmum || [],
        tipsTantangan: body.tipsTantangan || [],
        author: body.author || 'Admin GEMA',
        authorId: body.authorId || 'system',
        status: body.status || 'draft',
        featured: body.featured || false,
        versi: body.versi || '1.0.0',
        publishedAt: body.status === 'published' ? new Date() : null,
      }
    });

    return NextResponse.json({
      success: true,
      data: prompt,
      message: 'Prompt created successfully'
    });

  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
