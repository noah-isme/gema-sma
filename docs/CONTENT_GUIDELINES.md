# 📋 Aturan Konten: Tutorial vs Berita

## 🎯 Perbedaan Kategori

### 📚 **Tutorial (category: "tutorial")**
**Tujuan:** Mengajarkan skill coding secara praktis

**Karakteristik:**
- ✅ Ada code examples (HTML, CSS, JavaScript, Python, dll)
- ✅ Step-by-step guide yang detail
- ✅ Screenshots atau ilustrasi
- ✅ Hands-on practice / latihan
- ✅ Code yang bisa di-copy
- ✅ Penjelasan teknis konsep programming
- ✅ Challenge / bonus untuk level up

**Contoh Tutorial:**
- "Bikin Kartu Ucapan Digital dengan HTML & CSS"
- "Website Tips Interaktif: Accordion & Modal"
- "Game Tebak Angka dengan JavaScript"
- "CRUD Application dengan LocalStorage"

**Format Konten:**
```html
<div class="tutorial-content">
  <!-- Hero dengan info waktu, level, prerequisites -->
  
  <!-- Learning Objectives -->
  
  <!-- Step 1: Setup -->
  <pre><code>
    // Code example di sini
  </code></pre>
  
  <!-- Step 2: Implementation -->
  <!-- Step 3: Styling -->
  <!-- Step 4: Testing -->
  
  <!-- Bonus Challenge -->
  <!-- Conclusion -->
</div>
```

---

### 📰 **Berita (category: "news")**
**Tujuan:** Memberikan informasi & update terkini

**Karakteristik:**
- ✅ Informatif & faktual
- ✅ Berita sekolah / event
- ✅ Update teknologi terkini
- ✅ Prestasi siswa
- ✅ Pengumuman penting
- ❌ **TIDAK ADA CODE**
- ❌ **TIDAK ADA TUTORIAL TEKNIS**
- ❌ **TIDAK ADA STEP-BY-STEP CODING**

**Contoh Berita:**
- "GEMA SMA Wahidiyah Resmi Diluncurkan!"
- "Siswa SMA Wahidiyah Juara Coding Competition"
- "Workshop AI & Machine Learning"
- "Perkembangan AI di 2025"
- "Update Fitur Baru GEMA"

**Format Konten:**
```html
<div class="news-content">
  <!-- Header berita dengan tanggal, penulis -->
  
  <!-- Featured image -->
  
  <!-- Lead paragraph (5W1H) -->
  
  <!-- Body: fakta, quotes, detail event -->
  
  <!-- Quotes dari narasumber -->
  
  <!-- Call-to-action (jika ada) -->
  
  <!-- Footer: kontak/info tambahan -->
</div>
```

---

## 🗓️ Standar Tahun Konten

**Semua konten harus menggunakan tahun 2025 atau lebih baru:**
- ✅ publishedAt: 2025-01-15 (atau lebih baru)
- ✅ Event dates: 2025
- ✅ References: "di tahun 2025", "bulan Januari 2025"
- ❌ Jangan gunakan tahun lama (2024 kebawah)

---

## 📊 Status & Visibility

### Status Artikel:
1. **draft** - Artikel sedang dikerjakan, **TIDAK MUNCUL** di public
2. **published** - Artikel sudah siap, **MUNCUL** di public
3. **archived** - Artikel lama, tidak ditampilkan

### API Filtering:
```typescript
// Public page (tutorial/news) - HANYA published
GET /api/tutorial/articles?status=published&category=tutorial

// Admin panel - Bisa lihat semua
GET /api/tutorial/articles?status=all&category=news
```

---

## 🎨 Template & Styling

### Tutorial Template:
- Code blocks dengan syntax highlighting
- Step indicators (1, 2, 3, ...)
- Interactive checkboxes
- Copy code button
- Bonus/Challenge section
- Tips & tricks boxes

### News Template:
- Clean & readable typography
- Featured images
- Quote boxes untuk testimoni
- Info boxes untuk highlight
- Call-to-action buttons
- No code blocks

---

## ✅ Checklist Sebelum Publish

### Tutorial:
- [ ] Ada minimal 3 code examples
- [ ] Step-by-step jelas dan terstruktur
- [ ] Prerequisites dijelaskan
- [ ] Estimated time & difficulty level
- [ ] Testing checklist
- [ ] Category: "tutorial"
- [ ] Status: "published"
- [ ] PublishedAt: 2025 atau lebih baru

### Berita:
- [ ] Judul jelas & menarik
- [ ] Lead paragraph mencakup 5W1H
- [ ] Tanggal & sumber jelas
- [ ] Quotes (jika ada) akurat
- [ ] **TIDAK ADA CODE**
- [ ] Category: "news"
- [ ] Status: "published"
- [ ] PublishedAt: 2025 atau lebih baru

---

## 🔧 Seed Data Files

### Tutorial Articles:
```bash
npx ts-node seed/seed-tutorial-articles.ts
```
Files: `seed/seed-tutorial-articles.ts`

### News Articles:
```bash
npx ts-node seed/seed-news-articles.ts
```
Files: `seed/seed-news-articles.ts`

### Update Specific Tutorial:
```bash
npx ts-node seed/update/update-accordion-modal-tutorial.ts
```
Files: `seed/update/update-*-tutorial.ts`

---

## 🚀 Quick Commands

```bash
# Seed semua data
npm run seed

# Seed tutorial saja
npx ts-node seed/seed-tutorial-articles.ts

# Seed news saja
npx ts-node seed/seed-news-articles.ts

# Update tutorial tertentu
npx ts-node seed/update/update-accordion-modal-tutorial.ts

# Cek artikel di database
npx prisma studio
```

---

## 📌 Important Notes

1. **Tutorial = Ada Code** | **News = No Code**
2. **Semua konten tahun 2025+**
3. **Draft tidak muncul di public**
4. **Published harus lengkap & berkualitas**
5. **Category harus jelas: "tutorial" atau "news"**

---

**Last Updated:** November 2025  
**Maintained by:** Tim GEMA SMA Wahidiyah
