# 🌱 PRODUCTION SEED SETUP - COMPLETE

## ✅ Status: READY FOR PRODUCTION

Production seed data untuk akun admin telah berhasil dibuat dan siap untuk deployment.

---

## 📦 Files Created

### 1. Production Admin Seed Script
**File:** `seed/seed-production-admin.ts`
- Creates 2 admin accounts (Noah & Kevin)
- Uses bcrypt with 12 rounds for security
- Uses upsert (safe to run multiple times)

### 2. Documentation
**File:** `docs/PRODUCTION-ADMIN-SEED.md`
- Complete guide untuk production seeding
- Security best practices
- Troubleshooting tips

### 3. Credentials Reference
**File:** `docs/PRODUCTION-ADMIN-CREDENTIALS.md`
- Quick reference untuk login credentials
- Security checklist
- ⚠️ Should be deleted after saving credentials

### 4. Test Script
**File:** `scripts/test-admin-accounts.sh`
- Verify admin accounts di database
- Test database connection
- Automated verification

### 5. Add Admin Script
**File:** `scripts/add-admin.sh`
- Interactive script untuk add admin baru
- Auto-generate secure passwords
- Safe upsert operation

---

## 👥 Admin Accounts Created

### 1. Super Admin - Noah Caesar 👑
```
Email:    noah@smawahidiyah.edu
Password: Noah@GEMA2024!Secure
Role:     SUPER_ADMIN
```

### 2. Admin - Kevin Maulana 👨‍💼
```
Email:    kevin@smawahidiyah.edu
Password: Kevin@GEMA2024!Secure
Role:     ADMIN
```

---

## 🚀 How to Use

### Local Development Testing
```bash
# 1. Set DATABASE_URL (if not in .env)
export DATABASE_URL="your_database_url"

# 2. Run production seed
npm run db:seed-prod-admin

# 3. Verify accounts created
bash scripts/test-admin-accounts.sh

# 4. Test login
npm run dev
# Open: http://localhost:3000/admin/login
```

### Production Deployment
```bash
# On Vercel/production server:

# 1. Ensure DATABASE_URL is set in environment
# 2. Run seed after deployment
npm run db:seed-prod-admin

# 3. Verify accounts
bash scripts/test-admin-accounts.sh

# 4. Test login at production URL
```

---

## 🔐 Security Checklist

- [x] Passwords use bcrypt with 12 rounds
- [x] Strong password format (letters, numbers, special chars)
- [x] Credentials documented separately
- [x] Scripts use environment variables
- [x] Safe upsert operations (no duplicates)
- [ ] **TODO: Change passwords after first login**
- [ ] **TODO: Save credentials in password manager**
- [ ] **TODO: Delete PRODUCTION-ADMIN-CREDENTIALS.md after saving**

---

## 📝 NPM Scripts Available

```bash
# Run production admin seed
npm run db:seed-prod-admin

# Test admin accounts
bash scripts/test-admin-accounts.sh

# Add new admin interactively
bash scripts/add-admin.sh

# Database studio (view data)
npm run db:studio

# Reset admin password
npm run db:reset-admin
```

---

## 🔄 Next Steps

### Immediate Actions:
1. ✅ **Run seed script** - `npm run db:seed-prod-admin`
2. ✅ **Verify accounts** - Check login works
3. ⚠️ **Save credentials** - Use password manager
4. ⚠️ **Delete credentials file** - Don't commit to git

### After First Login:
1. Change both admin passwords
2. Update password manager
3. Test all admin features
4. Verify permissions correct

### Additional Setup (if needed):
1. Add more admin accounts: `bash scripts/add-admin.sh`
2. Seed students data: `npm run db:seed`
3. Seed course content: `npm run db:seed-tutorials`
4. Seed announcements: `npm run db:seed-announcements`

---

## 🛠️ Technical Details

### Password Hashing
```typescript
// Using bcryptjs with 12 rounds
const hashedPassword = await bcrypt.hash(password, 12)
```

### Upsert Strategy
```typescript
// Safe to run multiple times
await prisma.admin.upsert({
  where: { email },
  update: { password, name, role },
  create: { email, password, name, role }
})
```

### Admin Model
```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🐛 Troubleshooting

### "Cannot find module bcryptjs"
```bash
npm install bcryptjs @types/bcryptjs
```

### "Database connection failed"
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### "Admin already exists"
```bash
# Script uses upsert - it will update
# Or manually delete in Prisma Studio:
npm run db:studio
```

---

## 📊 Verification

After running seed, verify:
```bash
# 1. Check database
npm run db:studio

# 2. Or use test script
bash scripts/test-admin-accounts.sh

# Expected output:
# ✅ Both admin accounts found
# ✅ Database connection successful
```

---

## 🎯 Success Criteria

- [x] Seed script created and tested
- [x] Documentation complete
- [x] Test scripts functional
- [x] NPM scripts configured
- [x] Security best practices documented
- [ ] **Run in production**
- [ ] **Verify login works**
- [ ] **Passwords changed**

---

## 📞 Support

**Files to reference:**
- Full guide: `docs/PRODUCTION-ADMIN-SEED.md`
- Quick reference: `docs/PRODUCTION-ADMIN-CREDENTIALS.md`
- Schema: `prisma/schema.prisma`

**Scripts to use:**
- Seed: `npm run db:seed-prod-admin`
- Test: `bash scripts/test-admin-accounts.sh`
- Add admin: `bash scripts/add-admin.sh`

---

## ⚠️ CRITICAL REMINDERS

1. **CHANGE PASSWORDS** after first login
2. **DELETE** `docs/PRODUCTION-ADMIN-CREDENTIALS.md` after saving
3. **NEVER** commit credentials to git
4. **USE** password managers
5. **TEST** login before announcing to users

---

**Created:** 22 November 2024  
**Status:** ✅ Ready for Production  
**Version:** 1.0.0  
**Maintainer:** GEMA Development Team  

🎉 **Production admin seed setup complete!**
