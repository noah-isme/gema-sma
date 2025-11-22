# Student Authentication & Security Flow

## 🔐 Security Summary

Dashboard dan menu student **HANYA** bisa diakses oleh student yang:
1. ✅ Sudah **terdaftar** di database
2. ✅ Status akun **ACTIVE**
3. ✅ Memiliki **session valid** (login dalam 24 jam terakhir)

## 📋 Complete Flow

### 1. Registrasi (Pertama Kali)
```
User → /student/register
  ↓
Fill form (NIS, nama, email, password, dll)
  ↓
POST /api/auth/register
  ↓
✅ Password di-hash dengan bcrypt
✅ Status default: 'active'
✅ Data tersimpan ke database
  ↓
Redirect ke /student/login
```

### 2. Login
```
User → /student/login
  ↓
Input: studentId/username + password
  ↓
POST /api/auth/student-login
  ↓
Database Check:
  - Student exists? (by studentId OR username)
  - Status = 'active'?
  - Password match? (bcrypt verify)
  ↓
✅ BERHASIL:
  - Update lastLoginAt
  - Return student data
  - Save session to localStorage (24 jam)
  - Redirect ke dashboard
  ↓
❌ GAGAL:
  - Return 401 Unauthorized
  - Show error message
```

### 3. Session Management
```javascript
// File: src/lib/student-auth.ts

interface StudentSession {
  id: string              // Internal DB ID
  studentId: string       // NIS/Student ID
  fullName: string
  class: string
  email: string
  loginTime: number      // Timestamp
}

// Storage: localStorage key 'gema-student-session'
// Duration: 24 hours
// Auto-clear: Jika expired atau logout
```

### 4. Access Protection - StudentLayout
```
User buka halaman student (dashboard, assignments, dll)
  ↓
StudentLayout mount
  ↓
Check 1: Session di localStorage
  - Tidak ada? → Redirect /student/login
  - Ada tapi expired? → Clear session, redirect /student/login
  ↓
Check 2: Verify di database
  GET /api/student/profile?studentId={studentId}
  ↓
✅ Student ditemukan (200):
  - Load layout
  - Show navigation
  - Render page content
  ↓
❌ Student tidak ditemukan (404):
  - Alert: "Akun tidak ditemukan. Silakan daftar."
  - Clear session
  - Redirect /student/register
  ↓
❌ Server error (500):
  - Alert: "Gagal verifikasi akun. Login kembali."
  - Clear session
  - Redirect /student/login
```

### 5. Dashboard Data Protection
```
Dashboard page mount
  ↓
Fetch dashboard stats
  GET /api/student/dashboard?studentId={studentId}
  ↓
✅ Student ditemukan (200):
  - Return complete stats
  - Show progress, streak, engagement, etc
  ↓
❌ Student tidak ditemukan (404):
  - Alert: "Akun tidak ditemukan. Silakan daftar."
  - Clear session
  - Redirect /student/register
  ↓
❌ Server error (500):
  - Alert: "Terjadi kesalahan. Login kembali."
  - Clear session
  - Redirect /student/login
```

## 🚨 Security Checkpoints

| Checkpoint | Location | Action if Failed |
|------------|----------|------------------|
| Registration | `/api/auth/register` | Block & show error |
| Login | `/api/auth/student-login` | Return 401 Unauthorized |
| Session Check | `StudentLayout` → localStorage | Redirect to `/student/login` |
| Database Verify | `StudentLayout` → API | Redirect to `/student/register` or `/student/login` |
| Data Fetch | Dashboard → `/api/student/dashboard` | Redirect to `/student/register` |

## 🔧 Implementation Details

### Files Modified:
1. **src/components/student/StudentLayout.tsx**
   - Added database verification on mount
   - Double-check: session + database
   - Clear session jika student tidak ditemukan

2. **src/app/student/dashboard-simple/page.tsx**
   - Added 404 handling in fetchDashboardStats
   - Redirect to registration jika student tidak ada
   - Clear session untuk prevent loop

3. **src/components/student/PlayfulTourGuide.tsx**
   - Fixed: hasSeenTutorial default to `false`
   - Tour auto-start untuk akun baru (setelah verified)

### API Endpoints Used:
- `POST /api/auth/student-login` - Login verification
- `GET /api/student/profile` - Student existence check
- `GET /api/student/dashboard` - Dashboard stats (requires registered student)

## ✅ Testing Scenarios

### Scenario 1: Student Baru (Belum Daftar)
```
1. Akses /student/dashboard
   → Redirect ke /student/login (no session)

2. Coba login dengan akun random
   → Error: "Student not found" (401)

3. Daftar di /student/register
   → Success, data masuk DB

4. Login dengan akun baru
   → Success, dapat session

5. Akses dashboard
   → Success, tour tooltip muncul otomatis
```

### Scenario 2: Student Lama (Sudah Terdaftar)
```
1. Login dengan akun existing
   → Success, dapat session

2. Akses dashboard
   → Success, load stats lengkap

3. Tour tooltip
   → Tidak muncul (sudah pernah lihat)
   → Bisa klik "Ulang panduan" untuk replay
```

### Scenario 3: Student Dihapus dari Database
```
1. Student login (punya session valid)

2. Admin hapus student dari database

3. Student refresh dashboard
   → StudentLayout verify ke DB
   → 404 Not Found
   → Alert + clear session
   → Redirect ke /student/register
```

### Scenario 4: Session Expired
```
1. Student login

2. Tunggu 24+ jam (atau manual clear localStorage)

3. Akses dashboard
   → Session check failed
   → Redirect ke /student/login
```

## 🎯 Benefits

1. ✅ **No Unauthorized Access** - Student harus terdaftar di DB
2. ✅ **No Ghost Sessions** - Session di-verify ulang vs database
3. ✅ **Clear Error Messages** - User tahu harus daftar atau login
4. ✅ **Graceful Handling** - Tidak crash, smooth redirect
5. ✅ **Tour Auto-Start** - Akun baru langsung dapat panduan

## �� Notes

- Session berlaku 24 jam, auto-clear jika expired
- Password di-hash dengan bcrypt (tidak pernah plain text)
- Status 'active' required untuk login
- StudentLayout melindungi SEMUA halaman student (dashboard, assignments, labs, dll)
- Jika student dihapus dari DB saat punya session → auto logout + redirect register

---

**Last Updated:** 2025-01-22  
**Status:** ✅ Fully Implemented & Tested
