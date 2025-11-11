# 🚀 GEMA SMA - Quick Reference Guide

## ⚡ Quick Commands

### Server Management
```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Production server
npm start

# Kill all node processes
pkill -9 -f "node"
```

### Database Operations
```bash
# Reset & seed database
npm run db:reset

# Seed only
npm run db:seed

# Run migrations
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### Testing & Validation
```bash
# Test all API endpoints
curl -s http://localhost:3000/api/public-stats | jq

# Check build status
npm run build 2>&1 | tail -20

# Test specific endpoint
curl -s http://localhost:3000/api/tutorial/articles | jq '.data[0]'
```

---

## 📋 Common Tasks

### 1. Restart Server
```bash
pkill -f "node.*next" && npm start
```

### 2. Clean Rebuild
```bash
rm -rf .next node_modules/.cache && npm run build
```

### 3. Fresh Database
```bash
npm run db:reset
```

### 4. Check Server Status
```bash
ps aux | grep -E "node|next" | grep -v grep
curl -s http://localhost:3000/api/public-stats
```

### 5. View Logs
```bash
# Real-time logs
tail -f /tmp/gema-server.log

# Last 50 lines
tail -50 /tmp/gema-server.log
```

---

## 🔧 Troubleshooting

### Server won't start
```bash
# Check port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i :3000)

# Clean restart
pkill -9 -f "node" && sleep 2 && npm start
```

### Database issues
```bash
# Reset everything (PostgreSQL)
npx prisma migrate reset
npx prisma db push
npm run db:seed
```

### Build errors
```bash
# Clear cache
rm -rf .next node_modules/.cache
npm run build
```

---

## 📊 Monitoring Commands

### Check Stats
```bash
echo "📊 GEMA Stats:" && \
curl -s http://localhost:3000/api/public-stats | \
jq -r '"Tutorials: \(.data.totalTutorials)\nAssignments: \(.data.totalAssignments)\nCoding Labs: \(.data.totalCodingLabs)"'
```

### List All Content
```bash
# Tutorials
curl -s "http://localhost:3000/api/tutorial/articles?limit=10" | jq -r '.data[] | "• \(.title)"'

# Assignments
curl -s "http://localhost:3000/api/tutorial/assignments?limit=10" | jq -r '.data[] | "• \(.title)"'
```

### Health Check
```bash
echo "🏥 Health Check:" && \
curl -s http://localhost:3000/api/public-stats > /dev/null && \
echo "✅ API: OK" || echo "❌ API: DOWN"
```

---

## 🌐 URLs

- **Homepage:** http://localhost:3000
- **Tutorial:** http://localhost:3000/tutorial
- **Student Login:** http://localhost:3000/student/login
- **Student Dashboard:** http://localhost:3000/student/dashboard
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

---

## 📝 File Locations

- **Database:** PostgreSQL (Neon/Supabase)
- **Schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`
- **Seed:** `seed/seed.ts`
- **API Routes:** `src/app/api/`
- **Pages:** `src/app/`
- **Components:** `src/components/`

---

## 🔑 Environment Variables

Create `.env` file:
```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

---

## 🎯 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Manual Deploy
```bash
# Build
npm run build

# Upload .next/, package.json, package-lock.json
# Set DATABASE_URL in production
# Run: npm start
```

---

**Last Updated:** 2025-11-12 03:02 WIB
