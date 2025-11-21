import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPrompts() {
  console.log('🌱 Seeding prompts...');

  const prompts = [
    {
      schemaId: 'webPortfolioSma',
      title: 'Bagian 1 • Mendeteksi Keunikan Diri',
      titleShort: 'Pemetaan Persona',
      slug: 'pemetaan-persona',
      level: 'Pemula',
      durasiMenit: 45,
      prasyarat: ['Pemahaman dasar HTML/CSS', 'Kemampuan menulis refleksi diri'],
      tujuanPembelajaran: [
        'Mengidentifikasi keunikan personal sebagai dasar konten portfolio',
        'Menerapkan teknik self-discovery untuk mengungkap minat dan value',
        'Memetakan persona digital yang autentik dan menarik'
      ],
      tags: ['portfolio', 'self-discovery', 'personal-branding', 'web-design'],
      starterZip: '/downloads/starter-portfolio-1.zip',
      gambarContoh: '/images/tutorials/persona-mapping-example.jpg',
      roleDeskripsi: 'Kamu adalah konselor karir digital yang membantu siswa SMA menemukan dan mengkomunikasikan keunikan mereka.',
      roleFokus: 'Memfasilitasi proses self-discovery melalui pertanyaan reflektif dan framework pemetaan persona.',
      taskTujuan: [
        'Membuat profil keunikan personal yang spesifik dan measurable',
        'Mengidentifikasi minimal 3 passion utama dan bagaimana mengkomunikasikannya',
        'Memetakan value proposition unik untuk target audience portfolio'
      ],
      taskInstruksi: 'Siswa akan melalui proses self-discovery terbimbing untuk mengidentifikasi keunikan diri yang akan menjadi fondasi portfolio mereka. Gunakan pertanyaan reflektif dan framework pemetaan persona.',
      contextSituasi: [
        'Siswa SMA kelas 11-12 yang perlu membuat portfolio digital',
        'Memiliki basic knowledge tentang web tapi bingung konten apa yang mau ditampilkan',
        'Butuh guidance untuk menemukan unique value proposition mereka'
      ],
      reasoningPrinsip: 'Gunakan pendekatan reflektif dengan pertanyaan terbuka yang mendorong introspeksi mendalam. Fokus pada keunikan autentik daripada image yang dipaksakan.',
      reasoningStruktur: {
        observasi: 'Identifikasi minat, hobi, achievement, dan feedback dari orang lain',
        analisis: 'Temukan pola dan tema yang berulang dari observasi',
        keputusan: 'Rumuskan 2-3 unique selling points yang autentik dan measurable'
      },
      reasoningStrategi: [
        'Mulai dengan pertanyaan konkret tentang aktivitas favorit',
        'Gali lebih dalam dengan "why" di balik setiap aktivitas',
        'Cross-check dengan feedback dari teman/keluarga',
        'Validasi dengan evidence konkret (project, achievement, dll)'
      ],
      outputBentuk: [
        'Dokumen "Persona Map" dengan 3 kolom: Passion, Skills, Values',
        'List 5 achievement/project yang mencerminkan keunikan',
        'Draft 1 paragraf "About Me" yang autentik dan engaging'
      ],
      outputTugasSiswa: 'Buat dokumen Persona Map lengkap dengan evidence pendukung, kemudian draft About Me section untuk portfolio.',
      stopKriteria: [
        'Siswa sudah bisa mengartikulasikan minimal 3 keunikan dengan jelas',
        'Ada evidence konkret untuk setiap keunikan yang diklaim',
        'About Me section sudah reviewed dan mendapat feedback positif dari teman'
      ],
      tipsAksesibilitas: [
        'Sediakan template Persona Map untuk siswa yang kesulitan memulai',
        'Berikan contoh konkret dari portfolio yang bagus',
        'Tawarkan sesi one-on-one untuk siswa yang butuh guidance ekstra'
      ],
      tipsKesalahanUmum: [
        'Terlalu generic ("saya passionate di teknologi") - minta spesifik',
        'Mengklaim skill tanpa evidence - minta proof/portfolio link',
        'Menulis About Me seperti CV formal - dorong tone yang lebih personal'
      ],
      tipsTantangan: [
        'Challenge siswa untuk interview 3 teman dan minta feedback tentang keunikan mereka',
        'Minta siswa untuk analisis 2 portfolio professional dan identifikasi apa yang bikin menarik',
        'Suruh siswa revisi About Me section mereka minimal 3x sebelum finalisasi'
      ],
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: true,
      versi: '1.0.0',
      publishedAt: new Date('2024-01-15'),
    },
    {
      schemaId: 'webPortfolioSma',
      title: 'Bagian 2 • Desain Visual Portfolio',
      titleShort: 'Desain & Branding',
      slug: 'desain-visual-portfolio',
      level: 'Menengah',
      durasiMenit: 60,
      prasyarat: ['Sudah menyelesaikan Pemetaan Persona', 'Basic HTML/CSS', 'Figma atau tools desain serupa'],
      tujuanPembelajaran: [
        'Menerapkan prinsip desain visual untuk portfolio yang profesional',
        'Membuat brand identity yang konsisten dengan persona',
        'Mengoptimalkan UX untuk target audience portfolio'
      ],
      tags: ['design', 'ui-ux', 'branding', 'portfolio', 'figma'],
      starterZip: '/downloads/starter-portfolio-2.zip',
      gambarContoh: '/images/tutorials/portfolio-design-example.jpg',
      roleDeskripsi: 'Kamu adalah UI/UX designer yang membantu siswa mentranslasikan persona mereka ke dalam desain visual yang menarik dan fungsional.',
      roleFokus: 'Mengajarkan prinsip desain visual, color theory, typography, dan UX best practices untuk portfolio.',
      taskTujuan: [
        'Membuat moodboard yang align dengan persona',
        'Design high-fidelity mockup di Figma/tools serupa',
        'Mengimplementasikan design system yang konsisten'
      ],
      taskInstruksi: 'Siswa akan belajar proses desain dari moodboard hingga high-fidelity mockup, dengan fokus pada konsistensi brand dan UX optimization.',
      contextSituasi: [
        'Siswa sudah punya persona map yang clear',
        'Familiar dengan basic HTML/CSS tapi belum mahir desain',
        'Butuh guidance untuk memilih color palette, typography, dan layout'
      ],
      reasoningPrinsip: 'Desain harus mencerminkan persona sambil tetap profesional dan accessible. Prioritaskan clarity over creativity yang berlebihan.',
      reasoningStruktur: {
        observasi: 'Research portfolio inspiring dan identify element yang bagus',
        analisis: 'Breakdown kenapa element tertentu work dan bagaimana adapt untuk persona',
        keputusan: 'Pilih 2-3 style direction dan test dengan target audience'
      },
      reasoningStrategi: [
        'Mulai dengan moodboard untuk visualisasi direction',
        'Pilih color palette maksimal 3-4 warna',
        'Typography maksimal 2 font family',
        'Layout prioritaskan readability dan hierarchy yang jelas'
      ],
      outputBentuk: [
        'Moodboard dengan minimal 10 reference image',
        'Style guide: color palette, typography, spacing system',
        'High-fidelity mockup minimal 3 key screens (Home, About, Portfolio)'
      ],
      outputTugasSiswa: 'Buat complete design system dan mockup portfolio di Figma, siap untuk diimplementasikan ke code.',
      stopKriteria: [
        'Design sudah konsisten across all screens',
        'Lolos accessibility check (contrast ratio, font size)',
        'Mendapat feedback positif dari minimal 3 peer review'
      ],
      tipsAksesibilitas: [
        'Provide curated list portfolio inspiring untuk reference',
        'Sediakan template design system di Figma',
        'Tawarkan design critique session untuk feedback'
      ],
      tipsKesalahanUmum: [
        'Terlalu banyak warna - stick to 3-4 warna max',
        'Font size terlalu kecil - minimum 16px untuk body text',
        'Layout terlalu crowded - white space is good',
        'Inkonsistensi spacing - use spacing system (8px, 16px, 24px, dll)'
      ],
      tipsTantangan: [
        'Challenge siswa untuk redesign portfolio existing dengan style mereka',
        'Minta siswa A/B test 2 design direction dengan target audience',
        'Suruh siswa present design decision mereka di class'
      ],
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: true,
      versi: '1.0.0',
      publishedAt: new Date('2024-01-20'),
    },
    {
      schemaId: 'pythonDataAnalysis',
      title: 'Analisis Data Sederhana dengan Pandas',
      titleShort: 'Pandas Basics',
      slug: 'pandas-data-analysis-basics',
      level: 'Pemula',
      durasiMenit: 90,
      prasyarat: ['Python basics (variables, functions, loops)', 'Basic math/statistics'],
      tujuanPembelajaran: [
        'Memahami struktur DataFrame dan Series di Pandas',
        'Melakukan data cleaning dan preprocessing',
        'Membuat visualisasi data sederhana'
      ],
      tags: ['python', 'pandas', 'data-analysis', 'visualization'],
      starterZip: '/downloads/starter-pandas-1.zip',
      gambarContoh: '/images/tutorials/pandas-analysis-example.jpg',
      roleDeskripsi: 'Kamu adalah data analyst yang mengajarkan fundamental Pandas untuk analisis data.',
      roleFokus: 'Membantu siswa memahami workflow data analysis: load → clean → analyze → visualize.',
      taskTujuan: [
        'Load dan explore dataset CSV menggunakan Pandas',
        'Melakukan data cleaning (handle missing values, duplicates)',
        'Membuat 3 jenis visualisasi untuk insight extraction'
      ],
      taskInstruksi: 'Siswa akan menganalisis dataset real (contoh: data nilai siswa, data penjualan, dll) menggunakan Pandas dari awal hingga visualisasi.',
      contextSituasi: [
        'Siswa sudah familiar dengan Python basics',
        'Belum pernah pakai Pandas atau library data analysis',
        'Butuh guidance step-by-step untuk first data project'
      ],
      reasoningPrinsip: 'Mulai dengan exploration untuk understand data, lalu systematic cleaning, baru analysis dan visualization.',
      reasoningStruktur: {
        observasi: 'Explore dataset: shape, columns, data types, missing values',
        analisis: 'Identify pattern, outlier, dan relationship antar variable',
        keputusan: 'Pilih visualization yang paling efektif untuk communicate insight'
      },
      reasoningStrategi: [
        'Selalu mulai dengan df.head(), df.info(), df.describe()',
        'Handle missing values sebelum analysis',
        'Use visualisasi yang appropriate: line chart untuk trend, bar chart untuk comparison, dll'
      ],
      outputBentuk: [
        'Jupyter Notebook dengan complete analysis workflow',
        'Minimal 3 visualisasi dengan insight tertulis',
        'Report 1 halaman summarize key findings'
      ],
      outputTugasSiswa: 'Submit Jupyter Notebook lengkap dengan code, visualisasi, dan insight summary.',
      stopKriteria: [
        'Code berjalan tanpa error',
        'Visualisasi jelas dan labeled dengan baik',
        'Insight yang ditulis specific dan actionable'
      ],
      tipsAksesibilitas: [
        'Provide dataset yang clean dan well-documented',
        'Sediakan code template dengan TODO comments',
        'Buat video tutorial untuk follow along'
      ],
      tipsKesalahanUmum: [
        'Tidak check missing values di awal',
        'Visualisasi tanpa title/label yang jelas',
        'Insight terlalu generic ("data meningkat") tanpa specific number'
      ],
      tipsTantangan: [
        'Challenge siswa untuk find hidden pattern yang tidak obvious',
        'Minta siswa compare 2 dataset yang berbeda',
        'Suruh siswa present findings ke class dengan storytelling yang bagus'
      ],
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: false,
      versi: '1.0.0',
      publishedAt: new Date('2024-01-25'),
    },
  ];

  for (const promptData of prompts) {
    const prompt = await prisma.prompt.upsert({
      where: { slug: promptData.slug },
      update: {},
      create: promptData,
    });
    console.log(`✅ Created prompt: ${prompt.title}`);
  }

  console.log('✅ Prompts seeded successfully');
}

// Run if executed directly
if (require.main === module) {
  seedPrompts()
    .catch((error) => {
      console.error('Error seeding prompts:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
