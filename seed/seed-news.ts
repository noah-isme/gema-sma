import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedNews() {
  console.log('🌱 Seeding news articles...');

  const newsArticles = [
    {
      title: '🎉 GEMA Juara 1 Lomba Web Design Tingkat Provinsi!',
      slug: 'gema-juara-web-design-provinsi-2024',
      excerpt: 'Tim GEMA dari SMA Wahidiyah Kediri berhasil meraih juara 1 dalam Lomba Web Design Tingkat Provinsi Jawa Timur 2024.',
      content: `
<h2>Prestasi Membanggakan dari Tim GEMA</h2>
<p>Kabar gembira datang dari tim GEMA (Generasi Muda Informatika) SMA Wahidiyah Kediri! Pada lomba Web Design tingkat provinsi yang diselenggarakan di Surabaya, 15 November 2024, tim kami berhasil meraih juara pertama mengalahkan 45 tim dari seluruh Jawa Timur.</p>

<h3>Karya yang Memukau Juri</h3>
<p>Tim yang beranggotakan 3 siswa kelas XI ini berhasil memukau juri dengan project web interaktif bertema "Digital Heritage: Melestarikan Budaya Lokal di Era Modern". Website yang mereka buat menampilkan informasi lengkap tentang batik khas Kediri dengan teknologi 3D visualization dan augmented reality.</p>

<blockquote>
"Kami sangat bangga dengan pencapaian ini. Ini membuktikan bahwa dengan pembelajaran yang tepat dan dedikasi, siswa SMA bisa bersaing di level profesional." - Pak Budi Santoso, Pembina GEMA
</blockquote>

<h3>Teknologi yang Digunakan</h3>
<ul>
<li>Next.js 14 untuk framework</li>
<li>Three.js untuk 3D visualization</li>
<li>TailwindCSS untuk styling</li>
<li>Firebase untuk backend</li>
</ul>

<p>Selamat untuk tim GEMA! Semoga prestasi ini menginspirasi siswa lain untuk terus berinovasi di bidang teknologi.</p>
      `,
      category: 'news',
      tags: JSON.stringify(['prestasi', 'lomba', 'web-design', 'gema', 'sma-wahidiyah']),
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: true,
      imageUrl: '/images/news/gema-juara-web-design.jpg',
      readTime: 3,
      publishedAt: new Date('2024-11-16'),
    },
    {
      title: '🚀 Workshop AI untuk Siswa: Belajar Machine Learning dari Nol',
      slug: 'workshop-ai-machine-learning-siswa-2024',
      excerpt: 'GEMA mengadakan workshop intensif tentang pengenalan AI dan Machine Learning khusus untuk siswa SMA yang ingin terjun ke dunia AI.',
      content: `
<h2>Workshop AI untuk Generasi Muda</h2>
<p>GEMA kembali mengadakan workshop menarik! Kali ini fokus pada topik yang sedang hot: Artificial Intelligence dan Machine Learning. Workshop ini akan diadakan selama 3 hari penuh pada tanggal 1-3 Desember 2024.</p>

<h3>Apa yang Akan Dipelajari?</h3>
<p>Workshop ini dirancang khusus untuk pemula yang belum pernah menyentuh AI sama sekali:</p>

<ul>
<li><strong>Hari 1:</strong> Pengenalan AI, ML, dan Python basics</li>
<li><strong>Hari 2:</strong> Praktik membuat model ML sederhana dengan scikit-learn</li>
<li><strong>Hari 3:</strong> Project: Membuat aplikasi image recognition</li>
</ul>

<h3>Narasumber Ahli</h3>
<p>Workshop akan dibawakan oleh:</p>
<ul>
<li>Mas Andi Rahman - AI Engineer di Tokopedia</li>
<li>Mbak Sarah Putri - Data Scientist di Gojek</li>
<li>Pak Dimas Prasetyo - ML Researcher dari ITS</li>
</ul>

<h3>Cara Daftar</h3>
<p>Pendaftaran dibuka untuk 30 peserta pertama. Biaya: GRATIS! (disponsori oleh Alumni GEMA)</p>
<p>Daftar melalui: <a href="https://forms.gle/gema-workshop-ai">forms.gle/gema-workshop-ai</a></p>

<p><strong>Deadline:</strong> 28 November 2024</p>

<p>Jangan lewatkan kesempatan emas ini untuk belajar AI dari praktisi industri!</p>
      `,
      category: 'news',
      tags: JSON.stringify(['workshop', 'ai', 'machine-learning', 'event', 'gratis']),
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: true,
      imageUrl: '/images/news/workshop-ai-2024.jpg',
      readTime: 4,
      publishedAt: new Date('2024-11-18'),
    },
    {
      title: '💻 Update Terbaru: Lab Komputer GEMA Kini Dilengkapi 30 PC Gaming!',
      slug: 'lab-komputer-gema-upgrade-gaming-pc',
      excerpt: 'Lab komputer GEMA mendapat upgrade besar! 30 unit PC gaming spec tinggi siap mendukung pembelajaran yang lebih advanced.',
      content: `
<h2>Upgrade Lab Komputer GEMA</h2>
<p>Berkat dukungan dari yayasan dan donasi alumni, lab komputer GEMA kini sudah dilengkapi dengan 30 unit PC gaming dengan spesifikasi tinggi!</p>

<h3>Spesifikasi PC Baru</h3>
<ul>
<li>Processor: Intel Core i7 Gen 12</li>
<li>RAM: 16GB DDR4</li>
<li>Storage: 512GB NVMe SSD</li>
<li>GPU: NVIDIA RTX 3060</li>
<li>Monitor: 24" Full HD 144Hz</li>
</ul>

<h3>Apa yang Bisa Dilakukan?</h3>
<p>Dengan spec ini, siswa GEMA sekarang bisa:</p>
<ul>
<li>Belajar game development dengan Unity/Unreal Engine</li>
<li>Praktik 3D modeling dan rendering</li>
<li>Video editing untuk project multimedia</li>
<li>Machine learning dengan dataset besar</li>
<li>Virtual Reality development</li>
</ul>

<h3>Jadwal Penggunaan Lab</h3>
<p>Lab buka setiap hari:</p>
<ul>
<li>Senin-Jumat: 13.00 - 17.00 (after school)</li>
<li>Sabtu: 08.00 - 16.00</li>
<li>Minggu: Khusus untuk project intensif (booking dulu)</li>
</ul>

<p>Terima kasih untuk semua pihak yang mendukung upgrade lab ini. Mari manfaatkan fasilitas ini sebaik-baiknya untuk belajar dan berkarya!</p>
      `,
      category: 'news',
      tags: JSON.stringify(['fasilitas', 'lab-komputer', 'upgrade', 'teknologi']),
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: false,
      imageUrl: '/images/news/lab-upgrade-2024.jpg',
      readTime: 3,
      publishedAt: new Date('2024-11-10'),
    },
    {
      title: '🎓 Alumni GEMA Diterima di Top Tech Companies: Google, Microsoft, Tokopedia!',
      slug: 'alumni-gema-kerja-di-top-tech-companies',
      excerpt: 'Prestasi membanggakan dari alumni GEMA yang berhasil diterima bekerja di perusahaan teknologi top dunia dan Indonesia.',
      content: `
<h2>Alumni GEMA Berkarir di Perusahaan Top</h2>
<p>Kabar membanggakan datang dari alumni GEMA! Beberapa alumni angkatan 2020-2022 berhasil diterima bekerja di perusahaan teknologi ternama.</p>

<h3>Kisah Sukses Alumni</h3>

<h4>Andi Wijaya (Angkatan 2020) - Software Engineer di Google Singapore</h4>
<p>"GEMA memberi saya fondasi yang kuat dalam programming. Dari sini saya belajar tidak hanya coding, tapi juga problem solving dan teamwork yang sangat berguna di Google." - Andi</p>

<h4>Sarah Dewi (Angkatan 2021) - Frontend Developer di Microsoft Indonesia</h4>
<p>"Workshop dan project di GEMA membuat portfolio saya kuat saat melamar. Microsoft sangat menghargai kandidat yang punya real project experience." - Sarah</p>

<h4>Budi Santoso (Angkatan 2022) - Backend Engineer di Tokopedia</h4>
<p>"Saya mulai dari nol di GEMA. Sekarang saya handle sistem yang dipakai jutaan user setiap hari. Terima kasih GEMA!" - Budi</p>

<h3>Tips dari Alumni untuk Adik-Adik</h3>
<ul>
<li>Build portfolio: Buat project nyata, bukan cuma tugas</li>
<li>Contribute ke open source: Show your code quality</li>
<li>Network: Join komunitas dan tech events</li>
<li>Never stop learning: Technology changes fast</li>
<li>Practice coding challenges: LeetCode, HackerRank, dll</li>
</ul>

<p>Selamat untuk para alumni! Semoga semakin banyak adik-adik GEMA yang mengikuti jejak kalian. 🚀</p>
      `,
      category: 'news',
      tags: JSON.stringify(['alumni', 'karir', 'inspirasi', 'tech-industry']),
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: true,
      imageUrl: '/images/news/alumni-success-stories.jpg',
      readTime: 5,
      publishedAt: new Date('2024-11-12'),
    },
    {
      title: '📱 Hackathon GEMA 2024: 48 Jam Membangun Aplikasi untuk Solusi Sosial',
      slug: 'hackathon-gema-2024-aplikasi-solusi-sosial',
      excerpt: 'Event tahunan GEMA kembali digelar! Hackathon dengan tema "Tech for Social Good" akan diadakan 15-17 Desember 2024.',
      content: `
<h2>Hackathon GEMA 2024</h2>
<p>Mark your calendar! Event paling ditunggu di GEMA akan segera tiba. Hackathon GEMA 2024 dengan tema "Tech for Social Good" akan diadakan tanggal 15-17 Desember 2024.</p>

<h3>Tentang Event</h3>
<p>Hackathon ini mengajak siswa untuk membangun aplikasi atau website yang bisa memberikan dampak positif untuk masyarakat. Durasi: 48 jam non-stop coding!</p>

<h3>Tema dan Kategori</h3>
<ul>
<li><strong>Pendidikan:</strong> Aplikasi yang membantu akses pendidikan</li>
<li><strong>Kesehatan:</strong> Solusi digital untuk kesehatan masyarakat</li>
<li><strong>Lingkungan:</strong> Tech untuk sustainability</li>
<li><strong>UMKM:</strong> Platform yang memberdayakan usaha kecil</li>
</ul>

<h3>Hadiah Menarik</h3>
<ul>
<li>🥇 Juara 1: Rp 5.000.000 + Mentoring 3 bulan + Inkubasi startup</li>
<li>🥈 Juara 2: Rp 3.000.000 + Mentoring 2 bulan</li>
<li>🥉 Juara 3: Rp 2.000.000 + Mentoring 1 bulan</li>
<li>🎁 Favorit: Gadget tech senilai Rp 2.000.000</li>
</ul>

<h3>Mentor dan Juri</h3>
<p>Akan dibimbing oleh praktisi dari:</p>
<ul>
<li>Gojek Engineering Team</li>
<li>Tokopedia Product Team</li>
<li>Startup unicorn lainnya</li>
</ul>

<h3>Cara Daftar</h3>
<p>Buka untuk siswa SMA/SMK se-Indonesia. Tim maksimal 4 orang.</p>
<p>Daftar di: <a href="https://hackathon.gema.id">hackathon.gema.id</a></p>
<p><strong>Early bird:</strong> 25 November - 5 Desember (dapat free merchandise)</p>

<p>Jangan lewatkan kesempatan untuk berkreasi, belajar, dan berkompetisi dengan developer muda terbaik Indonesia!</p>
      `,
      category: 'news',
      tags: JSON.stringify(['hackathon', 'event', 'kompetisi', 'coding', 'social-impact']),
      author: 'Admin GEMA',
      authorId: 'system',
      status: 'published',
      featured: true,
      imageUrl: '/images/news/hackathon-2024.jpg',
      readTime: 4,
      publishedAt: new Date('2024-11-14'),
    },
  ];

  for (const newsData of newsArticles) {
    const news = await prisma.article.upsert({
      where: { slug: newsData.slug },
      update: {},
      create: newsData,
    });
    console.log(`✅ Created news: ${news.title}`);
  }

  console.log('✅ News articles seeded successfully');
}

// Run if executed directly
if (require.main === module) {
  seedNews()
    .catch((error) => {
      console.error('Error seeding news:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
