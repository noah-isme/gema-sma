import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stages = await prisma.classroomProjectChecklist.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      stages
    })
  } catch (error) {
    console.error('Get roadmap stages error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get roadmap stages' },
      { status: 500 }
    )
  }
}
