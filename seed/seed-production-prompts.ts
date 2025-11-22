import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const promptsData = [
  {
    schemaId: 'webPortfolioSma1',
    title: 'Bagian 1 • Membuat Web Portfolio HTML/CSS Dasar',
    titleShort: 'Web Portfolio Dasar',
    slug: 'web-portfolio-sma-bagian-1',
    level: 'Pemula',
    durasiMenit: 90,
    prasyarat: ['Pemahaman dasar HTML', 'Pemahaman dasar CSS'],
    tujuanPembelajaran: [
      'Siswa dapat membuat struktur halaman web portfolio sederhana',
      'Siswa dapat menerapkan styling CSS untuk mempercantik tampilan',
      'Siswa dapat menampilkan identitas diri di web portfolio'
    ],
    tags: ['HTML', 'CSS', 'Portfolio', 'Web Design', 'Pemula'],
    starterZip: null,
    gambarContoh: null,
    
    roleDeskripsi: 'Kamu adalah seorang guru informatika yang berperan sebagai fasilitator pembelajaran',
    roleFokus: 'Fokusmu adalah membantu siswa SMA membuat web portfolio sederhana menggunakan HTML dan CSS, dengan bahasa penjelasan yang mudah dipahami',
    
    taskTujuan: [
      'Menyusun langkah-langkah membuat web portfolio personal',
      'Menyediakan contoh kode sederhana',
      'Memberikan penjelasan praktis tentang struktur web (header, section, footer)',
      'Membimbing siswa agar bisa menampilkan identitas diri (nama, foto, hobi, kontak)'
    ],
    taskInstruksi: 'Buat web portfolio sederhana dengan struktur HTML dan styling CSS yang menampilkan informasi personal siswa',
    
    contextSituasi: [
      'Siswa SMA baru belajar dasar pemrograman web',
      'Mereka sudah mengenal HTML & CSS, tapi belum terbiasa menyusun project',
      'Web portfolio digunakan sebagai media untuk memperkenalkan diri (CV online sederhana)',
      'Siswa belajar di laboratorium sekolah dengan bimbingan guru'
    ],
    
    reasoningPrinsip: 'Web portfolio harus sederhana agar mudah dibuat (1–2 halaman)',
    reasoningStruktur: {
      observasi: 'Siswa perlu memahami struktur dasar HTML dan cara styling dengan CSS',
      analisis: 'Portfolio terdiri dari Header (nama & tagline), About Me (deskripsi), Projects (karya), Contact (kontak)',
      keputusan: 'Gunakan HTML untuk struktur & CSS untuk tampilan dengan contoh kode ringkas'
    },
    reasoningStrategi: [
      'Mulai dari struktur HTML sederhana',
      'Tambahkan CSS untuk styling bertahap',
      'Tekankan kreativitas (warna, font, layout)',
      'Berikan contoh yang bisa langsung dicoba'
    ],
    
    outputBentuk: [
      'Penjelasan berbentuk langkah demi langkah',
      'Potongan kode dalam blok html dan css',
      'Contoh hasil visual dijelaskan dengan kata-kata',
      'Tugas siswa: menyesuaikan isi (nama, foto, hobi)'
    ],
    outputTugasSiswa: 'Buat halaman web portfolio dengan nama, foto, deskripsi diri, daftar proyek/hobi, dan kontak',
    
    stopKriteria: [
      'Siswa memiliki satu halaman web portfolio sederhana',
      'Menampilkan: Nama lengkap, Foto, Deskripsi diri, Daftar proyek/hobi, Kontak',
      'Kode HTML & CSS bisa dibuka di browser tanpa error'
    ],
    
    tipsAksesibilitas: [
      'Gunakan tag semantic HTML (header, main, footer)',
      'Tambahkan alt text pada gambar',
      'Pastikan kontras warna cukup untuk dibaca'
    ],
    tipsKesalahanUmum: [
      'Lupa menutup tag HTML',
      'Salah menulis selector CSS',
      'Path gambar tidak sesuai dengan lokasi file'
    ],
    tipsTantangan: [
      'Tambahkan animasi CSS sederhana',
      'Buat layout responsif dengan media query',
      'Gunakan Google Fonts untuk variasi tipografi'
    ],
    
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    versi: '1.0.0',
    publishedAt: new Date('2024-01-15')
  },
  
  {
    schemaId: 'webPortfolioSma2',
    title: 'Bagian 2 • Interaksi JavaScript untuk Web Portfolio',
    titleShort: 'Interaksi JavaScript',
    slug: 'web-portfolio-sma-bagian-2',
    level: 'Menengah',
    durasiMenit: 120,
    prasyarat: [
      'Selesai Bagian 1: Web Portfolio HTML/CSS',
      'Pemahaman dasar JavaScript',
      'Pemahaman DOM manipulation'
    ],
    tujuanPembelajaran: [
      'Siswa dapat menambahkan interaksi pada web portfolio',
      'Siswa dapat mengimplementasi dark mode dan smooth scroll',
      'Siswa dapat membuat hamburger menu dan form validation'
    ],
    tags: ['JavaScript', 'DOM', 'Interaktif', 'Dark Mode', 'Validasi Form'],
    starterZip: null,
    gambarContoh: null,
    
    roleDeskripsi: 'Kamu adalah guru informatika yang memandu siswa SMA menambahkan interaksi JavaScript dasar',
    roleFokus: 'Jelaskan dengan bahasa sederhana dan contoh yang bisa langsung dijalankan pada web portfolio yang sudah dibuat',
    
    taskTujuan: [
      'Toggle Tema Gelap/Terang (dark mode)',
      'Smooth Scroll ke setiap section saat klik menu',
      'Hamburger Menu untuk layar kecil',
      'Filter Proyek berdasarkan kategori',
      'Validasi Form Kontak',
      'Modal Gambar/Project Preview',
      'Back to Top Button'
    ],
    taskInstruksi: 'Tambahkan minimal 3 fitur interaktif JavaScript pada portfolio (pilih dari 7 opsi yang tersedia)',
    
    contextSituasi: [
      'Siswa sudah punya halaman portfolio dasar (header, about, projects, contact)',
      'Tidak pakai framework—murni HTML, CSS, JS',
      'Target: dipakai di lab sekolah, bisa dibuka offline'
    ],
    
    reasoningPrinsip: 'Mulai dari interaksi paling terlihat (dark mode, hamburger) agar motivasi naik',
    reasoningStruktur: {
      observasi: 'Interaksi membuat web lebih menarik dan user-friendly',
      analisis: 'Gunakan selector yang jelas (id/class), tulis kode modular',
      keputusan: 'Satu fungsi untuk satu fitur, mudah dimodifikasi'
    },
    reasoningStrategi: [
      'Pastikan aksesibilitas: kontras warna, tombol bisa diakses keyboard',
      'Tulis kode modular dan pendek',
      'Uji fitur di desktop & mobile (resize browser)'
    ],
    
    outputBentuk: [
      'Langkah-langkah singkat per fitur',
      'Potongan kode dalam blok js',
      'Checkpoint pengujian (apa yang harus terlihat/terjadi)',
      'Tugas siswa: personalisasi & tambah 1 fitur pilihan'
    ],
    outputTugasSiswa: 'Implementasi minimal 3 fitur JS dan personalisasi tampilan/interaksi',
    
    stopKriteria: [
      'Minimal 3 fitur JS berjalan tanpa error di console',
      'Navigasi, tema, dan minimal 1 interaksi pada projects/contact berfungsi',
      'Halaman tetap terbaca & responsif setelah interaksi diaktifkan'
    ],
    
    tipsAksesibilitas: [
      'Pastikan keyboard navigation bekerja',
      'Toggle dark mode harus menyimpan preferensi (localStorage)',
      'Form validation harus memberikan feedback yang jelas'
    ],
    tipsKesalahanUmum: [
      'Lupa menambahkan event listener',
      'Selector querySelector salah',
      'LocalStorage tidak tersimpan dengan benar',
      'Dark mode tidak konsisten di semua elemen'
    ],
    tipsTantangan: [
      'Tambahkan loading animation saat klik project',
      'Buat filter project dengan animasi fade',
      'Implementasi lazy loading untuk gambar'
    ],
    
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    versi: '1.0.0',
    publishedAt: new Date('2024-02-01')
  },
  
  {
    schemaId: 'webPortfolioSma3',
    title: 'Bagian 3 • Bootstrap 5 untuk Portfolio Responsif',
    titleShort: 'Bootstrap 5 Layout',
    slug: 'web-portfolio-sma-bagian-3',
    level: 'Menengah',
    durasiMenit: 150,
    prasyarat: [
      'Selesai Bagian 1 & 2',
      'Pemahaman HTML/CSS/JS dasar',
      'Familiar dengan konsep responsive design'
    ],
    tujuanPembelajaran: [
      'Siswa dapat menggunakan Bootstrap 5 via CDN',
      'Siswa dapat membuat layout responsif dengan grid system',
      'Siswa dapat mengimplementasi komponen Bootstrap (navbar, card, modal, form)'
    ],
    tags: ['Bootstrap', 'Responsive', 'Grid System', 'CDN', 'Framework CSS'],
    starterZip: null,
    gambarContoh: null,
    
    roleDeskripsi: 'Kamu adalah guru informatika yang membimbing siswa SMA membangun web portfolio menggunakan Bootstrap 5 (CDN)',
    roleFokus: 'Gunakan bahasa sederhana dan contoh yang siap dicoba tanpa setup rumit',
    
    taskTujuan: [
      'Menambahkan layout responsif dan komponen siap pakai Bootstrap (navbar, grid, card, modal, form)',
      'Menerapkan utilitas (spacing, typography, colors) untuk merapikan tampilan',
      'Mengaktifkan komponen JS Bootstrap (Offcanvas/Hamburger, Modal, Toast) via bundle CDN',
      'Menyiapkan tema warna ringan dengan CSS var sederhana tanpa build tools'
    ],
    taskInstruksi: 'Rebuild portfolio menggunakan Bootstrap 5 dengan komponen responsif dan tema yang bisa dikustomisasi',
    
    contextSituasi: [
      'Siswa sudah punya halaman portfolio HTML/CSS dasar dan interaksi JS dasar',
      'Lingkungan lab: offline-ish tapi minimal bisa copy-paste file; memakai CDN saat koneksi tersedia',
      'Target: 1 halaman portfolio rapi, mobile-friendly, dan punya komponen interaktif'
    ],
    
    reasoningPrinsip: 'Bootstrap 5 dipilih karena mudah diadopsi (CDN), dokumentasi jelas, dan komponen lengkap',
    reasoningStruktur: {
      observasi: 'Bootstrap menyediakan grid responsif dan komponen siap pakai',
      analisis: 'Mulai dari kerangka dasar (container, row, col), lalu isi dengan komponen',
      keputusan: 'Navbar → Hero → Cards Projects → About → Contact Form → Footer'
    },
    reasoningStrategi: [
      'Grid responsif memudahkan tanpa media query manual',
      'Tambahkan komponen JS (Offcanvas/Hamburger, Modal preview) cukup dengan data-attributes',
      'Sesuaikan tema via CSS var (mis. warna utama) agar tiap siswa bisa personalisasi',
      'Validasi hasil dengan checklist visual & fungsi'
    ],
    
    outputBentuk: [
      'Langkah ringkas per bagian (layout → komponen → interaksi)',
      'Satu file HTML lengkap berisi link CDN Bootstrap + contoh komponen',
      'Area bertanda <!-- TODO: ... --> untuk siswa mengisi konten',
      'Catatan pengujian singkat (apa yang harus terlihat/terjadi)'
    ],
    outputTugasSiswa: 'Buat portfolio lengkap dengan Bootstrap 5, isi konten personal, dan sesuaikan tema warna',
    
    stopKriteria: [
      'Halaman responsif (navbar berubah jadi hamburger <768px)',
      '3–6 card proyek tersusun grid rapi',
      'Modal preview terbuka saat klik "Lihat"',
      'Form kontak tampil dengan state validasi (markup Bootstrap)',
      'Warna tema terganti (primary) sesuai variabel CSS sederhana'
    ],
    
    tipsAksesibilitas: [
      'Gunakan komponen Bootstrap yang sudah accessible by default',
      'Pastikan focus state terlihat jelas',
      'Form validation harus memberikan pesan error yang jelas'
    ],
    tipsKesalahanUmum: [
      'Lupa include Bootstrap JS bundle (komponen tidak bekerja)',
      'Salah struktur grid (row/col)',
      'Tidak menggunakan utility classes Bootstrap',
      'Custom CSS override Bootstrap tanpa !important yang tepat'
    ],
    tipsTantangan: [
      'Toggle tema bekerja & tersimpan (localStorage)',
      'Smooth scroll ke section',
      'Menu mobile bisa buka/tutup',
      'Filter proyek atau validasi form dengan JS custom'
    ],
    
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    versi: '1.0.0',
    publishedAt: new Date('2024-03-01')
  }
]

async function main() {
  console.log('📝 Seeding prompts data...')

  for (const prompt of promptsData) {
    const existing = await prisma.prompt.findUnique({
      where: { slug: prompt.slug }
    })

    if (existing) {
      await prisma.prompt.update({
        where: { slug: prompt.slug },
        data: prompt
      })
      console.log(`✅ Updated: ${prompt.title}`)
    } else {
      await prisma.prompt.create({
        data: prompt
      })
      console.log(`✅ Created: ${prompt.title}`)
    }
  }

  console.log(`\n✅ Seeded ${promptsData.length} prompts`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
