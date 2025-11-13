import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedClassroomRoadmap() {
  console.log('🚀 Seeding Classroom Roadmap: Web Development SMA...')

  try {
    // Clear existing data first
    await prisma.classroomProjectChecklist.deleteMany({})
    console.log('🧹 Cleared existing classroom project checklists')

    const labStages = [
      {
        title: 'Stage 1 · HTML Playground',
        slug: 'lp-html-playground',
        goal: 'Mengenal struktur halaman, semantic tag dasar, dan pola layout sederhana layaknya wireframe interaktif.',
        skills: ['Semantic HTML', 'Modular Sections', 'Accessibility Basics'],
        basicTargets: [
          {
            title: '💡 Hero Sandbox',
            description: 'Buat hero section dengan judul, subjudul, dan tombol call-to-action yang jelas.',
            completed: false
          },
          {
            title: '🧩 Grid Cerita',
            description: 'Susun tiga blok konten menggunakan semantic tag sebagai “story tiles”.',
            completed: false
          },
          {
            title: '🎯 Navigasi Fokus',
            description: 'Bangun struktur nav dengan anchor internal dan tambahkan skip-link untuk aksesibilitas.',
            completed: false
          }
        ],
        advancedTargets: [
          {
            title: '📐 Layout Blueprint',
            description: 'Gunakan CSS Grid sederhana untuk menata section menjadi 2 kolom responsif.',
            completed: false
          },
          {
            title: '🎛️ Komponen Reusable',
            description: 'Buat komponen kartu testimonial menggunakan semantic tag + class reusable.',
            completed: false
          }
        ],
        reflectionPrompt: 'Bagian mana dari struktur HTML yang paling membantu saat membaca ulang kode?',
        order: 1,
        isActive: true
      },
      {
        title: 'Stage 2 · CSS Interaction Studio',
        slug: 'lp-css-interaction',
        goal: 'Mengasah kemampuan styling modern: tokens, responsive spacing, serta micro interaction menggunakan hover/focus.',
        skills: ['Design Tokens', 'Responsive Layout', 'Micro Interaction'],
        basicTargets: [
          {
            title: '🎨 Palette & Tokens',
            description: 'Definisikan custom properties untuk warna, radius, dan shadow agar konsisten.',
            completed: false
          },
          {
            title: '📱 Responsive Stack',
            description: 'Implementasikan layout dua kolom di desktop dan stack di mobile menggunakan Flexbox.',
            completed: false
          },
          {
            title: '✨ Hover Feedback',
            description: 'Tambahkan transisi halus untuk tombol utama + state focus yang kontras.',
            completed: false
          }
        ],
        advancedTargets: [
          {
            title: '🌗 Theme Toggle Visual',
            description: 'Buat versi light/dark dengan CSS variables dan animasi minimal saat toggle.',
            completed: false
          },
          {
            title: '🧭 Sticky Mini Navbar',
            description: 'Tambahkan nav kecil yang menempel saat scroll untuk pengalaman lab dashboard.',
            completed: false
          }
        ],
        reflectionPrompt: 'Bagaimana caramu menentukan kapan efek hover perlu ditambahkan?',
        order: 2,
        isActive: true
      },
      {
        title: 'Stage 3 · JavaScript Motion Lab',
        slug: 'lp-js-motion',
        goal: 'Belajar menghubungkan UI dengan state sederhana: toggles, modals, carousel mini.',
        skills: ['State Management', 'DOM Updates', 'Modal/Carousel Logic'],
        basicTargets: [
          {
            title: '▶️ Play Toggle',
            description: 'Buat tombol play/pause yang mengganti ikon serta label secara dinamis.',
            completed: false
          },
          {
            title: '🪟 Modal Lab',
            description: 'Implementasikan modal dengan aksesibilitas dasar (focus trap sederhana).',
            completed: false
          },
          {
            title: '🔁 Carousel Mini',
            description: 'Bangun carousel 3 kartu dengan tombol prev/next dan indikator aktif.',
            completed: false
          }
        ],
        advancedTargets: [
          {
            title: '📡 Data Dummy',
            description: 'Ambil data lab progress dari file JSON lokal dan render secara dinamis.',
            completed: false
          },
          {
            title: '⚡ Keyboard Friendly',
            description: 'Tambahkan kontrol keyboard (Arrow / Escape) untuk carousel & modal.',
            completed: false
          }
        ],
        reflectionPrompt: 'Bagaimana cara kamu mengecek bug saat event handler tidak jalan?',
        order: 3,
        isActive: true
      },
      {
        title: 'Stage 4 · Component Systems Sprint',
        slug: 'lp-component-sprint',
        goal: 'Merancang sistem komponen mini (card, chip, stats) agar halaman terasa seperti lab profesional.',
        skills: ['Component Thinking', 'Design System', 'Documentation'],
        basicTargets: [
          {
            title: '🧱 Card Variants',
            description: 'Buat 2 varian kartu (default & highlight) dengan opsi badge status.',
            completed: false
          },
          {
            title: '🏷️ Chip Library',
            description: 'Siapkan set chip (Level, XP, Status) dengan warna berbeda dan ikon unggulan.',
            completed: false
          },
          {
            title: '📊 Progress HUD',
            description: 'Bangun komponen progress ring / bar yang bisa dikustom via CSS variables.',
            completed: false
          }
        ],
        advancedTargets: [
          {
            title: '📘 Mini Style Guide',
            description: 'Dokumentasikan komponen di satu halaman dengan contoh penggunaan.',
            completed: false
          },
          {
            title: '🧬 Animation Tokens',
            description: 'Tambahkan kelas utilitas untuk delay/animasi agar komponen hidup.',
            completed: false
          }
        ],
        reflectionPrompt: 'Komponen apa yang paling sering kamu pakai ulang, dan mengapa?',
        order: 4,
        isActive: true
      },
      {
        title: 'Stage 5 · Prototype Launch Mission',
        slug: 'lp-prototype-launch',
        goal: 'Menggabungkan semua skill menjadi dashboard “Coding Lab” versi beta sebelum dipresentasikan.',
        skills: ['Product Thinking', 'QA Checklist', 'Storytelling'],
        basicTargets: [
          {
            title: '🚀 MVP Scope',
            description: 'Susun daftar fitur wajib vs nice-to-have untuk prototipe final.',
            completed: false
          },
          {
            title: '🧪 QA Mini Suite',
            description: 'Buat checklist pengujian manual (responsif, aksesibilitas, interaksi).',
            completed: false
          },
          {
            title: '🎬 Demo Script',
            description: 'Siapkan script demo 3 menit untuk mempresentasikan hasil prototipe.',
            completed: false
          }
        ],
        advancedTargets: [
          {
            title: '🔗 Deployment Preview',
            description: 'Upload prototipe ke Netlify/Vercel/GitHub Pages untuk feedback teman.',
            completed: false
          },
          {
            title: '📣 Story Pitch',
            description: 'Buat satu halaman ringkasan (pitch deck mini) yang menjelaskan problem/solusi.',
            completed: false
          }
        ],
        reflectionPrompt: 'Apa satu hal yang paling kamu banggakan dari prototipe ini?',
        order: 5,
        isActive: true
      }
    ]

    for (const stage of labStages) {
      await prisma.classroomProjectChecklist.create({ data: stage })
    }
  } catch (error) {
    console.error('❌ Error seeding classroom roadmap:', error)
    throw error
  }
}

// Execute seeding
seedClassroomRoadmap()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
