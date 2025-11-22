import { PrismaClient, AnnouncementCategory } from '@prisma/client'

const prisma = new PrismaClient()

const announcementsData = [
  {
    title: '🎉 Pengenalan GEMA - Ekstrakurikuler Informatika SMA Wahidiyah',
    excerpt: 'GEMA (Generasi Muda Informatika) hadir sebagai wadah pengembangan skill teknologi untuk santri SMA Wahidiyah Kediri',
    content: `## Apa itu GEMA?

**GEMA (Generasi Muda Informatika)** adalah program ekstrakurikuler informatika yang dirancang khusus untuk santri SMA Wahidiyah Kediri. Program ini bertujuan membekali santri dengan keterampilan teknologi modern yang relevan dengan perkembangan zaman.

### 🎯 Tujuan GEMA:
- Mengembangkan kemampuan coding dan pemrograman
- Mempersiapkan santri untuk era digital
- Mencetak generasi yang paham teknologi dan tetap berakhlak mulia
- Membuka peluang karir di bidang IT

### 📚 Materi yang Dipelajari:
- **Web Development**: HTML, CSS, JavaScript, Bootstrap
- **Programming Fundamentals**: Python, algoritma dasar
- **AI & Machine Learning**: Pengenalan AI, Teachable Machine
- **Database**: SQL, pengelolaan data
- **Project-Based Learning**: Portfolio, web aplikasi

### 👥 Siapa yang Bisa Ikut?
- Santri SMA Wahidiyah kelas X, XI, XII
- Tidak perlu pengalaman coding sebelumnya
- Berkomitmen mengikuti program secara konsisten
- Memiliki laptop pribadi (diutamakan)

### 🕐 Jadwal Kegiatan:
- **Pertemuan Rutin**: 2x seminggu (Rabu & Sabtu)
- **Workshop**: Sebulan sekali
- **Project Showcase**: Setiap akhir semester

### 🎁 Benefit Bergabung:
- Belajar dari praktisi IT profesional
- Sertifikat kompetensi
- Portfolio project untuk masa depan
- Komunitas santri tech enthusiast
- Akses materi pembelajaran online 24/7

### 📝 Cara Daftar:
Pendaftaran akan dibuka segera! Ikuti terus pengumuman di grup kelas dan website resmi.

**Mari bergabung dengan GEMA dan wujudkan impian menjadi santri yang mahir teknologi!** 🚀

---
*Pondok Pesantren Kedunglo - SMA Wahidiyah Kediri*`,
    category: AnnouncementCategory.EVENT,
    type: 'success',
    isImportant: true,
    isActive: true,
    showOnHomepage: true,
    deadline: null,
    link: null,
    publishDate: new Date('2024-08-01T08:00:00Z')
  },
  
  {
    title: '🔬 Beta Testing GEMA - Tahap Awal Pengembangan Platform',
    excerpt: 'Kami mengundang 20 santri terpilih untuk menjadi beta tester platform pembelajaran GEMA',
    content: `## Beta Testing GEMA Platform

Assalamualaikum warahmatullahi wabarakatuh,

Alhamdulillah, pengembangan **Platform Pembelajaran GEMA** telah memasuki tahap beta testing! Kami membutuhkan bantuan kalian untuk menguji dan memberikan feedback.

### 🎯 Apa itu Beta Testing?
Beta testing adalah tahap pengujian platform oleh pengguna terpilih sebelum diluncurkan ke publik. Kalian akan menjadi yang pertama mencoba fitur-fitur baru!

### 👥 Kriteria Beta Tester:
- Santri SMA Wahidiyah kelas X, XI, atau XII
- Aktif mengikuti kegiatan GEMA
- Bersedia memberikan feedback konstruktif
- Memiliki waktu luang untuk testing (2-3 jam/minggu)
- Dapat mengoperasikan komputer/laptop dengan baik

### 📱 Fitur yang Akan Diuji:
1. **Dashboard Siswa** - Akses materi dan tugas
2. **Coding Lab** - Editor kode interaktif
3. **Quiz System** - Latihan soal otomatis
4. **Progress Tracker** - Monitoring perkembangan belajar
5. **Discussion Forum** - Tanya jawab dengan mentor

### 📅 Timeline Beta Testing:
- **Fase 1** (2 minggu): Testing fitur dasar
- **Fase 2** (2 minggu): Testing fitur lanjutan
- **Fase 3** (1 minggu): Final testing & bug fixing

### 🎁 Benefit untuk Beta Tester:
- **Akses Early Access** ke semua fitur premium
- **Sertifikat Beta Tester** resmi dari GEMA
- **Merchandise GEMA** eksklusif
- **Prioritas dalam program mentoring**
- Dicantumkan di hall of fame website

### 📝 Cara Daftar Beta Tester:
1. Isi form pendaftaran: [Link akan dibagikan di grup]
2. Ceritakan pengalaman belajar programming kamu
3. Jelaskan mengapa ingin jadi beta tester
4. Tunggu konfirmasi dari tim GEMA

**Kuota Terbatas: 20 orang saja!**

### ❗ Catatan Penting:
- Beta testing bersifat **sukarela** dan **gratis**
- Tidak mengganggu jadwal belajar reguler
- Bug dan error adalah hal normal dalam testing
- Feedback kalian sangat berharga untuk perbaikan

**Yuk jadi bagian dari sejarah GEMA! Daftarkan dirimu sekarang!** 🚀

Wassalamualaikum warahmatullahi wabarakatuh.

---
*Tim Developer GEMA*  
*SMA Wahidiyah Kediri*`,
    category: AnnouncementCategory.EVENT,
    type: 'info',
    isImportant: true,
    isActive: true,
    showOnHomepage: true,
    deadline: new Date('2024-09-15T23:59:00Z'),
    link: null,
    publishDate: new Date('2024-09-01T10:00:00Z')
  },
  
  {
    title: '🎊 Pembukaan Pendaftaran GEMA Eksklusif - Batch 1 Tahun Ajaran 2024/2025',
    excerpt: 'Pendaftaran resmi GEMA dibuka untuk 50 santri terpilih! Buruan daftar sebelum kuota penuh!',
    content: `## PEMBUKAAN PENDAFTARAN GEMA BATCH 1

### 🎉 GEMA RESMI DIBUKA UNTUK UMUM!

Assalamualaikum warahmatullahi wabarakatuh,

Alhamdulillah, setelah melalui fase beta testing yang sukses, **Platform Pembelajaran GEMA** kini resmi dibuka untuk seluruh santri SMA Wahidiyah!

---

### 📋 Informasi Pendaftaran

**Periode Pendaftaran:**  
📅 **20 September - 5 Oktober 2024**

**Kuota Peserta:**  
👥 **50 Santri (Batch 1)**

**Biaya Pendaftaran:**  
💰 **GRATIS** (Sudah termasuk akses platform, materi, dan sertifikat)

---

### 🎯 Program yang Ditawarkan

#### 1️⃣ **Track Web Development**
- HTML, CSS, JavaScript fundamental
- Bootstrap framework
- Project: Portfolio Website
- **Durasi**: 3 bulan

#### 2️⃣ **Track Python Programming**
- Python basics & syntax
- Data structures & algorithms
- Project: Simple applications
- **Durasi**: 3 bulan

#### 3️⃣ **Track AI Introduction**
- Pengenalan Machine Learning
- Teachable Machine
- Project: AI model sederhana
- **Durasi**: 2 bulan

---

### 📚 Fasilitas yang Didapat

✅ Akses platform pembelajaran 24/7  
✅ Materi video & artikel lengkap  
✅ Coding Lab interaktif  
✅ Live coding session (2x/minggu)  
✅ Mentoring dari praktisi IT  
✅ Discussion forum dengan mentor  
✅ Sertifikat kompetensi resmi  
✅ Portfolio project untuk CV  
✅ Job/internship opportunities info  

---

### 🎓 Persyaratan Pendaftaran

✔️ Santri SMA Wahidiyah kelas X, XI, atau XII  
✔️ Berkomitmen mengikuti program minimal 80% kehadiran  
✔️ Memiliki email aktif  
✔️ Memiliki laptop/komputer (bisa pinjam lab jika tidak punya)  
✔️ Mengisi formulir pendaftaran dengan lengkap  
✔️ Mendapat izin orang tua/wali  

---

### 📝 Cara Daftar

1. **Isi Formulir Online**  
   Link: [https://gema.smawahidiyah.edu/daftar](https://gema.smawahidiyah.edu/daftar)

2. **Submit Data Diri**
   - Nama lengkap
   - Kelas
   - Email & No. HP
   - Track yang diminati
   - Motivasi bergabung GEMA

3. **Tunggu Konfirmasi**
   - Pengumuman: 7 Oktober 2024
   - Via email & announcement website

4. **Orientasi Peserta**
   - 10 Oktober 2024, jam 15.00 WIB
   - Lokasi: Lab Komputer SMA Wahidiyah

---

### 🏆 Kenapa Harus Ikut GEMA?

💡 **Skill untuk Masa Depan**  
Teknologi adalah kebutuhan. GEMA membekali skill yang dibutuhkan industri.

🤝 **Komunitas Supportif**  
Belajar bareng teman-teman yang punya passion sama di bidang teknologi.

👨‍💻 **Bimbingan Expert**  
Diajar langsung oleh praktisi IT yang berpengalaman di industri.

📜 **Sertifikat Resmi**  
Dapat sertifikat yang bisa jadi nilai tambah untuk masa depan.

🚀 **Project Real-World**  
Buat project nyata yang bisa dipamerkan di portfolio.

---

### ⚡ INFORMASI PENTING

⚠️ **KUOTA TERBATAS HANYA 50 ORANG!**  
First come, first served. Daftar sekarang sebelum kehabisan!

📞 **Kontak Informasi:**
- Email: gema@smawahidiyah.edu
- Instagram: @gema.smawahidiyah
- WhatsApp Admin: 0812-3456-7890

---

### 🎊 Bonus Khusus Pendaftar Awal

Pendaftar di **minggu pertama** dapat bonus:
🎁 Merchandise GEMA eksklusif  
🎁 E-book "Panduan Menjadi Programmer Pemula"  
🎁 Akses ke recorded session beta testing  

---

## 🚀 JANGAN SAMPAI MENYESAL!

**Kesempatan emas ini tidak datang dua kali!**  
Daftarkan dirimu sekarang dan jadilah bagian dari **Generasi Muda Informatika** yang siap bersaing di era digital!

**"Barangsiapa yang menempuh jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga."** (HR. Muslim)

---

### 📲 DAFTAR SEKARANG!
**[https://gema.smawahidiyah.edu/daftar](https://gema.smawahidiyah.edu/daftar)**

Wassalamualaikum warahmatullahi wabarakatuh.

---
*Tim GEMA SMA Wahidiyah Kediri*  
*Pondok Pesantren Kedunglo*  
*Jl. KH. Wahid Hasyim, Kediri, Jawa Timur*`,
    category: AnnouncementCategory.EVENT,
    type: 'success',
    isImportant: true,
    isActive: true,
    showOnHomepage: true,
    deadline: new Date('2024-10-05T23:59:00Z'),
    link: 'https://gema.smawahidiyah.edu/daftar',
    publishDate: new Date('2024-09-20T07:00:00Z')
  }
]

async function main() {
  console.log('📢 Seeding announcements data...')

  for (const announcement of announcementsData) {
    const existing = await prisma.announcement.findFirst({
      where: { title: announcement.title }
    })

    if (existing) {
      await prisma.announcement.update({
        where: { id: existing.id },
        data: announcement
      })
      console.log(`✅ Updated: ${announcement.title}`)
    } else {
      await prisma.announcement.create({
        data: announcement
      })
      console.log(`✅ Created: ${announcement.title}`)
    }
  }

  console.log(`\n✅ Seeded ${announcementsData.length} announcements`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
