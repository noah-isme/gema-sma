import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const eventsData = [
  {
    title: 'Ekstrakurikuler GEMA - Sesi Rutin Sabtu',
    description: `**Kegiatan Rutin Mingguan GEMA**

Bergabunglah dengan sesi ekstrakurikuler GEMA setiap hari Sabtu!

📅 **Jadwal**: Setiap Sabtu
⏰ **Waktu**: 12.15 - 14.30 WIB (setelah pulang sekolah)
📍 **Lokasi**: Lab Komputer SMA Wahidiyah

### Agenda Kegiatan:
- **12.15 - 12.30**: Pembukaan & Ice breaking
- **12.30 - 13.30**: Materi coding & praktik langsung
- **13.30 - 14.00**: Live coding session dengan mentor
- **14.00 - 14.30**: Q&A, diskusi project, dan penutup

### Materi yang Dipelajari:
✅ Web Development (HTML, CSS, JavaScript)
✅ Python Programming
✅ Database & SQL
✅ AI & Machine Learning basics
✅ Project development

### Benefit:
- Belajar langsung dari praktisi IT
- Praktik coding real-time
- Diskusi dengan sesama peserta
- Bimbingan project personal
- Refreshment & snack

**Wajib bawa laptop!** 💻

Daftar via: gema.smawahidiyah.edu`,
    date: new Date('2024-10-12T12:15:00Z'), // First Saturday after opening
    location: 'Lab Komputer SMA Wahidiyah',
    capacity: 50,
    registered: 0,
    isActive: true,
    showOnHomepage: true
  },
  
  {
    title: 'Workshop: Membuat Aplikasi Web dari Nol sampai Mahir',
    description: `**Workshop Intensive - Full Stack Web Development**

Pelajari cara membuat aplikasi web profesional dari dasar hingga deployment!

📅 **Durasi**: 8 pertemuan (2 bulan)
⏰ **Waktu**: Setiap Rabu & Sabtu, 15.00 - 17.00 WIB
📍 **Lokasi**: Lab Komputer & Online (Hybrid)

### 🎯 Target Pembelajaran:

**Minggu 1-2: Fondasi Web**
- HTML semantic & struktur modern
- CSS Flexbox & Grid Layout
- Responsive design dengan media queries
- Git & GitHub basics

**Minggu 3-4: JavaScript Interaktif**
- JavaScript ES6+ fundamentals
- DOM manipulation & events
- Fetch API & AJAX
- Form validation & localStorage

**Minggu 5-6: Frontend Framework**
- Pengenalan React/Vue basics
- Component-based architecture
- State management
- Routing & navigation

**Minggu 7-8: Backend & Database**
- Node.js & Express.js basics
- RESTful API design
- Database (SQL/MongoDB)
- Authentication & authorization

**Project Akhir:**
- Portfolio website personal
- Todo app dengan database
- Simple e-commerce product catalog
- Blog platform

### 📦 Materi & Tools:
- Modul lengkap (PDF + video)
- Starter code template
- Akses coding lab 24/7
- Recording setiap session
- 1-on-1 mentoring

### 🎓 Fasilitas:
✅ Sertifikat kelulusan
✅ Portfolio project showcase
✅ Job/internship referral
✅ Alumni network access

### 💰 Investasi:
**GRATIS** untuk peserta GEMA batch 1!

### 👥 Kuota Terbatas:
Maksimal 30 peserta per batch

### 📋 Persyaratan:
- Sudah terdaftar sebagai anggota GEMA
- Komitmen mengikuti 80% pertemuan
- Memiliki laptop (min 4GB RAM)
- Basic HTML/CSS (akan ada pre-test ringan)

### 📝 Pendaftaran:
Link: gema.smawahidiyah.edu/workshop/fullstack-web

**Jadilah Full Stack Developer dalam 2 bulan!** 🚀`,
    date: new Date('2024-10-16T15:00:00Z'),
    location: 'Lab Komputer SMA Wahidiyah (Hybrid)',
    capacity: 30,
    registered: 0,
    isActive: true,
    showOnHomepage: true
  },
  
  {
    title: 'Workshop: Python Programming - Asah Logika & Problem Solving',
    description: `**Workshop Python - Dari Pemula hingga Mahir Algoritma**

Kuasai Python dan tingkatkan kemampuan logika pemrograman!

📅 **Durasi**: 6 pertemuan (1.5 bulan)
⏰ **Waktu**: Setiap Senin & Kamis, 15.30 - 17.30 WIB
📍 **Lokasi**: Lab Komputer SMA Wahidiyah

### 🐍 Kenapa Belajar Python?

Python adalah bahasa pemrograman #1 di dunia untuk:
- Data Science & AI
- Web Development (Django, Flask)
- Automation & Scripting
- Game Development
- Scientific Computing

**Python = Bahasa wajib untuk programmer modern!**

### 📚 Materi Pembelajaran:

**Modul 1-2: Python Fundamentals**
- Syntax dasar & data types
- Variables, operators, expressions
- Input/Output & string manipulation
- Control flow (if/else, loops)
- Functions & modules

**Modul 3-4: Data Structures**
- Lists, tuples, sets, dictionaries
- List comprehension
- Sorting & searching algorithms
- Big O notation basics
- Stack & Queue implementation

**Modul 5-6: Problem Solving**
- Algorithmic thinking
- Recursion & backtracking
- Dynamic programming intro
- Competitive programming basics
- Code optimization techniques

### 🎮 Learning Method:

**Interactive Coding:**
- Live coding dengan instructor
- Pair programming session
- Code review & debugging practice

**Gamification:**
- Daily coding challenges
- Leaderboard system
- Badges & achievements
- Mini hackathon

**Real Projects:**
- Calculator & unit converter
- Password generator & validator
- Simple games (guess number, rock-paper-scissors)
- File organizer automation
- Web scraper basics

### 🏆 Kompetisi & Challenge:

**Weekly Challenge:**
Selesaikan 5 coding problems per minggu

**Final Project:**
Build your own Python tool/game

**Hackathon:**
24-hour coding marathon (opsional)

### 🎁 Benefit Peserta:

✅ Berpikir algoritmik & problem solving
✅ Siap competitive programming
✅ Persiapan Olimpiade Informatika
✅ Portfolio GitHub yang solid
✅ Sertifikat + skill badge
✅ Rekomendasi untuk internship

### 📊 Level Track:

**🟢 Beginner Track**
- Belum pernah coding
- Fokus: syntax & basic logic

**🟡 Intermediate Track**
- Sudah paham basic programming
- Fokus: algorithms & optimization

**🔴 Advanced Track**
- Comfortable dengan coding
- Fokus: competitive programming

### 💻 Tools yang Digunakan:

- Python 3.11+
- VS Code / PyCharm
- Jupyter Notebook
- HackerRank / LeetCode
- GitHub untuk portfolio

### 📝 Pendaftaran:

**Link:** gema.smawahidiyah.edu/workshop/python

**Kuota:** 35 peserta
**Biaya:** GRATIS untuk anggota GEMA
**Bonus:** E-book "Python Problem Solving"

### ⚡ Pre-requisite:
- Anggota GEMA (wajib)
- Punya laptop
- Semangat belajar tinggi!
- Tidak perlu pengalaman coding sebelumnya

### 🎯 Target Akhir:

Setelah workshop ini, kamu akan:
- Mahir Python fundamentals
- Bisa solve 100+ coding problems
- Punya mindset algoritma yang kuat
- Siap untuk data science / web dev lanjutan
- Percaya diri ikut lomba coding

**"Code is poetry. Python is your pen."** ✍️

Mari bergabung dan jadilah Python master! 🐍🔥`,
    date: new Date('2024-10-21T15:30:00Z'),
    location: 'Lab Komputer SMA Wahidiyah',
    capacity: 35,
    registered: 0,
    isActive: true,
    showOnHomepage: true
  }
]

async function main() {
  console.log('📅 Seeding events data...')

  for (const event of eventsData) {
    const existing = await prisma.event.findFirst({
      where: { title: event.title }
    })

    if (existing) {
      await prisma.event.update({
        where: { id: existing.id },
        data: event
      })
      console.log(`✅ Updated: ${event.title}`)
    } else {
      await prisma.event.create({
        data: event
      })
      console.log(`✅ Created: ${event.title}`)
    }
  }

  console.log(`\n✅ Seeded ${eventsData.length} events`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
