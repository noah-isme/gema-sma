# ⚡ Quick Fix: Database Kosong / Data Tidak Lengkap

## 🔴 Masalah

Log Vercel menunjukkan:
```
✅ Database already seeded. Skipping...
   - 3 admins found
   - 20 students found
```

Tapi ketika diakses:
- ❌ Login gagal
- ❌ Announcements kosong
- ❌ Tutorial articles tidak ada
- ❌ Stats tidak muncul
- ❌ Semua data kosong

## 💡 Penyebab

Script `seed.ts` punya logic yang **terlalu sederhana**:

```typescript
// ❌ Logic lama (BURUK)
if (existingAdmins > 0 && existingStudents > 0) {
  return  // Skip SEMUA seeding!
}
```

Jadi kalau ada admin & student (walaupun corrupted), script langsung **skip** dan:
- ❌ Announcements tidak di-seed
- ❌ Articles tidak di-seed  
- ❌ Events tidak di-seed
- ❌ Assignments tidak di-seed
- ❌ Etc...

Plus, password hash admin/student lama kemungkinan **corrupted/berbeda**.

## ✅ Solusi: Clear dan Re-Seed Semua Data

### Option 1: Clear & Re-seed dari Lokal ⭐ **RECOMMENDED**

Ini akan **hapus semua data lama** dan seed ulang dengan data lengkap dan fresh.

#### Step 1: Copy DATABASE_URL Production

Dari Vercel Dashboard → Settings → Environment Variables:

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_wS5r8XtiTzJQ@ep-calm-salad-a1ln0go2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

#### Step 2: Run Clear & Re-seed Script

```bash
npm run db:clear-and-seed
```

Script ini akan:
1. ⚠️ **Hapus semua data existing**
2. 🔄 Reset migrations
3. 🌱 Seed admins & students (password fresh)
4. 📢 Seed announcements & events
5. 📚 Seed tutorial articles
6. 📝 Seed assignments
7. 💻 Seed coding lab tasks
8. 🗺️ Seed classroom roadmap
9. 📊 Seed student progress

**Expected Output:**
```
🗑️  Clearing database...
Database reset successful

🌱 Seeding base data...
✅ Created 2 admin accounts
✅ Created 20 student accounts
✅ Created 3 announcements
✅ Created 3 events

📚 Seeding tutorial articles...
✅ Created 12 tutorial articles

📝 Seeding assignments...
✅ Created 8 assignments

💻 Seeding Python coding lab...
✅ Created 15 coding tasks

✅ Database cleared and re-seeded successfully!

🔑 Default credentials:
   Admin:   admin.gema@smawahidiyah.edu / admin123
   Student: 2025001 / student123
```

#### Step 3: Verify Production

Buka production dan test:

**1. Login Admin:**
```
URL:      https://gema-sma-wahidiyah.vercel.app/admin
Email:    admin.gema@smawahidiyah.edu
Password: admin123
```

**2. Cek Data:**
- `/announcements` - Harus ada 3+ pengumuman ✅
- `/tutorial` - Harus ada 12+ artikel ✅
- `/admin/dashboard` - Stats harus muncul ✅

**3. Login Student:**
```
URL:        https://gema-sma-wahidiyah.vercel.app/student/login
Student ID: 2025001
Password:   student123
```

---

### Option 2: Manual Seed Satu-satu

Jika tidak mau hapus data existing:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Seed tutorial articles
npm run db:seed-tutorials

# Seed assignments  
npm run db:seed-assignments

# Seed Python lab
npm run db:seed-python-lab

# Reset passwords
npm run db:reset-admin
npm run db:reset-student
```

**Tapi ini TIDAK recommended** karena data lama mungkin conflict.

---

### Option 3: Re-deploy Vercel (Auto Seed)

Script `vercel-build.sh` sudah diupdate. Tapi karena database sudah punya data lama, auto-seed akan skip.

**Cara paksa re-seed via deploy:**

1. **Clear database manual** via Prisma Studio:
   ```bash
   export DATABASE_URL="..."
   npx prisma studio
   ```
   Hapus semua data di table Admin & Student

2. **Push trigger deploy:**
   ```bash
   git commit --allow-empty -m "trigger: re-deploy with fresh seed"
   git push origin main
   ```

Vercel akan detect database kosong dan auto-seed.

---

## 🔍 Verifikasi Data Lengkap

### Cek via Prisma Studio

```bash
export DATABASE_URL="postgresql://..."
npx prisma studio
```

Buka http://localhost:5555 dan cek:

- ✅ **Admin**: 2 records (superadmin, admin.gema)
- ✅ **Student**: 20 records (2025001-2025020)
- ✅ **Announcement**: 3+ records
- ✅ **Event**: 3+ records
- ✅ **TutorialArticle**: 12+ records
- ✅ **Assignment**: 8+ records
- ✅ **CodingTask**: 15+ records

### Cek via API Endpoints

```bash
# Announcements
curl https://gema-sma-wahidiyah.vercel.app/api/announcements

# Articles
curl https://gema-sma-wahidiyah.vercel.app/api/tutorial/articles

# Stats (butuh auth)
curl https://gema-sma-wahidiyah.vercel.app/api/stats
```

---

## 🎯 Data Lengkap Setelah Seed

### Admin Accounts (2)
```
1. superadmin@smawahidiyah.edu (SUPER_ADMIN)
2. admin.gema@smawahidiyah.edu (ADMIN)

Password: admin123 (semua)
```

### Student Accounts (20)
```
Student ID: 2025001 - 2025020
Password:   student123 (semua)

Contoh:
- 2025001: Ahmad Fauzi (XII-A)
- 2025002: Budi Santoso (XII-B)
- 2025003: Citra Dewi (XII-C)
...
```

### Content
```
- 3 Announcements (Welcome, Workshop, etc)
- 3 Events (Web Dev Workshop, dll)
- 12+ Tutorial Articles
- 8+ Assignments
- 15+ Coding Lab Tasks
- Classroom Roadmap (Complete)
- Sample Student Progress
```

---

## 🚨 Troubleshooting

### Error: "Can't reset database"

Jika `prisma migrate reset` gagal:

```bash
# Manual clear via SQL
export DATABASE_URL="..."

# Connect dan run:
npx prisma studio
# Atau
psql $DATABASE_URL

# Delete all data manually
DELETE FROM "Admin" WHERE true;
DELETE FROM "Student" WHERE true;
# ... dll
```

### Error: "Seed script not found"

Make sure di root project:
```bash
npm install  # Install deps
npm run build  # Generate Prisma client
```

### Vercel Deploy Masih Skip Seed

Karena logic di `seed.ts` sudah diupdate:

```typescript
// ✅ Logic baru (BETTER)
if (existingAdmins >= 2 && existingStudents >= 20 && 
    existingAnnouncements >= 3 && existingArticles >= 5) {
  return  // Skip only if SEMUA data lengkap
}
```

Tapi kalau tetap skip, berarti data lama masih ada. Solusinya: **clear manual** lalu re-deploy.

---

## 📋 Checklist

- [ ] `DATABASE_URL` production sudah di-set
- [ ] Backup data lama (jika perlu)
- [ ] Run `npm run db:clear-and-seed`
- [ ] Tunggu proses seeding selesai
- [ ] Test login admin ✅
- [ ] Test login student ✅
- [ ] Cek announcements muncul ✅
- [ ] Cek tutorial articles muncul ✅
- [ ] Cek stats di dashboard ✅
- [ ] Semua data lengkap ✅

---

## 💡 Prevention untuk Ke Depan

### 1. Jangan Edit Production Database Manual

Gunakan migration dan seed scripts.

### 2. Gunakan Environment Terpisah

```
- Development: Local PostgreSQL/SQLite
- Staging: Neon/Supabase staging
- Production: Neon/Supabase production
```

### 3. Backup Berkala

```bash
# Backup schema
npx prisma db pull

# Backup data (manual export via Prisma Studio)
npx prisma studio
```

### 4. Monitor Deployment Logs

```bash
vercel logs --prod | grep "Seeding"
```

---

## ✅ Expected Result

Setelah clear & re-seed:

```
✅ Login admin berhasil
✅ Login student berhasil
✅ Announcements tampil (3+)
✅ Tutorial articles tampil (12+)
✅ Events tampil (3+)
✅ Dashboard stats muncul
✅ Assignments ada
✅ Coding lab tasks ada
✅ Semua data lengkap dan fresh!
```

---

**Last Updated:** 2025-11-19  
**Status:** ✅ Tested & Working

**Next Step:** Run `npm run db:clear-and-seed` untuk fix production database!
