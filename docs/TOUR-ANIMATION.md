# 🎨 Tour Animation with Lottie Integration

## Overview
Animasi Lottie telah diintegrasikan ke dalam komponen tour tooltip untuk memberikan pengalaman visual yang lebih menarik dan interaktif kepada siswa. Animasi ditampilkan **di samping kotak tooltip** dengan ukuran yang lebih besar agar lebih terlihat dan menarik perhatian.

## 📦 Implementation Details

### 1. **Lottie Library**
- **Library:** `@lottiefiles/dotlottie-wc@0.8.5`
- **Type:** Web Component
- **Loading:** Async module script di `layout.tsx`

### 2. **Integration Points**

#### A. Script Loading (Root Layout)
```tsx
// src/app/layout.tsx
<script 
  src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js" 
  type="module" 
  async
></script>
```

#### B. Type Declarations
```typescript
// src/types/dotlottie-wc.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-wc': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        autoplay?: boolean
        loop?: boolean
        speed?: number
        // ... other properties
      },
      HTMLElement
    >
  }
}
```

#### C. Tour Tooltip Badge (Di Samping Tooltip)
```tsx
// src/components/student/PlayfulTourGuide.tsx
{/* Animasi Lottie di samping tooltip */}
<div className="tour-animation-badge" aria-hidden="true">
  <dotlottie-wc
    src="https://lottie.host/707b0b11-3881-41a9-a3de-c5a1942a3288/NfrXoRTgYm.lottie"
    style={{
      width: "120px",
      height: "120px",
      display: "block",
    }}
    autoplay
    loop
  />
</div>
```

**Posisi Berdasarkan Placement:**
- **Bottom/Default:** Kiri atas tooltip
- **Top:** Kiri bawah tooltip
- **Right:** Kiri tooltip (vertical center)
- **Left:** Kanan tooltip (vertical center)

#### D. Completion Modal Icon
```tsx
<div className="tour-complete-icon">
  <dotlottie-wc
    src="https://lottie.host/707b0b11-3881-41a9-a3de-c5a1942a3288/NfrXoRTgYm.lottie"
    style={{
      width: "120px",
      height: "120px",
      display: "block",
      margin: "0 auto",
    }}
    autoplay
    loop
  />
</div>
```

### 3. **CSS Styling**

#### Animation Badge Styles (Di Samping Tooltip)
```css
/* src/app/globals.css */
.tour-animation-badge {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: linear-gradient(135deg, #a855f7, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 20px 50px rgba(59, 130, 246, 0.6),
    0 0 0 3px rgba(255, 255, 255, 0.15),
    0 0 30px rgba(168, 85, 247, 0.4);
  animation: tour-animation-float 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

/* Posisi berdasarkan placement */
.tour-tooltip.bottom .tour-animation-badge,
.tour-tooltip .tour-animation-badge {
  top: -60px;
  left: -140px;
}

.tour-tooltip.top .tour-animation-badge {
  bottom: -60px;
  left: -140px;
}

.tour-tooltip.right .tour-animation-badge {
  top: 50%;
  left: -140px;
  transform: translateY(-50%);
}

.tour-tooltip.left .tour-animation-badge {
  top: 50%;
  right: -140px;
  left: auto;
  transform: translateY(-50%);
}
```

#### Lottie Component Optimization
```css
dotlottie-wc {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
}
```

## 🎯 Features

### ✅ What's Included
1. **External Badge Animation** - Animasi Lottie di **samping** tooltip (bukan di dalam)
2. **Larger Size** - 120x120px untuk visibility yang lebih baik
3. **Smart Positioning** - Otomatis menyesuaikan posisi berdasarkan placement tooltip
4. **Completion Modal Animation** - Animasi lebih besar saat menyelesaikan tour
5. **Responsive Design** - Pindah ke atas tooltip pada layar mobile
6. **Smooth Integration** - Terintegrasi sempurna dengan existing tour system
7. **Accessibility** - Marked dengan `aria-hidden="true"` untuk screen readers

### 🎨 Animation Properties
- **Autoplay:** ✅ Dimulai otomatis
- **Loop:** ✅ Berulang terus-menerus
- **Speed:** 1x (default)
- **Mode:** Normal playback
- **Interaction:** Non-interactive (pointer-events: none)

## 📱 Responsive Behavior

### Desktop (> 640px)
- **Animation Badge:** 120x120px
- **Position:** Di samping tooltip (kiri atau kanan)
- **Completion Modal:** 120x120px

### Mobile (≤ 640px)
- **Animation Badge:** 80x80px (lebih kecil)
- **Position:** Di atas tooltip (center)
- **Completion Modal:** 120x120px (tetap)
- Container menyesuaikan dengan viewport

### Positioning Logic
```
Desktop:
┌─────────┐
│ Animasi │  ┌──────────────┐
│ 120x120 │──│   Tooltip    │
└─────────┘  │   Content    │
             └──────────────┘

Mobile:
     ┌─────────┐
     │ Animasi │
     │ 80x80   │
     └─────────┘
     ┌──────────────┐
     │   Tooltip    │
     │   Content    │
     └──────────────┘
```

## 🔧 Customization Guide

### Mengganti Animasi
```tsx
<dotlottie-wc
  src="YOUR_LOTTIE_URL_HERE.lottie"
  autoplay
  loop
/>
```

### Menyesuaikan Ukuran
Edit CSS untuk mengubah ukuran container:
```css
.tour-animation-badge {
  width: 150px;    /* Ubah lebar */
  height: 150px;   /* Ubah tinggi */
}
```

Dan style inline untuk Lottie:
```tsx
<dotlottie-wc
  style={{
    width: "150px",
    height: "150px",
    display: "block",
  }}
/>
```

### Menyesuaikan Posisi
Edit CSS positioning untuk placement yang berbeda:
```css
/* Contoh: Geser animasi lebih jauh ke kiri */
.tour-tooltip.bottom .tour-animation-badge {
  top: -60px;
  left: -180px;  /* Dari -140px ke -180px */
}
```

### Menambahkan Kontrol
```tsx
<dotlottie-wc
  autoplay={false}    // Disable autoplay
  loop={false}        // Single play
  speed={1.5}         // 1.5x speed
  direction={-1}      // Reverse
  mode="bounce"       // Bounce mode
/>
```

## 🚀 Performance Optimization

### 1. **Lazy Loading**
Script dimuat dengan `async` attribute untuk non-blocking load:
```html
<script src="..." type="module" async></script>
```

### 2. **Pointer Events**
Animasi tidak mengganggu interaksi user:
```css
pointer-events: none !important;
```

### 3. **Hardware Acceleration**
CSS menggunakan `transform` dan `opacity` untuk GPU acceleration:
```css
animation: tour-badge-float 3s ease-in-out infinite;
will-change: transform;
```

## 🎭 Animation States

### 1. **Tour Active**
- Badge animasi berjalan di setiap tooltip
- Smooth transitions antar steps
- Particles effect tetap berjalan

### 2. **Tour Completion**
- Animasi lebih besar di modal
- Confetti effect background
- Multiple action buttons

### 3. **Reduced Motion**
Support untuk users dengan motion sensitivity:
```css
@media (prefers-reduced-motion: reduce) {
  .tour-animation-badge {
    animation: none !important;
  }
}
```

## 🐛 Troubleshooting

### Animasi Tidak Muncul
1. Cek apakah script Lottie sudah loaded
2. Verifikasi URL animasi valid
3. Pastikan TypeScript types sudah di-import
4. Periksa class `tour-animation-badge` ada di tooltip

### Animasi Terpotong atau Tidak Terlihat
1. Periksa `z-index` dan `position: absolute`
2. Verifikasi parent tidak punya `overflow: hidden`
3. Cek viewport bounds pada responsive breakpoints
4. Test pada berbagai placement (top, bottom, left, right)

### Ukuran Tidak Sesuai
1. Periksa CSS `.tour-animation-badge` styles
2. Verifikasi `display: block` pada element
3. Cek media queries untuk mobile
4. Pastikan inline styles match dengan container

### Performance Issues
1. Reduce animation complexity
2. Disable pada mobile devices
3. Use `prefers-reduced-motion`

## 📚 Resources

### Official Documentation
- [DotLottie Web Component](https://github.com/LottieFiles/dotlottie-wc)
- [LottieFiles Platform](https://lottiefiles.com/)

### Animation Sources
- [Current Animation](https://lottie.host/707b0b11-3881-41a9-a3de-c5a1942a3288/NfrXoRTgYm.lottie)
- [LottieFiles Library](https://lottiefiles.com/featured)
- [Create Custom](https://lottiefiles.com/create)

## 🎉 Result

Tour system sekarang memiliki:
- ✅ **Better Visibility:** Animasi 120x120px di samping tooltip (bukan di dalam)
- ✅ **Smart Positioning:** Otomatis adjust berdasarkan tooltip placement
- ✅ **Visual Appeal:** Animasi Lottie yang menarik dan prominent
- ✅ **User Engagement:** Lebih interaktif dan fun
- ✅ **Professional Look:** Modern dan polished
- ✅ **Responsive Design:** Adapts beautifully on mobile (pindah ke atas)
- ✅ **Smooth Performance:** Optimized untuk semua devices
- ✅ **Accessibility:** Support untuk screen readers

### Visual Hierarchy
```
Priority 1: 🎨 Animasi Badge (120x120px, di samping)
Priority 2: 📝 Tooltip Content (informasi step)
Priority 3: ✨ Particles & Effects (background)
```

---

**Status:** ✅ Production Ready  
**Last Updated:** 2024  
**Maintainer:** GEMA Development Team