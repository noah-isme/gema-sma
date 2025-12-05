# 🔧 Gallery Troubleshooting Guide

Quick solutions for common gallery issues.

---

## 🚨 Issue: Images Not Loading (Error 400)

### Symptoms
```
Failed to load resource: the server responded with a status of 400
/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2F...
```

### Cause
Next.js Image Optimization tidak mengizinkan domain Cloudinary.

### Solution

**1. Add Cloudinary domain to `next.config.ts`:**

```typescript
const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "images.unsplash.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
```

**2. Restart development server:**
```bash
# Stop server (Ctrl+C)
pnpm dev
```

**Status**: ✅ FIXED

---

## 🚨 Issue: Environment Variables Not Loaded

### Symptoms
```
❌ Missing Cloudinary environment variables!
CLOUDINARY_CLOUD_NAME: ❌ Missing
```

### Cause
Environment variables tidak ter-load di seed script.

### Solution

**1. Install dotenv:**
```bash
pnpm add dotenv
```

**2. Add to seed script:**
```typescript
import * as dotenv from 'dotenv'
dotenv.config()
```

**Status**: ✅ FIXED

---

## 🚨 Issue: Upload Failed

### Symptoms
```
❌ Failed to upload image.png: Upload failed
```

### Possible Causes & Solutions

**1. Internet Connection**
- Check your internet connection
- Try uploading a single image manually

**2. Invalid Credentials**
```bash
# Verify credentials in .env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**3. File Size Too Large**
- Free tier limit: 10MB per file
- Compress images before upload

**4. Quota Exceeded**
- Check Cloudinary dashboard usage
- Free tier: 25GB storage, 25GB bandwidth/month

---

## 🚨 Issue: Images Not Showing on Website

### Symptoms
Gallery section empty or shows placeholders.

### Debug Steps

**1. Check Database:**
```bash
pnpm run db:verify-gallery
```

Expected output: 5+ gallery items with Cloudinary URLs

**2. Check API Response:**
Open browser console and check:
```
GET /api/public
```

Should return gallery array with imageUrl fields.

**3. Check Image URLs:**
Copy imageUrl from database and open in browser.
Should load image directly from Cloudinary.

**4. Clear Cache:**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 🚨 Issue: Gallery Items Not Featured on Homepage

### Symptoms
Landing page doesn't show new gallery images.

### Solution

**Check `showOnHomepage` flag:**
```bash
pnpm run db:verify-gallery
```

Should show: `Show on Homepage: ✅ Yes`

**If not, update database:**
```sql
UPDATE galleries 
SET "showOnHomepage" = true 
WHERE id IN (SELECT id FROM galleries LIMIT 5);
```

Or re-run seed:
```bash
pnpm run db:seed-gallery-cloudinary
```

---

## 🚨 Issue: Slow Image Loading

### Symptoms
Images take > 2 seconds to load.

### Solutions

**1. Enable Cloudinary Transformations:**

Add to image URL:
```
/upload/q_auto,f_auto,w_800/
```

Example:
```
https://res.cloudinary.com/xxx/image/upload/q_auto,f_auto,w_800/gema-gallery/image.png
```

**2. Check Network Tab:**
- Open DevTools → Network
- Filter: Img
- Check load time per image
- Should be < 500ms

**3. Verify CDN:**
Image URLs should start with:
```
https://res.cloudinary.com/
```

NOT:
```
http://localhost:3000/images/
```

---

## 🚨 Issue: Database Connection Error

### Symptoms
```
Error: Can't reach database server
```

### Solutions

**1. Check DATABASE_URL:**
```bash
# In .env
DATABASE_URL="postgresql://..."
```

**2. Verify Prisma:**
```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

**3. Test Connection:**
```bash
pnpm exec prisma studio
```

---

## 🚨 Issue: TypeError in Seed Script

### Symptoms
```
TypeError: Cannot read property 'secure_url' of undefined
```

### Solution

Check Cloudinary response:
```typescript
console.log('Upload result:', result)
```

Verify result contains:
- `secure_url`
- `public_id`
- `format`

---

## 🛠️ General Debug Commands

### Test Cloudinary Configuration
```bash
pnpm run db:test-gallery-cloudinary
```

### Verify Database Data
```bash
pnpm run db:verify-gallery
```

### Re-seed Gallery
```bash
pnpm run db:seed-gallery-cloudinary
```

### Check Logs
```bash
# Development
tail -f .next/server.log

# Production
Check platform logs (Vercel/Railway)
```

---

## 📊 Health Check Checklist

Run through this checklist if gallery isn't working:

- [ ] Environment variables set correctly
- [ ] Cloudinary domain in next.config.ts
- [ ] dotenv dependency installed
- [ ] Database has gallery records
- [ ] Gallery records have Cloudinary URLs
- [ ] Images accessible in Cloudinary dashboard
- [ ] showOnHomepage flag is true
- [ ] isActive flag is true
- [ ] Development server restarted
- [ ] Browser cache cleared
- [ ] No console errors

---

## 🆘 Still Not Working?

### 1. Check Documentation
- [Quick Start Guide](./GALLERY-QUICK-START.md)
- [Full Setup Guide](./GALLERY-CLOUDINARY-SETUP.md)
- [Architecture Docs](./GALLERY-ARCHITECTURE.md)

### 2. Verify Configuration
```bash
# Run all checks
pnpm run db:test-gallery-cloudinary
pnpm run db:verify-gallery
```

### 3. Check Cloudinary Dashboard
- Login: https://cloudinary.com/console
- Check: Media Library → gema-gallery folder
- Verify: Images uploaded and accessible

### 4. Review Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### 5. Contact Support
- Review error logs
- Include error messages
- Provide browser/OS info
- Share relevant code snippets

---

## 🔍 Advanced Debugging

### Enable Verbose Logging

Add to seed script:
```typescript
console.log('Uploading:', imagePath)
console.log('Result:', JSON.stringify(result, null, 2))
```

### Test Single Image Upload

```typescript
// Quick test
const result = await cloudinary.uploader.upload('public/images/test.png', {
  folder: 'test',
})
console.log(result)
```

### Check Cloudinary API Status

Visit: https://status.cloudinary.com/

### Verify API Credentials

```typescript
const result = await cloudinary.api.ping()
console.log(result) // Should return: { status: 'ok' }
```

---

## 📚 Related Documentation

- [Gallery Index](./GALLERY-INDEX.md)
- [Quick Start](./GALLERY-QUICK-START.md)
- [Full Setup](./GALLERY-CLOUDINARY-SETUP.md)
- [Architecture](./GALLERY-ARCHITECTURE.md)
- [Deployment](./GALLERY-DEPLOYMENT-CHECKLIST.md)

---

**Last Updated**: 3 Desember 2024  
**Version**: 1.0.0