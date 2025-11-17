# 📸✨ Halaman Galeri GEMA - Playful & Interactive

## 🎯 Overview
Halaman galeri yang dirancang dengan konsep **playful, joyful, dan interaktif** untuk menampilkan dokumentasi kegiatan GEMA dengan experience yang fun dan engaging.

## 🚀 Fitur Utama

### 1. **Hero Section dengan Animated Doodles**
- Judul besar: "Galeri Momen GEMA"
- Subtext ringan dan engaging
- Doodle animasi floating (star, spiral, sparkle, circle)
- Animasi loop 7 detik dengan jitter 3-4px

### 2. **Sticky Category Filter Bar**
- Filter kategori yang sticky di top
- Smooth pill slider animation dengan spring effect
- 7 kategori:
  - 🌟 Semua
  - 📸 Foto
  - 🎥 Video
  - 🎨 Ekstrakurikuler
  - 🎉 Event Besar
  - 🏆 Lomba
  - 📚 Kegiatan Kelas

### 3. **Waterfall Grid Gallery (Pinterest-style)**
- Grid asymmetric dengan variasi ukuran:
  - XS (mini) - 1x1
  - M (normal) - 1x1
  - L (tall) - 1x2
  - XL (wide) - 2x1
  - XXL (large) - 2x2
- Staggered animation on load (80-120ms delay per item)
- Hover effects:
  - Scale 1.04
  - Shadow burst
  - Sparkle icon pop-out

### 4. **Interactive Photo Cards**
- Rounded corners besar
- Drop shadow lembut
- Category badge
- Video indicator dengan wiggle animation
- Overlay gradient on hover

### 5. **Lightbox Modal (Full Featured)**
- Background blur halus
- Scale 0.95 → 1 animation
- Navigation arrows (prev/next) dengan hover effects
- Swipe transition antar foto
- Info panel:
  - Judul
  - Kategori badge
  - Tanggal
  - Deskripsi
  - Counter (X / Total)
- Confetti particles on open (12 particles, once)
- Keyboard navigation:
  - `←` Previous
  - `→` Next
  - `ESC` Close

### 6. **Navigation Buttons**
- **Back Button (Top Left):**
  - Fixed position di kiri atas
  - Icon arrow left dengan label "Kembali"
  - Hover effect: scale + slide left
  - Responsive: label hidden di mobile
  
- **Floating Action Buttons (Bottom Right):**
  - Muncul setelah scroll 300px
  - 2 FAB buttons:
    - Scroll to top (gradient button)
    - Back to home (white/outlined button)
  - Bounce animation on appear
  - Scale + rotate animation on hover

## 🎨 Design System

### Warna Palette
```css
Primary: #6366F1 (Indigo)
Secondary: #EC4899 (Pink)
Accent: #22D3EE (Cyan)
Warning: #FBBF24 (Amber)
```

### Typography
- **Heading:** System font-stack (bold, large)
- **Body:** Standard readable fonts
- **Badge:** Small, bold, uppercase

### Animations
| Element | Animation | Duration |
|---------|-----------|----------|
| Hero doodles | floating 3-4px | 7s loop |
| Category slider | glide + spring | 0.3s |
| Grid item load | stagger fade-in | 80-120ms delay |
| Card hover | scale(1.04) + shadow | 0.3s |
| Video icon | slow wiggle | 3s loop |
| Lightbox | scale-up + fade-in | 0.3s |
| Next/prev | slide + fade | 0.3s |
| Confetti | particles burst | 1.5s once |

## 📱 Responsive Design
- **Mobile:** 2 columns grid, smaller cards
- **Tablet:** 3 columns grid
- **Desktop:** 6 columns asymmetric grid

## 🔗 API Integration
Menggunakan endpoint `/api/public` untuk fetch gallery data:

```typescript
interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
  isVideo?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
```

## 🎯 User Flow
1. **Landing** → Hero dengan animated doodles
2. **Browse** → Scroll melihat waterfall grid
3. **Filter** → Klik kategori untuk filter konten
4. **View** → Klik foto untuk open lightbox
5. **Navigate** → Arrow keys atau tombol untuk next/prev
6. **Close** → ESC atau close button
7. **Scroll Up** → FAB untuk quick scroll to top
8. **Back Home** → Top-left button atau FAB home button

## 🚀 Performance Optimizations
- ✅ Image lazy loading dengan Next.js Image
- ✅ Staggered animation untuk smooth rendering
- ✅ Backdrop blur untuk better visual hierarchy
- ✅ Optimistic UI updates
- ✅ Debounced scroll handler untuk FAB

## 🎨 Playful Elements
1. **Animated Doodles** - Floating shapes di hero
2. **Emoji Categories** - Fun category icons
3. **Sparkle Effects** - Pop-out sparkle on hover
4. **Wiggle Video Icon** - Rotating play button
5. **Confetti Burst** - Particles saat lightbox open
6. **Bounce FAB** - Spring animation untuk FAB
7. **Smooth Transitions** - Semua interaction smooth

## 🔧 Customization
Untuk customize, edit variabel di `/src/app/gallery/page.tsx`:

### 1. Ubah Kategori
```typescript
const categories = [
  { id: "custom", label: "Custom Label", emoji: "🎯" },
  // tambahkan kategori baru
];
```

### 2. Ubah Grid Pattern
```typescript
const getGridClass = (index: number) => {
  // Customize pattern di sini
  const pattern = index % 6;
  // ... logic
};
```

### 3. Ubah Animation Speed
```typescript
transition={{ duration: 0.4, delay: index * 0.08 }}
// Ubah duration dan delay sesuai keinginan
```

## 📸 Screenshot Reference
Halaman ini mengimplementasikan:
- ✅ Hero dengan animated doodles
- ✅ Sticky filter bar dengan pill slider
- ✅ Pinterest-style waterfall grid
- ✅ Interactive lightbox dengan navigation
- ✅ FAB untuk quick actions
- ✅ Responsive di semua devices

## 🎉 Mood & Tone
Halaman dirancang untuk memberikan feel:
- **Playful** - Fun animations dan colorful elements
- **Joyful** - Bright colors dan positive vibes
- **Interactive** - Smooth interactions dan feedback
- **Clean** - Organized layout dengan clear hierarchy
- **Modern** - Contemporary design trends

## 🔗 Navigation
Akses halaman di: `/gallery`

Tambahkan link di navigation menu:
```tsx
<Link href="/gallery">
  <Camera className="w-5 h-5" />
  Galeri
</Link>
```

## 🚨 Notes
- Video playback belum diimplementasi di lightbox (hanya thumbnail)
- Infinite scroll bisa ditambahkan jika data banyak
- Search functionality bisa ditambahkan di FAB
- Share functionality bisa ditambahkan di lightbox

---

**Status:** ✅ Production Ready
**Last Updated:** 2025-01-17
**Version:** 1.0.0
