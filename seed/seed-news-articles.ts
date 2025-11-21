import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📰 Seeding news articles for 2025...');

  // News articles - NO CODE, only informative content
  const newsArticles = [
    {
      title: '🎉 GEMA SMA Wahidiyah Resmi Diluncurkan!',
      slug: 'gema-sma-wahidiyah-resmi-diluncurkan',
      excerpt: 'Platform pembelajaran coding GEMA resmi diluncurkan untuk siswa SMA Wahidiyah Kediri. Mari kita belajar coding dengan cara yang menyenangkan!',
      category: 'news',
      tags: '["GEMA", "SMA Wahidiyah", "Peluncuran", "Informatika"]',
      featured: true,
      readTime: 5,
      publishedAt: '2025-01-15',
    },
    {
      title: '🏆 Siswa SMA Wahidiyah Raih Juara Coding Competition',
      slug: 'siswa-sma-wahidiyah-juara-coding-competition',
      excerpt: 'Membanggakan! Siswa kelas XI SMA Wahidiyah berhasil meraih juara 2 dalam kompetisi coding tingkat Jawa Timur.',
      category: 'news',
      tags: '["Prestasi", "Kompetisi", "Coding", "SMA Wahidiyah"]',
      featured: true,
      readTime: 4,
      publishedAt: '2025-02-20',
    },
    {
      title: '💻 Workshop AI & Machine Learning untuk Siswa SMA',
      slug: 'workshop-ai-machine-learning-siswa-sma',
      excerpt: 'GEMA mengadakan workshop khusus tentang Artificial Intelligence dan Machine Learning. Daftar sekarang, tempat terbatas!',
      category: 'news',
      tags: '["Workshop", "AI", "Machine Learning", "Event"]',
      featured: false,
      readTime: 3,
      publishedAt: '2025-03-10',
    },
    {
      title: '🌟 Update Fitur Baru GEMA: Dark Mode & Personalisasi',
      slug: 'update-fitur-baru-gema-dark-mode',
      excerpt: 'Platform GEMA kini hadir dengan tampilan dark mode dan fitur personalisasi dashboard. Belajar coding makin nyaman!',
      category: 'news',
      tags: '["Update", "Fitur Baru", "Dark Mode", "GEMA"]',
      featured: false,
      readTime: 3,
      publishedAt: '2025-04-05',
    },
    {
      title: '📱 Teknologi 5G dan Dampaknya pada Dunia Pendidikan',
      slug: 'teknologi-5g-dampak-dunia-pendidikan',
      excerpt: 'Bagaimana teknologi 5G akan mengubah cara kita belajar? Mari kita bahas peluang dan tantangan teknologi terkini ini.',
      category: 'news',
      tags: '["Teknologi", "5G", "Pendidikan", "Inovasi"]',
      featured: false,
      readTime: 6,
      publishedAt: '2025-05-12',
    },
    {
      title: '🎓 Alumni GEMA: Dari Siswa SMA Jadi Web Developer',
      slug: 'alumni-gema-jadi-web-developer',
      excerpt: 'Kisah inspiratif alumni SMA Wahidiyah yang kini bekerja sebagai Web Developer di perusahaan startup ternama.',
      category: 'news',
      tags: '["Alumni", "Success Story", "Web Developer", "Inspirasi"]',
      featured: true,
      readTime: 7,
      publishedAt: '2025-06-18',
    },
    {
      title: '🚀 Perkembangan AI di 2025: ChatGPT, Gemini, dan Lainnya',
      slug: 'perkembangan-ai-2025-chatgpt-gemini',
      excerpt: 'Tahun 2025 menjadi tahun revolusi AI. Yuk kenalan dengan teknologi AI terbaru yang wajib kamu tahu!',
      category: 'news',
      tags: '["AI", "ChatGPT", "Gemini", "Teknologi"]',
      featured: true,
      readTime: 8,
      publishedAt: '2025-07-22',
    },
    {
      title: '🎮 Game Development: Industri yang Menjanjikan untuk Generasi Z',
      slug: 'game-development-industri-menjanjikan',
      excerpt: 'Industri game di Indonesia terus berkembang. Peluang karir di bidang game development sangat terbuka lebar!',
      category: 'news',
      tags: '["Game Development", "Karir", "Industri", "Gen Z"]',
      featured: false,
      readTime: 6,
      publishedAt: '2025-08-15',
    },
    {
      title: '🌐 Cyber Security: Pentingnya Menjaga Keamanan Data Pribadi',
      slug: 'cyber-security-keamanan-data-pribadi',
      excerpt: 'Di era digital, keamanan data pribadi sangat penting. Pelajari tips dan trik melindungi data dari ancaman cyber.',
      category: 'news',
      tags: '["Cyber Security", "Keamanan Data", "Privacy", "Digital"]',
      featured: false,
      readTime: 5,
      publishedAt: '2025-09-10',
    },
    {
      title: '🏅 GEMA Raih Penghargaan Platform Edukasi Terbaik 2025',
      slug: 'gema-penghargaan-platform-edukasi-terbaik',
      excerpt: 'Alhamdulillah! GEMA mendapat penghargaan sebagai Platform Edukasi Coding Terbaik 2025 dari Kemendikbud.',
      category: 'news',
      tags: '["Penghargaan", "Achievement", "GEMA", "Kemendikbud"]',
      featured: true,
      readTime: 4,
      publishedAt: '2025-10-20',
    },
  ];

  // Get admin user for authorId
  const admin = await prisma.admin.findFirst();
  if (!admin) {
    throw new Error('❌ No admin found. Please create an admin first.');
  }

  console.log(`👨‍💻 Found admin: ${admin.name}`);

  // Create news articles
  let successCount = 0;
  let skipCount = 0;

  for (const newsData of newsArticles) {
    try {
      // Check if article already exists
      const existingArticle = await prisma.article.findUnique({
        where: { slug: newsData.slug }
      });

      if (existingArticle) {
        console.log(`⏭️  Skipped (already exists): ${newsData.title}`);
        skipCount++;
        continue;
      }

      // Generate news content (NO CODE, only informative)
      const content = generateNewsContent(newsData);

      const article = await prisma.article.create({
        data: {
          title: newsData.title,
          slug: newsData.slug,
          excerpt: newsData.excerpt,
          content: content,
          category: newsData.category,
          tags: newsData.tags,
          author: 'Tim GEMA',
          authorId: admin.id,
          status: 'published',
          featured: newsData.featured,
          readTime: newsData.readTime,
          publishedAt: new Date(newsData.publishedAt)
        }
      });

      console.log(`✅ Created news: ${article.title}`);
      successCount++;
    } catch (error) {
      console.log(`❌ Failed to create news: ${newsData.title}`, error);
    }
  }

  console.log(`\n🎉 News articles seeding completed!`);
  console.log(`✅ Successfully created: ${successCount} articles`);
  console.log(`⏭️  Skipped (existing): ${skipCount} articles`);
  console.log(`📰 Total news processed: ${newsArticles.length}`);
}

function generateNewsContent(newsData: any): string {
  const templates: Record<string, string> = {
    'gema-sma-wahidiyah-resmi-diluncurkan': `
      <div class="news-content prose max-w-4xl mx-auto">
        <div class="news-header bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-2xl mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">🎉 GEMA SMA Wahidiyah Resmi Diluncurkan!</h1>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span>📅 15 Januari 2025</span>
            <span>•</span>
            <span>✍️ Tim GEMA</span>
            <span>•</span>
            <span>⏱️ 5 menit baca</span>
          </div>
        </div>

        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Peluncuran GEMA" class="w-full rounded-xl mb-8">

        <p class="text-xl text-gray-700 mb-6 leading-relaxed">
          <strong>Kediri, 15 Januari 2025</strong> – Alhamdulillah, hari ini menjadi hari bersejarah bagi SMA Wahidiyah Kediri. 
          Platform pembelajaran coding <strong>GEMA (Generasi Muda Informatika)</strong> resmi diluncurkan untuk mendukung 
          pembelajaran mata pelajaran Informatika di era digital.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🎯 Apa itu GEMA?</h2>
        <p class="text-gray-700 mb-6 leading-relaxed">
          GEMA adalah platform Learning Management System (LMS) yang dirancang khusus untuk membuat pembelajaran coding 
          menjadi lebih menyenangkan dan interaktif. Dengan GEMA, siswa dapat belajar HTML, CSS, JavaScript, dan Python 
          dengan cara yang lebih seru seperti main game!
        </p>

        <div class="bg-blue-50 p-6 rounded-xl mb-8">
          <h3 class="text-xl font-bold text-blue-900 mb-4">✨ Fitur Unggulan GEMA:</h3>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start gap-3">
              <span class="text-2xl">💻</span>
              <span><strong>Coding Lab Interaktif:</strong> Tulis code langsung di browser, langsung dapat feedback!</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-2xl">📚</span>
              <span><strong>Tutorial Step-by-Step:</strong> Materi lengkap dari dasar sampai mahir</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-2xl">🎮</span>
              <span><strong>Gamifikasi:</strong> Kumpulin poin, naik level, dan raih badge keren!</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-2xl">📊</span>
              <span><strong>Progress Tracking:</strong> Pantau perkembangan belajarmu real-time</span>
            </li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🎤 Sambutan Kepala Sekolah</h2>
        <div class="bg-gray-50 border-l-4 border-indigo-500 p-6 mb-8 italic">
          <p class="text-gray-700 leading-relaxed">
            "Alhamdulillah, dengan hadirnya GEMA, kami berharap pembelajaran Informatika di SMA Wahidiyah 
            semakin berkualitas dan menyenangkan. Platform ini tidak hanya mengajarkan coding, tapi juga 
            melatih problem solving dan kreativitas siswa."
          </p>
          <p class="text-gray-900 font-semibold mt-4">- Bapak Kepala Sekolah SMA Wahidiyah Kediri</p>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🚀 Cara Memulai</h2>
        <p class="text-gray-700 mb-4 leading-relaxed">
          Untuk mulai belajar di GEMA sangat mudah:
        </p>
        <ol class="space-y-3 text-gray-700 ml-6 mb-8">
          <li>1️⃣ Daftar akun dengan email sekolah kamu</li>
          <li>2️⃣ Pilih tutorial yang mau dipelajari</li>
          <li>3️⃣ Ikuti step-by-step guide</li>
          <li>4️⃣ Praktek di Coding Lab</li>
          <li>5️⃣ Kumpulin tugas dan raih badge!</li>
        </ol>

        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl mb-8">
          <h3 class="text-2xl font-bold mb-4">🎁 Promo Spesial Peluncuran!</h3>
          <p class="text-lg mb-4">
            Untuk 100 siswa pertama yang mendaftar, akan mendapatkan:
          </p>
          <ul class="space-y-2 ml-6">
            <li>✅ Badge eksklusif "Early Adopter"</li>
            <li>✅ 500 XP bonus</li>
            <li>✅ Akses ke tutorial premium gratis 1 bulan</li>
          </ul>
        </div>

        <p class="text-gray-700 leading-relaxed mb-8">
          Mari bersama-sama menjadi bagian dari <strong>Generasi Muda Informatika</strong> yang siap 
          menghadapi tantangan era digital. Daftar sekarang di GEMA dan mulai petualangan codingmu!
        </p>

        <div class="text-center mt-12 mb-8">
          <a href="/student/register" class="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition">
            🚀 Daftar Sekarang!
          </a>
        </div>
      </div>
    `,

    'siswa-sma-wahidiyah-juara-coding-competition': `
      <div class="news-content prose max-w-4xl mx-auto">
        <div class="news-header bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-2xl mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">🏆 Siswa SMA Wahidiyah Raih Juara Coding Competition</h1>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span>📅 20 Februari 2025</span>
            <span>•</span>
            <span>✍️ Tim GEMA</span>
            <span>•</span>
            <span>⏱️ 4 menit baca</span>
          </div>
        </div>

        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" alt="Juara Kompetisi" class="w-full rounded-xl mb-8">

        <p class="text-xl text-gray-700 mb-6 leading-relaxed">
          <strong>Surabaya, 20 Februari 2025</strong> – Membanggakan! Tim SMA Wahidiyah yang terdiri dari 
          3 siswa kelas XI berhasil meraih <strong>Juara 2</strong> dalam ajang East Java Coding Competition 2025 
          yang diselenggarakan di Universitas Airlangga.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">👥 Tim Juara</h2>
        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white border-2 border-yellow-200 p-6 rounded-xl text-center">
            <div class="text-4xl mb-2">👨‍💻</div>
            <h3 class="font-bold text-gray-900">Ahmad Fadhil</h3>
            <p class="text-sm text-gray-600">Frontend Developer</p>
          </div>
          <div class="bg-white border-2 border-yellow-200 p-6 rounded-xl text-center">
            <div class="text-4xl mb-2">👩‍💻</div>
            <h3 class="font-bold text-gray-900">Siti Nurhaliza</h3>
            <p class="text-sm text-gray-600">Backend Developer</p>
          </div>
          <div class="bg-white border-2 border-yellow-200 p-6 rounded-xl text-center">
            <div class="text-4xl mb-2">👨‍💻</div>
            <h3 class="font-bold text-gray-900">Budi Santoso</h3>
            <p class="text-sm text-gray-600">UI/UX Designer</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🎯 Tentang Kompetisi</h2>
        <p class="text-gray-700 mb-6 leading-relaxed">
          East Java Coding Competition 2025 adalah kompetisi coding tingkat SMA/SMK se-Jawa Timur yang 
          diikuti oleh 50 tim dari berbagai sekolah. Kompetisi ini menguji kemampuan peserta dalam 
          membangun aplikasi web yang fungsional dalam waktu 8 jam.
        </p>

        <div class="bg-orange-50 p-6 rounded-xl mb-8">
          <h3 class="text-xl font-bold text-orange-900 mb-4">💡 Project yang Dibangun:</h3>
          <p class="text-gray-700 mb-4"><strong>"EduConnect"</strong> - Platform yang menghubungkan siswa dengan mentor untuk belajar online</p>
          <ul class="space-y-2 text-gray-700 ml-6">
            <li>✅ Sistem registrasi dan login</li>
            <li>✅ Dashboard interaktif</li>
            <li>✅ Real-time chat</li>
            <li>✅ Booking jadwal mentoring</li>
            <li>✅ Payment gateway integration</li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">💬 Testimoni Pemenang</h2>
        <div class="bg-gray-50 border-l-4 border-yellow-500 p-6 mb-8 italic">
          <p class="text-gray-700 leading-relaxed">
            "Alhamdulillah banget bisa juara! Berkat belajar rutin di GEMA dan dukungan dari guru pembimbing, 
            kami bisa menghadapi kompetisi ini dengan percaya diri. GEMA ngajarin kami nggak cuma teori, 
            tapi langsung praktek bikin project nyata."
          </p>
          <p class="text-gray-900 font-semibold mt-4">- Ahmad Fadhil, Ketua Tim</p>
        </div>

        <div class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-8 rounded-2xl mb-8">
          <h3 class="text-2xl font-bold mb-4">🎉 Penghargaan:</h3>
          <ul class="space-y-2 text-lg">
            <li>🏆 Piala Juara 2</li>
            <li>💰 Hadiah uang tunai Rp 5.000.000</li>
            <li>📜 Sertifikat untuk portofolio</li>
            <li>💻 Laptop untuk setiap anggota tim</li>
          </ul>
        </div>

        <p class="text-gray-700 leading-relaxed">
          Prestasi ini membuktikan bahwa dengan belajar yang konsisten dan praktik yang tepat, 
          siswa SMA pun bisa bersaing di level kompetisi regional. Mari terus belajar dan berkarya!
        </p>
      </div>
    `,

    // Default template for other news
    'default': `
      <div class="news-content prose max-w-4xl mx-auto">
        <div class="news-header bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${newsData.title}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span>📅 ${new Date(newsData.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span>✍️ Tim GEMA</span>
            <span>•</span>
            <span>⏱️ ${newsData.readTime} menit baca</span>
          </div>
        </div>

        <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80" alt="${newsData.title}" class="w-full rounded-xl mb-8">

        <p class="text-xl text-gray-700 mb-6 leading-relaxed">
          ${newsData.excerpt}
        </p>

        <div class="bg-blue-50 p-6 rounded-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">📰 Ringkasan Berita</h2>
          <p class="text-gray-700 leading-relaxed">
            Artikel ini membahas tentang perkembangan terbaru di dunia teknologi dan pendidikan. 
            Tetap update dengan berita terkini dari GEMA!
          </p>
        </div>

        <p class="text-gray-700 leading-relaxed mb-8">
          Untuk informasi lebih lanjut dan berita terbaru lainnya, kunjungi terus halaman tutorial GEMA 
          dan jangan lupa follow media sosial kami di Instagram <strong>@smawahidiyah_official</strong>
        </p>
      </div>
    `
  };

  return templates[newsData.slug] || templates['default'];
}

main()
  .catch((e) => {
    console.error('💥 Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
