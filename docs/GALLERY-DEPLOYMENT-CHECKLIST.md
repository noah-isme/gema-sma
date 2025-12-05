# ✅ Gallery Deployment Checklist

Checklist untuk deploy gallery feature dengan Cloudinary ke production.

## 📋 Pre-Deployment Checklist

### 1. Cloudinary Setup
- [ ] Cloudinary account created
- [ ] Cloud name obtained
- [ ] API key obtained
- [ ] API secret obtained
- [ ] Upload preset configured (optional)
- [ ] Quota checked (sufficient for production)

### 2. Environment Variables
- [ ] `.env.local` configured for development
- [ ] Production environment variables ready
- [ ] Variables tested in development
- [ ] No secrets committed to git

### 3. Images Prepared
- [ ] All images placed in `public/images/`
- [ ] Images optimized (compressed)
- [ ] Image names follow convention (lowercase, underscores)
- [ ] Image sizes appropriate (< 2MB each)
- [ ] Aspect ratios consistent (4:3 or 16:9)

### 4. Code Ready
- [ ] Seed script tested locally
- [ ] Test script passes all checks
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code committed to git

### 5. Database Ready
- [ ] Database schema up to date
- [ ] Prisma migrations applied
- [ ] `galleries` table exists
- [ ] Database accessible from production

---

## 🚀 Deployment Steps

### Step 1: Deploy Code to Production

```bash
# Commit all changes
git add .
git commit -m "Add gallery feature with Cloudinary integration"

# Push to production branch
git push origin main

# Or deploy to Vercel
vercel --prod
```

**Verify**: ✅ Code deployed successfully

---

### Step 2: Set Production Environment Variables

#### For Vercel:

```bash
# Via CLI
vercel env add CLOUDINARY_CLOUD_NAME
# Enter: your-cloud-name

vercel env add CLOUDINARY_API_KEY
# Enter: your-api-key

vercel env add CLOUDINARY_API_SECRET
# Enter: your-api-secret
```

#### Or via Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `CLOUDINARY_CLOUD_NAME` (Production)
3. Add `CLOUDINARY_API_KEY` (Production)
4. Add `CLOUDINARY_API_SECRET` (Production)
5. Save and redeploy

**Verify**: ✅ Environment variables set

---

### Step 3: Test Production Configuration

```bash
# SSH into production or use platform CLI
npm run db:test-gallery-cloudinary
```

Expected output: All checks ✅

**Verify**: ✅ Configuration test passed

---

### Step 4: Run Production Seed

```bash
npm run prod:seed-gallery-cloudinary
```

Expected output:
```
✅ Cloudinary configured: your-cloud-name
[1/5] Processing: ...
   ✅ Uploaded successfully
   ✅ Created: ...
...
✅ Seeding completed!
   Success: 5
   Failed: 0
```

**Verify**: ✅ Seed completed successfully

---

### Step 5: Verify in Cloudinary Dashboard

1. Login to https://cloudinary.com/console
2. Go to Media Library
3. Check `gema-gallery` folder exists
4. Verify 5 images uploaded
5. Check image URLs accessible

**Verify**: ✅ Images in Cloudinary

---

### Step 6: Verify in Database

```bash
# Open Prisma Studio or database client
npm run db:studio
```

Check `galleries` table:
- [ ] 5 records exist
- [ ] `imageUrl` contains Cloudinary URLs (starts with `https://res.cloudinary.com/`)
- [ ] `showOnHomepage` is `true` for all
- [ ] `isActive` is `true` for all
- [ ] `category` values correct

**Verify**: ✅ Database updated correctly

---

### Step 7: Verify on Production Website

Visit production URL and check:

#### Landing Page (`/`)
- [ ] Scroll to "Galeri Kegiatan" section
- [ ] 4-6 gallery images display
- [ ] Images load from Cloudinary (check Network tab)
- [ ] Images load quickly (< 2 seconds)
- [ ] Hover effects work
- [ ] No console errors
- [ ] Responsive on mobile

#### Gallery Page (`/gallery`)
- [ ] All 5 images display
- [ ] Category filters work
- [ ] Lightbox opens on click
- [ ] Image descriptions show
- [ ] Pagination works (if applicable)
- [ ] No console errors

#### Admin Panel (`/admin/gallery`)
- [ ] Login successful
- [ ] All gallery items listed
- [ ] Can edit existing items
- [ ] Can add new items
- [ ] Can delete items
- [ ] Upload new images works

**Verify**: ✅ All pages working correctly

---

### Step 8: Performance Check

Use browser DevTools (Network tab):

- [ ] Images served from Cloudinary CDN
- [ ] Images in WebP format (if supported)
- [ ] Image load time < 500ms per image
- [ ] Total page load time acceptable
- [ ] Lighthouse score > 90

Tools to use:
- Chrome DevTools → Network
- Chrome DevTools → Lighthouse
- GTmetrix: https://gtmetrix.com
- PageSpeed Insights: https://pagespeed.web.dev

**Verify**: ✅ Performance acceptable

---

### Step 9: Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**Verify**: ✅ Works on all browsers

---

### Step 10: Final Checks

- [ ] SSL certificate valid (https://)
- [ ] No mixed content warnings
- [ ] Images load on incognito/private mode
- [ ] Images load on different networks (WiFi, mobile data)
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Analytics tracking gallery views

**Verify**: ✅ All final checks passed

---

## 🐛 Troubleshooting Production Issues

### Issue: Images Not Showing

**Symptoms**: Images show broken image icon or 404

**Debug Steps**:
1. Check browser Network tab for failed requests
2. Check image URL in database (copy and open in browser)
3. Verify Cloudinary credentials in production env
4. Check Cloudinary dashboard for uploaded images
5. Verify CORS settings in Cloudinary

**Fix**:
```bash
# Re-seed if needed
npm run prod:seed-gallery-cloudinary
```

---

### Issue: Slow Image Loading

**Symptoms**: Images take > 2 seconds to load

**Debug Steps**:
1. Check Cloudinary transformation settings
2. Verify CDN is being used (not origin)
3. Check image file sizes
4. Review network waterfall in DevTools

**Fix**:
```typescript
// Add optimizations to image URLs
const optimizedUrl = imageUrl.replace(
  '/upload/',
  '/upload/q_auto,f_auto,w_800/'
)
```

---

### Issue: Upload Quota Exceeded

**Symptoms**: 403 or quota error from Cloudinary

**Debug Steps**:
1. Check Cloudinary dashboard → Usage
2. Review current plan limits
3. Check for unnecessary images

**Fix**:
- Upgrade Cloudinary plan
- Delete unused images
- Optimize image sizes before upload

---

### Issue: Environment Variables Not Loading

**Symptoms**: Seed script fails with "not configured" error

**Debug Steps**:
1. Verify variables set in platform dashboard
2. Check variable names (exact match required)
3. Redeploy after setting variables
4. Check build logs for errors

**Fix**:
```bash
# Verify variables (Vercel)
vercel env ls

# Re-add if needed
vercel env add CLOUDINARY_CLOUD_NAME
```

---

## 📊 Post-Deployment Monitoring

### Week 1: Daily Checks
- [ ] Monitor error logs
- [ ] Check Cloudinary bandwidth usage
- [ ] Verify image load times
- [ ] Review user feedback

### Week 2-4: Weekly Checks
- [ ] Review Cloudinary usage trends
- [ ] Check for broken images
- [ ] Monitor page performance
- [ ] Analyze gallery engagement

### Monthly: Regular Maintenance
- [ ] Cleanup unused images
- [ ] Review and optimize slow images
- [ ] Update gallery content
- [ ] Review Cloudinary quota vs usage

---

## 🔄 Rollback Plan

If deployment fails or issues occur:

### Quick Rollback
```bash
# Revert to previous deployment
git revert HEAD
git push origin main

# Or via Vercel
vercel rollback
```

### Data Rollback
```bash
# Deactivate gallery items
# Run this SQL in database:
UPDATE galleries SET "isActive" = false;
```

### Full Rollback
1. Revert code changes
2. Remove gallery items from database
3. Delete Cloudinary uploads (optional)
4. Deploy previous version

---

## 📝 Documentation Updates

After successful deployment:

- [ ] Update main README with gallery info
- [ ] Document Cloudinary credentials location
- [ ] Add gallery to site map
- [ ] Update API documentation
- [ ] Create user guide for admin panel
- [ ] Share with team

---

## 🎉 Success Criteria

Deployment is successful when:

- ✅ All 5 gallery items seeded
- ✅ Images load from Cloudinary CDN
- ✅ Landing page displays gallery section
- ✅ Gallery page fully functional
- ✅ Admin panel works correctly
- ✅ Performance metrics acceptable
- ✅ No console errors
- ✅ Works on all major browsers
- ✅ Mobile responsive
- ✅ Monitoring in place

---

## 📞 Support Contacts

- **Cloudinary Support**: support@cloudinary.com
- **Platform Support**: (Vercel/Railway/etc)
- **Team Lead**: [Contact Info]
- **DevOps**: [Contact Info]

---

## 📚 Related Documentation

- [Quick Start Guide](./GALLERY-QUICK-START.md)
- [Full Setup Guide](./GALLERY-CLOUDINARY-SETUP.md)
- [Architecture Docs](./GALLERY-ARCHITECTURE.md)
- [Seed Script README](../seed/README-GALLERY-CLOUDINARY.md)

---

**Checklist Version**: 1.0.0  
**Last Updated**: 2024  
**Next Review**: After first production deployment

---

## ✍️ Deployment Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | __________ | ______ | __________ |
| Reviewer | __________ | ______ | __________ |
| DevOps | __________ | ______ | __________ |
| Approved | __________ | ______ | __________ |

**Deployment Date**: __________  
**Production URL**: __________  
**Status**: ⬜ Success ⬜ Failed ⬜ Partial

**Notes**:
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

**End of Checklist** ✅