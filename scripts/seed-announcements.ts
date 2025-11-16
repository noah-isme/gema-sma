import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleAnnouncements = [
  {
    title: 'Workshop Mobile Development - Daftar Sekarang!',
    excerpt: 'Belajar membuat aplikasi Android dengan Flutter. Kuota terbatas!',
    content: 'GEMA mengadakan workshop mobile development menggunakan Flutter. Workshop ini akan berlangsung selama 3 hari dengan materi dari basic hingga membuat aplikasi sederhana. Daftar sekarang karena kuota terbatas hanya 30 peserta!',
    category: 'EVENT' as const,
    isImportant: true,
    isActive: true,
    showOnHomepage: true,
    deadline: new Date('2024-01-20T23:59:59'),
    link: '/events/mobile-workshop',
  },
  {
    title: 'Pengumpulan Tugas Algoritma - Deadline Besok!',
    excerpt: 'Jangan lupa kumpulkan tugas sorting algorithm ya!',
    content: 'Reminder untuk semua siswa kelas XI dan XII, tugas algoritma sorting harus dikumpulkan paling lambat besok jam 23:59. Format submission: PDF + Source Code (ZIP). Upload melalui portal GEMA.',
    category: 'TUGAS' as const,
    isImportant: true,
    isActive: true,
    showOnHomepage: false,
    deadline: new Date('2024-01-16T23:59:59'),
  },
  {
    title: 'Nilai UTS Semester Genap Sudah Keluar!',
    excerpt: 'Cek nilai UTS kamu sekarang di portal siswa.',
    content: 'Nilai UTS semester genap untuk semua mata pelajaran sudah dapat diakses melalui portal siswa. Silakan login menggunakan akun GEMA kamu untuk melihat detail nilai dan feedback dari guru.',
    category: 'NILAI' as const,
    isImportant: false,
    isActive: true,
    showOnHomepage: true,
  },
  {
    title: 'Perubahan Jadwal Kelas Pemrograman Web',
    excerpt: 'Kelas dipindah ke Lab 2 mulai minggu depan.',
    content: 'Mulai minggu depan, kelas Pemrograman Web akan dipindahkan dari Lab 1 ke Lab 2 karena renovasi. Jadwal tetap sama, hanya ruangan yang berubah. Mohon perhatiannya.',
    category: 'KELAS' as const,
    isImportant: false,
    isActive: true,
    showOnHomepage: false,
  },
  {
    title: 'Kompetisi Hackathon GEMA 2024 - Hadiah 10 Juta!',
    excerpt: 'Kompetisi coding terbesar tahun ini. Tunjukkan skill kalian!',
    content: 'GEMA proudly presents Hackathon 2024! Kompetisi 24 jam non-stop membuat aplikasi inovatif. Total hadiah 10 juta rupiah untuk 3 tim terbaik. Kategori: Web App, Mobile App, dan AI/ML. Daftar tim (3-4 orang) sebelum 25 Januari 2024.',
    category: 'EVENT' as const,
    isImportant: true,
    isActive: true,
    showOnHomepage: true,
    deadline: new Date('2024-01-25T23:59:59'),
    link: '/events/hackathon-2024',
  },
  {
    title: 'Maintenance Server GEMA - Minggu Ini',
    excerpt: 'Portal akan offline untuk maintenance rutin.',
    content: 'Server GEMA akan menjalani maintenance rutin pada Sabtu, 20 Januari 2024 pukul 22:00 - 02:00 WIB. Selama waktu tersebut, semua layanan GEMA termasuk portal siswa, forum, dan quiz akan tidak dapat diakses. Mohon maaf atas ketidaknyamanannya.',
    category: 'SISTEM' as const,
    isImportant: false,
    isActive: true,
    showOnHomepage: false,
  },
];

async function main() {
  console.log('🌱 Seeding announcements...');

  // Clear existing announcements (optional - comment out if you want to keep existing data)
  // await prisma.announcement.deleteMany({});

  for (const announcement of sampleAnnouncements) {
    const created = await prisma.announcement.create({
      data: announcement,
    });
    console.log(`✅ Created: ${created.title}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
