# 🖼️ Gallery Cloudinary Setup Guide

Panduan lengkap untuk setup dan seeding data gallery dengan Cloudinary upload untuk GEMA SMA Platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Cloudinary](#setup-cloudinary)
4. [Environment Configuration](#environment-configuration)
5. [Image Preparation](#image-preparation)
6. [Testing Configuration](#testing-configuration)
7. [Running the Seed](#running-the-seed)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Usage](#advanced-usage)

---

## Overview

Script seeding gallery ini akan:
- ✅ Mengupload gambar dari folder `public/images/` ke Cloudinary
- ✅ Menyimpan URL Cloudinary ke database
- ✅ Menandai gambar untuk ditampilkan di landing page
- ✅ Mengatur kategori gallery (pembelajaran, ekstrakulikuler, event, workshop)

## Prerequisites

### 1. Cloudinary Account
Daftar akun gratis di [Cloudinary](https://cloudinary.com/):
- Free tier: 25 GB storage, 25 GB bandwidth/month
- Cukup untuk development dan small-medium production

### 2. Node.js & Dependencies
```bash
node -v  # v18 or higher
npm -v   # v9 or higher
```

### 3. Prisma Setup
```bash
npm run prisma:generate
```

## Setup Cloudinary

### Step 1: Create Cloudinary Account

1. Buka https://cloudinary.com/users/register/free
2. Isi form registrasi
3. Verifikasi email
4. Login ke Dashboard

### Step 2: Get Credentials

Di Cloudinary Dashboard, Anda akan melihat:

```
Cloud name:     your-cloud-name
API Key:        123456789012345
API Secret:     abcdefghijklmnopqrstuvwxyz123
```

**⚠️ PENTING**: Jangan share API Secret ke public repository!

### Step 3: Setup Upload Preset (Optional)

Untuk keamanan tambahan:
1. Go to Settings → Upload
2. Create Upload Preset:
   - Name: `gema-gallery`
   - Signing Mode: `Signed`
   - Folder: `gema-gallery`

## Environment Configuration

### Development (.env.local)

Buat file `.env.local` di root project:

```env
# Database
DATABASE_URL="postgresql://..."

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Production (.env)

Untuk production, set di platform hosting Anda (Vercel/Railway/etc):

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

**Vercel:**
```bash
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

## Image Preparation

### Image Requirements

- **Format**: PNG, JPG, JPEG, WEBP
- **Size**: Max 10MB (recommended < 2MB)
- **Dimension**: Minimum 800x600px (recommended 1200x900px)
- **Aspect Ratio**: 4:3 atau 16:9 untuk tampilan optimal

### Image Location

Tempatkan gambar di folder `public/images/`:

```
gema-sma/
├── public/
│   └── images/
│       ├── belajar_dengan_teachable_machine.png
│       ├── kegiatan_ekstra_gema_setelah_sekolah.png
│       ├── mengerjakan_tugas_informatika.png
│       ├── presentasi_on_the_job_training_ai.png
│       └── workshop_pemanfaatan_ai.png
```

### Image Naming Convention

Best practices untuk nama file:
- ✅ Gunakan lowercase
- ✅ Pisahkan kata dengan underscore `_`
- ✅ Nama deskriptif
- ❌ Hindari spasi
- ❌ Hindari karakter special

Contoh:
```
✅ belajar_dengan_teachable_machine.png
✅ workshop_ai_2024.png
❌ Belajar Dengan Teachable Machine.png
❌ workshop@ai#2024.png
```

## Testing Configuration

Sebelum seeding, test konfigurasi Cloudinary:

```bash
npm run db:test-gallery-cloudinary
```

Test ini akan:
1. ✅ Validasi environment variables
2. ✅ Check keberadaan file gambar
3. ✅ Test koneksi ke Cloudinary API
4. ✅ Upload test image (lalu dihapus)

### Expected Output

```
🧪 Testing Cloudinary Configuration...

1️⃣  Checking environment variables...
   ✅ All environment variables are set
   Cloud Name: your-cloud-name

2️⃣  Checking image files...
   ✅ belajar_dengan_teachable_machine.png (452.31 KB)
   ✅ kegiatan_ekstra_gema_setelah_sekolah.png (523.45 KB)
   ✅ mengerjakan_tugas_informatika.png (387.22 KB)
   ✅ presentasi_on_the_job_training_ai.png (601.87 KB)
   ✅ workshop_pemanfaatan_ai.png (445.92 KB)
   ✅ All image files found

3️⃣  Testing Cloudinary API connection...
   ✅ Successfully connected to Cloudinary!
   Response: {"status":"ok"}

4️⃣  Testing image upload (dry run)...
   Uploading: belajar_dengan_teachable_machine.png
   ✅ Test upload successful!
   URL: https://res.cloudinary.com/.../test_belajar_dengan_teachable_machine
   Public ID: gema-gallery-test/test_belajar_dengan_teachable_machine
   Format: png
   Size: 452.31 KB

5️⃣  Cleaning up test upload...
   ✅ Test upload cleaned up

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All tests passed! Ready to seed gallery data.

To proceed with seeding, run:
   npm run db:seed-gallery-cloudinary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Running the Seed

### Development

```bash
npm run db:seed-gallery-cloudinary
```

### Production

```bash
npm run prod:seed-gallery-cloudinary
```

### Expected Output

```
🖼️  Starting gallery seed with Cloudinary upload...

✅ Cloudinary configured: your-cloud-name

[1/5] Processing: Belajar dengan Teachable Machine
   📤 Uploading belajar_dengan_teachable_machine.png to Cloudinary...
   ✅ Uploaded successfully: https://res.cloudinary.com/.../belajar_dengan_teachable_machine
   ✅ Created: Belajar dengan Teachable Machine

[2/5] Processing: Kegiatan Ekstra GEMA Setelah Sekolah
   📤 Uploading kegiatan_ekstra_gema_setelah_sekolah.png to Cloudinary...
   ✅ Uploaded successfully: https://res.cloudinary.com/.../kegiatan_ekstra_gema_setelah_sekolah
   ✅ Created: Kegiatan Ekstra GEMA Setelah Sekolah

[3/5] Processing: Mengerjakan Tugas Informatika
   📤 Uploading mengerjakan_tugas_informatika.png to Cloudinary...
   ✅ Uploaded successfully: https://res.cloudinary.com/.../mengerjakan_tugas_informatika
   ✅ Created: Mengerjakan Tugas Informatika

[4/5] Processing: Presentasi On The Job Training AI
   📤 Uploading presentasi_on_the_job_training_ai.png to Cloudinary...
   ✅ Uploaded successfully: https://res.cloudinary.com/.../presentasi_on_the_job_training_ai
   ✅ Created: Presentasi On The Job Training AI

[5/5] Processing: Workshop Pemanfaatan AI
   📤 Uploading workshop_pemanfaatan_ai.png to Cloudinary...
   ✅ Uploaded successfully: https://res.cloudinary.com/.../workshop_pemanfaatan_ai
   ✅ Created: Workshop Pemanfaatan AI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Seeding completed!
   Success: 5
   Failed: 0
   Total: 5
```

## Verification

### 1. Check Database

```bash
npm run db:studio
```

Buka Prisma Studio dan check table `galleries`:
- ✅ Ada 5 records
- ✅ `imageUrl` berisi URL Cloudinary (dimulai dengan `https://res.cloudinary.com/`)
- ✅ `showOnHomepage` = true
- ✅ `isActive` = true

### 2. Check Cloudinary Dashboard

1. Login ke Cloudinary Dashboard
2. Go to Media Library
3. Buka folder `gema-gallery`
4. ✅ Harusnya ada 5 images

### 3. Check Landing Page

```bash
npm run dev
```

Buka http://localhost:3000
- Scroll ke section "Galeri Kegiatan"
- ✅ Harusnya tampil 4-6 gambar dari Cloudinary
- ✅ Gambar load dengan cepat (optimized by Cloudinary)

### 4. Check Gallery Page

Buka http://localhost:3000/gallery
- ✅ Semua gambar tampil
- ✅ Filter kategori berfungsi
- ✅ Lightbox berfungsi (click gambar untuk zoom)

### 5. Check Admin Panel

Login sebagai admin: http://localhost:3000/admin/gallery
- ✅ Semua gallery items tampil
- ✅ Bisa edit, delete, tambah baru
- ✅ Upload gambar baru langsung ke Cloudinary

## Troubleshooting

### Problem: Environment variables not configured

```
❌ Cloudinary environment variables are not configured!
Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET
```

**Solution:**
1. Check file `.env.local` ada dan berisi credentials
2. Restart development server: `npm run dev`
3. Jika masih error, print env: `echo $CLOUDINARY_CLOUD_NAME`

### Problem: File not found

```
⚠️  File not found: /path/to/public/images/image.png
```

**Solution:**
1. Check gambar ada di `public/images/`
2. Check nama file match dengan yang di script
3. Check case-sensitive (Linux/Mac)

### Problem: Upload failed

```
❌ Failed to upload image.png: Upload failed
```

**Solutions:**
1. Check internet connection
2. Verify Cloudinary credentials
3. Check file size (max 10MB for free tier)
4. Check Cloudinary quota tidak habis

### Problem: Invalid credentials

```
❌ Invalid signature
```

**Solution:**
1. Double-check API Secret (no extra spaces)
2. Regenerate API Secret di Cloudinary Dashboard
3. Update `.env.local` dengan credentials baru

### Problem: Images not showing on website

**Solutions:**
1. Check browser console untuk errors
2. Check image URL di database (harusnya Cloudinary URL)
3. Check Cloudinary image masih ada (not deleted)
4. Clear browser cache: `Ctrl+Shift+R`

### Problem: Quota exceeded

```
❌ Rate limit exceeded
```

**Solution:**
1. Check Cloudinary usage di Dashboard
2. Free tier: 25GB storage, 25GB bandwidth/month
3. Upgrade plan atau optimize images
4. Delete unused images dari Cloudinary

## Advanced Usage

### Adding New Images

Edit `seed/seed-gallery-cloudinary.ts`:

```typescript
const galleryData: GalleryData[] = [
  // ... existing data
  {
    title: 'Hackathon GEMA 2024',
    description: 'Kompetisi coding marathon untuk siswa GEMA',
    imagePath: 'public/images/hackathon_gema_2024.png',
    category: 'event',
    showOnHomepage: true,
  },
]
```

Then run seed again:
```bash
npm run db:seed-gallery-cloudinary
```

### Updating Existing Images

1. Replace file di `public/images/` dengan nama yang sama
2. Run seed lagi (akan overwrite di Cloudinary)
3. Database akan auto-update dengan URL baru

### Bulk Upload Script

Untuk upload banyak gambar sekaligus:

```typescript
// seed/seed-gallery-bulk.ts
import * as fs from 'fs'
import * as path from 'path'

const imagesDir = path.join(process.cwd(), 'public/images')
const files = fs.readdirSync(imagesDir)

const galleryData = files
  .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
  .map(file => ({
    title: file.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/_/g, ' '),
    description: `Gallery image: ${file}`,
    imagePath: `public/images/${file}`,
    category: 'general',
    showOnHomepage: false,
  }))
```

### Image Transformations

Cloudinary supports on-the-fly transformations. Update URL di database:

```typescript
// Original
const url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'

// Resized
const resized = 'https://res.cloudinary.com/demo/image/upload/w_800,h_600,c_fill/sample.jpg'

// Optimized
const optimized = 'https://res.cloudinary.com/demo/image/upload/q_auto,f_auto/sample.jpg'

// Rounded corners
const rounded = 'https://res.cloudinary.com/demo/image/upload/r_20/sample.jpg'
```

### Automated Optimization

Update `src/components/ui/OptimizedImage.tsx` untuk auto-optimize:

```typescript
export function OptimizedImage({ src, alt, ...props }) {
  // Check if it's Cloudinary URL
  if (src.includes('cloudinary.com')) {
    // Add transformations
    const parts = src.split('/upload/')
    const optimizedSrc = `${parts[0]}/upload/q_auto,f_auto,w_800,h_600,c_fill/${parts[1]}`
    return <img src={optimizedSrc} alt={alt} {...props} />
  }
  return <img src={src} alt={alt} {...props} />
}
```

### Backup Cloudinary Images

Script untuk backup semua images:

```bash
# Install cloudinary CLI
npm install -g cloudinary-cli

# Login
cloudinary config

# Download all images
cloudinary download gema-gallery/ -d ./backups/gallery/
```

## Best Practices

### 1. Image Optimization

- ✅ Compress images sebelum upload (use TinyPNG, ImageOptim)
- ✅ Use WebP format untuk size lebih kecil
- ✅ Set max width/height di transformation
- ✅ Enable auto-quality (`q_auto`)

### 2. Security

- ✅ Never commit `.env` files
- ✅ Use signed uploads untuk production
- ✅ Restrict upload folder permissions
- ✅ Set allowed formats di Cloudinary settings

### 3. Performance

- ✅ Use CDN (Cloudinary auto-provides)
- ✅ Enable lazy loading di frontend
- ✅ Implement progressive images
- ✅ Cache images di browser

### 4. Maintenance

- ✅ Regular cleanup unused images
- ✅ Monitor bandwidth usage
- ✅ Implement image versioning
- ✅ Keep backup of originals

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload API Reference](https://cloudinary.com/documentation/upload_images)

## Support

Jika mengalami masalah:
1. Check dokumentasi ini dulu
2. Check Cloudinary Dashboard untuk logs
3. Check browser console untuk errors
4. Contact tim development GEMA

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained by**: GEMA SMA Development Team