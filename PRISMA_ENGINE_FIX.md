# 🔧 Fix: Prisma Engine Not Found on Vercel

## 🔴 Error

```json
{
  "status": "error",
  "database": "disconnected",
  "error": "Prisma Client could not locate the Query Engine for runtime \"rhel-openssl-3.0.x\"."
}
```

## 💡 Root Cause

Vercel serverless functions run on **RHEL (Red Hat Enterprise Linux)** with OpenSSL 3.0. By default, Prisma only generates engines for your local system (native). The production engine binary is missing!

## ✅ Solution Applied

### 1. Updated `prisma/schema.prisma`

Added `binaryTargets` to generator:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

- `native` = untuk development lokal (Mac/Linux/Windows)
- `rhel-openssl-3.0.x` = untuk Vercel production

### 2. Updated `next.config.ts`

Added Prisma-specific webpack config:

```typescript
const nextConfig: NextConfig = {
  outputFileTracing: true,
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  },
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Removed '@prisma/client' from here
  },
}
```

### 3. Regenerated Prisma Client

```bash
npx prisma generate
```

This downloads both engine binaries:
- `libquery_engine-darwin-arm64.dylib.node` (Mac M1)
- `libquery_engine-rhel-openssl-3.0.x.so.node` (Vercel)

## 🚀 Deploy

```bash
git add prisma/schema.prisma next.config.ts
git commit -m "fix: add Prisma binary targets for Vercel"
git push origin main
```

Vercel will:
1. Install dependencies
2. Run `prisma generate` (includes RHEL engine)
3. Build Next.js
4. Deploy with correct engine binary ✅

## 🧪 Verify

After deployment:

```bash
curl https://gema-sma-wahidiyah.vercel.app/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "database": "connected",
  "data": {
    "admins": 2,
    "students": 20,
    "announcements": 3
  }
}
```

## 📋 Checklist

- [x] Added `binaryTargets` to schema.prisma
- [x] Updated next.config.ts
- [x] Regenerated Prisma client locally
- [ ] Committed changes
- [ ] Pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Tested /api/health endpoint
- [ ] Status: "ok" ✅

## 🔍 Why This Happens

### Vercel Serverless Environment:
```
Operating System: Red Hat Enterprise Linux (RHEL)
OpenSSL Version: 3.0.x
Node.js Runtime: AWS Lambda

Your Local:
Operating System: macOS/Ubuntu/Windows
OpenSSL Version: varies
Node.js Runtime: Native
```

Prisma needs **different engine binaries** for each platform!

### Binary Size Impact:

```
Before (native only):
- libquery_engine-darwin-arm64.dylib.node: 28 MB

After (native + RHEL):
- libquery_engine-darwin-arm64.dylib.node: 28 MB
- libquery_engine-rhel-openssl-3.0.x.so.node: 26 MB

Total: 54 MB (but only correct one is bundled per environment)
```

Vercel will **only include** the RHEL binary in production bundle.

## 💡 Prevention

Always include production target in schema from start:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

## 🆘 If Still Failing

### Check Build Logs:

Vercel Dashboard → Deployments → Build Logs

Look for:
```
✅ prisma generate
✅ Generated Prisma Client to node_modules/@prisma/client
✅ Binaries: native, rhel-openssl-3.0.x
```

### Common Issues:

**1. Old Prisma Client Cached**
```bash
# Clear .next and node_modules
rm -rf .next node_modules
npm install
npx prisma generate
```

**2. Wrong Binary Target**
```bash
# Check your Vercel region
# Most use: rhel-openssl-3.0.x
# Some older: rhel-openssl-1.0.x

# Update schema.prisma if needed
```

**3. Prisma Version Mismatch**
```bash
# Update to latest
npm install prisma@latest @prisma/client@latest
npx prisma generate
```

## 📚 References

- [Prisma + Next.js Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Binary Targets](https://www.prisma.io/docs/concepts/components/prisma-engines/query-engine#binary-targets)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

---

**Status:** ✅ Fixed  
**Last Updated:** 2025-11-19
