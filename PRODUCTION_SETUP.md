# 🚀 Production Setup Guide - GEMA SMA Wahidiyah

## Masalah: Data Tidak Muncul di Production

Jika aplikasi berhasil di-deploy tapi **data tidak muncul**, kemungkinan database belum di-seed.

## ✅ Solusi: Setup Database Production

### 1. **Vercel Environment Variables**

Pastikan environment variables berikut sudah di-set di Vercel Dashboard:

```bash
# Database (WAJIB)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# NextAuth
NEXTAUTH_URL=https://gema-sma-wahidiyah.vercel.app
NEXTAUTH_SECRET=your-production-secret-key-here

# Cloudinary (untuk upload file)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Judge0 (untuk coding lab)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key

# Public Variables (otomatis dari .env)
NEXT_PUBLIC_SITE_URL=https://gema-sma-wahidiyah.vercel.app
NEXT_PUBLIC_SCHOOL_NAME=SMA Wahidiyah Kediri
# ... (public vars lainnya otomatis terbaca)
```

### 2. **Re-deploy dengan Seed Otomatis**

Script `vercel-build.sh` sudah diupdate untuk otomatis seed database. Untuk re-deploy:

```bash
# Commit perubahan
git add .
git commit -m "fix: add automatic database seeding on production"
git push origin main

# Atau force deploy
npm run vercel:force-deploy
```

### 3. **Manual Seed (Jika Perlu)**

Jika auto-seed gagal, seed manual dari lokal:

```bash
# Set DATABASE_URL production
export DATABASE_URL="postgresql://..."

# Run seed
npx tsx seed/seed.ts

# Atau
npm run db:seed
```

### 4. **Verifikasi Data**

Setelah deploy, cek apakah data sudah ada:

```bash
# Install Prisma CLI global
npm i -g prisma

# Connect ke production database
export DATABASE_URL="postgresql://..."
prisma studio
```

Atau buka aplikasi dan cek:
- `/admin` - Login admin (admin.gema@smawahidiyah.edu / admin123)
- `/student/login` - Login student (2025001 / student123)
- `/announcements` - Cek pengumuman
- `/tutorial` - Cek artikel tutorial

## 📊 Data yang Di-seed

Script `seed/seed.ts` akan membuat:

1. **2 Admin Accounts**
   - `superadmin@smawahidiyah.edu` / `admin123`
   - `admin.gema@smawahidiyah.edu` / `admin123`

2. **20 Student Accounts**
   - Student ID: `2025001` - `2025020`
   - Password: `student123`

3. **Sample Data**
   - 3 Announcements
   - 3 Events
   - Tutorial Articles
   - Coding Lab Challenges
   - Assignments
   - Quiz Questions

## 🔧 Troubleshooting

### Database Connection Error

```
Error: Can't reach database server
```

**Solusi:**
1. Cek `DATABASE_URL` di Vercel dashboard
2. Pastikan database Neon/Supabase aktif
3. Whitelist Vercel IP (jika perlu)

### Seed Timeout

```
Error: Script timeout
```

**Solusi:**
1. Increase function timeout di `vercel.json`:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

2. Atau seed manual dari lokal

### Migration Failed

```
Error: Migration failed to apply
```

**Solusi:**
```bash
# Reset dan re-migrate
export DATABASE_URL="postgresql://..."
prisma migrate reset --force
prisma migrate deploy
npx tsx seed/seed.ts
```

## 🎯 Best Practices

1. **Gunakan Production Database Terpisah**
   - Jangan gunakan database development untuk production
   - Buat database baru di Neon/Supabase khusus production

2. **Backup Database Berkala**
   ```bash
   # Export data
   prisma db pull
   
   # Atau gunakan backup feature dari Neon/Supabase
   ```

3. **Environment Variables Security**
   - Jangan commit `.env` ke git
   - Gunakan Vercel Environment Variables
   - Generate `NEXTAUTH_SECRET` baru untuk production:
   ```bash
   openssl rand -base64 32
   ```

4. **Monitor Logs**
   ```bash
   vercel logs
   ```

## 📝 Checklist Deploy Production

- [ ] Database production sudah dibuat
- [ ] Environment variables di-set di Vercel
- [ ] `DATABASE_URL` valid dan ter-test
- [ ] `NEXTAUTH_SECRET` production-ready
- [ ] Script `vercel-build.sh` sudah update
- [ ] Deploy sukses tanpa error
- [ ] Database ter-seed dengan data
- [ ] Login admin berhasil
- [ ] Login student berhasil
- [ ] Data muncul di UI

## 🆘 Butuh Bantuan?

Jika masih ada masalah:

1. Cek deployment logs: `vercel logs`
2. Cek build logs di Vercel dashboard
3. Test database connection manual
4. Buka issue di repository

---

**✅ Setelah mengikuti guide ini, production app sudah siap digunakan!**
