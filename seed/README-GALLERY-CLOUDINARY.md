# Gallery Seed dengan Cloudinary Upload

Dokumentasi untuk melakukan seeding data gallery dengan upload gambar ke Cloudinary.

## 📋 Prerequisite

1. **Cloudinary Account**: Pastikan Anda memiliki akun Cloudinary
2. **Environment Variables**: Set environment variables berikut di `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Gambar**: Pastikan gambar tersedia di folder `public/images/`

## 📁 Struktur Gambar

Script ini akan mengupload gambar dari folder `public/images/`:

```
public/images/
├── belajar_dengan_teachable_machine.png
├── kegiatan_ekstra_gema_setelah_sekolah.png
├── mengerjakan_tugas_informatika.png
├── presentasi_on_the_job_training_ai.png
└── workshop_pemanfaatan_ai.png
```

## 🚀 Cara Menjalankan

### Development/Local

```bash
npm run db:seed-gallery-cloudinary
```

### Production

```bash
npm run prod:seed-gallery-cloudinary
```

## 📝 Apa yang Dilakukan Script Ini?

1. **Validasi Konfigurasi**: Memastikan Cloudinary credentials sudah dikonfigurasi
2. **Upload ke Cloudinary**: 
   - Membaca gambar dari `public/images/`
   - Upload ke Cloudinary folder `gema-gallery`
   - Menggunakan nama file sebagai `public_id`
3. **Simpan ke Database**:
   - Menyimpan URL Cloudinary ke database
   - Update jika data sudah ada
   - Create jika data belum ada
4. **Set Flag Homepage**: Menandai gambar untuk ditampilkan di landing page

## 🎯 Data yang Di-seed

Script akan membuat/update 5 gallery items:

| Judul | Kategori | Show on Homepage |
|-------|----------|------------------|
| Belajar dengan Teachable Machine | pembelajaran | ✅ Yes |
| Kegiatan Ekstra GEMA Setelah Sekolah | ekstrakulikuler | ✅ Yes |
| Mengerjakan Tugas Informatika | pembelajaran | ✅ Yes |
| Presentasi On The Job Training AI | event | ✅ Yes |
| Workshop Pemanfaatan AI | workshop | ✅ Yes |

## 📤 Output di Cloudinary

Gambar akan diupload ke Cloudinary dengan struktur:

```
Folder: gema-gallery/
├── belajar_dengan_teachable_machine
├── kegiatan_ekstra_gema_setelah_sekolah
├── mengerjakan_tugas_informatika
├── presentasi_on_the_job_training_ai
└── workshop_pemanfaatan_ai
```

## 🖼️ Tampilan di Landing Page

Gambar yang memiliki flag `showOnHomepage: true` akan otomatis muncul di:
- **Landing Page** → Section Gallery
- **Gallery Page** → `/gallery`

## ⚠️ Troubleshooting

### Error: Cloudinary environment variables are not configured

**Solusi**: Pastikan `.env` sudah berisi:
```env
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Error: File not found

**Solusi**: 
1. Pastikan gambar ada di folder `public/images/`
2. Cek nama file sesuai dengan yang ada di script
3. Pastikan ekstensi file benar (.png, .jpg, dll)

### Error: Upload failed

**Solusi**:
1. Cek koneksi internet
2. Verifikasi Cloudinary credentials
3. Pastikan quota Cloudinary tidak habis

## 🔄 Update Gambar

Jika ingin update gambar yang sudah ada:

1. Replace file di `public/images/`
2. Jalankan lagi script seeding
3. Script akan otomatis update URL di database

## 📊 Verifikasi

Setelah seeding, verifikasi dengan:

1. **Database**: 
```bash
npm run db:studio
# Cek table `galleries`, pastikan imageUrl berisi URL Cloudinary
```

2. **Landing Page**: 
   - Buka `http://localhost:3000`
   - Scroll ke section "Galeri Kegiatan"
   - Pastikan gambar tampil dari Cloudinary

3. **Gallery Page**:
   - Buka `http://localhost:3000/gallery`
   - Pastikan semua gambar tampil

## 🎨 Menambah Gambar Baru

Edit file `seed/seed-gallery-cloudinary.ts`:

```typescript
const galleryData: GalleryData[] = [
  // ... existing data
  {
    title: 'Judul Gambar Baru',
    description: 'Deskripsi gambar',
    imagePath: 'public/images/nama_file_baru.png',
    category: 'kategori', // pembelajaran, ekstrakulikuler, event, workshop
    showOnHomepage: true, // true untuk tampil di landing page
  },
]
```

Kemudian jalankan script lagi.

## 🔗 Related Files

- Script: `seed/seed-gallery-cloudinary.ts`
- Schema: `prisma/schema.prisma` (model Gallery)
- Component: `src/components/landing/GallerySection.tsx`
- Page: `src/app/gallery/page.tsx`
- Admin: `src/features/admin/gallery/GalleryManager.tsx`

## 📱 API Endpoints

Gallery data dapat diakses via:
- `GET /api/gallery` - Get all gallery items
- Admin panel: `/admin/gallery` - Manage gallery

## ✅ Checklist

Sebelum deploy ke production:

- [ ] Semua gambar sudah diupload ke Cloudinary
- [ ] Database sudah berisi data gallery dengan URL Cloudinary
- [ ] Landing page menampilkan gambar dengan benar
- [ ] Gallery page berfungsi normal
- [ ] Admin panel gallery berfungsi normal

---

**Note**: Script ini aman dijalankan berkali-kali karena menggunakan upsert logic (update jika ada, create jika belum ada).