import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Seeding student progress data for beta testing...\n');

  // Check if student 2025001 exists
  const student = await prisma.student.findUnique({
    where: { studentId: '2025001' }
  });

  if (!student) {
    console.log('❌ Student 2025001 not found. Run main seed first!');
    console.log('   Command: npm run db:seed');
    return;
  }

  console.log('✅ Student found:', student.name);

  // Get student's classrooms
  const enrollments = await prisma.classroomEnrollment.findMany({
    where: { studentId: '2025001' },
    include: { classroom: true }
  });

  console.log('🏫 Enrollments:', enrollments.length);

  if (enrollments.length === 0) {
    console.log('❌ No enrollments found. Creating enrollment...');
    
    // Find or create GEMA classroom
    let classroom = await prisma.classroom.findFirst({
      where: { slug: 'gema-classroom-1' }
    });

    if (!classroom) {
      console.log('Creating GEMA classroom...');
      classroom = await prisma.classroom.create({
        data: {
          id: 'gema-classroom-1',
          title: 'GEMA - Generasi Muda Informatika',
          slug: 'gema-classroom-1',
          description: 'Kelas ekstrakulikuler informatika SMA Wahidiyah Kediri',
          teacherId: student.id // Use any teacher ID
        }
      });
    }

    // Enroll student
    await prisma.classroomEnrollment.create({
      data: {
        studentId: '2025001',
        classroomId: classroom.id,
        enrolledAt: new Date()
      }
    });

    console.log('✅ Student enrolled in GEMA classroom');
  }

  // Get or create assignments
  let assignments = await prisma.assignment.findMany({
    where: {
      classroomId: { in: enrollments.map(e => e.classroomId) }
    },
    take: 5
  });

  if (assignments.length === 0) {
    console.log('📝 No assignments found. Creating sample assignments...');
    
    const classroomId = enrollments[0]?.classroomId || 'gema-classroom-1';

    const assignmentData = [
      {
        title: 'Pengenalan HTML & CSS',
        description: 'Membuat halaman web sederhana dengan HTML dan CSS',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        classroomId,
        maxScore: 100
      },
      {
        title: 'JavaScript Dasar',
        description: 'Latihan logika dan algoritma dengan JavaScript',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        classroomId,
        maxScore: 100
      },
      {
        title: 'Membuat Form Interaktif',
        description: 'Buat form validasi dengan JavaScript',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        classroomId,
        maxScore: 100
      },
      {
        title: 'Responsive Web Design',
        description: 'Membuat website yang responsive',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (completed)
        classroomId,
        maxScore: 100
      },
      {
        title: 'Git & GitHub Basics',
        description: 'Belajar version control dengan Git',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago (completed)
        classroomId,
        maxScore: 100
      }
    ];

    for (const data of assignmentData) {
      const assignment = await prisma.assignment.create({ data });
      assignments.push(assignment);
      console.log(`  ✅ Created: ${assignment.title}`);
    }
  }

  console.log(`\n📋 Total assignments: ${assignments.length}`);

  // Check existing submissions
  const existingSubmissions = await prisma.assignmentSubmission.findMany({
    where: { studentId: '2025001' }
  });

  console.log(`✏️  Existing submissions: ${existingSubmissions.length}`);

  if (existingSubmissions.length === 0) {
    console.log('\n🚀 Creating sample submissions for student 2025001...\n');

    // Create submissions for completed assignments (past due date)
    const completedAssignments = assignments.filter(a => 
      new Date(a.dueDate) < new Date()
    );

    for (const assignment of completedAssignments) {
      const submission = await prisma.assignmentSubmission.create({
        data: {
          assignmentId: assignment.id,
          studentId: '2025001',
          content: `Submission for ${assignment.title}`,
          submittedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000), // Random time in past 5 days
          status: 'GRADED',
          score: Math.floor(Math.random() * 20 + 80), // Random score 80-100
          feedback: 'Good work! Keep it up.'
        }
      });

      console.log(`  ✅ Submission: ${assignment.title} - ${submission.score} points`);
    }

    // Create 1 pending submission
    const pendingAssignment = assignments.find(a => 
      new Date(a.dueDate) > new Date()
    );

    if (pendingAssignment) {
      await prisma.assignmentSubmission.create({
        data: {
          assignmentId: pendingAssignment.id,
          studentId: '2025001',
          content: `Submission for ${pendingAssignment.title}`,
          submittedAt: new Date(),
          status: 'SUBMITTED',
          score: null,
          feedback: null
        }
      });

      console.log(`  ⏳ Pending: ${pendingAssignment.title}`);
    }
  } else {
    console.log('✅ Student already has submissions');
    existingSubmissions.forEach(s => {
      console.log(`  - ${s.assignmentId}: ${s.status} (${s.score || 0} points)`);
    });
  }

  // Summary
  const finalSubmissions = await prisma.assignmentSubmission.count({
    where: { studentId: '2025001' }
  });

  const completedCount = await prisma.assignmentSubmission.count({
    where: { 
      studentId: '2025001',
      status: 'GRADED'
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
