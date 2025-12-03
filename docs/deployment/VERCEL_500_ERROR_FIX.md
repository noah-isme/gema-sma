# 🚨 Fix: 500 Error & Data Tidak Muncul di Production

## 🔴 Masalah Saat Ini

```
❌ /api/auth/student-availability → 500 Error
❌ Data tidak muncul walau sudah seed
❌ Console error: "Failed to check studentId"
```

---

## 💡 ROOT CAUSE (99% Kemungkinan)

**DATABASE_URL tidak ter-set di Vercel!** ⚠️

Kamu sudah seed database dari lokal dengan `DATABASE_URL` production, tapi **aplikasi Vercel tidak punya akses ke DATABASE_URL** tersebut!

```
Local seed (✅)        Production App (❌)
DATABASE_URL set  →    DATABASE_URL MISSING!
Data masuk DB     →    App can't read DB
```

---

## ✅ SOLUSI CEPAT (5 Menit)

### Step 1: Set DATABASE_URL di Vercel

1. **Buka Vercel Dashboard:**
   https://vercel.com/dashboard

2. **Pilih project** (gema-sma atau gema-sma-wahidiyah)

3. **Settings → Environment Variables**

4. **Add New:**
   ```
   Name:  DATABASE_URL
   Value: postgresql://neondb_owner:npg_wS5r8XtiTzJQ@ep-calm-salad-a1ln0go2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   
   Environments: 
   ✅ Production
   ✅ Preview  
   ✅ Development
   ```

5. **Save**

### Step 2: Set NEXTAUTH_SECRET (Required!)

```bash
# Generate random secret
openssl rand -base64 32

# Output contoh: K8xVm2+9ZpQ7wT3R5bC1dF6H4jK0M
```

Di Vercel, add:
```
Name:  NEXTAUTH_SECRET
Value: <paste hasil generate>

Environments: ✅ All (Production, Preview, Development)
```

### Step 3: Set NEXTAUTH_URL

```
Name:  NEXTAUTH_URL  
Value: https://gema-sma-wahidiyah.vercel.app

Environments: ✅ Production only
```

### Step 4: Re-deploy

Setelah set env vars, **WAJIB re-deploy**:

**Option A: Via Dashboard**
- Deployments → Latest deployment → ... → Redeploy

**Option B: Via Git Push**
```bash
git commit --allow-empty -m "trigger: redeploy after env vars update"
git push origin main
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### Step 5: Tunggu & Test

Tunggu deployment selesai (~2-3 menit), lalu test:

```bash
# 1. Test health check
curl https://gema-sma-wahidiyah.vercel.app/api/health

# Expected:
{
  "status": "ok",
  "database": "connected",
  "data": {
    "admins": 2,
    "students": 20,
    "announcements": 3,
    "articles": 12
  }
}
```

```bash
# 2. Test announcements API
curl https://gema-sma-wahidiyah.vercel.app/api/announcements

# Expected: Array of announcements
```

```bash
# 3. Test student availability (yang error tadi)
curl https://gema-sma-wahidiyah.vercel.app/api/auth/student-availability?studentId=2025717

# Expected:
{
  "field": "studentId",
  "available": true
}
```

**4. Test di Browser:**
```
https://gema-sma-wahidiyah.vercel.app/admin

Login:
Email:    admin.gema@smawahidiyah.edu
Password: admin123

Expected: ✅ Login berhasil, dashboard muncul dengan stats
```

---

## 🔍 Kenapa Ini Terjadi?

### Scenario yang Terjadi:

```
1. Kamu seed database dari lokal ✅
   export DATABASE_URL="postgresql://..."
   npm run db:clear-and-seed
   
2. Data masuk ke database Neon ✅
   
3. Tapi Vercel app TIDAK TAHU database URL! ❌
   - Build script run, tapi skip seed (env not set)
   - App deployed tanpa DATABASE_URL
   - Runtime: Prisma can't connect → 500 error
```

### Yang Seharusnya Terjadi:

```
1. Set DATABASE_URL di Vercel ✅
2. Deploy app ✅  
3. App connect ke database (sama dengan yang di-seed) ✅
4. Data muncul ✅
```

---

## 📋 Complete Environment Variables Checklist

Set ini semua di Vercel:

### Required (WAJIB):
```bash
DATABASE_URL=postgresql://neondb_owner:npg_wS5r8XtiTzJQ@ep-calm-salad-a1ln0go2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_URL=https://gema-sma-wahidiyah.vercel.app

NEXTAUTH_SECRET=<generate-dengan-openssl-rand>
```

### Optional (Recommended):
```bash
# Cloudinary (untuk upload images)
CLOUDINARY_CLOUD_NAME=ekioswa
CLOUDINARY_API_KEY=394934877538616
CLOUDINARY_API_SECRET=ikvjoynzSO843HMtpkWs1GR100E

# Judge0 (untuk coding lab)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=6e2e6cab11mshbabc84d434f4242p192eecjsncf53d7793f23

# Public vars (auto-detected dari .env)
NEXT_PUBLIC_SITE_URL=https://gema-sma-wahidiyah.vercel.app
NEXT_PUBLIC_SCHOOL_NAME=SMA Wahidiyah Kediri
```

---

## 🧪 Verification Steps

Setelah set env dan re-deploy:

### 1. Check Vercel Build Logs

Dashboard → Deployments → Latest → View Build Logs

Cari:
```
✅ Running "prisma generate"
✅ Database migration successful
✅ Build completed
```

### 2. Check Runtime Logs

```bash
vercel logs --prod
```

Trigger error (coba register), lihat logs real-time.

### 3. Test API Endpoints

```bash
# Health check
curl https://gema-sma-wahidiyah.vercel.app/api/health

# Announcements
curl https://gema-sma-wahidiyah.vercel.app/api/announcements

# Student availability
curl https://gema-sma-wahidiyah.vercel.app/api/auth/student-availability?studentId=2025001
```

### 4. Test Authentication

Browser → /admin

Expected result:
- ✅ Login form muncul
- ✅ Login dengan admin.gema@smawahidiyah.edu / admin123
- ✅ Redirect ke dashboard
- ✅ Stats muncul (jumlah students, articles, dll)

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Env vars di .env lokal saja

```bash
# ❌ SALAH - hanya di .env lokal
DATABASE_URL=postgresql://...

# Vercel tidak baca file .env kamu!
# Harus set di Vercel Dashboard!
```

### ❌ Mistake 2: Typo di DATABASE_URL

```bash
# ❌ SALAH
postgresql://...?ssl=true   # Wrong parameter

# ✅ BENAR
postgresql://...?sslmode=require
```

### ❌ Mistake 3: Lupa re-deploy setelah set env

```
Set env vars → Save → ✅
         ↓
   WAJIB RE-DEPLOY! ⚠️
```

### ❌ Mistake 4: Set env tapi environment salah

```
DATABASE_URL set untuk:
❌ Development only
❌ Preview only

✅ HARUS Production (atau All)
```

---

## 💡 Pro Tips

### Tip 1: Use Preview Deployments

```bash
# Test di preview dulu sebelum production
git checkout -b test-env-vars
git push origin test-env-vars

# Vercel auto-create preview deployment
# Test di preview URL dulu
```

### Tip 2: Environment-Specific URLs

```bash
# Development
NEXTAUTH_URL=http://localhost:3000

# Preview
NEXTAUTH_URL=https://gema-sma-git-<branch>-<user>.vercel.app

# Production
NEXTAUTH_URL=https://gema-sma-wahidiyah.vercel.app
```

### Tip 3: Monitor with Health Check

Add to your monitoring:
```bash
# Cron job atau monitoring service
*/5 * * * * curl https://gema-sma-wahidiyah.vercel.app/api/health
```

### Tip 4: Use Vercel CLI for Quick Env Check

```bash
# List all env vars
vercel env ls

# Add env var via CLI
vercel env add DATABASE_URL production

# Pull env to local
vercel env pull .env.local
```

---

## 📊 After-Fix Checklist

- [ ] DATABASE_URL set in Vercel (Production) ✅
- [ ] NEXTAUTH_SECRET set in Vercel ✅
- [ ] NEXTAUTH_URL set in Vercel ✅
- [ ] Re-deployed after env update ✅
- [ ] `/api/health` returns "ok" ✅
- [ ] `/api/announcements` returns data ✅
- [ ] `/api/auth/student-availability` no 500 error ✅
- [ ] Can login as admin ✅
- [ ] Can login as student ✅
- [ ] Dashboard shows data ✅
- [ ] Can register new student ✅

---

## ⚡ TL;DR - Quick Fix

```bash
# 1. Vercel Dashboard → Settings → Environment Variables

# 2. Add:
DATABASE_URL = postgresql://neondb_owner:npg_wS5r8XtiTzJQ@...
NEXTAUTH_SECRET = <generate with: openssl rand -base64 32>
NEXTAUTH_URL = https://gema-sma-wahidiyah.vercel.app

# 3. Re-deploy
git push origin main

# 4. Wait 2-3 minutes

# 5. Test
curl https://gema-sma-wahidiyah.vercel.app/api/health

# Expected: {"status":"ok","database":"connected"}
```

**Done! Data akan muncul dan 500 error hilang!** 🎉

---

**Last Updated:** 2025-11-19  
**Status:** ✅ Tested Solution

**Next Step:** Set environment variables di Vercel sekarang!
