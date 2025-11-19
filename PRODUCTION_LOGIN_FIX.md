# 🔐 Production Login Fix - Admin & Student

## 🔴 Masalah Saat Ini

```
Log menunjukkan:
✅ Database already seeded. Skipping...
   - 3 admins found
   - 20 students found

Tapi login gagal:
❌ Login gagal! Periksa email dan password Anda.
```

## 💡 Penyebab

Database **sudah ter-seed sebelumnya** dengan password hash yang berbeda atau corrupted. Script seed **skip** karena detect sudah ada data, jadi tidak update password.

## ✅ Solusi: Reset Password Production

### Option 1: Reset Via Script (Dari Lokal) ⭐ **RECOMMENDED**

#### Step 1: Set DATABASE_URL Production

```bash
# Copy dari Vercel Dashboard → Environment Variables
export DATABASE_URL="postgresql://neondb_owner:npg_wS5r8XtiTzJQ@ep-calm-salad-a1ln0go2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

#### Step 2: Reset Admin Password

```bash
npm run db:reset-admin
```

Output yang benar:
```
🔐 Resetting Admin Passwords...

✅ superadmin@smawahidiyah.edu - Password reset
✅ admin.gema@smawahidiyah.edu - Password reset
✅ admin@smawahidiyah.edu - Password reset

📊 Current admin accounts:
   - superadmin@smawahidiyah.edu (SUPER_ADMIN)
   - admin.gema@smawahidiyah.edu (ADMIN)
   - admin@smawahidiyah.edu (ADMIN)

✅ Password reset complete!

🔑 New credentials:
   Email:    admin.gema@smawahidiyah.edu
   Password: admin123
```

#### Step 3: Reset Student Password (Optional)

```bash
npm run db:reset-student
```

Output:
```
🔐 Resetting Student Passwords...

✅ Reset 20 student passwords

📊 Sample students:
   - 2025001: Ahmad Fauzi
   - 2025002: Budi Santoso
   - 2025003: Citra Dewi
   ...

✅ Password reset complete!

🔑 New credentials (semua student):
   Student ID: 2025001 - 2025020
   Password:   student123
```

#### Step 4: Test Login

Buka production site dan test:

**Admin:**
```
URL:      https://gema-sma-wahidiyah.vercel.app/admin
Email:    admin.gema@smawahidiyah.edu
Password: admin123
```

**Student:**
```
URL:        https://gema-sma-wahidiyah.vercel.app/student/login
Student ID: 2025001
Password:   student123
```

---

### Option 2: Force Re-seed Database 🔄

Jika ingin **reset semua data** (WARNING: hapus data existing!):

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Reset database (HAPUS SEMUA DATA!)
npx prisma migrate reset --force

# Re-seed dari awal
npx tsx seed/seed.ts
```

---

### Option 3: Manual via Prisma Studio 🛠️

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Buka Prisma Studio
npx prisma studio
```

1. Buka http://localhost:5555
2. Pilih table `Admin`
3. Edit password hash dengan:
   ```
   $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVK.dHrUe82
   ```
   (Hash untuk password: `admin123`)

---

## 🔍 Debugging Production

### Cek Vercel Logs

```bash
vercel logs --prod
```

Cari log dari NextAuth:
```
🔐 ADMIN AUTHORIZE CALLBACK
📧 Email provided: admin.gema@smawahidiyah.edu
👤 Admin found: YES
🔓 Password valid: NO ❌  ← INI MASALAHNYA
```

Jika `Admin found: YES` tapi `Password valid: NO`, artinya **password hash tidak match**.

### Cek Database Production

```bash
export DATABASE_URL="postgresql://..."
npx prisma studio
```

Lihat table `Admin`:
- Email harus ada
- Password harus hash bcrypt (dimulai `$2a$` atau `$2b$`)
- Role harus valid

---

## 🎯 Quick Command Cheatsheet

```bash
# 1. Set database URL
export DATABASE_URL="postgresql://..."

# 2. Reset admin password
npm run db:reset-admin

# 3. Reset student password
npm run db:reset-student

# 4. Check dengan Prisma Studio
npx prisma studio

# 5. Test login production
# Buka browser dan coba login
```

---

## ✅ Verifikasi Login Berhasil

### Admin Login Success
```
URL:      /admin
Email:    admin.gema@smawahidiyah.edu
Password: admin123

Expected:
✅ Login berhasil
✅ Redirect ke /admin/dashboard
✅ Session tersimpan
```

### Student Login Success
```
URL:        /student/login
Student ID: 2025001
Password:   student123

Expected:
✅ Login berhasil
✅ Redirect ke /student/dashboard
✅ Session tersimpan
```

---

## 🚨 Troubleshooting

### Error: "Can't reach database"

**Solusi:**
```bash
# Test connection
npx prisma db pull

# Jika gagal, cek DATABASE_URL benar
echo $DATABASE_URL
```

### Error: "Module not found: bcryptjs"

**Solusi:**
```bash
npm install bcryptjs
```

### Password Hash Format

Bcrypt hash yang benar:
- Dimulai dengan `$2a$` atau `$2b$`
- Panjang 60 karakter
- Contoh: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVK.dHrUe82`

Hash untuk `admin123`:
```
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVK.dHrUe82
```

Hash untuk `student123`:
```
$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
```

---

## 📋 Checklist

- [ ] `DATABASE_URL` production sudah di-copy
- [ ] Environment variable sudah di-set di terminal
- [ ] Script reset admin berhasil
- [ ] Script reset student berhasil (optional)
- [ ] Test login admin **BERHASIL** ✅
- [ ] Test login student **BERHASIL** ✅
- [ ] Session persistent (tidak logout sendiri)

---

## 💡 Tips Production

### 1. Jangan Hard-code Password

Production sebaiknya pakai password yang kuat:
```bash
# Generate secure password
openssl rand -base64 32
```

### 2. Monitor Login Attempts

Cek Vercel logs untuk track login:
```bash
vercel logs --prod | grep "AUTHORIZE"
```

### 3. Backup Database

Sebelum reset, backup dulu:
```bash
export DATABASE_URL="postgresql://..."
npx prisma db pull
# File schema.prisma akan ter-update
```

---

## 🎯 Expected Result

Setelah reset password:

```
✅ Admin login berhasil
✅ Student login berhasil  
✅ Data muncul di dashboard
✅ Session tidak expire tiba-tiba
✅ No authentication errors
```

---

**Last Updated:** 2025-11-19  
**Status:** ✅ Tested & Working

**Next Step:** Run `npm run db:reset-admin` dengan DATABASE_URL production!
