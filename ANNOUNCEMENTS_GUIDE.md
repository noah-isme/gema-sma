# 📢 Halaman Pengumuman GEMA - Dokumentasi Lengkap

## 🎨 Konsep Desain: Playful & Joyful untuk SMA

Halaman pengumuman dirancang dengan pendekatan **playful yet elegant** yang cocok untuk audiens SMA - energik, modern, dan engaging tanpa terlihat childish.

---

## ✨ Fitur Utama

### 1. **Header Ringkas & Atraktif**
- ✅ Judul "Pengumuman Terbaru" dengan gradient text
- ✅ Subtext motivasi: "Tetap update, tetap semangat! ✨"
- ✅ Ikon Bell animasi pulse untuk menarik perhatian
- ✅ Hover effect: ikon terangkat 2-4px dengan smooth transition

### 2. **Announcement Feed (Card Style)**
Setiap pengumuman ditampilkan sebagai kartu dengan:

#### Visual Design:
- **Warna lembut**: Mint (#A5E8D3), Amber (#FFD485), Lilac (#D8C7FF), Sky (#97D6FF), Pink (#FFC7DD)
- **Ikon kategori**: Setiap kategori punya ikon dan warna sendiri
- **Card elevation**: Shadow yang mengembang saat hover
- **Responsive grid**: 1 kolom (mobile) → 2 kolom (tablet) → 3 kolom (desktop)

#### Animasi:
- ✅ **Hover**: Scale 1.03 + translate Y -5px + shadow expansion
- ✅ **Load-in**: Staggered animation (delay 80ms per card)
- ✅ **Doodle accent**: Star icon dengan opacity 20% sebagai dekorasi

#### Konten Card:
- Judul (max 2 baris, line-clamp)
- Excerpt (max 2 baris)
- Timestamp
- Deadline (jika ada)
- Badge "unread" dengan pulse animation
- CTA "Lihat Selengkapnya"

### 3. **Filter Pintar**

#### Tab Kategori:
- **All** - Semua pengumuman
- **Kelas** - Perubahan jadwal, ruangan, dll
- **Event** - Workshop, kompetisi, hackathon
- **Tugas** - Pengumpulan tugas, reminder deadline
- **Nilai** - Pengumuman nilai, rapor
- **Sistem** - Maintenance, update sistem

#### Animasi Tab:
- ✅ Active tab dengan **layout animation** (Framer Motion layoutId)
- ✅ Smooth slide transition dengan spring physics
- ✅ Color-coded sesuai kategori

#### Dropdown Sorting:
- Terbaru (default)
- Paling Populer (berdasarkan views)
- Deadline Terdekat (urgent first)

### 4. **Banner Pengumuman Penting**
Untuk pengumuman urgent/important:
- ✅ Gradient background: orange → pink → purple
- ✅ Icon ⚠️ dengan wiggle animation (tiap 5 detik)
- ✅ Background gradient shifting lembut
- ✅ Posisi: sticky di atas feed
- ✅ Clickable untuk langsung buka detail

### 5. **Detail Pengumuman (Bottom Sheet)**

#### Mobile-First Design:
- **Bottom Sheet** (bukan modal) untuk UX yang lebih natural di mobile
- Slide-up animation dengan spring bounce
- Handle bar untuk visual cue
- Backdrop blur untuk focus

#### Konten Detail:
- Badge kategori dengan warna
- Judul besar & bold
- Timestamp dan deadline
- Konten lengkap dengan prose styling
- CTA actions:
  - "Lihat Detail" (jika ada link)
  - "Tambahkan ke Kalender"

#### Animasi:
- ✅ Slide-up transition: 250ms dengan spring easing
- ✅ Confetti explosion (6 particles) untuk pengumuman important
- ✅ Backdrop fade-in: 180ms
- ✅ Button ripple effect saat click

### 6. **Mode "Belum Dibaca"**
- ✅ Blue dot indicator dengan pulse animation
- ✅ Slightly brighter card background
- ✅ Auto-remove setelah dibaca (future feature)

### 7. **Reward UX** 🔥
Gamifikasi untuk engagement:
- Track jumlah pengumuman yang dibuka
- Setelah 10 pengumuman: Toast notification
- "🔥 Kamu super update hari ini!"
- Gradient yellow-orange dengan wiggle animation
- Auto-dismiss setelah 3 detik

---

## 🎨 Design System

### Palet Warna

#### Kategori Colors:
```typescript
const categoryConfig = {
  kelas: { color: "#A5E8D3" },   // Mint - segar & clear
  event: { color: "#FFD485" },    // Amber - exciting & energetic
  tugas: { color: "#D8C7FF" },    // Lilac - calm & focused
  nilai: { color: "#97D6FF" },    // Sky - achievement & clarity
  sistem: { color: "#FFC7DD" },   // Pink - attention & care
};
```

#### Background:
- Light mode: `from-purple-50 via-pink-50 to-blue-50`
- Dark mode: `from-gray-900 via-purple-900/20 to-blue-900/20`

### Typography
- **Heading**: System font stack (SF Pro, Segoe UI, Roboto)
- **Body**: Tailwind default
- **Weight**: 
  - Titles: font-bold (700)
  - Body: font-normal (400)
  - CTA: font-medium (500)

### Spacing
- Container: `max-w-6xl` dengan padding responsive
- Card gap: `gap-6` (24px)
- Section margins: `mb-8` hingga `mb-12`

---

## 🎭 Micro-Interactions Checklist

| Interaction | Effect | Duration | Easing |
|------------|--------|----------|--------|
| Card Hover | scale(1.03) + translateY(-5px) | 200ms | ease-out |
| Tab Switch | layoutId animation | 300ms | spring |
| Bottom Sheet | slide-up | 250ms | spring(300, 30) |
| Button Click | ripple + scale(0.95) | 140ms | ease-out |
| Icon Pulse | scale(1.2) loop | 2s | ease-in-out |
| Confetti | opacity + scale + position | 800ms | ease-out |
| Badge Blink | opacity 0.5 → 1 | 800ms | infinite |

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default: 1 column, full width cards

/* Tablet */
md (768px): 2 columns

/* Desktop */
lg (1024px): 3 columns

/* Max Container */
max-w-6xl (1152px): centered dengan padding
```

---

## 🚀 Implementasi Teknis

### Stack:
- **Framework**: Next.js 15 (App Router)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

### File Structure:
```
src/app/announcements/
├── page.tsx           # Main announcements page
├── loading.tsx        # Loading skeleton dengan shimmer
└── layout.tsx         # Metadata & SEO
```

### Key Components:

#### 1. AnnouncementCard
```typescript
interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "kelas" | "event" | "tugas" | "nilai" | "sistem";
  timestamp: string;
  date: Date;
  isImportant: boolean;
  isUnread: boolean;
  icon: string;
  color: string;
  deadline?: string;
  link?: string;
  views?: number;
}
```

#### 2. FloatingDoodle
Decorative SVG elements (star, heart, zigzag) yang muncul dengan animation

#### 3. Confetti
6 particles dengan random trajectory untuk celebrate important announcements

#### 4. Skeleton Loading
Shimmer effect dengan gradient sweep animation

---

## 🎯 User Flow

1. **Landing**: User melihat header + filter tabs + important banner
2. **Browse**: User scroll feed dengan staggered card animation
3. **Filter**: User bisa switch kategori (smooth tab transition)
4. **Sort**: User bisa ubah sorting via dropdown
5. **Click**: User click card → bottom sheet muncul dengan slide-up
6. **Detail**: User baca konten lengkap + lihat CTA options
7. **Action**: User bisa "Lihat Detail" atau "Tambah ke Kalender"
8. **Reward**: Setelah baca 10 pengumuman → toast reward muncul

---

## 🎨 Floating Background Elements

Untuk menambah kesan playful:
- 2 blob gradient yang floating dengan slow animation
- 5 sparkles yang rotate + fade di random positions
- Opacity rendah (10-20%) agar tidak mengganggu

---

## ♿ Accessibility

- ✅ Semantic HTML (section, article, button)
- ✅ ARIA labels untuk interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Color contrast ratio > 4.5:1
- ✅ Reduced motion support (future enhancement)

---

## 📊 Performance

### Optimizations:
- Static page generation (SSG)
- Lazy loading untuk images (jika ada)
- Memoized computed values (useMemo)
- Optimized animations (GPU-accelerated)
- Minimal re-renders dengan useCallback

### Bundle Size:
Estimasi: ~40KB gzipped (termasuk Framer Motion)

---

## 🔮 Future Enhancements

### Phase 2:
- [ ] Real-time notifications via WebSocket
- [ ] Infinite scroll / pagination
- [ ] Search functionality
- [ ] Bookmark/save announcements
- [ ] Share announcement (WhatsApp, copy link)
- [ ] Mark as read/unread
- [ ] Push notifications

### Phase 3:
- [ ] Admin panel untuk create/edit announcements
- [ ] Rich text editor
- [ ] Image upload support
- [ ] Attachment files
- [ ] Reactions (like, love, wow)
- [ ] Comments section

---

## 🧪 Testing Checklist

### Manual Testing:
- [ ] Load page → check animations smooth
- [ ] Click each tab → check filter works
- [ ] Change sort → check order updates
- [ ] Click card → bottom sheet appears
- [ ] Click important announcement → confetti appears
- [ ] Read 10 announcements → reward toast shows
- [ ] Test on mobile (responsive)
- [ ] Test on tablet (2 columns)
- [ ] Test dark mode
- [ ] Test empty state

### Performance Testing:
- [ ] Lighthouse score > 90
- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

---

## 📝 Content Guidelines

### Writing Tips untuk Pengumuman:
1. **Judul**: Maksimal 2 baris, to-the-point, gunakan action words
2. **Excerpt**: 1-2 kalimat singkat yang menggambarkan inti
3. **Content**: Struktur jelas, pakai bullet points jika perlu
4. **Deadline**: Selalu tampilkan jika ada batas waktu
5. **Link**: Tambahkan link ke detail page jika ada info lebih lanjut
6. **Tone**: Friendly, encouraging, tidak formal berlebihan

### Best Practices:
- ✅ Gunakan emoji secukupnya (1-2 per pengumuman)
- ✅ Highlight info penting dengan **bold**
- ✅ Tandai pengumuman urgent sebagai "important"
- ✅ Update timestamp secara konsisten
- ✅ Kategori yang tepat untuk easy filtering

---

## 🎬 Demo Screenshots

### Desktop View:
- Header dengan animated bell icon
- 3-column grid layout
- Important banner di atas
- Filter tabs dengan active indicator

### Mobile View:
- Stacked cards (1 column)
- Touch-friendly tap targets
- Bottom sheet untuk detail
- Smooth scroll behavior

### Interactions:
- Hover animation (scale + shadow)
- Tab switching (slide transition)
- Bottom sheet (slide-up from bottom)
- Confetti (for important announcements)
- Reward toast (after 10 reads)

---

## 🚀 Quick Start

### Development:
```bash
npm run dev
```

### Access:
Navigate to: `http://localhost:3000/announcements`

### Mock Data:
6 sample announcements dengan berbagai kategori dan status

---

## 🎉 Kesimpulan

Halaman pengumuman GEMA dirancang dengan philosophy:

> **"Information should be joyful, not overwhelming"**

Dengan kombinasi:
- 🎨 **Visual Delight**: Playful colors & smooth animations
- 🎯 **Functional**: Smart filtering & sorting
- 📱 **Mobile-First**: Responsive & touch-friendly
- ⚡ **Performant**: Fast load & smooth interactions
- 🎮 **Gamified**: Reward system untuk engagement

**Result**: Halaman yang bikin siswa excited untuk check pengumuman! 🎉

---

Made with ❤️ for GEMA - SMA Wahidiyah Kediri
