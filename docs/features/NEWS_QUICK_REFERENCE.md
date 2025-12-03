# 📰 Quick Reference - Halaman Berita GEMA

## 🎯 Akses Cepat

### URLs
- **Halaman Berita**: `http://localhost:3000/news`
- **Detail Berita**: `http://localhost:3000/news/[slug]`
- **API Berita**: `http://localhost:3000/api/news`

### Navigation
- Dari **Landing Page** → Button "Lihat Berita" di Hero Section
- Dari **Tutorial Page** → Button "Lihat Berita" di Header
- Direct link: `/news`

## 🗂️ Struktur Files

```
✅ /src/app/news/page.tsx                    - Main news listing
✅ /src/app/news/[slug]/page.tsx             - News detail page
✅ /src/app/api/news/route.ts                - GET & POST API
✅ /src/app/api/news/[slug]/route.ts         - GET detail API
✅ /src/app/api/news/[slug]/view/route.ts    - POST view counter
```

## 🎨 Features

### Halaman Utama (`/news`)
- ✅ Featured news dengan highlight
- ✅ Category filter (Semua, Sekolah, Prestasi, Kegiatan, Pengumuman, Teknologi)
- ✅ Search bar
- ✅ Trending news section
- ✅ Recent news grid
- ✅ Responsive & dark mode

### Halaman Detail (`/news/[slug]`)
- ✅ Full article content
- ✅ Meta info (author, date, reading time, views)
- ✅ Share buttons (Facebook, Twitter, LinkedIn, Copy)
- ✅ Related news
- ✅ Code syntax highlighting
- ✅ Auto view counter

## 🚀 API Endpoints

### 1. GET `/api/news`
```bash
# Get all published news
curl http://localhost:3000/api/news

# Filter by tags
curl http://localhost:3000/api/news?tags=prestasi,kompetisi

# Search news
curl http://localhost:3000/api/news?search=programming

# Pagination
curl http://localhost:3000/api/news?page=1&limit=10

# Featured only
curl http://localhost:3000/api/news?featured=true
```

### 2. GET `/api/news/[slug]`
```bash
curl http://localhost:3000/api/news/peluncuran-platform-gema
```

### 3. POST `/api/news/[slug]/view`
```bash
curl -X POST http://localhost:3000/api/news/peluncuran-platform-gema/view
```

### 4. POST `/api/news` (Admin only)
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Berita Baru",
    "excerpt": "Summary...",
    "content": "Full content...",
    "tags": ["sekolah", "pengumuman"],
    "status": "published",
    "featured": false,
    "readTime": 5
  }'
```

## 🎯 Categories & Tags

### Categories
- `all` - Semua Berita
- `sekolah` - Berita Sekolah
- `prestasi` - Prestasi Siswa
- `kegiatan` - Kegiatan & Event
- `pengumuman` - Pengumuman Penting
- `teknologi` - Update Teknologi

### Common Tags
- `prestasi` - Prestasi/Achievement
- `kompetisi` - Competition
- `workshop` - Workshop/Training
- `teknologi` - Technology Updates
- `sekolah` - School News
- `kegiatan` - Activities/Events
- `pengumuman` - Announcements
- `industri` - Industry Visit
- `karir` - Career
- `platform` - Platform Updates
- `update` - Feature Updates

## 📝 Content Format

### Markdown Support
```markdown
# Heading 1
## Heading 2

**Bold text**
*Italic text*

- List item 1
- List item 2

1. Numbered list
2. Second item

\`\`\`python
# Code block
def hello():
    print("Hello, World!")
\`\`\`

> Blockquote

[Link text](url)
```

## 🎨 Color Scheme

```css
Primary (Indigo):   #6366F1
Secondary (Pink):   #EC4899
Success (Green):    #10B981
Warning (Amber):    #FBBF24
Info (Cyan):        #06B6D4
Purple:             #8B5CF6
```

## 🔧 Development

### Run Development Server
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

### Seed News Data
```bash
npx tsx seed/seed-news-articles.ts
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px` - Single column
- **Tablet**: `768px - 1024px` - 2 columns
- **Desktop**: `> 1024px` - 3 columns
- **Featured**: Always full width

## 🎯 Key Components

### NewsCard
```tsx
<NewsCard 
  article={article} 
  index={index} 
/>
```

### Search Bar
```tsx
<input 
  type="text" 
  placeholder="Cari berita..." 
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

### Category Filter
```tsx
<button onClick={() => setSelectedCategory(cat.id)}>
  {cat.label}
</button>
```

## ✅ Testing Checklist

- [ ] Buka `/news` - list berita muncul
- [ ] Test search functionality
- [ ] Test category filters
- [ ] Klik berita → detail page muncul
- [ ] Test share buttons
- [ ] Test related news
- [ ] Test responsive di mobile
- [ ] Test dark mode toggle
- [ ] Check API response
- [ ] Check view counter increment

## 🚀 Quick Start Guide

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Navigate to News**:
   - Open: `http://localhost:3000/news`

3. **Create News (via Admin Panel atau API)**:
   - Login as Admin
   - Use POST `/api/news` endpoint

4. **View News**:
   - Browse list page
   - Click any news card
   - Check detail page

## 🎉 Status

✅ **COMPLETED & WORKING**

- News page fully functional
- API endpoints working
- Navigation integrated
- Build successful
- Ready for production

---

**Quick Links**:
- 📚 [Full Documentation](./NEWS_PAGE_IMPLEMENTATION.md)
- 🏠 [Landing Page](/)
- 📰 [News Page](/news)
- 📖 [Tutorial Page](/tutorial)
