# 🔌 Tutorial Page - API Integration Guide

## ✅ Status Integrasi

**Halaman tutorial SUDAH TERINTEGRASI dengan API!** 

Semua data artikel diambil dari database melalui endpoint `/api/tutorial/articles`.

---

## 📡 API Endpoint

### **GET /api/tutorial/articles**

**Base URL:** `/api/tutorial/articles`

**Method:** GET

**Authentication:** None (Public endpoint)

---

## 📥 Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | string | - | Filter by category (berita, artikel, prompt, kuis, diskusi) |
| `status` | string | `published` | Filter by status |
| `featured` | boolean | - | Filter featured articles only |
| `limit` | number | - | Pagination limit |
| `page` | number | 1 | Page number |

### **Example Requests:**

```bash
# Get all published articles
GET /api/tutorial/articles

# Get featured articles only
GET /api/tutorial/articles?featured=true

# Get articles by category
GET /api/tutorial/articles?category=artikel

# Pagination
GET /api/tutorial/articles?limit=10&page=2
```

---

## 📤 Response Format

### **Success Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "article-id",
      "title": "Tutorial Title",
      "slug": "tutorial-slug",
      "excerpt": "Short description...",
      "category": "artikel",
      "tags": ["html", "css", "javascript"],
      "author": "Admin Name",
      "status": "published",
      "featured": true,
      "imageUrl": "/path/to/image.jpg",
      "readTime": 5,
      "views": 120,
      "publishedAt": "2025-01-15T10:00:00.000Z",
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### **Error Response:**

```json
{
  "success": false,
  "error": "Failed to fetch articles"
}
```

---

## 🔄 Data Processing (Client-Side)

### **1. Fetch Articles**

```typescript
const fetchArticles = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/tutorial/articles");
    if (res.ok) {
      const data = await res.json();
      const articlesData = Array.isArray(data.data) ? data.data : [];
      
      // Process articles...
      setArticles(processedArticles);
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    setLoading(false);
  }
};
```

### **2. Add Trending Logic**

```typescript
// Mark as trending if:
// - Published within 7 days AND views > 50
// - OR views > 100 (regardless of date)

const isTrending = 
  (daysSincePublished <= 7 && (article.views || 0) > 50) ||
  (article.views || 0) > 100;
```

### **3. Process Featured**

```typescript
// Map API's `featured` field to `isFeatured`
const processedArticles = articlesData.map((article) => ({
  ...article,
  isFeatured: article.featured || false,
  isTrending: calculateTrending(article),
}));
```

---

## 🎯 Client-Side Filtering

### **Category Filter:**

```typescript
const filteredArticles = useMemo(() => {
  let filtered = articles.filter(
    (article) => article.category === activeTab
  );
  
  return filtered;
}, [articles, activeTab]);
```

### **Tag Filter:**

```typescript
if (selectedTags.length > 0) {
  filtered = filtered.filter((article) =>
    article.tags?.some((tag) => selectedTags.includes(tag))
  );
}
```

### **Smart Sections:**

```typescript
// Featured: First article with isFeatured = true
const featuredArticle = filteredArticles.find((a) => a.isFeatured) 
  || filteredArticles[0];

// Recommended: First 3 articles
const recommendedArticles = filteredArticles.slice(0, 3);

// Trending: Articles with isTrending = true
const trendingArticles = filteredArticles
  .filter((a) => a.isTrending)
  .slice(0, 4);

// Grid: Remaining articles
const gridArticles = filteredArticles.filter(
  (a) => 
    a.id !== featuredArticle?.id && 
    !recommendedArticles.includes(a) && 
    !trendingArticles.includes(a)
);
```

---

## 🗄️ Database Schema

### **Article Model (Prisma):**

```prisma
model Article {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String
  category    String    // berita, artikel, prompt, kuis, diskusi
  tags        String[]  @default([])
  author      String?
  status      String    @default("draft") // draft, published
  featured    Boolean   @default(false)
  imageUrl    String?
  readTime    Int?      // in minutes
  views       Int       @default(0)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## 📊 Data Flow

```
┌─────────────────┐
│   Database      │
│   (Prisma)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Route      │
│  /api/tutorial/ │
│  articles       │
└────────┬────────┘
         │
         ▼ GET Request
┌─────────────────┐
│  Tutorial Page  │
│  (Client)       │
├─────────────────┤
│ 1. Fetch data   │
│ 2. Process      │
│ 3. Filter       │
│ 4. Display      │
└─────────────────┘
```

---

## 🔄 Real-time Updates

### **Option 1: Polling (Current)**

```typescript
useEffect(() => {
  fetchArticles();
  
  // Optional: Refresh every 5 minutes
  const interval = setInterval(fetchArticles, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

### **Option 2: Optimistic Updates**

```typescript
// After admin creates/updates article
mutate('/api/tutorial/articles'); // SWR revalidation
```

---

## 🎯 Feature Status

| Feature | API Support | Client Processing | Status |
|---------|-------------|-------------------|--------|
| Fetch articles | ✅ Yes | ✅ Yes | ✅ Working |
| Filter by category | ✅ Yes | ✅ Yes | ✅ Working |
| Filter by tags | ❌ No | ✅ Yes | ✅ Working (client-side) |
| Featured articles | ✅ Yes | ✅ Yes | ✅ Working |
| Trending logic | ❌ No | ✅ Yes | ✅ Working (calculated) |
| Views count | ✅ Yes | - | ✅ Working |
| Read time | ✅ Yes | - | ✅ Working |
| Pagination | ✅ Yes | ❌ No | ⏳ Ready (not used yet) |
| Search | ❌ No | ❌ No | ⏳ Future feature |

---

## 🚀 Performance Optimizations

### **1. useMemo for Filtered Data**

```typescript
const filteredArticles = useMemo(() => {
  // Heavy filtering logic
}, [articles, activeTab, selectedTags]);
```

**Benefits:**
- ✅ No unnecessary recalculation
- ✅ Only recomputes when dependencies change
- ✅ Faster UI updates

### **2. Lazy Loading (Future)**

```typescript
// Implement infinite scroll
const loadMore = async () => {
  const nextPage = page + 1;
  const res = await fetch(`/api/tutorial/articles?page=${nextPage}`);
  // Append to existing articles
};
```

### **3. Image Optimization**

```typescript
// Use Next.js Image component
<Image 
  src={article.imageUrl} 
  width={600} 
  height={400} 
  loading="lazy"
/>
```

---

## 🐛 Error Handling

### **1. Network Errors**

```typescript
try {
  const res = await fetch("/api/tutorial/articles");
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
} catch (error) {
  console.error("Error fetching articles:", error);
  // Show error toast/message
}
```

### **2. Empty States**

```typescript
{!loading && filteredArticles.length === 0 && (
  <EmptyState 
    title="Belum ada konten"
    description="Konten {activeTab} akan segera tersedia"
  />
)}
```

### **3. Loading States**

```typescript
{loading && <LoadingSpinner />}
```

---

## 🔐 Security

### **Public Access:**
- ✅ Tutorial articles are **public**
- ✅ No authentication required
- ✅ Only `published` status articles shown

### **Admin Only:**
- Create article: `POST /api/tutorial/articles` (requires auth)
- Update article: `PATCH /api/tutorial/articles/[id]` (requires auth)
- Delete article: `DELETE /api/tutorial/articles/[id]` (requires auth)

---

## 📈 Analytics Integration (Future)

### **Track Article Views:**

```typescript
useEffect(() => {
  // Increment view count when article is opened
  fetch(`/api/tutorial/articles/${articleId}/view`, {
    method: 'POST'
  });
}, [articleId]);
```

### **Track User Engagement:**

```typescript
// Track:
- Time spent on article
- Scroll depth
- Tag clicks
- Category switches
```

---

## 🎉 Summary

### **Current Integration Status:**

✅ **Fully Integrated:**
- Data fetched from `/api/tutorial/articles`
- All article fields mapped correctly
- Featured articles working
- Category filtering working
- Tag filtering working (client-side)
- Views & readTime displayed
- Loading states handled
- Error states handled
- Empty states handled

⏳ **Future Enhancements:**
- Server-side tag filtering
- Pagination/infinite scroll
- Search functionality
- Real-time updates (WebSocket)
- View tracking
- Analytics integration

---

## 🔗 Related Files

- **Page:** `/src/app/tutorial/page.tsx`
- **API:** `/src/app/api/tutorial/articles/route.ts`
- **Schema:** `/prisma/schema.prisma`
- **Types:** Defined in page component

---

**Status:** ✅ **Production Ready & Fully Integrated**  
**Last Updated:** 2025-01-17  
**Version:** 2.0.0
