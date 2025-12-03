import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const student = await prisma.student.findFirst({
  where: {
    OR: [
      { username: 'noahisme' },
      { studentId: 'noahisme' }
    ]
  },
  select: {
    id: true,
    studentId: true,
    username: true,
    fullName: true,
    class: true,
    email: true,
    status: true
  }
})

console.log('Student noahisme:', JSON.stringify(student, null, 2))
await prisma.$disconnect()
