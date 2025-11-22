import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const studentId = searchParams.get('studentId')
    const username = searchParams.get('username')

    if (!email && !studentId && !username) {
      return NextResponse.json(
        { message: 'Email, studentId, atau username wajib disediakan.' },
        { status: 400 }
      )
    }

    // Check multiple fields at once
    if ((email && studentId) || (email && username) || (studentId && username)) {
      const checks = await Promise.all([
        studentId ? prisma.student.findUnique({ where: { studentId } }) : Promise.resolve(null),
        username ? prisma.student.findUnique({ where: { username } }) : Promise.resolve(null),
        email ? prisma.student.findUnique({ where: { email } }) : Promise.resolve(null)
      ])

      return NextResponse.json({
        field: 'multiple',
        studentIdAvailable: studentId ? !checks[0] : undefined,
        usernameAvailable: username ? !checks[1] : undefined,
        emailAvailable: email ? !checks[2] : undefined
      })
    }

    // Check individual fields
    if (studentId) {
      const existingStudentId = await prisma.student.findUnique({ where: { studentId } })
      return NextResponse.json({
        field: 'studentId',
        available: !existingStudentId,
        studentIdAvailable: !existingStudentId
      })
    }

    if (username) {
      const existingUsername = await prisma.student.findUnique({ where: { username } })
      return NextResponse.json({
        field: 'username',
        available: !existingUsername,
        usernameAvailable: !existingUsername
      })
    }

    if (email) {
      const existingEmail = await prisma.student.findUnique({ where: { email } })
      return NextResponse.json({
        field: 'email',
        available: !existingEmail,
        emailAvailable: !existingEmail
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
