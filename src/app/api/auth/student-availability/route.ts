import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const studentId = searchParams.get('studentId')

    if (!email && !studentId) {
      return NextResponse.json(
        { message: 'Email atau studentId wajib disediakan.' },
        { status: 400 }
      )
    }

    if (email && studentId) {
      const [existingStudentId, existingEmail] = await Promise.all([
        prisma.student.findUnique({ where: { studentId } }),
        prisma.student.findUnique({ where: { email } })
      ])

      return NextResponse.json({
        field: 'both',
        studentIdAvailable: !existingStudentId,
        emailAvailable: !existingEmail
      })
    }

    if (studentId) {
      const existingStudentId = await prisma.student.findUnique({ where: { studentId } })
      return NextResponse.json({
        field: 'studentId',
        available: !existingStudentId
      })
    }

    if (email) {
      const existingEmail = await prisma.student.findUnique({ where: { email } })
      return NextResponse.json({
        field: 'email',
        available: !existingEmail
      })
    }

    return NextResponse.json({
      field: 'unknown',
      available: false
    })
  } catch (error) {
    console.error('Student availability check error:', error)
    return NextResponse.json(
      { message: 'Gagal memeriksa ketersediaan data siswa.' },
      { status: 500 }
    )
  }
}
