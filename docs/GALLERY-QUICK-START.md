# 🖼️ Gallery Cloudinary - Quick Start

Panduan cepat untuk seeding gallery dengan Cloudinary upload.

## ⚡ Quick Steps

### 1. Setup Cloudinary Credentials

Tambahkan ke `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Dapatkan credentials di**: https://cloudinary.com/console

### 2. Prepare Images

Pastikan gambar ada di `public/images/`:

```
public/images/
├── belajar_dengan_teachable_machine.png
├── kegiatan_ekstra_gema_setelah_sekolah.png
├── mengerjakan_tugas_informatika.png
├── presentasi_on_the_job_training_ai.png
└── workshop_pemanfaatan_ai.png
```

### 3. Test Configuration

```bash
npm run db:test-gallery-cloudinary
```

Pastikan semua ✅ (hijau).

### 4. Run Seed

```bash
npm run db:seed-gallery-cloudinary
```

### 5. Verify

```bash
# Check database
npm run db:studio

# Check website
npm run dev
# Buka: http://localhost:3000
```

---

## 🎯 What This Does

1. ✅ Upload images dari `public/images/` → Cloudinary
2. ✅ Save Cloudinary URLs → Database
3. ✅ Mark images untuk tampil di landing page
4. ✅ Set kategori (pembelajaran, ekstrakulikuler, event, workshop)

---

## 📍 Where Images Show

- **Landing Page**: http://localhost:3000 → Section "Galeri Kegiatan"
- **Gallery Page**: http://localhost:3000/gallery
- **Admin Panel**: http://localhost:3000/admin/gallery

---

## 🐛 Common Issues

### ❌ "Environment variables not configured"
**Fix**: Check `.env.local` ada dan berisi CLOUDINARY_* variables

### ❌ "File not found"
**Fix**: Check gambar ada di `public/images/` dengan nama yang benar

### ❌ "Upload failed"
**Fix**: Check internet connection dan Cloudinary credentials

---

## 🔄 Update Images

1. Replace file di `public/images/`
2. Run: `npm run db:seed-gallery-cloudinary`
3. Done! (auto-overwrite)

---

## ➕ Add New Images

Edit `seed/seed-gallery-cloudinary.ts`:

```typescript
const galleryData: GalleryData[] = [
  // ... existing data
  {
    title: 'New Image Title',
    description: 'Description here',
    imagePath: 'public/images/new_image.png',
    category: 'pembelajaran', // atau: ekstrakulikuler, event, workshop
    showOnHomepage: true,
  },
]
```

Run seed lagi: `npm run db:seed-gallery-cloudinary`

---

## 📚 Full Documentation

Untuk dokumentasi lengkap, baca: [GALLERY-CLOUDINARY-SETUP.md](./GALLERY-CLOUDINARY-SETUP.md)

---

## 🎨 Image Guidelines

- **Format**: PNG, JPG, JPEG, WEBP
- **Size**: Max 10MB (recommend < 2MB)
- **Dimension**: Min 800x600px (recommend 1200x900px)
- **Aspect Ratio**: 4:3 atau 16:9
- **Naming**: lowercase, gunakan underscore, no spaces

✅ Good: `workshop_ai_2024.png`  
❌ Bad: `Workshop AI 2024.png`

---

## 🚀 Production Deploy

```bash
# Set env variables di Vercel/Railway
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET

# Run seed di production
npm run prod:seed-gallery-cloudinary
```

---

## ✅ Checklist

- [ ] Cloudinary account created
- [ ] Credentials added to `.env.local`
- [ ] Images placed in `public/images/`
- [ ] Test passed: `npm run db:test-gallery-cloudinary`
- [ ] Seed completed: `npm run db:seed-gallery-cloudinary`
- [ ] Verified in database (Prisma Studio)
- [ ] Verified on landing page
- [ ] Verified on gallery page

---

**Need Help?** Check [GALLERY-CLOUDINARY-SETUP.md](./GALLERY-CLOUDINARY-SETUP.md) for detailed troubleshooting.