import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const student = await prisma.student.findFirst({
  where: {
    OR: [
      { username: 'noahcaesar' },
      { studentId: 'noahcaesar' }
    ]
  },
  select: {
    id: true,
    studentId: true,
    username: true,
    fullName: true,
    class: true,
    email: true,
    status: true,
    createdAt: true
  }
})

console.log('Student noahcaesar:', JSON.stringify(student, null, 2))
await prisma.$disconnect()
