import { PrismaClient } from '@prisma/client'
import type { Prisma, QuizQuestionType, QuizSessionMode, QuizSessionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function ensureAnnouncementSchema() {
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'AnnouncementCategory'
      ) THEN
        CREATE TYPE "AnnouncementCategory" AS ENUM ('KELAS', 'EVENT', 'TUGAS', 'NILAI', 'SISTEM');
      END IF;
    END
    $$;
  `)

  const statements = [
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "excerpt" TEXT`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "category" "AnnouncementCategory" NOT NULL DEFAULT 'SISTEM'`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'info'`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "isImportant" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "showOnHomepage" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "deadline" TIMESTAMPTZ`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "link" TEXT`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "publishDate" TIMESTAMPTZ NOT NULL DEFAULT now()`
  ]

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement)
  }
}

async function main() {
  console.log('🌱 Starting database seed...')

  let quizzesSeeded = 0
  let quizQuestionsSeeded = 0
  let quizSessionsSeeded = 0

  // Create admin users (2 admins)
  console.log('👨‍💼 Creating admin accounts...')
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admins = [
    {
      email: 'superadmin@smawahidiyah.edu',
      password: hashedPassword,
      name: 'Super Administrator',
      role: 'SUPER_ADMIN'
    },
    {
      email: 'admin.gema@smawahidiyah.edu',
      password: hashedPassword,
      name: 'Admin GEMA',
      role: 'ADMIN'
    }
  ]

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: admin
    })
  }

  console.log('✅ Created 2 admin accounts')
  const adminRecords = await prisma.admin.findMany({
    where: { email: { in: admins.map((admin) => admin.email) } },
    select: { id: true, email: true, name: true },
  })
  const adminMap = new Map(adminRecords.map((admin) => [admin.email, admin]))

  // Create student accounts (20 students)
  console.log('👨‍🎓 Creating student accounts...')

  const studentNames = [
    'Ahmad Fauzi', 'Budi Santoso', 'Citra Dewi', 'Dedi Rahman', 'Eka Putri',
    'Fajar Nugroho', 'Gita Sari', 'Hadi Wijaya', 'Indah Permata', 'Joko Susilo',
    'Kartika Ayu', 'Lutfi Hakim', 'Maya Sari', 'Nanda Putra', 'Oka Widodo',
    'Putri Lestari', 'Rizki Ramadhan', 'Sari Indah', 'Taufik Hidayat', 'Umi Kalsum'
  ]

  const students = studentNames.map((name, index) => ({
    studentId: `2025${(index + 1).toString().padStart(3, '0')}`, // 2025001, 2025002, etc.
    fullName: name,
    email: `${name.toLowerCase().replace(' ', '.')}@students.smawahidiyah.edu`,
    password: bcrypt.hashSync('student123', 12),
    class: `XII-${String.fromCharCode(65 + (index % 3))}`, // XII-A, XII-B, XII-C
    phone: `0812${Math.floor(Math.random() * 90000000 + 10000000)}`,
    address: `Jl. Sudirman No.${Math.floor(Math.random() * 100) + 1}, Kediri`,
    parentName: `Orang Tua ${name.split(' ')[0]}`,
    parentPhone: `0813${Math.floor(Math.random() * 90000000 + 10000000)}`,
    status: 'ACTIVE' as const
  }))

  for (const student of students) {
    await prisma.student.upsert({
      where: { studentId: student.studentId },
      update: {},
      create: student
    })
  }

  console.log('✅ Created 20 student accounts')
  const studentRecords = await prisma.student.findMany({
    where: { studentId: { in: students.map((student) => student.studentId) } },
    select: { id: true, studentId: true, fullName: true },
  })
  const studentMap = new Map(studentRecords.map((student) => [student.studentId, student]))

  // Create sample announcements
  console.log('📢 Creating announcements...')
  await ensureAnnouncementSchema()
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Selamat Datang di Program GEMA SMA Wahidiyah!',
        content: 'Assalamualaikum warahmatullahi wabarakatuh. Selamat datang para santri teknologi di program Generasi Muda Informatika (GEMA). Mari bersama kita bangun masa depan teknologi yang lebih baik.',
        type: 'info'
      },
      {
        title: 'Jadwal Pengenalan Program GEMA',
        content: 'Pengenalan program GEMA akan dilaksanakan pada tanggal 20 Oktober 2025 di Aula SMA Wahidiyah. Wajib dihadiri oleh semua peserta.',
        type: 'warning'
      },
      {
        title: 'Workshop Coding Dasar - Gratis!',
        content: 'Workshop pengenalan coding untuk pemula akan dilaksanakan setiap Sabtu di Lab Komputer. Materi meliputi HTML, CSS, dan JavaScript.',
        type: 'success'
      }
    ]
  })

  console.log('✅ Created 3 announcements')

  // Create sample events
  console.log('📅 Creating events...')
  await prisma.event.createMany({
    data: [
      {
        title: 'Workshop Web Development',
        description: 'Belajar membuat website modern dengan React dan Next.js. Cocok untuk pemula yang ingin memulai karir di dunia web development.',
        date: new Date('2025-11-15'),
        location: 'Lab Komputer SMA Wahidiyah',
        capacity: 30,
        registered: 28
      },
      {
        title: 'Lomba Karya Tulis Teknologi',
        description: 'Kompetisi menulis artikel tentang perkembangan teknologi terkini. Tema: "AI dan Masa Depan Pendidikan".',
        date: new Date('2025-11-20'),
        location: 'Aula SMA Wahidiyah',
        capacity: 50,
        registered: 35
      },
      {
        title: 'Study Group Python Programming',
        description: 'Belajar Python bersama dengan mentor berpengalaman. Project-based learning dengan fokus pada automation.',
        date: new Date('2025-11-25'),
        location: 'Ruang Kelas XII-A',
        capacity: 25,
        registered: 22
      },
      {
        title: 'Seminar "Teknologi Hijau untuk Lingkungan"',
        description: 'Seminar tentang penerapan teknologi untuk menjaga kelestarian lingkungan. Invited speaker dari ITB.',
        date: new Date('2025-12-01'),
        location: 'Gedung Serbaguna',
        capacity: 100,
        registered: 75
      }
    ]
  })

  console.log('✅ Created 4 events')

  // Create sample gallery items
  console.log('🖼️ Creating gallery items...')
  await prisma.gallery.createMany({
    data: [
      {
        title: 'Kegiatan Pengenalan GEMA 2025',
        description: 'Moment perkenalan antara mentor dan santri baru program GEMA di Aula SMA Wahidiyah',
        imageUrl: 'https://picsum.photos/800/600?random=1',
        category: 'kegiatan'
      },
      {
        title: 'Workshop Coding Santri',
        description: 'Santri GEMA fokus belajar programming di Lab Komputer',
        imageUrl: 'https://picsum.photos/800/600?random=2',
        category: 'workshop'
      },
      {
        title: 'Tim GEMA Juara Lomba',
        description: 'Tim GEMA berhasil meraih juara dalam lomba teknologi se-Kediri',
        imageUrl: 'https://picsum.photos/800/600?random=3',
        category: 'prestasi'
      },
      {
        title: 'Belajar Bersama di Masjid',
        description: 'Kegiatan tadarus Al-Quran dan diskusi teknologi santri GEMA',
        imageUrl: 'https://picsum.photos/800/600?random=4',
        category: 'kegiatan'
      }
    ]
  })

  console.log('✅ Created 4 gallery items')

  // Create sample quizzes with question banks
  console.log('🧠 Creating quiz library and demo sessions...')
  const quizHost = await prisma.admin.findUnique({
    where: { email: 'admin.gema@smawahidiyah.edu' }
  })

  if (!quizHost) {
    throw new Error('Admin host (admin.gema@smawahidiyah.edu) not found for quiz seeding')
  }

  type QuizSessionSeed = {
    code: string
    title: string
    description?: string | null
    mode: QuizSessionMode
    status: QuizSessionStatus
    startedAt?: Date
    finishedAt?: Date
    scheduledStart?: Date
    scheduledEnd?: Date
    homeworkWindowStart?: Date
    homeworkWindowEnd?: Date
  }

  type QuizQuestionSeed = {
    type: QuizQuestionType
    prompt: string
    options?: unknown[]
    correctAnswers?: unknown
    shortAnswers?: string[]
    points: number
    timeLimitSeconds?: number
    competencyTag?: string
    explanation?: string
    difficulty?: string
  }

  type QuizDefinition = {
    slug: string
    title: string
    description: string
    isPublic: boolean
    defaultPoints: number
    timePerQuestion: number
    questions: QuizQuestionSeed[]
    session?: QuizSessionSeed
  }

  const quizDefinitions: QuizDefinition[] = [
    {
      slug: 'quiz-fundamental-web',
      title: 'Kuis Fundamental Web Dasar',
      description: 'Mengukur pemahaman HTML, CSS, dan dasar aksesibilitas.',
      isPublic: true,
      defaultPoints: 10,
      timePerQuestion: 45,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Elemen HTML manakah yang semantik untuk menyatakan navigasi utama pada halaman?',
          options: ['<div>', '<section>', '<nav>', '<main>'],
          correctAnswers: ['<nav>'],
          points: 10,
          timeLimitSeconds: 45,
          competencyTag: 'HTML Semantik',
          explanation: 'Elemen <nav> digunakan untuk membungkus tautan navigasi utama.'
        },
        {
          type: 'MULTI_SELECT',
          prompt: 'Manakah praktik berikut yang meningkatkan aksesibilitas situs?',
          options: [
            'Memberi teks alternatif pada gambar',
            'Menggunakan warna teks dan latar dengan kontras tinggi',
            'Menempatkan seluruh konten dalam satu <div>',
            'Menonaktifkan fokus keyboard'
          ],
          correctAnswers: [
            'Memberi teks alternatif pada gambar',
            'Menggunakan warna teks dan latar dengan kontras tinggi'
          ],
          points: 12,
          timeLimitSeconds: 60,
          competencyTag: 'Aksesibilitas'
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Property CSS flexbox dapat digunakan untuk membuat layout responsif tanpa media query.',
          correctAnswers: [true],
          points: 8,
          timeLimitSeconds: 30,
          competencyTag: 'CSS Flexbox'
        },
        {
          type: 'SHORT_ANSWER',
          prompt: 'Sebutkan minimal satu alat untuk menganalisis performa website di peramban.',
          shortAnswers: ['lighthouse', 'google lighthouse', 'chrome devtools'],
          points: 10,
          timeLimitSeconds: 45,
          competencyTag: 'Performance',
          explanation: 'Lighthouse di Chrome DevTools dapat mengaudit performa, aksesibilitas, dan SEO.'
        }
      ],
      session: {
        code: 'GEMA01',
        title: 'Demo Live Web Fundamentals',
        description: 'Sesi contoh untuk memperkenalkan fitur live quiz di kelas GEMA.',
        mode: 'LIVE',
        status: 'COMPLETED',
        startedAt: new Date(Date.now() - 1000 * 60 * 50),
        finishedAt: new Date(Date.now() - 1000 * 60 * 20)
      }
    },
    {
      slug: 'quiz-logika-pemrograman',
      title: 'Kuis Logika Pemrograman',
      description: 'Pertanyaan campuran seputar algoritma dasar, pseudocode, dan struktur data sederhana.',
      isPublic: false,
      defaultPoints: 15,
      timePerQuestion: 60,
      questions: [
        {
          type: 'MULTIPLE_CHOICE',
          prompt: 'Struktur data apa yang paling tepat untuk menerapkan algoritma BFS (Breadth First Search)?',
          options: ['Stack', 'Queue', 'Linked List', 'Tree'],
          correctAnswers: ['Queue'],
          points: 15,
          timeLimitSeconds: 60,
          competencyTag: 'Struktur Data'
        },
        {
          type: 'NUMERIC',
          prompt: 'Berapa jumlah maksimum iterasi dalam algoritma binary search untuk daftar 1024 elemen?',
          correctAnswers: [{ value: 10, tolerance: 0 }],
          points: 15,
          timeLimitSeconds: 45,
          competencyTag: 'Kompleksitas',
          explanation: 'Binary search membutuhkan log₂(n) langkah. log₂(1024) = 10.'
        },
        {
          type: 'SHORT_ANSWER',
          prompt: 'Apa nama teknik desain algoritma yang memecah masalah menjadi sub masalah lebih kecil dan solusi digabung?',
          shortAnswers: ['divide and conquer', 'divide-and-conquer'],
          points: 15,
          timeLimitSeconds: 45,
          competencyTag: 'Algoritma'
        },
        {
          type: 'TRUE_FALSE',
          prompt: 'Bubble sort memiliki kompleksitas waktu rata-rata O(n log n).',
          correctAnswers: [false],
          points: 8,
          competencyTag: 'Kompleksitas',
          explanation: 'Bubble sort memiliki kompleksitas O(n²) pada rata-rata dan kasus terburuk.'
        }
      ],
      session: {
        code: 'GEMA-HOME',
        title: 'Homework Logika Pemrograman',
        description: 'Latihan mandiri yang bisa diakses siswa selama akhir pekan.',
        mode: 'HOMEWORK',
        status: 'ACTIVE',
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        homeworkWindowStart: new Date(Date.now() - 1000 * 60 * 60 * 6),
        homeworkWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 18)
      }
    }
  ]

  for (const definition of quizDefinitions) {
    let quizRecord = await prisma.quiz.findUnique({
      where: { slug: definition.slug },
      include: { questions: true }
    })

    if (!quizRecord) {
      quizRecord = await prisma.quiz.create({
        data: {
          title: definition.title,
          slug: definition.slug,
          description: definition.description,
          isPublic: definition.isPublic,
          defaultPoints: definition.defaultPoints,
          timePerQuestion: definition.timePerQuestion,
          createdBy: quizHost.id,
          questions: {
            create: definition.questions.map((question, index) => {
              const optionsValue =
                question.options !== undefined
                  ? (question.options as Prisma.InputJsonValue)
                  : undefined
              const correctAnswersSource =
                question.correctAnswers !== undefined
                  ? question.correctAnswers
                  : question.shortAnswers !== undefined
                    ? question.shortAnswers
                    : undefined

              return {
                order: index,
                type: question.type,
                prompt: question.prompt,
                options: optionsValue,
                correctAnswers: correctAnswersSource as Prisma.InputJsonValue | undefined,
                points: question.points,
                timeLimitSeconds: question.timeLimitSeconds ?? null,
                competencyTag: question.competencyTag ?? null,
                explanation: question.explanation ?? null,
                difficulty: question.difficulty ?? null
              }
            })
          }
        },
        include: { questions: true }
      })

      quizzesSeeded += 1
      quizQuestionsSeeded += quizRecord.questions.length
    }

    if (!quizRecord) {
      continue
    }

    if (definition.session) {
      const existingSession = await prisma.quizSession.findUnique({
        where: { code: definition.session.code }
      })

      if (!existingSession) {
        await prisma.quizSession.create({
          data: {
            quizId: quizRecord.id,
            hostId: quizHost.id,
            code: definition.session.code,
            title: definition.session.title,
            description: definition.session.description ?? null,
            mode: definition.session.mode,
            status: definition.session.status,
            startedAt: definition.session.startedAt ?? null,
            finishedAt: definition.session.finishedAt ?? null,
            scheduledStart: definition.session.scheduledStart ?? null,
            scheduledEnd: definition.session.scheduledEnd ?? null,
            homeworkWindowStart: definition.session.homeworkWindowStart ?? null,
            homeworkWindowEnd: definition.session.homeworkWindowEnd ?? null,
            metadata: {}
          }
        })
        quizSessionsSeeded += 1
      }
    }
  }

  console.log(`✅ Quiz library ready (${quizzesSeeded} new quiz(es), ${quizQuestionsSeeded} soal, ${quizSessionsSeeded} sesi demo)`)

  // Create sample settings
  console.log('⚙️ Creating system settings...')
  await prisma.settings.upsert({
    where: { key: 'site_title' },
    update: {},
    create: {
      key: 'site_title',
      value: 'GEMA - Generasi Muda Informatika SMA Wahidiyah'
    }
  })

  await prisma.settings.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      value: 'Program pengembangan bakat teknologi untuk santri SMA Wahidiyah Kediri'
    }
  })

  await prisma.settings.upsert({
    where: { key: 'contact_email' },
    update: {},
    create: {
      key: 'contact_email',
      value: 'gema@smawahidiyah.edu'
    }
  })

  console.log('✅ Created system settings')

  // Seed discussion threads
  console.log('💬 Seeding tutorial discussions...')
  type ActorRef =
    | { type: 'admin'; email: string }
    | { type: 'student'; studentId: string }

  const daysAgo = (days: number, hours = 0) =>
    new Date(Date.now() - days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000)

  const resolveActor = (actor: ActorRef) => {
    if (actor.type === 'admin') {
      const admin = adminMap.get(actor.email)
      if (!admin) {
        throw new Error(`Admin with email ${actor.email} not found for discussion seed`)
      }
      return { id: admin.id, name: admin.name ?? 'Admin GEMA' }
    }

    const student = studentMap.get(actor.studentId)
    if (!student) {
      throw new Error(`Student ${actor.studentId} not found for discussion seed`)
    }
    return { id: student.id, name: student.fullName }
  }

  const discussionSeeds: Array<{
    id: string
    title: string
    owner: ActorRef
    content: string
    createdAt: Date
    replies: Array<{ actor: ActorRef; content: string; createdAt: Date }>
  }> = [
    {
      id: 'diskusi-hero-optimasi',
      title: 'Optimasi animasi hero supaya tidak patah-patah',
      owner: { type: 'student', studentId: '2025003' }, // Indah Permata
      content:
        'Saat scroll di landing page, animasi hero saya terasa lag. Apakah ada tips supaya elemen dekoratifnya lebih ringan?',
      createdAt: daysAgo(4, 2),
      replies: [
        {
          actor: { type: 'admin', email: 'admin.gema@smawahidiyah.edu' },
          content:
            'Halo Indah! Coba gunakan CSS transform + will-change dan hindari terlalu banyak blur besar. Di repo terbaru kami juga pindah ke CSS native parallax supaya JS-nya lebih ringan.',
          createdAt: daysAgo(4, 5),
        },
        {
          actor: { type: 'student', studentId: '2025010' }, // Hadi Wijaya
          content:
            'Aku sempat turun jumlah blur dari 80px ke 40px dan efeknya lumayan. Bisa juga compress gradient sebagai SVG.',
          createdAt: daysAgo(3, 1),
        },
      ],
    },
    {
      id: 'diskusi-kuis-state',
      title: 'Simpan state jawaban kuis sebelum submit?',
      owner: { type: 'student', studentId: '2025008' }, // Gita Sari
      content:
        'Kalau siswa reload halaman kuis, apakah jawaban terakhir bisa dipulihkan? Ada ide penyimpanan local storage?',
      createdAt: daysAgo(2, 4),
      replies: [
        {
          actor: { type: 'admin', email: 'admin.gema@smawahidiyah.edu' },
          content:
            'Di modul quiz kami pakai client storage helper (`quiz.participant:*`). Kamu bisa niru pola itu: simpan array jawaban ke localStorage lalu restore ketika komponen mount.',
          createdAt: daysAgo(2, 6),
        },
        {
          actor: { type: 'student', studentId: '2025015' }, // Oka Widodo
          content:
            'Aku tambahkan indicator auto-save tiap 30 detik supaya siswa tenang. Pastikan encrypt datanya kalau sensitif ya.',
          createdAt: daysAgo(1, 3),
        },
        {
          actor: { type: 'admin', email: 'admin.gema@smawahidiyah.edu' },
          content:
            'Kami catat sebagai feedback, nanti fitur resume progress akan dibuka di dashboard siswa.',
          createdAt: daysAgo(1, 6),
        },
      ],
    },
    {
      id: 'diskusi-gallery-optimasi',
      title: 'Strategi optimasi gambar galeri kelas',
      owner: { type: 'student', studentId: '2025005' }, // Budi Santoso
      content:
        'Galeri kegiatan memakai foto 3MB-an. Bagaimana workflow kompresi yang aman supaya tidak pecah?',
      createdAt: daysAgo(3, 5),
      replies: [
        {
          actor: { type: 'student', studentId: '2025012' }, // Lutfi Hakim
          content:
            'Aku pakai Squoosh + ubah ke WebP 80%. Selain itu set `sizes` di Next/Image supaya tidak download 1200px di mobile.',
          createdAt: daysAgo(3, 9),
        },
        {
          actor: { type: 'admin', email: 'admin.gema@smawahidiyah.edu' },
          content:
            'Betul, Next/Image + preset breakpoints membantu. Kita juga set quality 70 dan lazy loading.',
          createdAt: daysAgo(2, 2),
        },
      ],
    },
  ]

  for (const seed of discussionSeeds) {
    const owner = resolveActor(seed.owner)
    await prisma.discussionReply.deleteMany({ where: { threadId: seed.id } })
    await prisma.discussionThread.upsert({
      where: { id: seed.id },
      update: {
        title: seed.title,
        content: seed.content,
        authorId: owner.id,
        authorName: owner.name,
      },
      create: {
        id: seed.id,
        title: seed.title,
        content: seed.content,
        authorId: owner.id,
        authorName: owner.name,
        createdAt: seed.createdAt,
      },
    })

    if (seed.replies.length > 0) {
      const replyData = seed.replies.map((reply) => {
        const actor = resolveActor(reply.actor)
        return {
          threadId: seed.id,
          authorId: actor.id,
          authorName: actor.name,
          content: reply.content,
          createdAt: reply.createdAt,
          updatedAt: reply.createdAt,
        }
      })
      await prisma.discussionReply.createMany({ data: replyData })
    }
  }

  console.log(`✅ Seeded ${discussionSeeds.length} discussion threads with lively replies`)

  // Create Python Coding Lab tasks
  console.log('🐍 Creating Python Coding Lab tasks...')
  
  // Task 1: Hello World
  const task1 = await prisma.pythonCodingTask.upsert({
    where: { slug: 'hello-world-python' },
    update: {},
    create: {
      title: 'Hello World',
      slug: 'hello-world-python',
      description: `Tugas pertamamu adalah membuat program Python sederhana yang mencetak "Hello, World!" ke layar.

Ini adalah tugas dasar untuk memulai perjalanan programming Python kamu!`,
      difficulty: 'EASY',
      category: 'general',
      tags: '["beginner", "introduction", "basics"]',
      starterCode: `# Write your Python code here
def hello_world():
    # TODO: Return "Hello, World!"
    pass

# Test your solution
if __name__ == "__main__":
    result = hello_world()
    print(result)`,
      solutionCode: `def hello_world():
    return "Hello, World!"

if __name__ == "__main__":
    result = hello_world()
    print(result)`,
      hints: JSON.parse('["Gunakan fungsi return untuk mengembalikan string", "String di Python bisa menggunakan petik satu atau petik dua", "Pastikan ejaan dan kapitalisasi tepat!"]'),
      timeLimit: 2,
      memoryLimit: 128,
      points: 100,
      order: 1,
      isActive: true,
    },
  })

  await prisma.pythonTestCase.create({
    data: {
      taskId: task1.id,
      name: 'Test Case 1: Basic Output',
      input: '',
      expectedOutput: 'Hello, World!',
      isHidden: false,
      points: 100,
      order: 1,
    },
  })

  // Task 2: Penjumlahan Dua Bilangan
  const task2 = await prisma.pythonCodingTask.upsert({
    where: { slug: 'penjumlahan-dua-bilangan' },
    update: {},
    create: {
      title: 'Penjumlahan Dua Bilangan',
      slug: 'penjumlahan-dua-bilangan',
      description: `Buatlah fungsi yang menerima dua bilangan sebagai parameter dan mengembalikan hasil penjumlahannya.

Contoh:
- Input: 5, 3 → Output: 8
- Input: -2, 7 → Output: 5

Format input: dua bilangan dipisahkan spasi. Cetak hasil penjumlahannya.`,
      difficulty: 'EASY',
      category: 'math',
      tags: '["math", "basic", "arithmetic"]',
      starterCode: `def add_numbers(a, b):
    # TODO: Return the sum of a and b
    pass

if __name__ == "__main__":
    import sys
    raw = sys.stdin.read().strip().split()
    if len(raw) >= 2:
        a, b = map(int, raw[:2])
        print(add_numbers(a, b))`,
      solutionCode: `def add_numbers(a, b):
    return a + b

if __name__ == "__main__":
    import sys
    raw = sys.stdin.read().strip().split()
    if len(raw) >= 2:
        a, b = map(int, raw[:2])
        print(add_numbers(a, b))`,
      hints: JSON.parse('["Gunakan operator + untuk penjumlahan", "Fungsi harus return hasilnya, bukan print", "Python otomatis menangani bilangan negatif"]'),
      timeLimit: 2,
      memoryLimit: 128,
      points: 100,
      order: 2,
      isActive: true,
    },
  })

  await prisma.pythonTestCase.createMany({
    data: [
      {
        taskId: task2.id,
        name: 'Test Case 1: Bilangan Positif',
        input: '5 3',
        expectedOutput: '8',
        isHidden: false,
        points: 50,
        order: 1,
      },
      {
        taskId: task2.id,
        name: 'Test Case 2: Bilangan Negatif',
        input: '-2 7',
        expectedOutput: '5',
        isHidden: false,
        points: 50,
        order: 2,
      },
    ],
  })

  // Task 3: FizzBuzz
  const task3 = await prisma.pythonCodingTask.upsert({
    where: { slug: 'fizzbuzz' },
    update: {},
    create: {
      title: 'FizzBuzz',
      slug: 'fizzbuzz',
      description: `Buatlah fungsi FizzBuzz yang menerima sebuah bilangan n dan mengembalikan:
- "Fizz" jika n habis dibagi 3
- "Buzz" jika n habis dibagi 5
- "FizzBuzz" jika n habis dibagi 3 dan 5
- String dari bilangan tersebut jika tidak memenuhi kondisi di atas

Contoh:
- Input: 3 → Output: "Fizz"
- Input: 5 → Output: "Buzz"
- Input: 15 → Output: "FizzBuzz"
- Input: 7 → Output: "7"

Format input: satu bilangan bulat n. Cetak hasil FizzBuzz untuk n.`,
      difficulty: 'MEDIUM',
      category: 'algorithm',
      tags: '["logic", "conditional", "modulo"]',
      starterCode: `def fizzbuzz(n):
    # TODO: Implement FizzBuzz logic
    pass

if __name__ == "__main__":
    import sys
    raw = sys.stdin.read().strip()
    if raw:
        n = int(raw)
        print(fizzbuzz(n))`,
      solutionCode: `def fizzbuzz(n):
    if n % 3 == 0 and n % 5 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)`,
      hints: JSON.parse('["Gunakan operator modulo (%) untuk cek habis dibagi", "Cek kondisi FizzBuzz terlebih dahulu", "Jangan lupa convert angka ke string untuk return"]'),
      timeLimit: 3,
      memoryLimit: 128,
      points: 150,
      order: 3,
      isActive: true,
    },
  })

  await prisma.pythonTestCase.createMany({
    data: [
      {
        taskId: task3.id,
        name: 'Test Case 1: Fizz',
        input: '3',
        expectedOutput: 'Fizz',
        isHidden: false,
        points: 37,
        order: 1,
      },
      {
        taskId: task3.id,
        name: 'Test Case 2: Buzz',
        input: '5',
        expectedOutput: 'Buzz',
        isHidden: false,
        points: 37,
        order: 2,
      },
      {
        taskId: task3.id,
        name: 'Test Case 3: FizzBuzz',
        input: '15',
        expectedOutput: 'FizzBuzz',
        isHidden: false,
        points: 38,
        order: 3,
      },
      {
        taskId: task3.id,
        name: 'Test Case 4: Number',
        input: '7',
        expectedOutput: '7',
        isHidden: false,
        points: 38,
        order: 4,
      },
    ],
  })

  console.log('✅ Created 3 Python Coding Lab tasks with test cases')

  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log('- 2 Admin accounts created')
  console.log('- 20 Student accounts created')
  console.log('- 3 Announcements created')
  console.log('- 4 Activities created')
  console.log('- 4 Gallery items created')
  console.log(`- ${quizzesSeeded} quizzes created (${quizQuestionsSeeded} questions, ${quizSessionsSeeded} demo sessions)`)
  console.log('- 3 Discussion threads created')
  console.log('- 3 Python Coding Lab tasks created')
  console.log('- System settings configured')
  console.log('')
  console.log('🔐 Admin Credentials:')
  console.log('Super Admin: superadmin@smawahidiyah.edu / admin123')
  console.log('GEMA Admin: admin.gema@smawahidiyah.edu / admin123')
  console.log('')
  console.log('👨‍🎓 Student Credentials:')
  console.log('All students: [studentId]@students.smawahidiyah.edu / student123')
  console.log('Example: 2025001@students.smawahidiyah.edu / student123')
  console.log('')
  console.log('🐍 Python Coding Lab:')
  console.log('Access at: /student/python-coding-lab')
  console.log('3 sample tasks available (Easy, Medium difficulty)')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
