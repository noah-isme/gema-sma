# 🚀 Production Seed Data - Quick Reference

**Quick commands dan overview untuk seed data production GEMA SMA.**

---

## ⚡ Quick Commands

```bash
# Run ALL seeds (recommended for fresh database)
npm run prod:seed-all

# Individual seeds (if needed)
npm run prod:seed-admin          # 2 admin accounts
npm run prod:seed-gallery        # 5 images
npm run prod:seed-prompts        # 3 prompts
npm run prod:seed-announcements  # 3 announcements
npm run prod:seed-events         # 3 events
npm run prod:seed-articles       # 4 curriculum articles
npm run prod:seed-weblabs        # 3 web assignments
npm run prod:seed-codinglabs     # 8 coding exercises
npm run prod:seed-extracourse    # 86 lessons (14 modules)
npm run prod:seed-news           # 3 news articles
```

---

## 📊 What Gets Seeded?

| Category | Count | Details |
|----------|-------|---------|
| 👤 **Admins** | 2 | Noah (SUPER_ADMIN), Kevin (ADMIN) |
| 🖼️ **Gallery** | 5 | Activity photos |
| 📝 **Prompts** | 3 | Web portfolio tutorials |
| 📢 **Announcements** | 3 | GEMA program info |
| 📅 **Events** | 3 | Weekly ekstra + workshops |
| 📖 **Curriculum Articles** | 4 | Bab 1-4 Informatika |
| 🌐 **Web Labs** | 3 | Portfolio, Gallery, Recipe |
| 💻 **Coding Labs** | 8 | Python exercises (Easy/Medium/Hard) |
| 🎓 **Extra Course** | 86 | 14 modules, Level 0-13 |
| 📰 **News** | 3 | Tech news (GPT-5, Gemini 3, Outage) |
| **TOTAL** | **200+** | Production-ready content |

---

## 🔐 Admin Credentials

```
Noah (SUPER_ADMIN):
  Email: noah@smawahidiyah.edu
  Password: Noah@GEMA2024!Secure

Kevin (ADMIN):
  Email: kevin@smawahidiyah.edu
  Password: Kevin@GEMA2024!Secure
```

⚠️ **Change passwords after first login!**

---

## 📁 Seed Files Location

```
seed/
├── seed-production-admin.ts          # Admin accounts
├── seed-production-gallery.ts        # Gallery images
├── seed-production-prompts.ts        # Learning prompts
├── seed-production-announcements.ts  # Announcements
├── seed-production-events.ts         # Events
├── seed-production-articles.ts       # Curriculum articles
├── seed-production-weblabs.ts        # Web assignments
├── seed-production-codinglabs.ts     # Coding exercises
├── seed-production-extracourse.ts    # Extra course
└── seed-production-news.ts           # News articles
```

---

## 🎯 Seed Order (Important!)

Seeds run in this order with `prod:seed-all`:

1. **Admin** → Creates admin accounts (needed for articles)
2. **Gallery** → Adds images
3. **Prompts** → Learning prompts
4. **Announcements** → Program announcements
5. **Events** → Workshops & activities
6. **Articles** → Curriculum content
7. **Web Labs** → Web assignments
8. **Coding Labs** → Coding exercises
9. **Extra Course** → Full web dev curriculum
10. **News** → Tech news articles

---

## ✅ Verification Checklist

After running seeds, verify:

```bash
# 1. Check database records
npx prisma studio

# 2. Look for these counts:
# - admins: 2 records
# - gallery: 5 records
# - prompts: 3 records
# - announcements: 3 records
# - events: 3 records
# - articles: 7 records (4 curriculum + 3 news)
# - weblabs: 3 records
# - codinglabs: 3 records
# - codingexercises: 8 records
# - courses: 1 record
# - modules: 14 records
# - lessons: 86 records
```

---

## 🔧 Common Tasks

### Fresh Database Setup
```bash
# 1. Run migrations
npm run db:migrate

# 2. Seed all data
npm run prod:seed-all

# 3. Verify in Prisma Studio
npm run db:studio
```

### Update Specific Data
```bash
# Example: Update only news articles
npm run prod:seed-news
```

### Re-seed Everything
```bash
# Safe to run multiple times (uses upsert pattern)
npm run prod:seed-all
```

---

## 🎓 Extra Course Curriculum

**14 Levels, 86 Lessons:**

- **Level 0:** Fondasi (4 lessons)
- **Level 1:** HTML Dasar (7 lessons)
- **Level 2:** CSS Dasar (6 lessons)
- **Level 3:** CSS Menengah (6 lessons)
- **Level 4:** JavaScript Dasar (7 lessons)
- **Level 5:** DOM Manipulation (6 lessons)
- **Level 6:** JavaScript Lanjutan (7 lessons)
- **Level 7:** Git & Version Control (6 lessons)
- **Level 8:** TailwindCSS (7 lessons)
- **Level 9:** React Dasar (7 lessons)
- **Level 10:** React Lanjutan (7 lessons)
- **Level 11:** Backend Dasar (7 lessons)
- **Level 12:** Database Dasar (7 lessons)
- **Level 13:** Fullstack Project (8 lessons)

---

## 💻 Coding Lab Exercises

**8 Exercises, 3 Difficulty Levels:**

**Level 1 (Easy):**
1. Print Hello - 10 pts
2. Jumlah Dua Angka - 10 pts
3. Selisih Angka - 10 pts

**Level 2 (Medium):**
4. Faktorial - 20 pts
5. Cek Prima - 25 pts
6. Jumlah Deret 1..N - 15 pts

**Level 3 (Hard):**
7. Maximum Subarray (Kadane's) - 40 pts
8. Frekuensi Karakter - 35 pts
9. Mode dari List - 30 pts

Total: **195 points**

---

## 📰 News Articles

1. **GPT-5.1-Codex-Max** (8 min read)
   - OpenAI's latest coding AI
   - Context window 2M tokens
   - Real-time debugging

2. **Gemini 3** (10 min read)
   - Google's multimodal AI
   - Nano/Pro/Ultra variants
   - Educational applications

3. **Internet Outage** (12 min read)
   - Cloudflare & AWS down 6+ hours
   - BGP route leak technical analysis
   - $4.5B economic impact

---

## 🚨 Troubleshooting

### "Admin not found" in article seeds
```bash
# Run admin seed first
npm run prod:seed-admin
```

### "Unique constraint violation"
```
✅ This is normal - seeds update existing records
```

### Images not showing
```bash
# Ensure files exist in public/images/
ls public/images/
```

### Foreign key errors
```bash
# Check seed order - run prod:seed-all
npm run prod:seed-all
```

---

## 📚 Full Documentation

For detailed documentation, see:
- **[PRODUCTION_SEED_DATA.md](./PRODUCTION_SEED_DATA.md)** - Complete guide

---

## 📞 Support

**Developer:** Noah Caesar  
**Institution:** SMA Wahidiyah Kediri  
**Program:** GEMA  
**Last Updated:** 22 November 2025

---

*Keep this file handy for quick reference during deployment!* 🚀
