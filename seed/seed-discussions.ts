import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDiscussions() {
  console.log('🌱 Seeding discussion threads...');

  const discussions = [
    {
      title: '💬 Tips Belajar JavaScript untuk Pemula',
      authorId: 'student-001',
      authorName: 'Andi Pratama',
      content: 'Halo teman-teman! Saya baru mulai belajar JavaScript dan masih bingung dengan konsep async/await. Ada yang bisa kasih tips atau resource bagus untuk belajar?',
    },
    {
      title: '🤔 Perbedaan React vs Vue, Mana yang Lebih Baik?',
      authorId: 'student-002',
      authorName: 'Sarah Dewi',
      content: 'Saya lagi bingung mau belajar React atau Vue untuk project portfolio. Menurut kalian mana yang lebih cocok untuk pemula? Dan kenapa?',
    },
    {
      title: '🚀 Share Project Kalian Yuk!',
      authorId: 'admin-001',
      authorName: 'Admin GEMA',
      content: 'Thread untuk sharing project yang sudah kalian buat. Bisa website, aplikasi, atau apapun. Mari saling kasih feedback dan belajar bareng!',
    },
    {
      title: '❓ Cara Deploy Website Gratis?',
      authorId: 'student-003',
      authorName: 'Budi Santoso',
      content: 'Website saya sudah jadi di localhost. Sekarang bingung cara deploy supaya bisa diakses orang lain. Ada rekomendasi platform gratis yang bagus?',
    },
    {
      title: '💡 Ide Project untuk Portfolio',
      authorId: 'student-004',
      authorName: 'Dina Kusuma',
      content: 'Butuh ide project untuk portfolio yang stand out. Selain to-do list dan weather app, ada ide project menarik yang bisa bikin portfolio kita beda dari yang lain?',
    },
  ];

  for (const discussionData of discussions) {
    const thread = await prisma.discussionThread.create({
      data: discussionData,
    });
    console.log(`✅ Created discussion: ${thread.title}`);

    // Add some replies to each thread
    if (thread.title.includes('JavaScript')) {
      await prisma.discussionReply.createMany({
        data: [
          {
            threadId: thread.id,
            authorId: 'student-005',
            authorName: 'Raka Putra',
            content: 'Coba baca dokumentasi MDN Web Docs, sangat lengkap! Untuk async/await, praktik langsung dengan fetch API akan lebih cepat paham.',
          },
          {
            threadId: thread.id,
            authorId: 'admin-001',
            authorName: 'Admin GEMA',
            content: 'Rekomendasi: javascript.info untuk teori yang dalam, dan freeCodeCamp untuk praktik. Jangan lupa join channel Discord GEMA untuk diskusi real-time!',
          },
        ],
      });
    }

    if (thread.title.includes('React vs Vue')) {
      await prisma.discussionReply.createMany({
        data: [
          {
            threadId: thread.id,
            authorId: 'student-006',
            authorName: 'Lina Wati',
            content: 'Saya pakai React dan sangat bagus! Job market untuk React juga lebih banyak. Tapi Vue lebih mudah dipelajari untuk pemula.',
          },
          {
            threadId: thread.id,
            authorId: 'student-007',
            authorName: 'Fajar Aditya',
            content: 'Vue! Lebih simple dan dokumentasinya bagus banget. React bagus tapi learning curve-nya agak steep di awal.',
          },
          {
            threadId: thread.id,
            authorId: 'admin-001',
            authorName: 'Admin GEMA',
            content: 'Keduanya bagus! Saran saya: belajar fundamentals JavaScript dulu sampai kuat, baru pilih framework. React lebih populer di job market, Vue lebih friendly untuk pemula.',
          },
        ],
      });
    }

    if (thread.title.includes('Deploy')) {
      await prisma.discussionReply.createMany({
        data: [
          {
            threadId: thread.id,
            authorId: 'student-008',
            authorName: 'Eko Wijaya',
            content: 'Vercel! Super mudah, tinggal connect GitHub repo dan auto deploy. Gratis untuk project personal.',
          },
          {
            threadId: thread.id,
            authorId: 'student-009',
            authorName: 'Tika Sari',
            content: 'Netlify juga bagus! Dan kalau mau yang lebih advanced, coba Railway atau Render untuk fullstack app.',
          },
        ],
      });
    }

    if (thread.title.includes('Ide Project')) {
      await prisma.discussionReply.createMany({
        data: [
          {
            threadId: thread.id,
            authorId: 'student-010',
            authorName: 'Galang Pratama',
            content: 'Coba bikin platform untuk local UMKM di daerah kamu! Real problem, real impact. Atau bisa juga recipe sharing app dengan fitur meal planning.',
          },
          {
            threadId: thread.id,
            authorId: 'student-011',
            authorName: 'Putri Andini',
            content: 'Saya lagi bikin expense tracker dengan data visualization. Atau bisa juga bikin study planner dengan Pomodoro timer integrated.',
          },
          {
            threadId: thread.id,
            authorId: 'admin-001',
            authorName: 'Admin GEMA',
            content: 'Pro tip: Bikin project yang solve masalah yang kamu sendiri punya. Lebih passionate dan bisa explain dengan baik saat interview. Contoh: jika suka fotografi, bikin portfolio gallery dengan advanced filters.',
          },
        ],
      });
    }

    if (thread.title.includes('Share Project')) {
      await prisma.discussionReply.createMany({
        data: [
          {
            threadId: thread.id,
            authorId: 'student-012',
            authorName: 'Ilham Fauzi',
            content: 'Saya baru selesai bikin clone Spotify UI dengan React + Tailwind. Masih banyak bug tapi lumayan untuk belajar! Link: github.com/ilham/spotify-clone',
          },
          {
            threadId: thread.id,
            authorId: 'student-013',
            authorName: 'Maya Anggraini',
            content: 'Portfolio website saya sudah jadi! Pakai Next.js + Framer Motion untuk animasi. Feedback welcome ya: maya-portfolio.vercel.app',
          },
        ],
      });
    }
  }

  console.log('✅ Discussion threads and replies seeded successfully');
}

// Run if executed directly
if (require.main === module) {
  seedDiscussions()
    .catch((error) => {
      console.error('Error seeding discussions:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
