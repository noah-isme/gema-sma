# 🏗️ Gallery Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GEMA SMA Platform                         │
│                     Gallery System Architecture                  │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────┐
│   Cloudinary CDN  │
│                   │
│  ┌─────────────┐  │
│  │ gema-gallery│  │
│  │   folder    │  │
│  │             │  │
│  │ • image1.png│  │
│  │ • image2.png│  │
│  │ • image3.png│  │
│  └─────────────┘  │
│                   │
│  Global CDN       │
│  Edge Servers     │
└────────┬──────────┘
         │
         │ Delivers optimized images
         │ (WebP, AVIF, auto-quality)
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Application                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Frontend Layer                       │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │  │
│  │  │ Landing Page   │  │  Gallery Page  │  │   Admin   │  │  │
│  │  │      (/)       │  │   (/gallery)   │  │  Panel    │  │  │
│  │  │                │  │                │  │(/admin/   │  │  │
│  │  │ GallerySection │  │  GalleryGrid   │  │ gallery)  │  │  │
│  │  │   Component    │  │   Component    │  │           │  │  │
│  │  └────────┬───────┘  └────────┬───────┘  └─────┬─────┘  │  │
│  │           │                   │                 │        │  │
│  │           └───────────────────┼─────────────────┘        │  │
│  │                               │                          │  │
│  │                               │ Fetch Data               │  │
│  │                               ▼                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                       API Layer                           │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  GET /api/public                                   │  │  │
│  │  │  • Returns all public data (activities,            │  │  │
│  │  │    announcements, gallery, stats)                  │  │  │
│  │  │  • Filter: ?type=gallery                           │  │  │
│  │  │  • Filter: ?highlight=true (homepage only)         │  │  │
│  │  └─────────────────────┬──────────────────────────────┘  │  │
│  │                        │                                  │  │
│  │                        │ Queries Database                 │  │
│  │                        ▼                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Database Layer                        │  │
│  │                      (PostgreSQL)                         │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Table: galleries                                  │  │  │
│  │  │                                                    │  │  │
│  │  │  • id (cuid)                                       │  │  │
│  │  │  • title (string)                                  │  │  │
│  │  │  • description (string?)                           │  │  │
│  │  │  • imageUrl (string) ← Cloudinary URL stored here  │  │  │
│  │  │  • category (string)                               │  │  │
│  │  │  • isActive (boolean)                              │  │  │
│  │  │  • showOnHomepage (boolean)                        │  │  │
│  │  │  • createdAt (datetime)                            │  │  │
│  │  │  • updatedAt (datetime)                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  Managed by Prisma ORM                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      Seed Scripts Layer                        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  seed-gallery-cloudinary.ts                              │ │
│  │                                                          │ │
│  │  1. Read images from public/images/                     │ │
│  │  2. Upload to Cloudinary API                            │ │
│  │  3. Get secure_url from response                        │ │
│  │  4. Save to database (upsert)                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  test-gallery-cloudinary.ts                              │ │
│  │                                                          │ │
│  │  • Validate env variables                               │ │
│  │  • Check image files exist                              │ │
│  │  • Test Cloudinary connection                           │ │
│  │  • Dry run upload test                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### 1. Seeding Flow (One-time Setup)

```
┌──────────────┐
│   Developer  │
│              │
│ Run seed     │
│ script       │
└──────┬───────┘
       │
       │ npm run db:seed-gallery-cloudinary
       ▼
┌──────────────────────────────────────────┐
│  seed-gallery-cloudinary.ts              │
│                                          │
│  Loop through gallery data:              │
│  ┌────────────────────────────────────┐  │
│  │ 1. Read image from disk            │  │
│  │    public/images/image1.png        │  │
│  └────────────────┬───────────────────┘  │
│                   │                      │
│  ┌────────────────▼───────────────────┐  │
│  │ 2. Upload to Cloudinary            │  │
│  │    cloudinary.uploader.upload()    │  │
│  └────────────────┬───────────────────┘  │
│                   │                      │
│                   │ Returns secure_url   │
│                   ▼                      │
│  ┌────────────────────────────────────┐  │
│  │ 3. Save to database                │  │
│  │    prisma.gallery.upsert()         │  │
│  │    - title                         │  │
│  │    - description                   │  │
│  │    - imageUrl ← Cloudinary URL     │  │
│  │    - category                      │  │
│  │    - showOnHomepage                │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### 2. Runtime Flow (User Request)

```
┌──────────────┐
│     User     │
│              │
│ Visits page  │
└──────┬───────┘
       │
       │ https://gema-sma.com/
       ▼
┌──────────────────────────────────────────┐
│  Next.js Server (Landing Page)           │
│                                          │
│  useEffect(() => {                       │
│    fetchPublicData()                     │
│  })                                      │
└──────────────┬───────────────────────────┘
               │
               │ fetch('/api/public')
               ▼
┌──────────────────────────────────────────┐
│  API Route: /api/public                  │
│                                          │
│  const gallery = await prisma.gallery    │
│    .findMany({                           │
│      where: {                            │
│        isActive: true,                   │
│        showOnHomepage: true              │
│      },                                  │
│      take: 6                             │
│    })                                    │
│                                          │
│  return { gallery: [...] }               │
└──────────────┬───────────────────────────┘
               │
               │ Returns JSON
               ▼
┌──────────────────────────────────────────┐
│  Frontend Component                      │
│  GallerySection.tsx                      │
│                                          │
│  gallery.map(item => (                   │
│    <OptimizedImage                       │
│      src={item.imageUrl}                 │
│      alt={item.title}                    │
│    />                                    │
│  ))                                      │
└──────────────┬───────────────────────────┘
               │
               │ Browser requests image
               ▼
┌──────────────────────────────────────────┐
│  Cloudinary CDN                          │
│                                          │
│  GET https://res.cloudinary.com/...     │
│                                          │
│  • Auto-optimization                     │
│  • Format conversion (WebP/AVIF)         │
│  • Quality adjustment                    │
│  • Responsive sizing                     │
│                                          │
│  ← Returns optimized image               │
└──────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components Hierarchy

```
src/
├── app/
│   ├── page.tsx                          ← Landing Page (root)
│   │   └── Uses: GallerySection
│   │
│   ├── gallery/
│   │   └── page.tsx                      ← Gallery Page
│   │       └── Full gallery display
│   │
│   └── admin/
│       └── gallery/
│           └── page.tsx                  ← Admin Panel
│               └── Uses: GalleryManager
│
├── components/
│   ├── landing/
│   │   └── GallerySection.tsx            ← Gallery on homepage
│   │       ├── Displays 4-6 items
│   │       ├── Grid layout
│   │       └── Links to /gallery
│   │
│   └── ui/
│       └── OptimizedImage.tsx            ← Image wrapper
│           └── Handles lazy loading
│
└── features/
    └── admin/
        └── gallery/
            ├── GalleryManager.tsx        ← Admin CRUD
            ├── components/
            │   ├── GalleryForm.tsx       ← Add/Edit form
            │   └── GalleryGrid.tsx       ← Admin grid view
            └── types.ts                  ← TypeScript types
```

---

## Database Schema Details

```prisma
model Gallery {
  id             String   @id @default(cuid())
  title          String
  description    String?
  imageUrl       String   // ← Key field: Cloudinary URL
  category       String   @default("general")
  isActive       Boolean  @default(true)
  showOnHomepage Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("galleries")
}
```

### Field Purposes

| Field | Type | Purpose |
|-------|------|---------|
| `id` | String (cuid) | Unique identifier |
| `title` | String | Display title (e.g., "Workshop AI") |
| `description` | String? | Optional description for hover/detail |
| `imageUrl` | String | **Cloudinary URL** (full https:// URL) |
| `category` | String | Filter category (pembelajaran, event, etc) |
| `isActive` | Boolean | Soft delete flag |
| `showOnHomepage` | Boolean | Display on landing page? |
| `createdAt` | DateTime | Audit trail |
| `updatedAt` | DateTime | Auto-updated on changes |

---

## API Endpoints Architecture

### GET /api/public

**Purpose**: Public-facing API for unauthenticated users

**Query Parameters**:
- `type=gallery` - Get only gallery data
- `highlight=true` - Get only homepage items

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "gallery": [
      {
        "id": "clxxx...",
        "title": "Workshop AI",
        "image": "https://res.cloudinary.com/xxx/gema-gallery/workshop_ai.png",
        "category": "workshop",
        "description": "Workshop description..."
      }
    ]
  }
}
```

**Filtering Logic**:
```typescript
const gallery = await prisma.gallery.findMany({
  where: {
    isActive: true,
    ...(highlightOnly ? { showOnHomepage: true } : {}),
  },
  orderBy: { createdAt: 'desc' },
  take: highlightOnly ? 9 : 8
})
```

---

## Cloudinary Integration Details

### Upload Configuration

```typescript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const result = await cloudinary.uploader.upload(filePath, {
  folder: 'gema-gallery',           // Organized in folder
  public_id: 'image_name',          // Custom ID
  overwrite: true,                  // Replace if exists
  resource_type: 'image',           // Image type
})
```

### URL Structure

```
Original Upload:
https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}

With Transformations:
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}

Examples:
1. Auto-optimize:
   /image/upload/q_auto,f_auto/gema-gallery/workshop_ai.png

2. Resize + optimize:
   /image/upload/w_800,h_600,c_fill,q_auto,f_auto/gema-gallery/workshop_ai.png

3. Responsive:
   /image/upload/w_auto,dpr_auto,q_auto,f_auto/gema-gallery/workshop_ai.png
```

---

## Security Architecture

### Environment Variables Flow

```
Development:
┌──────────────┐
│ .env.local   │  ← Developer sets locally
│              │  ← NEVER commit to git
│ Contains:    │
│ - CLOUD_NAME │
│ - API_KEY    │
│ - API_SECRET │
└──────┬───────┘
       │
       │ Loaded by Next.js
       ▼
┌──────────────┐
│ Seed Script  │
│ Server-side  │
└──────────────┘

Production:
┌──────────────┐
│ Vercel Env   │  ← Set via dashboard/CLI
│ Variables    │  ← Encrypted at rest
└──────┬───────┘
       │
       │ Injected at build/runtime
       ▼
┌──────────────┐
│ Next.js App  │
│ Server       │
└──────────────┘
```

### Security Best Practices

1. **Never expose API_SECRET to frontend**
   - Only used in server-side scripts
   - Never in client components

2. **Use signed uploads for user-generated content**
   - Admin panel uploads should be signed
   - Prevents unauthorized uploads

3. **Restrict folder permissions**
   - Set upload restrictions in Cloudinary dashboard
   - Whitelist allowed formats

4. **Rate limiting**
   - Cloudinary provides automatic rate limiting
   - Monitor usage in dashboard

---

## Performance Optimizations

### Image Optimization Pipeline

```
Original Image (2MB PNG)
        │
        │ Upload to Cloudinary
        ▼
Cloudinary Processing
        │
        ├─ WebP conversion (-70% size)
        ├─ AVIF conversion (-80% size)
        ├─ Quality optimization
        ├─ Metadata stripping
        └─ Responsive sizing
        │
        │ Serve via CDN
        ▼
Edge Servers Worldwide
        │
        │ Cache at edge
        ▼
User's Browser (Fast Load!)
```

### Loading Strategy

1. **Lazy Loading**
   - Images below fold load on scroll
   - Reduces initial page load

2. **Progressive Loading**
   - Low-quality placeholder first
   - High-quality loaded progressively

3. **Responsive Images**
   - Different sizes for different devices
   - Mobile gets smaller images

4. **CDN Caching**
   - Images cached at edge locations
   - Sub-100ms load times globally

---

## Scaling Considerations

### Current Setup (Free Tier)
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month
- Suitable for: Small to medium traffic

### When to Upgrade
- **Storage**: Running out of space (monitor in dashboard)
- **Bandwidth**: High traffic exceeding 25GB/month
- **Transformations**: Heavy image processing needs

### Horizontal Scaling
```
Single Server → Multiple Regions
      │
      ├─ Cloudinary handles this automatically
      ├─ CDN edge servers worldwide
      ├─ Auto-scales with traffic
      └─ No code changes needed
```

---

## Monitoring & Maintenance

### What to Monitor

1. **Cloudinary Dashboard**
   - Storage usage
   - Bandwidth consumption
   - Transformation count
   - Error rates

2. **Application Logs**
   - Upload success/failure rates
   - API response times
   - Database query performance

3. **User Experience**
   - Image load times
   - Failed image loads
   - CDN cache hit rates

### Maintenance Tasks

**Weekly**:
- [ ] Review Cloudinary usage
- [ ] Check for failed uploads
- [ ] Monitor bandwidth trends

**Monthly**:
- [ ] Cleanup unused images
- [ ] Review transformation usage
- [ ] Optimize underperforming images

**Quarterly**:
- [ ] Audit image inventory
- [ ] Review access patterns
- [ ] Plan capacity needs

---

## Disaster Recovery

### Backup Strategy

```
Primary: Cloudinary
        │
        ├─ Automatic backups by Cloudinary
        ├─ Version history available
        └─ 99.99% uptime SLA
        │
Secondary: Local Backup
        │
        ├─ Keep originals in public/images/
        ├─ Git tracks file structure
        └─ Can re-seed if needed
```

### Recovery Procedures

**Scenario 1: Cloudinary Account Issue**
1. Run seed script with backup account
2. Update environment variables
3. Re-seed all images

**Scenario 2: Database Corruption**
1. Restore database from backup
2. Images still available in Cloudinary
3. Run seed to repopulate if needed

**Scenario 3: Accidental Deletion**
1. Check Cloudinary version history
2. Restore from Cloudinary backup
3. Or re-upload from local copy

---

## Development Workflow

### Adding New Gallery Items

```
1. Developer adds image
   ↓
   Save to: public/images/new_image.png
   
2. Update seed script
   ↓
   Edit: seed/seed-gallery-cloudinary.ts
   Add new GalleryData object
   
3. Run test
   ↓
   npm run db:test-gallery-cloudinary
   
4. Run seed
   ↓
   npm run db:seed-gallery-cloudinary
   
5. Verify
   ↓
   Check: Landing page, Gallery page, Admin panel
   
6. Commit
   ↓
   Git add/commit (NOT .env files!)
   
7. Deploy
   ↓
   Push to production
   Run production seed if needed
```

---

## Testing Strategy

### Test Pyramid

```
        ╱╲
       ╱  ╲
      ╱ E2E ╲         Playwright tests
     ╱──────╲        - Full user flows
    ╱        ╲
   ╱Integration╲     API tests
  ╱────────────╲    - Cloudinary upload
 ╱              ╲   - Database operations
╱     Unit       ╲  Component tests
──────────────────  - Image optimization
                    - Data transformations
```

### Test Coverage

1. **Unit Tests**
   - Image URL validation
   - Data transformation functions
   - Component rendering

2. **Integration Tests**
   - Cloudinary upload/delete
   - Database CRUD operations
   - API endpoint responses

3. **E2E Tests**
   - Gallery page loads
   - Images display correctly
   - Admin panel functionality

---

**Documentation Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained by**: GEMA SMA Development Team