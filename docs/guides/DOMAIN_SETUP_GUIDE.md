# Domain Setup Guide - gema-sma.tech

## 🌐 Custom Domain Configuration

Your app is now configured for custom domain: **gema-sma.tech**

---

## ✅ Step-by-Step Setup

### 1. Configure Domain in Vercel

**A. Add Custom Domain:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `gema-sma`
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `gema-sma.tech`
6. Click **Add**

**B. Add www subdomain (optional):**
- Also add: `www.gema-sma.tech`
- Vercel will auto-redirect www to main domain

---

### 2. Configure DNS Records

Go to your domain registrar (where you bought gema-sma.tech) and add these DNS records:

**A. For Root Domain (gema-sma.tech):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |

**B. For WWW Subdomain:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | 3600 |

**Alternative (if your registrar supports CNAME flattening):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | cname.vercel-dns.com | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

> **Note:** DNS propagation can take 24-48 hours, but usually completes in 1-2 hours.

---

### 3. Update Environment Variables in Vercel

After domain is added, update these variables:

**Go to:** Vercel Dashboard → Project → Settings → Environment Variables

**Update/Add:**

```bash
# Main site URL (REQUIRED)
NEXT_PUBLIC_SITE_URL=https://gema-sma.tech

# NextAuth configuration (REQUIRED if using authentication)
NEXTAUTH_URL=https://gema-sma.tech
NEXTAUTH_SECRET=your-secret-key-here-change-me
NEXTAUTH_COOKIE_DOMAIN=gema-sma.tech

# Database (REQUIRED if using database features)
DATABASE_URL=postgresql://username:password@host:5432/database
```

**Important:**
- Set environment for: **Production**, **Preview**, and **Development**
- Click **Save** after each variable
- Redeploy after saving

---

### 4. Force Redeploy

After updating environment variables:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **⋮** (three dots)
4. Select **Redeploy**

**Option B: Via Git Push**
```bash
git commit --allow-empty -m "chore: trigger redeploy for domain update"
git push origin main
```

---

### 5. Verify Domain Setup

**A. Check DNS Propagation:**
```bash
# Check A record
dig gema-sma.tech

# Check CNAME
dig www.gema-sma.tech

# Or use online tool
https://www.whatsmydns.net/#A/gema-sma.tech
```

**B. Test HTTPS:**
```bash
curl -I https://gema-sma.tech
```

Should return: `HTTP/2 200` (or 301 redirect to www)

**C. Check SSL Certificate:**
- Visit: https://gema-sma.tech
- Click padlock icon in browser
- Verify certificate is issued by Let's Encrypt/Vercel

---

## 🔒 SSL/TLS Certificate

**Automatic HTTPS:**
- Vercel automatically provisions SSL certificates
- Uses Let's Encrypt
- Auto-renews before expiration
- No manual configuration needed

**Certificate Status:**
- Check in Vercel Dashboard → Settings → Domains
- Should show: ✅ Valid Certificate

---

## 🐛 Troubleshooting

### Issue 1: Domain Not Resolving

**Symptoms:**
- Site doesn't load on custom domain
- DNS_PROBE_FINISHED_NXDOMAIN error

**Solutions:**
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Clear browser cache: `Ctrl + Shift + R`
4. Try incognito mode
5. Check with: https://www.whatsmydns.net

### Issue 2: SSL Certificate Error

**Symptoms:**
- Browser shows "Not Secure" warning
- Certificate invalid/expired

**Solutions:**
1. Wait 15-30 minutes for certificate provisioning
2. Check Vercel Dashboard → Domains → Certificate Status
3. If stuck, remove and re-add domain in Vercel
4. Contact Vercel Support if persists

### Issue 3: API Errors After Domain Change

**Symptoms:**
- APIs return 500 errors
- CORS errors in console
- Authentication doesn't work

**Solutions:**

1. **Update Environment Variables:**
   ```bash
   NEXTAUTH_URL=https://gema-sma.tech
   NEXT_PUBLIC_SITE_URL=https://gema-sma.tech
   ```

2. **Clear Application Cache:**
   - Browser DevTools → Application → Clear Storage
   - Clear all cookies for old domain

3. **Redeploy Application:**
   ```bash
   git push origin main
   ```

### Issue 4: Mixed Content Warnings

**Symptoms:**
- Some resources load over HTTP instead of HTTPS
- Console shows mixed content errors

**Solutions:**
1. Ensure all URLs in code use `https://`
2. Use protocol-relative URLs: `//domain.com`
3. Check next.config.ts headers
4. Update NEXT_PUBLIC_SITE_URL

---

## ✅ Verification Checklist

After setup is complete, verify:

- [ ] Domain resolves to correct IP
- [ ] WWW subdomain redirects to main domain
- [ ] HTTPS works (green padlock in browser)
- [ ] SSL certificate is valid
- [ ] Landing page loads correctly
- [ ] All assets load (images, fonts, scripts)
- [ ] APIs respond correctly
- [ ] No console errors
- [ ] Authentication works (if applicable)
- [ ] Redirects work properly

---

## 📞 Need Help?

**Vercel Support:**
- Dashboard: https://vercel.com/support
- Discord: https://vercel.com/discord
- Documentation: https://vercel.com/docs/custom-domains

**DNS Issues:**
- Contact your domain registrar support
- Common registrars: Namecheap, GoDaddy, Cloudflare, Google Domains

**Domain Registrars Guide:**
- [Namecheap DNS Setup](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)
- [GoDaddy DNS Setup](https://www.godaddy.com/help/add-an-a-record-19238)
- [Cloudflare DNS Setup](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)

---

## 🚀 Post-Setup Tasks

After domain is working:

1. **Update Social Media Links:**
   - Instagram bio
   - Facebook page
   - YouTube channel
   - Linktree profile

2. **Update School Materials:**
   - Registration forms
   - Brochures
   - Email signatures
   - Official documents

3. **SEO Updates:**
   - Submit new sitemap to Google Search Console
   - Update Google My Business
   - Verify domain in Bing Webmaster Tools

4. **Monitoring:**
   - Add domain to uptime monitoring
   - Set up Google Analytics with new domain
   - Configure error tracking (Sentry, etc.)

---

## 📝 Current Configuration

**Domain:** gema-sma.tech  
**Hosting:** Vercel  
**SSL:** Automatic (Let's Encrypt)  
**DNS:** Your Registrar  
**Framework:** Next.js 15  

**URLs Updated:**
- ✅ `.env.example` - NEXT_PUBLIC_SITE_URL
- ✅ `.env.example` - NEXTAUTH_URL
- ✅ `.env.example` - NEXTAUTH_COOKIE_DOMAIN

**Ready to deploy!** 🎉
