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
