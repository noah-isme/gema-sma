import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      studentId,
      username,
      fullName,
      email,
      password,
      class: studentClass,
      phone,
      address,
      parentName,
      parentPhone,
      extracurricularInterests,
      userType
    } = body

    // Validate required fields - must have either studentId or username
    if (!fullName || !password) {
      return NextResponse.json(
        { message: 'Nama lengkap dan password wajib diisi' },
        { status: 400 }
      )
    }

    if (!studentId && !username) {
      return NextResponse.json(
        { message: 'NIS atau username wajib diisi' },
        { status: 400 }
      )
    }

    // Validate user type
    if (userType !== 'student') {
      return NextResponse.json(
        { message: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Check if student ID already exists (if provided)
    if (studentId) {
      const existingStudentId = await prisma.student.findUnique({
        where: { studentId }
      })

      if (existingStudentId) {
        return NextResponse.json(
          { message: 'NIS sudah terdaftar. Gunakan NIS yang berbeda.' },
          { status: 400 }
        )
      }
    }

    // Check if username already exists (if provided)
    if (username) {
      const existingUsername = await prisma.student.findUnique({
        where: { username }
      })

      if (existingUsername) {
        return NextResponse.json(
          { message: 'Username sudah digunakan. Pilih username lain.' },
          { status: 400 }
        )
      }
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.student.findUnique({
        where: { email }
      })

      if (existingEmail) {
        return NextResponse.json(
          { message: 'Email sudah terdaftar. Gunakan email yang berbeda.' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new student
    const student = await prisma.student.create({
      data: {
        studentId: studentId || null,
        username: username || null,
        fullName,
        email: email || null,
        password: hashedPassword,
        class: studentClass,
        phone,
        address,
        parentName,
        parentPhone,
        extracurricularInterests: Array.isArray(extracurricularInterests) && extracurricularInterests.length
          ? extracurricularInterests
          : Array.isArray(extracurricularInterests)
            ? []
            : undefined,
        status: 'active',
        isVerified: true // For now, auto-verify. Later can add email verification
      }
    })

    // Remove password from response and return necessary session data
    const { password: _, ...studentWithoutPassword } = student;

    return NextResponse.json({
      message: 'Registrasi berhasil! Selamat datang di GEMA.',
      student: {
        id: student.id,
        studentId: student.studentId,
        username: student.username,
        fullName: student.fullName,
        email: student.email,
        class: student.class
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Student registration error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
