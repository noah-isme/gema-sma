import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const galleryData = [
  {
    title: 'Belajar dengan Teachable Machine',
    description: 'Siswa GEMA belajar Machine Learning menggunakan Teachable Machine dari Google untuk membuat model AI sederhana',
    imageUrl: '/images/belajar_dengan_teachable_machine.png',
    category: 'pembelajaran',
    showOnHomepage: true,
    isActive: true
  },
  {
    title: 'Kegiatan Ekstra GEMA Setelah Sekolah',
    description: 'Kegiatan ekstrakurikuler GEMA dengan berbagai aktivitas coding, robotik, dan teknologi terkini',
    imageUrl: '/images/kegiatan_ekstra_gema_setelah_sekolah.png',
    category: 'ekstrakulikuler',
    showOnHomepage: true,
    isActive: true
  },
  {
    title: 'Mengerjakan Tugas Informatika',
    description: 'Siswa fokus mengerjakan tugas informatika dengan pendampingan dari pengajar GEMA',
    imageUrl: '/images/mengerjakan_tugas_informatika.png',
    category: 'pembelajaran',
    showOnHomepage: true,
    isActive: true
  },
  {
    title: 'Presentasi On The Job Training AI',
    description: 'Presentasi hasil On The Job Training tentang implementasi Artificial Intelligence',
    imageUrl: '/images/presentasi_on_the_job_training_ai.png',
    category: 'event',
    showOnHomepage: true,
    isActive: true
  },
  {
    title: 'Workshop Pemanfaatan AI',
    description: 'Workshop pemanfaatan Artificial Intelligence dalam kehidupan sehari-hari dan pendidikan',
    imageUrl: '/images/workshop_pemanfaatan_ai.png',
    category: 'workshop',
    showOnHomepage: true,
    isActive: true
  }
]

async function main() {
  console.log('🖼️  Seeding gallery data...')

  for (const gallery of galleryData) {
    const existing = await prisma.gallery.findFirst({
      where: { imageUrl: gallery.imageUrl }
    })
    
    if (existing) {
      await prisma.gallery.update({
        where: { id: existing.id },
        data: gallery
      })
    } else {
      await prisma.gallery.create({
        data: gallery
      })
    }
    console.log(`✅ ${gallery.title}`)
  }

  console.log(`\n✅ Seeded ${galleryData.length} gallery items`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
