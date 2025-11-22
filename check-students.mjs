import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const students = await prisma.student.findMany({
  select: {
    id: true,
    studentId: true,
    fullName: true,
    class: true
  },
  take: 5
})
console.log('Students in database:', JSON.stringify(students, null, 2))
await prisma.$disconnect()
