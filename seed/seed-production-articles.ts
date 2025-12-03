import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const articlesData = [
  {
    title: 'Bab 1: Tentang Informatika - Pengantar dan Ruang Lingkup',
    slug: 'bab-1-tentang-informatika',
    excerpt: 'Memahami definisi informatika, ruang lingkup bidang informatika, dan hubungannya dengan disiplin ilmu lainnya',
    content: `# Bab 1: Tentang Informatika

## Pengantar Informatika

**Informatika** adalah ilmu yang mempelajari tentang pengolahan informasi menggunakan komputer dan sistem komputasi. Informatika tidak hanya tentang komputer, tetapi juga tentang bagaimana kita memecahkan masalah menggunakan pemikiran komputasional.

### 🎯 Definisi Informatika

Informatika berasal dari kata "information" (informasi) dan "automatic" (otomatis). Secara sederhana:

> **Informatika adalah ilmu yang mempelajari cara mengolah, menyimpan, dan menyebarkan informasi secara otomatis menggunakan teknologi komputer.**

### 📚 Ruang Lingkup Informatika

Informatika mencakup berbagai bidang, antara lain:

#### 1. **Algoritma dan Pemrograman**
- Cara berpikir sistematis untuk memecahkan masalah
- Bahasa pemrograman (Python, Java, C++, JavaScript, dll)
- Struktur data dan algoritma

#### 2. **Sistem Komputer**
- Arsitektur komputer (hardware)
- Sistem operasi (Windows, Linux, macOS)
- Jaringan komputer dan internet

#### 3. **Basis Data**
- Penyimpanan dan pengelolaan data
- SQL dan database management
- Big Data dan data warehousing

#### 4. **Kecerdasan Buatan (AI)**
- Machine Learning
- Deep Learning
- Computer Vision dan Natural Language Processing

#### 5. **Rekayasa Perangkat Lunak**
- Pengembangan aplikasi dan website
- Software engineering principles
- Agile dan metodologi pengembangan

#### 6. **Keamanan Siber**
- Cybersecurity dan ethical hacking
- Enkripsi dan kriptografi
- Network security

#### 7. **Grafika dan Multimedia**
- Desain grafis digital
- Game development
- Animasi dan visual effects

#### 8. **Internet of Things (IoT)**
- Smart devices dan sensor
- Embedded systems
- Robotika

### 🔗 Hubungan Informatika dengan Disiplin Lain

Informatika bersifat **multidisiplin** dan berkolaborasi dengan banyak bidang:

#### **Matematika**
- Logika dan aljabar Boolean
- Statistika untuk data science
- Kalkulus untuk AI dan machine learning

#### **Fisika**
- Komputasi kuantum
- Simulasi fisika
- Signal processing

#### **Biologi**
- Bioinformatika (analisis DNA/genom)
- Computational biology
- Medical imaging

#### **Ekonomi & Bisnis**
- E-commerce dan fintech
- Business intelligence
- Data analytics untuk marketing

#### **Seni & Desain**
- Digital art dan creative coding
- UI/UX design
- Interactive media

#### **Kedokteran**
- AI untuk diagnosa penyakit
- Medical records management
- Telemedicine applications

#### **Pertanian**
- Precision agriculture dengan sensor IoT
- Drone untuk monitoring tanaman
- AI untuk prediksi cuaca dan panen

### 💡 Mengapa Informatika Penting?

1. **Transformasi Digital**
   - Semua bidang kehidupan kini terdigitalisasi
   - Kebutuhan tenaga ahli IT terus meningkat

2. **Problem Solving**
   - Melatih berpikir logis dan sistematis
   - Kemampuan memecahkan masalah kompleks

3. **Inovasi & Kreativitas**
   - Menciptakan solusi baru
   - Startup dan entrepreneurship

4. **Career Opportunities**
   - Gaji tinggi dan job security
   - Remote work friendly
   - Banyak posisi: programmer, data scientist, AI engineer, dll

### 🚀 Perkembangan Informatika di Indonesia

**Sejarah Singkat:**
- 1970-an: Komputer mainframe di instansi pemerintah
- 1980-an: PC mulai masuk Indonesia
- 1990-an: Internet pertama kali (1994)
- 2000-an: Boom website dan e-commerce
- 2010-an: Smartphone dan mobile apps
- 2020-an: AI, Cloud, Big Data, IoT

**Industri Digital Indonesia:**
- Unicorn: Gojek, Tokopedia, Bukalapak, Traveloka
- Startup ecosystem yang berkembang pesat
- Kebutuhan programmer 600,000+ per tahun
- Pendidikan coding mulai dari SD

### 📖 Kompetensi yang Diperlukan

Untuk berhasil di bidang informatika, kalian perlu:

1. **Hard Skills:**
   - Programming (minimal 1-2 bahasa)
   - Algoritma dan struktur data
   - Database management
   - Version control (Git)

2. **Soft Skills:**
   - Problem solving
   - Logical thinking
   - Communication
   - Teamwork & collaboration
   - Continuous learning

### 🎯 Kesimpulan

Informatika bukan hanya tentang coding, tetapi tentang:
- **Berpikir komputasional** untuk memecahkan masalah
- **Berkolaborasi** dengan berbagai disiplin ilmu
- **Berinovasi** menciptakan solusi digital
- **Berkontribusi** pada kemajuan teknologi

**"Informatika adalah masa depan. Yang tidak belajar informatika akan tertinggal di era digital."**

### 📝 Tugas Refleksi

1. Sebutkan 3 bidang informatika yang paling menarik bagimu dan jelaskan alasannya
2. Berikan 2 contoh penerapan informatika dalam kehidupan sehari-hari
3. Bagaimana informatika bisa membantu memecahkan masalah di lingkunganmu?

---

*Materi Informatika Kelas XI - SMA Wahidiyah Kediri*`,
    category: 'tutorial',
    tags: JSON.stringify(['Informatika', 'Pengantar', 'Ruang Lingkup', 'Kurikulum']),
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    imageUrl: '/images/belajar_dengan_teachable_machine.png',
    readTime: 10,
    publishedAt: new Date('2024-08-15T10:00:00Z')
  },

  {
    title: 'Bab 2: Strategi Algoritmik dan Pemrograman',
    slug: 'bab-2-strategi-algoritmik-pemrograman',
    excerpt: 'Memahami proses pemrograman, berpikir komputasional, algoritma, dan penerapan pemrograman lintas bidang',
    content: `# Bab 2: Strategi Algoritmik dan Pemrograman

## Pengantar

Dalam bab ini, kita akan mempelajari fondasi terpenting dalam informatika: **algoritma** dan **pemrograman**. Ini adalah skill fundamental yang harus dikuasai setiap programmer.

---

## 🧠 Berpikir Komputasional

**Computational Thinking** adalah cara berpikir untuk memecahkan masalah seperti cara kerja komputer.

### 4 Pilar Berpikir Komputasional:

#### 1. **Decomposition (Dekomposisi)**
Memecah masalah besar menjadi bagian-bagian kecil.

**Contoh:**
- Masalah: Membuat website e-commerce
- Dekomposisi:
  - Halaman login
  - Halaman produk
  - Keranjang belanja
  - Sistem payment
  - Admin dashboard

#### 2. **Pattern Recognition (Pengenalan Pola)**
Menemukan kesamaan atau pola dalam masalah.

**Contoh:**
- Login user, admin, seller → semua butuh validasi email & password
- Buat satu fungsi \`validateLogin()\` yang bisa dipakai berulang

#### 3. **Abstraction (Abstraksi)**
Fokus pada informasi penting, abaikan detail yang tidak relevan.

**Contoh:**
- Saat booking Gojek, kita hanya perlu tau: titik jemput, tujuan, harga
- Tidak perlu tau: algoritma routing, database driver, sistem GPS detail

#### 4. **Algorithm Design (Desain Algoritma)**
Membuat langkah-langkah sistematis untuk menyelesaikan masalah.

**Contoh:**
- Algoritma mencari nilai terbesar dalam array
- Algoritma sorting data
- Algoritma shortest path

---

## 📋 Apa itu Algoritma?

> **Algoritma adalah urutan langkah-langkah logis dan sistematis untuk menyelesaikan suatu masalah.**

### Karakteristik Algoritma yang Baik:

✅ **Input**: Memiliki 0 atau lebih input  
✅ **Output**: Menghasilkan minimal 1 output  
✅ **Definiteness**: Setiap langkah jelas dan tidak ambigu  
✅ **Finiteness**: Memiliki titik akhir (tidak infinite loop)  
✅ **Effectiveness**: Setiap langkah bisa dikerjakan  

### Contoh Algoritma Sederhana:

**Algoritma Membuat Mie Instan:**
1. Siapkan panci dan air
2. Didihkan air
3. Masukkan mie ke air mendidih
4. Tunggu 3 menit
5. Matikan kompor
6. Tiriskan mie
7. Tambahkan bumbu
8. Aduk rata
9. Mie siap disajikan

**Algoritma Mencari Nilai Maksimum:**
1. Mulai
2. Set max = array[0]
3. Untuk setiap elemen dalam array:
   - Jika elemen > max, set max = elemen
4. Return max
5. Selesai

---

## 💻 Proses Pemrograman

### Tahapan Pembuatan Program:

#### 1. **Analisis Masalah**
- Pahami problem yang akan diselesaikan
- Identifikasi input dan output
- Tentukan constraint (batasan)

#### 2. **Desain Algoritma**
- Buat pseudocode atau flowchart
- Tentukan struktur data yang digunakan
- Pilih algoritma yang efisien

#### 3. **Implementasi (Coding)**
- Tulis kode dalam bahasa pemrograman
- Follow coding conventions
- Buat kode yang readable

#### 4. **Testing & Debugging**
- Uji dengan berbagai test case
- Perbaiki bug yang ditemukan
- Pastikan edge cases tertangani

#### 5. **Maintenance**
- Update fitur
- Optimize performance
- Fix bugs yang ditemukan user

---

## 🔢 Notasi Algoritma

### 1. **Pseudocode**

\`\`\`
ALGORITMA CekBilanganGenap
INPUT: bilangan
OUTPUT: "Genap" atau "Ganjil"

MULAI
  BACA bilangan
  JIKA bilangan % 2 == 0 MAKA
    TULIS "Genap"
  SELAIN ITU
    TULIS "Ganjil"
  AKHIR JIKA
SELESAI
\`\`\`

### 2. **Flowchart**

Simbol standar:
- ⭕ Oval: Start/End
- ▭ Persegi panjang: Proses
- ⬥ Belah ketupat: Keputusan (if)
- ▱ Jajaran genjang: Input/Output
- → Panah: Alur

### 3. **Bahasa Pemrograman**

\`\`\`python
def cek_bilangan_genap(bilangan):
    if bilangan % 2 == 0:
        return "Genap"
    else:
        return "Ganjil"

# Test
print(cek_bilangan_genap(4))  # Output: Genap
print(cek_bilangan_genap(7))  # Output: Ganjil
\`\`\`

---

## 🌍 Pemrograman Lintas Bidang

### Contoh Penerapan:

#### **Kesehatan**
\`\`\`python
# Hitung BMI (Body Mass Index)
def hitung_bmi(berat_kg, tinggi_m):
    bmi = berat_kg / (tinggi_m ** 2)
    if bmi < 18.5:
        kategori = "Kurus"
    elif bmi < 25:
        kategori = "Normal"
    elif bmi < 30:
        kategori = "Gemuk"
    else:
        kategori = "Obesitas"
    return bmi, kategori
\`\`\`

#### **Ekonomi/Keuangan**
\`\`\`python
# Hitung bunga majemuk
def bunga_majemuk(modal, rate, tahun):
    return modal * (1 + rate) ** tahun
\`\`\`

#### **Fisika**
\`\`\`python
# Hitung kecepatan
def hitung_kecepatan(jarak, waktu):
    return jarak / waktu
\`\`\`

#### **Pertanian**
\`\`\`python
# Prediksi waktu panen
def prediksi_panen(jenis_tanaman, cuaca):
    database_panen = {
        "padi": {"cerah": 110, "hujan": 120},
        "jagung": {"cerah": 90, "hujan": 100}
    }
    return database_panen[jenis_tanaman][cuaca]
\`\`\`

---

## 🎯 Kompleksitas Algoritma

### Big O Notation

Mengukur efisiensi algoritma:

- **O(1)**: Constant - sangat cepat
- **O(log n)**: Logarithmic - cepat
- **O(n)**: Linear - normal
- **O(n log n)**: Linearithmic - cukup cepat
- **O(n²)**: Quadratic - lambat
- **O(2ⁿ)**: Exponential - sangat lambat

**Contoh:**
\`\`\`python
# O(1) - Akses array by index
arr[0]

# O(n) - Linear search
for item in arr:
    if item == target:
        return item

# O(n²) - Nested loop
for i in arr:
    for j in arr:
        print(i, j)
\`\`\`

---

## 📚 Best Practices Pemrograman

1. **Write Clean Code**
   - Nama variabel yang deskriptif
   - Fungsi yang fokus pada satu tugas
   - Komentar untuk kode kompleks

2. **DRY Principle** (Don't Repeat Yourself)
   - Jangan copy-paste kode
   - Buat fungsi untuk kode yang berulang

3. **Error Handling**
   - Antisipasi input error
   - Beri pesan error yang jelas

4. **Testing**
   - Test semua fungsi
   - Test edge cases

---

## 🎓 Kesimpulan

- **Berpikir komputasional** adalah skill fundamental programmer
- **Algoritma** adalah langkah sistematis memecahkan masalah
- **Pemrograman** bisa diterapkan di semua bidang
- **Clean code** dan **efisiensi** sama pentingnya

### 📝 Latihan

1. Buat algoritma untuk mencari bilangan prima
2. Implementasi bubble sort dalam Python
3. Buat program kalkulator sederhana
4. Analisis kompleksitas algoritma yang kamu buat

---

*Materi Informatika Kelas XI - SMA Wahidiyah Kediri*`,
    category: 'tutorial',
    tags: JSON.stringify(['Algoritma', 'Pemrograman', 'Computational Thinking', 'Coding']),
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    imageUrl: '/images/mengerjakan_tugas_informatika.png',
    readTime: 15,
    publishedAt: new Date('2024-09-01T10:00:00Z')
  },

  {
    title: 'Bab 3: Berpikir Kritis dan Dampak Sosial Informatika',
    slug: 'bab-3-berpikir-kritis-dampak-sosial',
    excerpt: 'Pengantar berpikir kritis dan kajian dampak sosial teknologi informatika di berbagai bidang kehidupan',
    content: `# Bab 3: Berpikir Kritis dan Dampak Sosial Informatika

## Pengantar Berpikir Kritis

**Berpikir kritis** adalah kemampuan untuk menganalisis informasi secara objektif dan membuat penilaian yang rasional.

### 🧠 Komponen Berpikir Kritis:

1. **Observation** (Observasi)
   - Mengumpulkan data dan informasi
   - Mengamati fenomena dengan seksama

2. **Analysis** (Analisis)
   - Memecah informasi menjadi bagian-bagian
   - Mencari hubungan dan pola

3. **Inference** (Inferensi)
   - Menarik kesimpulan logis
   - Membuat prediksi berdasarkan data

4. **Communication** (Komunikasi)
   - Menyampaikan hasil analisis
   - Berargumentasi dengan bukti

5. **Problem Solving** (Pemecahan Masalah)
   - Mencari solusi alternatif
   - Evaluasi solusi terbaik

### 🎯 Mengapa Berpikir Kritis Penting dalam Informatika?

- **Hoax & Misinformasi**: Internet penuh informasi palsu
- **Privacy & Security**: Harus waspada terhadap data pribadi
- **Ethical AI**: Teknologi harus digunakan secara etis
- **Digital Divide**: Kesenjangan akses teknologi

---

## 🌾 Dampak Informatika di Bidang Pertanian

### Transformasi Digital Pertanian:

#### **1. Precision Agriculture (Pertanian Presisi)**

**Teknologi:**
- Sensor IoT untuk monitoring tanah
- Drone untuk pemetaan lahan
- AI untuk prediksi cuaca dan hama

**Dampak Positif:**
✅ Efisiensi penggunaan air dan pupuk  
✅ Meningkatkan hasil panen 20-30%  
✅ Mengurangi biaya operasional  
✅ Real-time monitoring kondisi tanaman  

**Dampak Negatif:**
❌ Biaya investasi teknologi tinggi  
❌ Petani tradisional kesulitan adaptasi  
❌ Ketergantungan pada teknologi  
❌ Resiko cyber attack pada sistem pertanian  

#### **2. Aplikasi Mobile untuk Petani**

**Contoh:** TaniHub, iGrow, Tanihub

**Fitur:**
- Akses informasi harga pasar real-time
- Konsultasi dengan ahli pertanian
- E-commerce hasil panen
- Edukasi teknik bertani modern

**Dampak:**
✅ Petani dapat harga jual lebih baik  
✅ Akses pasar lebih luas  
✅ Mengurangi peran tengkulak  

❌ Literacy digital petani masih rendah  
❌ Infrastruktur internet di desa terbatas  

---

## 🏥 Dampak Informatika di Bidang Kesehatan

### Revolusi Digital Healthcare:

#### **1. Telemedicine (Konsultasi Online)**

**Platform:** Halodoc, Alodokter, KlikDokter

**Manfaat:**
✅ Akses dokter lebih mudah  
✅ Hemat waktu dan biaya transportasi  
✅ Konsultasi 24/7  
✅ Medical records digital  

**Tantangan:**
❌ Diagnosis terbatas (tidak bisa periksa fisik)  
❌ Resiko misdiagnosis  
❌ Privacy data kesehatan  

#### **2. AI dalam Diagnosa Penyakit**

**Penerapan:**
- AI membaca hasil X-ray dan CT scan
- Deteksi kanker lebih dini
- Prediksi risiko penyakit

**Studi Kasus:**
> AI Google Health dapat mendeteksi kanker payudara dengan akurasi 94.5%, lebih tinggi dari dokter (88%)

**Pro & Kontra:**

**PRO:**
- Akurasi tinggi
- Tidak kelelahan (tireless)
- Analisis jutaan data medis

**KONTRA:**
- Biaya teknologi mahal
- Kurang empati (human touch)
- Ethical dilemma: siapa yang bertanggung jawab jika AI salah?

#### **3. Wearable Health Devices**

**Contoh:** Apple Watch, Fitbit, Mi Band

**Fungsi:**
- Monitor detak jantung
- Tracking aktivitas fisik
- Deteksi pola tidur
- Alert kondisi abnormal

**Impact:**
✅ Preventive healthcare (cegah penyakit)  
✅ Personal health data  
✅ Early warning system  

❌ Privacy concern (data kesehatan dijual?)  
❌ Over-reliance pada teknologi  

---

## 🏭 Dampak Informatika di Industri & Manufaktur

### Industry 4.0:

**Teknologi:**
- IoT untuk smart factory
- Robotika dan automation
- AI untuk quality control
- Big Data untuk supply chain

**Dampak Sosial:**

**Positif:**
- Produktivitas meningkat 40%
- Kualitas produk lebih konsisten
- Efisiensi energi dan bahan baku
- Customization produk lebih mudah

**Negatif:**
- **Job displacement**: Pekerja tergantikan robot
- Skill gap: Butuh training ulang pekerja
- Ketergantungan teknologi
- Kesenjangan ekonomi melebar

---

## 📚 Dampak Informatika di Bidang Pendidikan

### E-Learning Revolution:

#### **Platform:**
- Ruangguru, Zenius, Quipper
- Coursera, edX, Khan Academy
- Platform LMS sekolah (seperti GEMA ini!)

#### **Transformasi:**

**Sebelum:**
- Belajar hanya di kelas
- Guru sebagai satu-satunya sumber
- Akses buku terbatas

**Sesudah:**
- Belajar anywhere, anytime
- Banyak sumber belajar gratis
- Personalized learning
- Gamification (belajar sambil main)

#### **Dampak:**

**Positif:**
✅ Akses pendidikan merata (democratization)  
✅ Biaya lebih murah  
✅ Self-paced learning  
✅ Materi always up-to-date  

**Negatif:**
❌ Screen time berlebihan  
❌ Kurang interaksi sosial  
❌ Digital divide (tidak semua punya gadget)  
❌ Plagiarisme lebih mudah  

---

## 💼 Dampak Sosial Ekonomi

### Gig Economy & Remote Work:

**Platform:** Freelancer, Upwork, Fiverr, Toptal

**Fenomena:**
- Freelancing sebagai profesi utama
- Remote work jadi normal (post-pandemic)
- Digital nomad lifestyle

**Pro:**
- Fleksibilitas waktu dan lokasi
- Income tidak terbatas lokasi geografis
- Work-life balance lebih baik

**Kontra:**
- Tidak ada job security
- Tidak ada benefit (BPJS, asuransi)
- Kompetisi global (bersaing dengan dunia)
- Burn out karena overwork

---

## 🔒 Isu Privasi & Keamanan Data

### Big Data & Surveillance Capitalism:

**Kasus:**
- Facebook-Cambridge Analytica scandal
- TikTok data privacy concerns
- Google tracking user behavior

**Dilema Etika:**

**Pertanyaan:**
1. Apakah kita boleh mengorbankan privasi demi kemudahan?
2. Siapa yang berhak punya data pribadi kita?
3. Bagaimana melindungi data dari cyber attack?

**Contoh Kasus Lokal:**
- Bocornya data BPJS 279 juta penduduk Indonesia
- Hacking e-commerce: data kartu kredit dijual
- Phishing dan penipuan online meningkat

---

## 🌍 Digital Divide & Kesenjangan Akses

### Realita di Indonesia:

**Data:**
- 77% populasi punya akses internet (2024)
- 23% masih belum terkoneksi
- Kesenjangan kota vs desa sangat besar

**Dampak:**
- Pendidikan: Siswa desa kesulitan e-learning
- Ekonomi: UMKM desa sulit go digital
- Kesehatan: Telemedicine tidak merata
- Politik: Digital literacy rendah → mudah dimanipulasi

**Solusi:**
- Infrastruktur internet merata
- Program literasi digital
- Subsidi gadget untuk siswa kurang mampu
- Curriculum yang inklusif

---

## 🤔 Berpikir Kritis: Evaluasi Teknologi

### Framework Evaluasi:

Saat menilai teknologi baru, tanyakan:

1. **Untuk siapa?**
   - Siapa yang diuntungkan?
   - Siapa yang dirugikan?

2. **Dampak jangka panjang?**
   - Apa efeknya 5-10 tahun ke depan?
   - Apakah sustainable?

3. **Etika & Moral?**
   - Apakah teknologi ini ethical?
   - Apakah melanggar privacy atau HAM?

4. **Aksesibilitas?**
   - Apakah semua orang bisa akses?
   - Bagaimana dengan kelompok marginal?

---

## 🎯 Kesimpulan

**Informatika bukan hanya teknologi, tapi juga tentang manusia dan masyarakat.**

**Prinsip:**
- Gunakan teknologi untuk kebaikan bersama
- Hormati privasi dan data pribadi
- Berpikir kritis terhadap informasi digital
- Berkontribusi mengurangi digital divide

**Quote:**

> "Technology is best when it brings people together." - Matt Mullenweg

> "With great power comes great responsibility." - Uncle Ben (tapi berlaku juga untuk teknologi!)

### 📝 Diskusi & Refleksi:

1. Menurutmu, apakah AI akan menggantikan pekerjaan manusia? Bagaimana kita harus mempersiapkan diri?

2. Bagaimana kita bisa menjaga privasi di era digital? Apa yang sudah kamu lakukan?

3. Berikan contoh 1 teknologi yang menurutmu punya dampak sosial positif dan 1 yang negatif. Jelaskan alasanmu.

---

*Materi Informatika Kelas XI - SMA Wahidiyah Kediri*`,
    category: 'tutorial',
    tags: JSON.stringify(['Berpikir Kritis', 'Dampak Sosial', 'Digital Society', 'Ethics']),
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    imageUrl: '/images/workshop_pemanfaatan_ai.png',
    readTime: 18,
    publishedAt: new Date('2024-09-15T10:00:00Z')
  },

  {
    title: 'Bab 4: Jaringan Komputer dan Internet',
    slug: 'bab-4-jaringan-komputer-internet',
    excerpt: 'Memahami topologi jaringan, model jaringan, transmisi data, dan keamanan jaringan komputer',
    content: `# Bab 4: Jaringan Komputer dan Internet

## Pengantar Jaringan Komputer

Jaringan komputer adalah kumpulan perangkat yang terhubung.

## Monitoring Jaringan

### Tools:

**Windows:**
- \`ipconfig\` - Cek IP address
- \`ping\` - Test konektivitas

*Materi Informatika Kelas XI - SMA Wahidiyah Kediri*`,
    category: 'tutorial',
    tags: JSON.stringify(['Jaringan', 'Internet', 'Network Security', 'TCP/IP']),
    author: 'Noah Caesar',
    authorId: 'admin-noah',
    status: 'published',
    featured: true,
    imageUrl: '/images/kegiatan_ekstra_gema_setelah_sekolah.png',
    readTime: 20,
    publishedAt: new Date('2024-10-01T10:00:00Z')
  }
]

async function main() {
  console.log('📚 Seeding articles data...')

  for (const article of articlesData) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug }
    })

    if (existing) {
      await prisma.article.update({
        where: { slug: article.slug },
        data: article
      })
      console.log(`✅ Updated: ${article.title}`)
    } else {
      await prisma.article.create({
        data: article
      })
      console.log(`✅ Created: ${article.title}`)
    }
  }

  console.log(`\n✅ Seeded ${articlesData.length} articles`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
