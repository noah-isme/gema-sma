import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Seeding student progress for landing page stats...\n');

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { studentId: '2025001' }
  });

  if (!student) {
    console.log('❌ Student 2025001 not found');
    console.log('💡 Run main seed first: npm run db:seed');
    return;
  }

  console.log('✅ Student found:', student.fullName);
  console.log('📝 Student ID (cuid):', student.id);

  // Check existing assignments
  const assignments = await prisma.assignment.findMany({
    take: 10
  });

  console.log(`📝 Total assignments in database: ${assignments.length}`);

  if (assignments.length === 0) {
    console.log('⚠️  No assignments found. Skipping submission creation.');
    console.log('💡 Run: npm run db:seed to create assignments');
    return;
  }

  // Check existing submissions (use student.id which is the cuid)
  const existingSubmissions = await prisma.submission.findMany({
    where: { studentId: student.id }
  });

  console.log(`✏️  Existing submissions: ${existingSubmissions.length}\n`);

  if (existingSubmissions.length > 0) {
    console.log('✅ Student already has submissions:');
    for (const sub of existingSubmissions) {
      const assignment = assignments.find(a => a.id === sub.assignmentId);
      console.log(`  - ${assignment?.title || sub.assignmentId}: ${sub.status}`);
    }
    return;
  }

  // Create sample submissions
  console.log('🚀 Creating sample submissions...\n');

  const submissionsToCreate = Math.min(5, assignments.length);

  for (let i = 0; i < submissionsToCreate; i++) {
    const assignment = assignments[i];
    const isCompleted = i < 3; // First 3 are completed

    const submission = await prisma.submission.create({
      data: {
        assignmentId: assignment.id,
        studentId: student.id, // Use the cuid, not studentId field
        fileName: `submission-${i + 1}.pdf`,
        originalFileName: `tugas-${i + 1}.pdf`,
        filePath: `/uploads/submissions/tugas-${i + 1}.pdf`,
        fileSize: Math.floor(Math.random() * 1000000 + 500000), // 500KB - 1.5MB
        mimeType: 'application/pdf',
        documentType: 'pdf',
        submittedAt: new Date(),
        status: isCompleted ? 'graded' : 'submitted',
        grade: isCompleted ? Math.floor(Math.random() * 20 + 80) : null,
        feedback: isCompleted ? 'Good work! Keep it up.' : null,
        isLate: false
      }
    });

    console.log(`  ${isCompleted ? '✅' : '⏳'} ${assignment.title} - ${submission.status}`);
  }

  // Summary
  const finalCount = await prisma.submission.count({
    where: { studentId: student.id }
  });

  const completedCount = await prisma.submission.count({
    where: { 
      studentId: student.id,
      status: 'graded'
    }
  });

  console.log('\n✨ Seeding completed!');
  console.log('📊 Summary:');
  console.log(`  - Total submissions: ${finalCount}`);
  console.log(`  - Completed: ${completedCount}`);
  console.log(`  - Pending: ${finalCount - completedCount}`);
  console.log('\n💡 Check landing page stats at: http://localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
