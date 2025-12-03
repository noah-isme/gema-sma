# 📡 Announcements API Integration Guide

## ✅ Status: Backend Complete, Frontend Integration In Progress

### 🎯 What's Been Completed

#### 1. **Database Schema** ✅
Updated Prisma schema with new fields:
- `category` (enum: KELAS, EVENT, TUGAS, NILAI, SISTEM)
- `excerpt` (short description)
- `isImportant` (boolean)
- `deadline` (DateTime, optional)
- `link` (string, optional)
- `views` (integer, default: 0)

**Location**: `prisma/schema.prisma` (lines 273-297)

#### 2. **API Endpoints** ✅

##### Public Endpoints:
- `GET /api/announcements` - Get all active announcements
  - Query params: `category`, `isActive`, `showOnHomepage`
- `GET /api/announcements/[id]` - Get single announcement (auto-increments views)

##### Admin Endpoints (requires authentication):
- `GET /api/admin/announcements` - Get all announcements
- `POST /api/admin/announcements` - Create announcement
- `GET /api/admin/announcements/[id]` - Get single announcement
- `PUT /api/admin/announcements/[id]` - Update announcement
- `DELETE /api/admin/announcements/[id]` - Delete announcement

#### 3. **Type Definitions** ✅
- `src/features/admin/announcements/types.ts` - Updated with new fields
- `src/app/announcements/types.ts` - Frontend types
- `src/app/announcements/utils.ts` - Helper functions

---

## 🔧 Next Steps: Frontend Integration

### Step 1: Update Announcements Page to Fetch from API

The announcements page (`src/app/announcements/page.tsx`) currently uses mock data.

**Replace mock data with API fetch:**

```typescript
// Add at the top of the component
const [announcements, setAnnouncements] = useState<Announcement[]>([]);
const [isLoading, setIsLoading] = useState(true);

// Fetch function
const fetchAnnouncements = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/announcements?isActive=true');
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data: AnnouncementAPI[] = await response.json();
    
    // Transform API data to UI format
    const transformed = data.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt || item.content.substring(0, 100) + '...',
      content: item.content,
      category: item.category.toLowerCase() as AnnouncementCategory,
      timestamp: formatRelativeTime(new Date(item.publishDate)),
      date: new Date(item.publishDate),
      isImportant: item.isImportant,
      isUnread: false, // Client-side tracking
      icon: getCategoryIcon(item.category),
      color: categoryConfig[item.category.toLowerCase()].color,
      deadline: formatDeadline(item.deadline),
      link: item.link || undefined,
      views: item.views,
    }));
    
    setAnnouncements(transformed);
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  fetchAnnouncements();
}, [fetchAnnouncements]);
```

### Step 2: Update Admin Panel

The admin panel (`src/features/admin/announcements/AnnouncementForm.tsx`) needs to support new fields.

**Add form fields:**
- Category dropdown (KELAS, EVENT, TUGAS, NILAI, SISTEM)
- Excerpt textarea
- Important checkbox
- Deadline date picker
- Link input

### Step 3: Database Migration

Run migration to update production database:

```bash
# If not already done
npx prisma migrate dev --name add_announcement_features

# Or for production
npx prisma migrate deploy
```

### Step 4: Seed Initial Data (Optional)

Create seed script to populate with sample announcements:

```typescript
// prisma/seed-announcements.ts
const announcements = [
  {
    title: "Workshop Mobile Development",
    excerpt: "Belajar Flutter dari basic hingga advanced",
    content: "...",
    category: "EVENT",
    isImportant: true,
    deadline: new Date("2024-01-20"),
    link: "/events/mobile-workshop",
  },
  // ... more announcements
];

for (const announcement of announcements) {
  await prisma.announcement.create({ data: announcement });
}
```

---

## 📋 Complete Integration Checklist

### Backend ✅
- [x] Update Prisma schema
- [x] Create API routes (public + admin)
- [x] Add authentication middleware
- [x] Update type definitions
- [x] Generate Prisma client

### Frontend (To Do)
- [ ] Update announcements page to fetch from API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement client-side "unread" tracking (localStorage)
- [ ] Update admin form with new fields
- [ ] Add category icons mapping
- [ ] Add date pickers for deadline
- [ ] Test all CRUD operations

### Testing
- [ ] Test public endpoints
- [ ] Test admin endpoints with auth
- [ ] Test filtering by category
- [ ] Test sorting
- [ ] Test view counter
- [ ] Test responsive design
- [ ] Test dark mode

### Deployment
- [ ] Run migrations on production
- [ ] Seed initial data
- [ ] Test API on production
- [ ] Monitor performance

---

## 🧪 Testing API Endpoints

### Public API Test:
```bash
# Get all announcements
curl http://localhost:3000/api/announcements

# Filter by category
curl http://localhost:3000/api/announcements?category=EVENT

# Get single announcement
curl http://localhost:3000/api/announcements/[id]
```

### Admin API Test (requires auth token):
```bash
# Create announcement
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Announcement",
    "excerpt": "Test excerpt",
    "content": "Full content here",
    "category": "SISTEM",
    "isImportant": false,
    "isActive": true
  }'
```

---

## 🔄 Data Flow

```
User Opens Page
    ↓
Frontend fetches: GET /api/announcements?isActive=true
    ↓
API queries Prisma
    ↓
Returns AnnouncementAPI[]
    ↓
Frontend transforms to Announcement[]
    ↓
Renders cards with animations
    ↓
User clicks card
    ↓
Frontend fetches: GET /api/announcements/[id]
    ↓
API increments views + returns data
    ↓
Shows detail in bottom sheet
```

---

## 🎨 Category Mapping

| Database | Frontend | Icon | Color |
|----------|----------|------|-------|
| KELAS | kelas | BookOpen | #A5E8D3 |
| EVENT | event | Calendar | #FFD485 |
| TUGAS | tugas | Award | #D8C7FF |
| NILAI | nilai | TrendingUp | #97D6FF |
| SISTEM | sistem | Bell | #FFC7DD |

---

## 📝 Sample API Response

```json
[
  {
    "id": "clx123abc",
    "title": "Workshop Mobile Development",
    "excerpt": "Belajar Flutter dari basic hingga advanced",
    "content": "GEMA mengadakan workshop...",
    "category": "EVENT",
    "isImportant": true,
    "isActive": true,
    "deadline": "2024-01-20T00:00:00.000Z",
    "link": "/events/mobile-workshop",
    "views": 234,
    "publishDate": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

## 🚀 Quick Integration Script

For quick frontend integration, add this to `page.tsx`:

```typescript
// Replace mockAnnouncements with:
const [announcements, setAnnouncements] = useState<Announcement[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/announcements?isActive=true')
    .then(res => res.json())
    .then(data => {
      const transformed = data.map(transformAnnouncementFromAPI);
      setAnnouncements(transformed);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

// Then use {loading ? <AnnouncementsLoading /> : /* render cards */}
```

---

## 💡 Pro Tips

1. **Caching**: Consider using SWR or React Query for better caching
2. **Optimistic Updates**: Update UI immediately, sync with server
3. **Error Boundaries**: Add error boundaries for API failures
4. **Loading States**: Use existing skeleton components
5. **Incremental Migration**: Can keep mock data as fallback initially

---

## �� Support

If you encounter issues:
1. Check Prisma schema is up to date: `npx prisma generate`
2. Verify API routes are accessible
3. Check browser console for errors
4. Verify authentication for admin routes

---

**Status**: Backend ✅ Complete | Frontend ⏳ Ready for Integration

**Next Action**: Update `src/app/announcements/page.tsx` to replace mock data with API fetch

---

Last Updated: 2025-01-16
Version: 1.0.0
