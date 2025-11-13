import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRoadmapAssignments() {
  try {
    console.log('🚀 Seeding assignments sesuai dengan classroom roadmap...\n');

    // Cari admin user untuk createdBy field
    let admin = await prisma.admin.findFirst({
      where: { email: 'admin@smawahidiyah.edu' }
    });

    // Jika admin belum ada, buat admin default
    if (!admin) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      admin = await prisma.admin.create({
        data: {
          email: 'admin@smawahidiyah.edu',
          password: hashedPassword,
          name: 'Admin GEMA',
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Admin user created');
    }

    // Assignments berdasarkan classroom roadmap yang benar
    const roadmapAssignments = [
      {
        title: 'Makalah: Dampak AI dalam Pendidikan Indonesia',
        description: 'Tulislah makalah ilmiah yang menganalisis dampak kecerdasan buatan terhadap dunia pendidikan di Indonesia (positif dan negatif).',
        subject: 'Informatika - Kecerdasan Buatan',
        dueDate: new Date('2024-12-18T23:59:59Z'),
        maxSubmissions: 1,
        status: 'active',
        instructions: JSON.stringify([
          'Format A4, Times New Roman 12pt, spasi 1.5, margin 3-3-3-3',
          'Struktur: Cover, Pendahuluan, Pembahasan, Kesimpulan, Daftar Pustaka',
          'Minimal 10 halaman (tidak termasuk lampiran)',
          'Gunakan minimal 10 referensi akademis',
          'File yang diterima: PDF atau DOCX',
          'Nama file: NIS_NamaLengkap_MakalahAI.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 20971520, // 20MB
        createdBy: admin.id,
      },
      {
        title: 'Esai Argumentatif: Etika Penggunaan Data Pribadi',
        description: 'Buat esai argumentatif mengenai urgensi regulasi data pribadi pengguna internet di Indonesia.',
        subject: 'Informatika - Etika Digital',
        dueDate: new Date('2024-12-22T23:59:59Z'),
        maxSubmissions: 1,
        status: 'active',
        instructions: JSON.stringify([
          'Panjang esai 1500–2000 kata',
          'Struktur: Pendahuluan, Argumen (min 3), Kesimpulan',
          'Cantumkan minimal 5 referensi kasus nyata',
          'Gunakan bahasa formal',
          'File: PDF atau DOCX',
          'Nama file: NIS_NamaLengkap_EsaiEtika.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 10485760, // 10MB
        createdBy: admin.id,
      },
      {
        title: 'Presentasi: Inovasi Teknologi untuk Lingkungan',
        description: 'Susun presentasi yang menjelaskan satu inovasi teknologi untuk solusi lingkungan.',
        subject: 'Informatika - Teknologi Hijau',
        dueDate: new Date('2024-12-28T23:59:59Z'),
        maxSubmissions: 1,
        status: 'active',
        instructions: JSON.stringify([
          '10–15 slide termasuk cover & penutup',
          'Konten: Latar belakang, Teknologi, Studi kasus, Dampak',
          'Gunakan visual/grafik seperlunya',
          'File: PDF atau PPTX',
          'Nama file: NIS_NamaLengkap_PresentasiHijau.pdf/.pptx'
        ]),
        allowedFileTypes: 'pdf,ppt,pptx',
        maxFileSize: 20971520, // 20MB
        createdBy: admin.id,
      },
      {
        title: 'Makalah Kelompok: Analisis Sistem Informasi Sekolah',
        description: 'Kelompok 3–4 siswa menganalisis sistem informasi sekolah saat ini dan memberi usulan perbaikan.',
        subject: 'Basis Data - Sistem Informasi',
        dueDate: new Date('2025-01-05T23:59:59Z'),
        maxSubmissions: 10,
        status: 'upcoming',
        instructions: JSON.stringify([
          'Cantumkan semua anggota di cover',
          'Minimal 15 halaman dengan analisis SWOT & Use Case Diagram',
          'Sertakan rekomendasi perbaikan sistem',
          'File: PDF atau DOCX',
          'Nama file: KelompokX_AnalisisSistem.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 25165824, // 24MB
        createdBy: admin.id,
      },
      {
        title: 'Esai Reflektif: Pengalaman Belajar Informatika',
        description: 'Esai reflektif personal mengenai pengalaman belajar selama semester berjalan.',
        subject: 'Informatika - Refleksi',
        dueDate: new Date('2025-01-10T23:59:59Z'),
        maxSubmissions: 1,
        status: 'upcoming',
        instructions: JSON.stringify([
          'Panjang 800–1200 kata',
          'Tuliskan pembelajaran, tantangan, dan rencana ke depan',
          'Gunakan gaya reflektif',
          'File: PDF atau DOCX',
          'Nama file: NIS_NamaLengkap_RefleksiIF.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 5242880, // 5MB
        createdBy: admin.id,
      },
      {
        title: 'Presentasi Mini: Review Aplikasi Pendidikan Favorit',
        description: 'Presentasi singkat (5–8 slide) yang me-review aplikasi edukasi pilihan.',
        subject: 'UI/UX Design - Review',
        dueDate: new Date('2025-01-15T23:59:59Z'),
        maxSubmissions: 1,
        status: 'upcoming',
        instructions: JSON.stringify([
          'Struktur: Cover, Profil aplikasi, UI/UX review, Fitur, Rekomendasi',
          'Sertakan screenshot aplikasi',
          'File: PDF atau PPTX',
          'Nama file: NIS_NamaLengkap_ReviewApp.pdf/.pptx'
        ]),
        allowedFileTypes: 'pdf,ppt,pptx',
        maxFileSize: 15728640, // 15MB
        createdBy: admin.id,
      },
    ];

    // Clear existing assignments untuk update bersih
    console.log('🧹 Cleaning existing assignments...');
    await prisma.assignment.deleteMany({});
    console.log('✅ Existing assignments cleared');

    // Create assignments berdasarkan roadmap
    let createdCount = 0;
    for (const assignmentData of roadmapAssignments) {
      await prisma.assignment.create({
        data: assignmentData
      });
      createdCount++;
      console.log(`✅ Created: ${assignmentData.title}`);
    }

    console.log(`\n🎉 Successfully created ${createdCount} assignments sesuai roadmap!`);
    console.log('\n📚 Assignment Structure:');
    console.log('├── Proyek 1-3: Basic Web Development (HTML, CSS, JS)');
    console.log('├── Proyek 4-6: Data Management & CRUD Operations');
    console.log('├── Proyek 7-9: Advanced Features & API Integration');
    console.log('└── Proyek 10: Full-Stack Final Project');
    
    console.log('\n⏰ Timeline:');
    console.log('- Active assignments: 1-3 (Due Dec 2024)');
    console.log('- Upcoming assignments: 4-10 (Due Jan-Feb 2025)');
    console.log('- Progressive difficulty: Beginner → Intermediate → Advanced');

  } catch (error) {
    console.error('❌ Error seeding roadmap assignments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default seedRoadmapAssignments;

if (process.argv[1]?.endsWith('seed-roadmap-assignments.ts')) {
  seedRoadmapAssignments()
    .then(() => {
      console.log('\n✅ Roadmap assignments seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
