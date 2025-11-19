# ⚡ Quick Fix: Data Tidak Muncul di Production

## 🔴 Masalah
Setelah deploy ke Vercel, aplikasi berjalan tapi **data tidak muncul** (kosong).

## ✅ Penyebab
Database production belum di-seed (kosong, hanya ada struktur tabel).

## 🚀 Solusi Cepat (3 Langkah)

### Option 1: Re-deploy Otomatis (Recommended) ⭐

Script build sudah diupdate untuk auto-seed. Cukup push ulang:

```bash
# Commit perubahan terbaru
git add .
git commit -m "fix: enable auto-seed on production deploy"
git push origin main
```

Vercel akan otomatis:
1. ✅ Run migrations
2. ✅ Seed database (jika belum ada data)
3. ✅ Build aplikasi

**Tunggu ~3-5 menit**, lalu cek aplikasi. Data seharusnya sudah muncul!

---

### Option 2: Manual Seed dari Lokal 🔧

Jika option 1 gagal, seed manual dari komputer lokal:

#### Step 1: Copy DATABASE_URL Production

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **gema-sma**
3. Settings → Environment Variables
4. Copy value `DATABASE_URL`

#### Step 2: Set Environment Variable

```bash
# Linux/Mac
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Windows CMD
set DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Windows PowerShell
$env:DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

#### Step 3: Run Seed Script

```bash
# Otomatis (dengan konfirmasi)
npm run db:seed-prod

# Atau manual
npx tsx seed/seed.ts
```

Output yang benar:
```
🌱 Starting database seed...
👨‍💼 Creating admin accounts...
✅ Created 2 admin accounts
👨‍🎓 Creating student accounts...
✅ Created 20 student accounts
📢 Creating announcements...
✅ Created 3 announcements
...
```

---

### Option 3: Vercel CLI Deploy 🚢

Deploy langsung dengan Vercel CLI:

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login
vercel login

# Deploy production
vercel --prod
```

---

## ✅ Verifikasi Data Sudah Ada

### 1. Test Login Admin

Buka: `https://gema-sma-wahidiyah.vercel.app/admin`

```
Email:    admin.gema@smawahidiyah.edu
Password: admin123
```

Jika berhasil login → **Data sudah ada!** ✅

### 2. Test Login Student

Buka: `https://gema-sma-wahidiyah.vercel.app/student/login`

```
Student ID: 2025001
Password:   student123
```

### 3. Cek Announcements

Buka: `https://gema-sma-wahidiyah.vercel.app/announcements`

Harus ada 3 pengumuman default.

### 4. Cek Tutorial

Buka: `https://gema-sma-wahidiyah.vercel.app/tutorial`

Harus ada artikel tutorial.

---

## 🔍 Troubleshooting

### Error: "Can't reach database server"

**Solusi:**
1. Cek `DATABASE_URL` di Vercel benar
2. Database Neon/Supabase masih aktif
3. Connection string format benar:
   ```
   postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   ```

### Error: "Already seeded. Skipping..."

Artinya data **sudah ada**. Cek lagi di browser:
- Clear cache (Ctrl+Shift+R)
- Coba incognito mode
- Cek endpoint API: `/api/announcements`

### Data Muncul Sebentar Lalu Hilang

**Penyebab:** Database free tier mungkin ter-reset.

**Solusi:**
- Upgrade Neon/Supabase ke paid plan
- Atau re-seed berkala
- Atau ganti ke database provider lain

### Build Success tapi 500 Error

**Cek Logs:**
```bash
vercel logs --prod
```

Biasanya issue:
- `DATABASE_URL` tidak di-set
- `NEXTAUTH_SECRET` missing
- Database tidak reachable

---

## 📝 Checklist

Pastikan semua sudah OK:

- [ ] `DATABASE_URL` di-set di Vercel
- [ ] Database Neon/Supabase aktif
- [ ] Deploy sukses tanpa error
- [ ] Seed berhasil (cek logs)
- [ ] Login admin berhasil ✅
- [ ] Login student berhasil ✅
- [ ] Data muncul di halaman ✅

---

## 🎯 Data Default Setelah Seed

### Admin Accounts
```
1. superadmin@smawahidiyah.edu  / admin123  (Super Admin)
2. admin.gema@smawahidiyah.edu / admin123  (Admin)
```

### Student Accounts
```
Student ID: 2025001 - 2025020
Password:   student123 (semua)
```

### Sample Data
- ✅ 3 Announcements
- ✅ 3 Events
- ✅ Tutorial Articles
- ✅ Coding Lab Challenges
- ✅ Sample Assignments

---

## 🆘 Masih Gagal?

1. **Cek Deployment Logs:**
   ```bash
   vercel logs --prod
   ```

2. **Cek Database dengan Prisma Studio:**
   ```bash
   export DATABASE_URL="..."
   npx prisma studio
   ```
   Buka http://localhost:5555 dan cek isi tabel.

3. **Force Re-deploy:**
   ```bash
   npm run vercel:force-deploy
   ```

4. **Contact Support:**
   - Buka issue di GitHub repository
   - Attach logs dan error message

---

## ✅ Success!

Jika login admin/student berhasil dan data muncul, selamat! 🎉

Production app sudah **siap digunakan**.

**Next steps:**
- Upload foto gallery di admin panel
- Buat pengumuman baru
- Atur user permissions
- Monitor dengan Vercel Analytics

---

**Last updated:** 2025-11-19
**Status:** ✅ Tested & Working
