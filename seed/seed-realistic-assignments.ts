import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding realistic assignment data (makalah, esai, presentasi)...')

  // 1. Get admin for createdBy
  const admin = await prisma.admin.findFirst()
  if (!admin) {
    console.log('❌ No admin found. Please create an admin first.')
    return
  }
  console.log('✅ Admin found:', admin.id)

  // 2. Delete old test assignments
  await prisma.assignment.deleteMany({
    where: {
      OR: [
        { id: { startsWith: 'test-' } },
        { title: { contains: 'Algoritma Sort' } },
        { title: { contains: 'Web Portfolio' } },
        { title: { contains: 'Database' } }
      ]
    }
  })
  console.log('✅ Cleaned up old test assignments')

  // 3. Create realistic assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'Makalah: Dampak Kecerdasan Buatan dalam Pendidikan',
        description: 'Buatlah makalah ilmiah tentang dampak positif dan negatif penggunaan AI dalam dunia pendidikan. Makalah harus memuat pendahuluan, tinjauan pustaka, pembahasan, kesimpulan, dan daftar pustaka.',
        subject: 'Informatika',
        dueDate: new Date('2025-11-15T23:59:00'),
        status: 'active',
        createdBy: admin.id,
        instructions: JSON.stringify([
          'Format makalah: A4, margin 3-3-3-3 cm, font Times New Roman 12pt',
          'Minimal 10 halaman (tidak termasuk cover dan daftar pustaka)',
          'Gunakan minimal 10 referensi (buku, jurnal, atau artikel ilmiah)',
          'Cantumkan sitasi dan daftar pustaka sesuai format APA',
          'File yang diterima: PDF atau DOCX',
          'Nama file: NIS_NamaLengkap_MakalahAI.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 20971520, // 20MB
        maxSubmissions: 1
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Esai: Etika Penggunaan Data Pribadi di Era Digital',
        description: 'Tulislah esai argumentatif tentang pentingnya etika dalam penggunaan data pribadi pengguna internet. Sampaikan argumen yang kuat disertai contoh kasus nyata.',
        subject: 'Informatika',
        dueDate: new Date('2025-11-20T23:59:00'),
        status: 'active',
        createdBy: admin.id,
        instructions: JSON.stringify([
          'Panjang esai: 1500-2000 kata',
          'Struktur: Pendahuluan, Argumen (min 3 paragraf), Kesimpulan',
          'Cantumkan minimal 5 contoh kasus nyata (berita/artikel)',
          'Gunakan bahasa formal dan argumentatif',
          'File yang diterima: PDF atau DOCX',
          'Nama file: NIS_NamaLengkap_EsaiEtika.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 10485760, // 10MB
        maxSubmissions: 1
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Presentasi: Inovasi Teknologi untuk Solusi Lingkungan',
        description: 'Buatlah presentasi tentang salah satu inovasi teknologi (IoT, AI, Blockchain, dll) yang dapat digunakan untuk mengatasi masalah lingkungan. Presentasi harus informatif dan menarik.',
        subject: 'Informatika',
        dueDate: new Date('2025-11-25T23:59:00'),
        status: 'active',
        createdBy: admin.id,
        instructions: JSON.stringify([
          'Slide presentasi: 10-15 slide (termasuk cover dan penutup)',
          'Konten: Cover, Pendahuluan, Masalah Lingkungan, Solusi Teknologi, Studi Kasus, Kesimpulan',
          'Desain: Menarik, tidak terlalu banyak teks, gunakan visual/diagram',
          'File yang diterima: PDF atau PPTX',
          'Nama file: NIS_NamaLengkap_PresentasiTeknologi.pdf/.pptx',
          'Catatan: Slide akan dipresentasikan di kelas (5-7 menit)'
        ]),
        allowedFileTypes: 'pdf,ppt,pptx',
        maxFileSize: 30485760, // ~30MB
        maxSubmissions: 1
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Makalah Kelompok: Analisis Sistem Informasi Sekolah',
        description: 'Dalam kelompok (3-4 orang), buatlah makalah analisis sistem informasi yang ada di sekolah. Identifikasi kelebihan, kekurangan, dan usulan perbaikan sistem.',
        subject: 'Informatika',
        dueDate: new Date('2025-12-01T23:59:00'),
        status: 'active',
        createdBy: admin.id,
        instructions: JSON.stringify([
          'Kelompok: 3-4 orang (cantumkan semua anggota di cover)',
          'Format makalah: A4, margin normal, font Times New Roman 12pt',
          'Minimal 15 halaman (analisis mendalam)',
          'Konten: Profil sistem saat ini, Analisis SWOT, Use Case Diagram, Usulan perbaikan',
          'Sertakan screenshot/foto sistem jika perlu',
          'File yang diterima: PDF atau DOCX',
          'Nama file: Kelompok[X]_AnalisisSistemSekolah.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 25165824, // ~25MB
        maxSubmissions: 10 // Untuk kelompok
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Esai Reflektif: Pengalaman Belajar Informatika Semester Ini',
        description: 'Tulislah esai reflektif tentang pengalaman dan pembelajaran kalian di mata pelajaran Informatika semester ini. Apa yang paling berkesan? Apa tantangan yang dihadapi?',
        subject: 'Informatika',
        dueDate: new Date('2025-12-10T23:59:00'),
        status: 'active',
        createdBy: admin.id,
        instructions: JSON.stringify([
          'Panjang esai: 800-1200 kata',
          'Gaya penulisan: Reflektif dan personal (boleh menggunakan sudut pandang orang pertama)',
          'Konten: Pembelajaran yang diperoleh, Tantangan yang dihadapi, Solusi yang dicoba, Rencana ke depan',
          'Jujur dan terbuka dalam merefleksikan pengalaman',
          'File yang diterima: PDF atau DOCX',
          'Nama file: NIS_NamaLengkap_RefleksiInformatika.pdf'
        ]),
        allowedFileTypes: 'pdf,doc,docx',
        maxFileSize: 5242880, // 5MB
        maxSubmissions: 1
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Presentasi Mini: Review Aplikasi Mobile Pilihan',
        description: 'Pilih satu aplikasi mobile yang menurut kalian inovatif, lalu buatlah presentasi singkat yang mereview aplikasi tersebut dari sisi UI/UX, fitur, dan teknologi yang digunakan.',
        subject: 'Informatika',
        dueDate: new Date('2025-12-05T23:59:00'),
        status: 'active',
        createdBy: admin.id,
        instructions: JSON.stringify([
          'Slide presentasi: 5-8 slide',
          'Konten: Cover, Profil Aplikasi, UI/UX Review, Fitur Unggulan, Teknologi, Rating & Rekomendasi',
          'Sertakan screenshot aplikasi',
          'Desain slide: Clean dan profesional',
          'File yang diterima: PDF atau PPTX',
          'Nama file: NIS_NamaLengkap_ReviewAplikasi.pdf/.pptx',
          'Catatan: Presentasi 3-5 menit'
        ]),
        allowedFileTypes: 'pdf,ppt,pptx',
        maxFileSize: 20971520, // 20MB
        maxSubmissions: 1
      }
    })
  ])

  console.log(`✅ Created ${assignments.length} realistic assignments`)

  // 4. Get Ahmad Fauzi
  const student = await prisma.student.findUnique({
    where: { studentId: '2025001' }
  })

  if (student) {
    // 5. Create sample submissions untuk 2 assignments
    await prisma.submission.deleteMany({
      where: { studentId: student.id }
    })

    const submissions = await prisma.submission.createMany({
      data: [
        {
          assignmentId: assignments[1].id, // Esai Etika
          studentId: student.id,
          fileName: '2025001_AhmadFauzi_EsaiEtika.pdf',
          originalFileName: 'Esai Etika Data Pribadi.pdf',
          filePath: '/uploads/submissions/2025001_AhmadFauzi_EsaiEtika.pdf',
          fileSize: 856432, // ~850KB
          mimeType: 'application/pdf',
          documentType: 'pdf',
          status: 'submitted',
          submittedAt: new Date('2025-10-28T14:30:00'),
          isLate: false
        },
        {
          assignmentId: assignments[5].id, // Review Aplikasi
          studentId: student.id,
          fileName: '2025001_AhmadFauzi_ReviewAplikasi.pdf',
          originalFileName: 'Review Instagram Reels.pdf',
          filePath: '/uploads/submissions/2025001_AhmadFauzi_ReviewAplikasi.pdf',
          fileSize: 2458624, // ~2.4MB
          mimeType: 'application/pdf',
          documentType: 'pdf',
          status: 'submitted',
          submittedAt: new Date('2025-10-30T16:45:00'),
          isLate: false
        }
      ]
    })

    console.log(`✅ Created ${submissions.count} sample submissions for Ahmad Fauzi`)
  }

  // 6. Verify
  console.log('\n📊 Summary:')
  const totalAssignments = await prisma.assignment.count()
  const totalSubmissions = await prisma.submission.count()
  console.log(`- Total assignments: ${totalAssignments}`)
  console.log(`- Total submissions: ${totalSubmissions}`)
  
  console.log('\n📝 Assignment List:')
  const allAssignments = await prisma.assignment.findMany({
    select: {
      title: true,
      subject: true,
      dueDate: true,
      allowedFileTypes: true,
      _count: { select: { submissions: true } }
    },
    orderBy: { dueDate: 'asc' }
  })
  
  allAssignments.forEach((a, i) => {
    console.log(`${i+1}. ${a.title}`)
    console.log(`   Subject: ${a.subject} | Due: ${a.dueDate.toLocaleDateString('id-ID')} | Types: ${a.allowedFileTypes} | Submissions: ${a._count.submissions}`)
  })

  console.log('\n✅ Realistic assignment seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding data:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
