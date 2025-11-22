# 🚀 QUICK START - Production Admin Seed

## TL;DR
```bash
# 1. Run seed
npm run db:seed-prod-admin

# 2. Verify
bash scripts/test-admin-accounts.sh

# 3. Login & test
# noah@smawahidiyah.edu / Noah@GEMA2024!Secure
# kevin@smawahidiyah.edu / Kevin@GEMA2024!Secure
```

## 📋 What You Get

- ✅ **2 Admin Accounts** (Noah & Kevin)
- ✅ **Secure passwords** (bcrypt 12 rounds)
- ✅ **Production-ready** (safe upsert)
- ✅ **Full documentation** 

## 👥 Accounts

| Name | Email | Role | Password |
|------|-------|------|----------|
| Noah Caesar | noah@smawahidiyah.edu | SUPER_ADMIN | Noah@GEMA2024!Secure |
| Kevin Maulana | kevin@smawahidiyah.edu | ADMIN | Kevin@GEMA2024!Secure |

## 🔐 Security

⚠️ **IMPORTANT:**
1. Change passwords after first login
2. Save in password manager
3. Delete credentials file
4. Never commit to git

## 📖 Full Docs

- **Complete Guide:** `docs/PRODUCTION-ADMIN-SEED.md`
- **Credentials Ref:** `docs/PRODUCTION-ADMIN-CREDENTIALS.md`
- **Setup Summary:** `PRODUCTION_SEED_COMPLETE.md`

## 🛠️ Additional Tools

```bash
# Add new admin
bash scripts/add-admin.sh

# View database
npm run db:studio

# Test accounts
bash scripts/test-admin-accounts.sh

# Pretty summary
bash scripts/show-production-seed-summary.sh
```

---

**Need help?** Check `docs/PRODUCTION-ADMIN-SEED.md` for troubleshooting.
