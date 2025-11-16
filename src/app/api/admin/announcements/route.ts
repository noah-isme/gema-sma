import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureAnnouncementHomepageColumn() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "announcements"
    ADD COLUMN IF NOT EXISTS "showOnHomepage" BOOLEAN NOT NULL DEFAULT FALSE
  `)
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureAnnouncementHomepageColumn();

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureAnnouncementHomepageColumn();

    const body = await request.json();
    const { 
      title, 
      excerpt,
      content, 
      category,
      type, 
      isImportant,
      isActive, 
      showOnHomepage,
      deadline,
      link
    } = body;

    console.log('POST /api/admin/announcements - Received data:', JSON.stringify(body, null, 2));

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['KELAS', 'EVENT', 'TUGAS', 'NILAI', 'SISTEM'];
    const finalCategory = category && validCategories.includes(category) ? category : 'SISTEM';

    const announcement = await prisma.announcement.create({
      data: {
        title,
        excerpt: excerpt || null,
        content,
        category: finalCategory,
        type: type || 'info',
        isImportant: isImportant || false,
        isActive: isActive !== undefined ? isActive : true,
        showOnHomepage: showOnHomepage === true,
        deadline: deadline ? new Date(deadline) : null,
        link: link || null,
      }
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureAnnouncementHomepageColumn();

    const body = await request.json();
    const { id, ...updateData } = body;

    console.log('PATCH /api/admin/announcements - Received data:', JSON.stringify(body, null, 2));

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Process updateData
    if (updateData.showOnHomepage !== undefined) {
      updateData.showOnHomepage = Boolean(updateData.showOnHomepage);
    }

    // Validate category if present
    if (updateData.category) {
      const validCategories = ['KELAS', 'EVENT', 'TUGAS', 'NILAI', 'SISTEM'];
      if (!validCategories.includes(updateData.category)) {
        updateData.category = 'SISTEM';
      }
    }

    // Convert deadline to Date if present
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }

    // Ensure null for optional fields
    if (updateData.excerpt === '') updateData.excerpt = null;
    if (updateData.link === '') updateData.link = null;

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: id },
      data: updateData
    });

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.announcement.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
