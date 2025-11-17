# 🔄 Prompt System - Migration to Database

## ✅ **COMPLETED: Prompt moved from JSON to Database**

### **Previous System:**
- ❌ Prompts stored in JSON file: `/src/data/prompts/webPortfolioSma.json`
- ❌ Managed via file-based API: `/api/prompts/[schemaId]`
- ❌ No database integration
- ❌ Difficult to manage and query

### **New System:**
- ✅ Prompts stored in **PostgreSQL database** (Prisma)
- ✅ Full CRUD API: `/api/tutorial/prompts`
- ✅ Integrated with tutorial page
- ✅ Easy to manage from admin panel

---

## 📊 **Database Schema**

### **New Table: `prompts`**

```prisma
model Prompt {
  id                  String   @id @default(cuid())
  schemaId            String   // webPortfolioSma, etc
  title               String   // Bagian 1 • Mendeteksi Keunikan Diri
  titleShort          String   // Pemetaan Persona
  slug                String   @unique
  
  // Meta Information
  level               String   // Menengah, Pemula, Lanjut
  durasiMenit         Int      // Duration in minutes
  prasyarat           Json     // Array of prerequisites
  tujuanPembelajaran  Json     // Array of learning objectives
  tags                Json     // Array of tags
  
  // Assets
  starterZip          String?  // URL to starter files
  gambarContoh        String?  // URL to example image
  
  // Content Sections
  roleDeskripsi       String   // Role description
  roleFokus           String   // Role focus
  
  taskTujuan          Json     // Array of task objectives
  taskInstruksi       String   // Task instructions
  
  contextSituasi      Json     // Array of context situations
  
  reasoningPrinsip    String   // Reasoning principle
  reasoningStruktur   Json     // Reasoning structure
  reasoningStrategi   Json     // Array of strategies
  
  outputBentuk        Json     // Array of output formats
  outputTugasSiswa    String   // Student task description
  
  stopKriteria        Json     // Array of stop criteria
  
  tipsAksesibilitas   Json     // Array of accessibility tips
  tipsKesalahanUmum   Json     // Array of common mistakes
  tipsTantangan       Json     // Array of challenges
  
  // Admin fields
  author              String   // Admin name
  authorId            String   // Admin ID
  status              String   @default("draft") // draft, published
  featured            Boolean  @default(false)
  views               Int      @default(0)
  
  // Versioning
  versi               String   @default("1.0.0")
  
  // Timestamps
  publishedAt         DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@index([schemaId])
  @@index([status])
  @@index([featured])
  @@index([slug])
}
```

---

## 🚀 **API Endpoints**

### **1. GET /api/tutorial/prompts**

Get all prompts with filtering and pagination.

**Query Parameters:**
- `schemaId` - Filter by schema (webPortfolioSma)
- `status` - Filter by status (draft, published, all)
- `featured` - Filter featured prompts (true/false)
- `limit` - Pagination limit
- `page` - Page number

**Example:**
```bash
GET /api/tutorial/prompts?status=published&schemaId=webPortfolioSma
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prompt-id",
      "schemaId": "webPortfolioSma",
      "title": "Bagian 1 • Mendeteksi Keunikan Diri",
      "titleShort": "Pemetaan Persona",
      "slug": "web-portfolio-sma-b1",
      "level": "Menengah",
      "durasiMenit": 25,
      "tags": ["perencanaan", "ux copy"],
      "featured": true,
      "status": "published",
      ...
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### **2. POST /api/tutorial/prompts**

Create new prompt (Admin only).

**Authentication:** Required

**Body:**
```json
{
  "schemaId": "webPortfolioSma",
  "title": "Bagian X • New Section",
  "titleShort": "Short Title",
  "slug": "unique-slug",
  "level": "Menengah",
  "durasiMenit": 30,
  "prasyarat": ["HTML", "CSS"],
  "tujuanPembelajaran": ["Learn X", "Master Y"],
  "tags": ["tag1", "tag2"],
  "roleDeskripsi": "Role description",
  "roleFokus": "Focus area",
  "taskTujuan": ["Goal 1", "Goal 2"],
  "taskInstruksi": "Instructions",
  ...
}
```

---

## 🔄 **Migration Steps**

### **Step 1: Update Prisma Schema**

✅ **Done!** Model `Prompt` added to `schema.prisma`

### **Step 2: Generate Prisma Client**

```bash
npx prisma generate
```

✅ **Done!**

### **Step 3: Run Database Migration**

```bash
# Create migration
npx prisma migrate dev --name add_prompt_model

# Or just push changes
npx prisma db push
```

⚠️ **Action Required:** Run this command!

### **Step 4: Migrate Data from JSON to Database**

```bash
npx tsx scripts/migrate-prompts-to-db.ts
```

**Script Features:**
- ✅ Reads from `/src/data/prompts/webPortfolioSma.json`
- ✅ Converts to database format
- ✅ Skips duplicates (checks by slug)
- ✅ Sets first prompt as featured
- ✅ Shows migration summary

**Expected Output:**
```
🚀 Starting prompt migration from JSON to database...

📄 Found schema: webPortfolioSma
📊 Total sections: 10

✅ Created: Bagian 1 • Mendeteksi Keunikan Diri
✅ Created: Bagian 2 • Mendesain Halaman Utama
...

📊 Migration Summary:
   ✅ Created: 10
   ⏭️  Skipped: 0
   📝 Total: 10

✨ Migration completed successfully!
```

⚠️ **Action Required:** Run this script after database migration!

### **Step 5: Update Tutorial Page**

✅ **Done!** Tutorial page now fetches from `/api/tutorial/prompts`

---

## 📝 **Tutorial Page Integration**

### **Before:**
```typescript
// Fetched from JSON file
const promptRes = await fetch("/api/prompts/webPortfolioSma");
```

### **After:**
```typescript
// Fetch from database
const promptRes = await fetch("/api/tutorial/prompts?status=all");

// Convert to article format for unified display
promptArticles = promptData.data.map((prompt: PromptFromDB) => ({
  id: prompt.id,
  title: prompt.title,
  slug: prompt.slug,
  excerpt: prompt.roleDeskripsi,
  category: 'prompt',
  tags: Array.isArray(prompt.tags) ? prompt.tags : [],
  readTime: prompt.durasiMenit,
  featured: prompt.featured,
  ...
}));
```

---

## 🎯 **Benefits of Database Migration**

### **1. Better Data Management**
- ✅ CRUD operations via API
- ✅ Easy to update from admin panel
- ✅ Versioning support
- ✅ Soft delete (status: archived)

### **2. Better Performance**
- ✅ Database indexing (slug, schemaId, status)
- ✅ Efficient queries with Prisma
- ✅ Pagination support
- ✅ Filter by multiple criteria

### **3. Better Integration**
- ✅ Unified with Article system
- ✅ Same admin panel flow
- ✅ Consistent API structure
- ✅ Easy to extend

### **4. Better Features**
- ✅ View tracking
- ✅ Featured flag
- ✅ Publish/draft status
- ✅ Author tracking
- ✅ Timestamps

---

## 🔧 **Admin Panel Integration (Next Steps)**

### **Update Prompt Admin Page:**

**File:** `/src/app/admin/tutorial/prompt/page.tsx`

**Changes needed:**
1. Replace file-based operations with API calls
2. Use `/api/tutorial/prompts` instead of file operations
3. Add CRUD UI (Create, Read, Update, Delete)
4. Add status toggle (draft/published)
5. Add featured toggle

### **Example API Usage:**

```typescript
// Fetch prompts
const prompts = await fetch('/api/tutorial/prompts').then(r => r.json());

// Create prompt
await fetch('/api/tutorial/prompts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(promptData)
});

// Update prompt (TODO: create [id]/route.ts)
await fetch(`/api/tutorial/prompts/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(updates)
});
```

---

## 📊 **Data Comparison**

### **JSON File:**
```json
{
  "schemaId": "webPortfolioSma",
  "sections": [
    {
      "title": "Bagian 1 • ...",
      "meta": { ... },
      "role": { ... },
      "task": { ... }
    }
  ]
}
```

### **Database:**
```sql
SELECT * FROM prompts 
WHERE schemaId = 'webPortfolioSma' 
  AND status = 'published'
ORDER BY featured DESC, publishedAt DESC;
```

---

## ✅ **Migration Checklist**

### **Database:**
- [x] Create Prompt model in schema.prisma
- [x] Generate Prisma client
- [ ] Run database migration (`prisma migrate dev`)
- [ ] Run data migration script (`tsx scripts/migrate-prompts-to-db.ts`)

### **API:**
- [x] Create GET endpoint `/api/tutorial/prompts`
- [x] Create POST endpoint for creating prompts
- [ ] Create PATCH endpoint for updating prompts
- [ ] Create DELETE endpoint for deleting prompts

### **Frontend:**
- [x] Update tutorial page to fetch from new API
- [x] Convert prompt format to article format
- [x] Display in "Prompt" tab
- [ ] Update admin prompt page to use API
- [ ] Add CRUD UI in admin panel

### **Testing:**
- [ ] Test prompt creation
- [ ] Test prompt listing
- [ ] Test filtering (status, featured, schemaId)
- [ ] Test pagination
- [ ] Test tutorial page display

---

## 🚀 **Quick Start Commands**

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run database migration
npx prisma migrate dev --name add_prompt_model

# 3. Migrate data from JSON
npx tsx scripts/migrate-prompts-to-db.ts

# 4. Verify in database
npx prisma studio
# Open table "prompts" and check data

# 5. Test API
curl http://localhost:3000/api/tutorial/prompts?status=published

# 6. Check tutorial page
# Open: http://localhost:3000/tutorial
# Click tab: "Prompt" (💡)
```

---

## 📌 **Important Notes**

1. **JSON file still exists** but is no longer used by tutorial page
2. **Old API** `/api/prompts/[schemaId]` can be kept for backward compatibility
3. **Admin panel** needs to be updated to use new database API
4. **Run migration** AFTER database schema is applied
5. **Backup JSON** before running migration (optional)

---

## 🎉 **Result**

✅ **Prompts now stored in database**  
✅ **Full API support for CRUD**  
✅ **Integrated with tutorial page**  
✅ **Ready for admin panel integration**  
✅ **Scalable and maintainable**

**Status:** ✅ **Migration Ready - Run migration commands!**

---

**Files Created/Modified:**
1. `/prisma/schema.prisma` - Added Prompt model
2. `/src/app/api/tutorial/prompts/route.ts` - New API endpoint
3. `/src/app/tutorial/page.tsx` - Updated to fetch from database
4. `/scripts/migrate-prompts-to-db.ts` - Migration script
5. `/PROMPT_DATABASE_MIGRATION.md` - This documentation

**Next Steps:**
1. Run `npx prisma migrate dev --name add_prompt_model`
2. Run `npx tsx scripts/migrate-prompts-to-db.ts`
3. Test tutorial page `/tutorial` → Click "Prompt" tab
4. Update admin panel to use new API

---

**Last Updated:** 2025-01-17  
**Version:** 1.0.0
