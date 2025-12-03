# 🚀 Quick Reference - Production Issues

## ⚠️ Known Non-Critical Errors (Safe to Ignore)

### 1. Tutorial Prompts API (500 Error)
```
GET /api/tutorial/prompts?status=all → 500 Error
```

**Status:** Feature not yet implemented  
**Impact:** ❌ Low - Optional AI feature  
**Solution:** API stub added, returns empty array  
**User Impact:** None - frontend handles gracefully

### 2. Activities Routes (404 Error)
```
GET /activities/[id] → 404 Not Found
```

**Status:** Feature planned but not implemented  
**Impact:** ❌ Low - Prefetch only, not user-facing  
**Solution:** Will implement in future updates  
**User Impact:** None - only affects link prefetching

---

## ✅ Production Data Status

### What's Working:
- ✅ Admin login
- ✅ Student login
- ✅ Announcements (3+)
- ✅ Events (4+)
- ✅ Base tutorial articles
- ✅ Assignments
- ✅ Python coding tasks
- ✅ Gallery
- ✅ Quizzes

### What Might Be Missing:

Check these manually:

```bash
# 1. Tutorial articles count
curl https://www.gema-sma.tech/api/tutorial/articles | jq '.data | length'

# 2. Announcements
curl https://www.gema-sma.tech/api/announcements | jq '.data | length'

# 3. Health check
curl https://www.gema-sma.tech/api/health
```

Expected:
- Articles: 12+
- Announcements: 3+
- Health: "status": "ok"

---

## 🔧 Quick Fixes

### If Data Still Missing:

**Option 1: Re-seed from Local (Safe)**
```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Clear and re-seed
npm run db:clear-and-seed
```

**Option 2: Trigger Re-deploy**
```bash
# Empty commit to trigger Vercel rebuild
git commit --allow-empty -m "trigger: re-seed production data"
git push origin main
```

**Option 3: Manual Seed Individual Scripts**
```bash
export DATABASE_URL="postgresql://..."

# Seed articles
npm run db:seed-tutorials

# Seed assignments
npx tsx seed/seed-realistic-assignments.ts

# Seed Python lab
npm run db:seed-python-lab
```

---

## 📊 Verify What Data Exists

### Via API:
```bash
# Health check (shows counts)
curl https://www.gema-sma.tech/api/health

# Announcements
curl https://www.gema-sma.tech/api/announcements

# Articles
curl https://www.gema-sma.tech/api/tutorial/articles
```

### Via Prisma Studio:
```bash
export DATABASE_URL="postgresql://..."
npx prisma studio
```

Open http://localhost:5555 and check each table.

---

## 🐛 Debug Console Errors

### Safe to Ignore:
```
❌ /api/tutorial/prompts → 500 (AI feature, not critical)
❌ /activities/[id] → 404 (prefetch only, not user-facing)
```

### Need to Fix:
```
❌ /api/announcements → 500 (critical!)
❌ /api/tutorial/articles → 500 (critical!)
❌ Any authentication errors
```

If you see critical errors, check:
1. DATABASE_URL set in Vercel
2. NEXTAUTH_SECRET set
3. Prisma engine properly bundled

---

## 📝 Data Missing Checklist

If data not showing, check:

- [ ] /api/health returns "ok"
- [ ] /api/announcements returns array
- [ ] /api/tutorial/articles returns array
- [ ] Can login as admin
- [ ] Can login as student
- [ ] Dashboard shows stats

If any fails:
```bash
# Check Vercel logs
vercel logs --prod | grep ERROR

# Re-seed
npm run db:clear-and-seed
```

---

## ✅ Expected Production State

After all fixes:

```json
{
  "database": "connected",
  "data": {
    "admins": 2,
    "students": 20,
    "announcements": 3+,
    "events": 4+,
    "articles": 12+,
    "assignments": 5+,
    "pythonCodingTasks": 5+,
    "gallery": 4+,
    "quizzes": 2
  }
}
```

All core features should work!

---

**Last Updated:** 2025-11-19  
**Status:** Production Stable

**Minor Issues:** 2 non-critical API stubs  
**Core Features:** ✅ All Working
