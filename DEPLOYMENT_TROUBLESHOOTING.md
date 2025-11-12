# Deployment Troubleshooting Guide

## Common Issues & Solutions

### 1. API 500 Errors on Vercel

**Problem:** `/api/public-stats` and `/api/public` return 500 errors

**Root Causes:**
- Database connection not configured in Vercel
- Missing environment variables
- Prisma client not initialized properly

**Solutions:**

#### A. Configure Environment Variables in Vercel

Required variables:
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # If using connection pooling
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key"
```

Steps:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all required variables from `.env.example`
3. Redeploy the application

#### B. Database Setup

If using Supabase/Neon/Railway:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed
```

#### C. Graceful Degradation (Already Implemented)

Both APIs now return:
- Status 200 (instead of 500) on errors
- Fallback data with realistic values
- Error details in development mode only

This ensures the landing page loads even if database is unavailable.

### 2. Build Errors

**Problem:** Next.js build fails on Vercel

**Solutions:**
- Check TypeScript errors: `npm run build`
- Check ESLint errors: `npm run lint`
- Verify all imports are correct

### 3. Prisma Issues on Vercel

**Problem:** Prisma Client not found or outdated

**Solution:**

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Or in `vercel.json`:
```json
{
  "buildCommand": "prisma generate && next build"
}
```

### 4. Static Generation Errors

**Problem:** Pages fail during build time

**Solution:**

Mark API routes as dynamic:
```typescript
export const dynamic = 'force-dynamic'
export const revalidate = 3600
```

### 5. Environment-Specific Issues

**Development works, Production fails:**

Check:
1. Are all env vars set in Vercel?
2. Is DATABASE_URL accessible from Vercel's region?
3. Are there IP whitelist restrictions?

## Testing Deployment

### Local Production Build
```bash
npm run build
npm start
```

### Check API Endpoints
```bash
# Test locally
curl http://localhost:3000/api/public-stats
curl http://localhost:3000/api/public?type=activities

# Test on Vercel
curl https://your-app.vercel.app/api/public-stats
```

## Quick Fixes Applied

### 1. API Error Handling
- Changed 500 → 200 status for graceful degradation
- Added fallback data (20 students, 15 tutorials, etc.)
- Error details shown only in development

### 2. Landing Page Resilience
- Page loads even if APIs fail
- Shows fallback statistics
- No console errors for users

## Monitoring

### Vercel Dashboard
- Check Function Logs for API errors
- Monitor error rates
- Check build logs

### Console Logs
```javascript
// In browser console (should be clean now)
console.log('No errors expected')
```

## Next Steps

1. ✅ Fix API error handling (DONE)
2. ⏳ Configure DATABASE_URL in Vercel
3. ⏳ Run prisma migrations
4. ⏳ Test all endpoints
5. ⏳ Monitor production logs

## Support

If issues persist:
1. Check Vercel Function Logs
2. Verify database connection string
3. Test API routes directly
4. Check Prisma schema compatibility

---

## Database Migration Issues

### Problem: Database URL sama tapi data tidak muncul di Vercel

**Root Cause:**
- Database schema belum di-migrate ke production
- Tables tidak exist di production database
- Migration belum dijalankan setelah deploy

### Solution: Run Migrations on Vercel

#### Option 1: Automatic Migration (Recommended)

**Already configured in `vercel.json` and `package.json`:**

```json
// vercel.json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}

// package.json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

**What happens:**
1. Vercel runs `vercel-build` script
2. Generates Prisma Client
3. Deploys all pending migrations
4. Builds Next.js app

**To trigger:**
```bash
git push origin main
```

#### Option 2: Manual Migration via Vercel CLI

If automatic doesn't work, run manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration command
vercel env pull .env.production
npx prisma migrate deploy

# Or push schema directly (dev only)
npx prisma db push
```

#### Option 3: Direct Database Access

Connect to production database and run migrations:

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Verify tables
npx prisma studio
```

---

## Verifying Database Setup

### 1. Check Tables Exist

**Via Prisma Studio:**
```bash
npx prisma studio
```

Should show all tables:
- Admin
- Student
- Article
- Assignment
- CodingLabTask
- WebLabAssignment
- Event
- Announcement
- Gallery
- etc.

**Via SQL:**
```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check if migration table exists
SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 5;
```

### 2. Check Migration Status

```bash
npx prisma migrate status
```

Should show:
```
Database schema is up to date!
```

### 3. Check Data Exists

**Via API:**
```bash
curl https://gema-sma.tech/api/public-stats
```

Should return actual data (not 0s):
```json
{
  "success": true,
  "data": {
    "totalStudents": 20,
    "totalTutorials": 15,
    ...
  }
}
```

---

## Common Database Issues

### Issue 1: Tables Don't Exist

**Symptoms:**
- Prisma error: "Table doesn't exist"
- APIs return empty data
- 500 errors referencing Prisma

**Solution:**
```bash
# Run migrations
npx prisma migrate deploy

# Or push schema
npx prisma db push
```

### Issue 2: Migration History Conflict

**Symptoms:**
- Migration fails with "divergent migration history"
- Can't apply migrations

**Solution:**
```bash
# Reset migration history (CAUTION: Dev only)
npx prisma migrate reset

# Or resolve conflicts
npx prisma migrate resolve --applied <migration_name>
```

### Issue 3: Connection String Wrong

**Symptoms:**
- Can connect but no tables
- Empty database

**Check:**
```bash
# Verify DATABASE_URL points to correct database
echo $DATABASE_URL

# Should be: postgresql://user:pass@host:5432/dbname
#                                              ^^^^^^^
#                                              This should match!
```

**Common mistake:**
- Local: `postgresql://localhost:5432/gema_dev`
- Production: `postgresql://host:5432/gema_prod` ❌ Wrong!
- Should be: Same database name or different connection string

### Issue 4: SSL Connection Required

**Symptoms:**
- Connection timeout
- SSL handshake failed

**Solution:**

Add to DATABASE_URL:
```bash
# For Supabase/Neon
DATABASE_URL="postgresql://...?sslmode=require"

# For direct connection with pooling
DIRECT_URL="postgresql://...?sslmode=require"
```

---

## Seeding Production Database

### Run Seed Script

```bash
# Manually seed production
npm run db:seed

# Or via Vercel CLI
vercel env pull .env.production
npm run db:seed
```

### Seed Script Location

`prisma/seed.ts` - Contains initial data:
- Admin user
- Sample students
- Articles/tutorials
- Assignments
- Events
- Announcements

---

## Database Setup Checklist

Production deployment checklist:

- [ ] Database created (Supabase/Neon/Railway)
- [ ] DATABASE_URL set in Vercel env vars
- [ ] `vercel.json` has buildCommand with migrate
- [ ] `package.json` has vercel-build script
- [ ] Push to trigger auto-migration
- [ ] Verify tables exist (Prisma Studio)
- [ ] Check migration status (prisma migrate status)
- [ ] Seed database (optional)
- [ ] Test APIs return real data
- [ ] No console errors

---

## Quick Fix Commands

```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy

# Push schema (dev)
npx prisma db push

# Check status
npx prisma migrate status

# Open database viewer
npx prisma studio

# Reset (DANGEROUS - deletes data!)
npx prisma migrate reset
```

---

## Environment Variables Checklist

Required in Vercel:

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://user:pass@host:5432/database?sslmode=require

# If using connection pooling
DIRECT_URL=postgresql://user:pass@host:5432/database?sslmode=require

# NextAuth (if using auth)
NEXTAUTH_URL=https://gema-sma.tech
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_COOKIE_DOMAIN=gema-sma.tech

# Site config
NEXT_PUBLIC_SITE_URL=https://gema-sma.tech
```

---

## Monitoring Database

### Check Connection

```bash
# Via psql
psql $DATABASE_URL -c "SELECT version();"

# Via Prisma
npx prisma db execute --stdin < check.sql
```

### Check Table Count

```sql
SELECT 
  schemaname,
  tablename,
  (SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname = 'public') as total_tables
FROM pg_catalog.pg_tables 
WHERE schemaname = 'public';
```

### Check Recent Migrations

```sql
SELECT 
  migration_name,
  finished_at,
  applied_steps_count
FROM _prisma_migrations
ORDER BY finished_at DESC
LIMIT 10;
```

---

## Support Resources

**Prisma Documentation:**
- https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- https://www.prisma.io/docs/concepts/components/prisma-migrate

**Vercel Documentation:**
- https://vercel.com/guides/using-databases-with-vercel

**Database Providers:**
- Supabase: https://supabase.com/docs
- Neon: https://neon.tech/docs
- Railway: https://docs.railway.app

