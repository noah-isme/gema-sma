import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Seeding student progress data for beta testing...\n');

  // Check if student 2025001 exists
  let student = await prisma.student.findUnique({
    where: { studentId: '2025001' }
  });

  if (!student) {
    console.log('❌ Student 2025001 not found. Creating test student...');
    // Create a test student
    student = await prisma.student.create({
      data: {
        studentId: '2025001',
        email: 'student2025001@smawahidiyah.sch.id',
        password: 'hashedpassword123', // In production, this should be properly hashed
        fullName: 'Ahmad Fauzi',
        class: 'XI-A',
        phone: '081234567890',
        status: 'active',
        isVerified: true,
      }
    });
    console.log('✅ Test student created:', student.fullName);
  } else {
    console.log('✅ Student found:', student.fullName);
  }

  // Get existing assignments
  const assignments = await prisma.assignment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  console.log(`\n📋 Total assignments found: ${assignments.length}`);

  if (assignments.length === 0) {
    console.log('❌ No assignments found. Please run other seed files first.');
    return;
  }

  // Check existing submissions for this student
  const existingSubmissions = await prisma.submission.findMany({
    where: { studentId: student.id }
  });

  console.log(`✏️  Existing submissions: ${existingSubmissions.length}`);

  if (existingSubmissions.length === 0) {
    console.log('\n🚀 Creating sample submissions for student...\n');

    // Create 2-3 sample submissions
    const sampleCount = Math.min(3, assignments.length);
    
    for (let i = 0; i < sampleCount; i++) {
      const assignment = assignments[i];
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: assignment.id,
          studentId: student.id,
          fileName: `tugas-${i + 1}.pdf`,
          originalFileName: `Tugas ${assignment.title}.pdf`,
          filePath: `/uploads/submissions/tugas-${i + 1}.pdf`,
          fileSize: Math.floor(Math.random() * 500000) + 100000, // 100KB - 600KB
          mimeType: 'application/pdf',
          documentType: 'pdf',
          status: i === 0 ? 'submitted' : 'graded',
          grade: i === 0 ? null : Math.floor(Math.random() * 20 + 80), // 80-100
          feedback: i === 0 ? null : 'Kerja bagus! Terus tingkatkan.',
          isLate: false,
          submittedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
        }
      });

      console.log(`  ✅ Submission: ${assignment.title} - ${submission.status} ${submission.grade ? `(${submission.grade})` : ''}`);
    }
  } else {
    console.log('✅ Student already has submissions');
  }

  // Summary
  const finalSubmissions = await prisma.submission.count({
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
  console.log(`  - Total submissions: ${finalSubmissions}`);
  console.log(`  - Completed: ${completedCount}`);
  console.log(`  - Pending: ${finalSubmissions - completedCount}`);
  console.log('\n💡 Test landing page at: http://localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
