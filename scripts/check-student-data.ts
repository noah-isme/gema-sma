import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking student 2025001 data...\n');
  
  const student = await prisma.user.findUnique({ 
    where: { nis: '2025001' },
    include: { 
      enrollments: {
        include: {
          classroom: true
        }
      }
    }
  });
  
  if (!student) {
    console.log('❌ Student 2025001 not found');
    return;
  }
  
  console.log('✅ Student found:', student.name);
  console.log('📧 Email:', student.email);
  console.log('🏫 Enrollments:', student.enrollments.length);
  
  // Check assignments
  const assignments = await prisma.assignment.findMany({
    where: {
      classroomId: { in: student.enrollments.map(e => e.classroomId) }
    }
  });
  
  console.log('📝 Assignments in classrooms:', assignments.length);
  
  // Check submissions
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { studentId: '2025001' },
    include: {
      assignment: {
        select: {
          title: true
        }
      }
    }
  });
  
  console.log('✏️  Submissions by student:', submissions.length);
  
  if (submissions.length === 0) {
    console.log('\n⚠️  No submissions found - need to seed data!');
  } else {
    console.log('\n✅ Student has submissions:');
    submissions.forEach(s => {
      console.log(`  - ${s.assignment.title}: ${s.status} (${s.score || 0} points)`);
    });
  }
  
  return submissions.length > 0;
}

main()
  .then((hasData) => {
    if (!hasData) {
      console.log('\n💡 Run: npm run seed-student-progress');
    }
  })
  .catch(console.error)
  .finally(() => prisma.$disconnect());
