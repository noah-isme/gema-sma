# 🌱 Production Seed Data - Admin Accounts

## 📋 Overview
Dokumentasi ini menjelaskan cara seeding data admin untuk production environment GEMA SMA Wahidiyah.

## 👥 Admin Accounts Created

### 1. Super Admin - Noah Caesar
- **Email:** `noah@smawahidiyah.edu`
- **Password:** `Noah@GEMA2024!Secure`
- **Role:** `SUPER_ADMIN`
- **Permissions:** Full access to all features

### 2. Admin - Kevin Maulana
- **Email:** `kevin@smawahidiyah.edu`
- **Password:** `Kevin@GEMA2024!Secure`
- **Role:** `ADMIN`
- **Permissions:** Standard admin access

## 🚀 How to Run Production Seed

### Method 1: Using NPM Script (Recommended)
```bash
npm run db:seed-prod-admin
```

### Method 2: Direct Execution
```bash
npx tsx seed/seed-production-admin.ts
```

### Method 3: With Environment Variables
```bash
# Set DATABASE_URL first
export DATABASE_URL="your_production_database_url"
npm run db:seed-prod-admin
```

## 🔐 Security Best Practices

### 1. **Change Passwords Immediately**
Setelah deployment pertama kali, segera ubah password default:
```
1. Login dengan credentials di atas
2. Pergi ke Profile Settings
3. Change Password
4. Use strong, unique password (min 12 characters)
```

### 2. **Password Requirements**
- Minimal 12 karakter
- Kombinasi huruf besar dan kecil
- Minimal 1 angka
- Minimal 1 karakter spesial
- Jangan gunakan password yang sama dengan akun lain

### 3. **Recommended Password Managers**
- **Bitwarden** (Open source, recommended)
- **1Password** (Paid, team features)
- **LastPass** (Free tier available)
- **KeePassXC** (Offline, self-hosted)

### 4. **Environment Security**
```bash
# ❌ NEVER do this:
git add .env
git commit -m "add env file"

# ✅ DO this instead:
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 5. **Database URL Security**
```bash
# Store in Vercel dashboard, not in code:
# Vercel Dashboard > Project > Settings > Environment Variables
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
```

## 📊 Verification Steps

### 1. Check if Admin Accounts Created
```bash
# Using Prisma Studio
npm run db:studio

# Or direct query
npx prisma db execute --stdin <<EOF
SELECT id, email, name, role, created_at FROM admins;
EOF
```

### 2. Test Login
```bash
# Local development
http://localhost:3000/admin/login

# Production
https://gema.smawahidiyah.edu/admin/login
```

### 3. Verify Permissions
- [ ] Can access admin dashboard
- [ ] Can view all students
- [ ] Can manage content
- [ ] Can view analytics
- [ ] Super admin has additional features

## 🔄 Re-run Seed Data

Jika perlu re-run seed (misalnya reset password):
```bash
# Will update existing records with new passwords
npm run db:seed-prod-admin
```

Script menggunakan `upsert`, jadi aman untuk dijalankan berulang kali.

## 🛠️ Troubleshooting

### Problem: "Cannot find module 'bcryptjs'"
```bash
# Solution:
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### Problem: "Database connection failed"
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### Problem: "Admin already exists"
```bash
# Script uses upsert, it will update existing admin
# If you want to delete first:
npx prisma studio
# Delete admins manually, then re-run seed
```

### Problem: "Password hash failed"
```bash
# Check bcrypt installation
npm list bcryptjs

# Reinstall if needed
npm uninstall bcryptjs
npm install bcryptjs
```

## 📝 Admin Model Schema

```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcrypt (12 rounds)
  name      String
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("admins")
}
```

## 🎯 Next Steps After Seeding

1. **✅ Verify Admin Login**
   - Test login dengan kedua akun
   - Verify permissions sesuai role

2. **🔐 Update Passwords**
   - Change default passwords
   - Save in password manager
   - Share securely with team

3. **👥 Add More Admins (Optional)**
   - Buat akun untuk admin lain jika perlu
   - Set appropriate roles
   - Follow security best practices

4. **📊 Seed Additional Data**
   - Students data
   - Courses and modules
   - Announcements
   - Articles

5. **🚀 Production Deployment**
   - Run seed on production database
   - Test all features
   - Monitor logs for errors

## 🔗 Related Scripts

- **Reset Admin Password:** `npm run db:reset-admin`
- **Full Production Seed:** `npm run db:seed-prod`
- **Database Studio:** `npm run db:studio`
- **Database Push:** `npm run db:push`

## 📞 Support

Jika ada masalah dengan seeding atau admin accounts:
1. Check logs di terminal
2. Verify DATABASE_URL
3. Test database connection
4. Review error messages
5. Contact development team

## 🎉 Success Indicators

Setelah seeding berhasil, Anda akan melihat:
```
🌱 Starting production admin seed...

👨‍💼 Creating admin accounts for production...
✅ Created/Updated Super Admin: Noah Caesar (noah@smawahidiyah.edu)
   ID: clxxxx...
   Role: SUPER_ADMIN

✅ Created/Updated Admin: Kevin Maulana (kevin@smawahidiyah.edu)
   ID: clxxxx...
   Role: ADMIN

📋 PRODUCTION LOGIN CREDENTIALS:
================================

👑 SUPER ADMIN - Noah Caesar:
   Email: noah@smawahidiyah.edu
   Password: Noah@GEMA2024!Secure
   Role: SUPER_ADMIN

👨‍💼 ADMIN - Kevin Maulana:
   Email: kevin@smawahidiyah.edu
   Password: Kevin@GEMA2024!Secure
   Role: ADMIN

✅ Production admin seed completed successfully!
```

## ⚠️ CRITICAL SECURITY REMINDERS

1. **NEVER** commit credentials to git
2. **ALWAYS** use environment variables for secrets
3. **CHANGE** default passwords immediately
4. **USE** password managers
5. **ENABLE** 2FA when available
6. **AUDIT** access logs regularly
7. **ROTATE** passwords every 90 days
8. **LIMIT** super admin access to necessary personnel only

---

**Last Updated:** 22 November 2024  
**Version:** 1.0.0  
**Maintainer:** GEMA Development Team
