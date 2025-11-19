import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetStudentPasswords() {
  console.log('🔐 Resetting Student Passwords...')
  console.log('')

  const newPassword = 'student123'
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Reset all students to same password
  const result = await prisma.student.updateMany({
    data: {
      password: hashedPassword
    }
  })

  console.log(`✅ Reset ${result.count} student passwords`)
  console.log('')
  console.log('📊 Sample students:')
  
  const sampleStudents = await prisma.student.findMany({
    take: 5,
    select: {
      studentId: true,
      fullName: true,
      email: true
    },
    orderBy: {
      studentId: 'asc'
    }
  })

  sampleStudents.forEach(student => {
    console.log(`   - ${student.studentId}: ${student.fullName}`)
  })

  console.log('')
  console.log('✅ Password reset complete!')
  console.log('')
  console.log('🔑 New credentials (semua student):')
  console.log('   Student ID: 2025001 - 2025020')
  console.log('   Password:   student123')
  console.log('')
}

async function main() {
  try {
    await resetStudentPasswords()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
