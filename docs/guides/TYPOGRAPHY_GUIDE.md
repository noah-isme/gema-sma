# 🪄 Typography System Guide - GEMA Landing Page

## Quick Reference Card

```
╔════════════════════════════════════════════════════════════════╗
║                    GEMA TYPOGRAPHY SYSTEM                      ║
║                     4-Tier Hierarchy                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  H1 - DISPLAY HEADLINES                                        ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Font: Outfit Extrabold (800)                           │   ║
║  │ Size: 48-72px (clamp responsive)                       │   ║
║  │ Line Height: 1.1                                       │   ║
║  │ Tracking: -0.02em                                      │   ║
║  │ Usage: Hero headlines, major statements               │   ║
║  │ Class: .type-h1                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  H2 - SECTION HEADERS                                          ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Font: Outfit Semibold (600)                            │   ║
║  │ Size: 28-36px (clamp responsive)                       │   ║
║  │ Line Height: 1.2                                       │   ║
║  │ Tracking: -0.01em                                      │   ║
║  │ Usage: Section titles, card headers                   │   ║
║  │ Class: .type-h2                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  BODY - CONTENT TEXT                                           ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Font: Inter Regular (400)                              │   ║
║  │ Size: 16-18px (clamp responsive)                       │   ║
║  │ Line Height: 1.7                                       │   ║
║  │ Usage: Paragraphs, descriptions                        │   ║
║  │ Class: .type-body                                      │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  CAPTION - LABELS & MICRO COPY                                 ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Font: Inter Medium (500)                               │   ║
║  │ Size: 14px (fixed)                                     │   ║
║  │ Line Height: 1.5                                       │   ║
║  │ Transform: UPPERCASE                                   │   ║
║  │ Tracking: 0.08em                                       │   ║
║  │ Usage: Labels, badges, overlines                      │   ║
║  │ Class: .type-caption                                   │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Font Stack

### 🎨 Display Font: **Outfit**
```css
font-family: 'Outfit', system-ui, -apple-system, sans-serif;
```
**Weights Available:** 400, 500, 600, 700, 800
**Use For:** Headlines, CTAs, bold UI elements

### 📝 Body Font: **Inter**
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```
**Weights Available:** 300, 400, 500, 600, 700
**Use For:** Body text, descriptions, UI text

### 💻 Monospace Font: **Fira Code**
```css
font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
```
**Weights Available:** 400, 500, 600, 700
**Use For:** Code snippets, technical content

---

## Usage Examples

### Hero Headline
```jsx
<h1 className="type-h1">
  Platform LMS Informatika yang Bikin Belajar{" "}
  <span className="text-highlight font-extrabold">Coding</span> Jadi{" "}
  <span className="text-gradient-primary font-extrabold">
    Seru 🚀
  </span>{" "}
  dan{" "}
  <span className="text-gradient-primary font-extrabold">
    Interaktif!
  </span>
</h1>
```

### Section Header
```jsx
<h2 className="type-h2 text-slate-900 dark:text-white">
  Fitur Lengkap & Terpadu
</h2>
```

### Body Text
```jsx
<p className="type-body text-slate-600 dark:text-slate-300">
  GEMA adalah Learning Management System modern untuk 
  mata pelajaran Informatika SMA.
</p>
```

### Caption / Label
```jsx
<span className="type-caption text-[#5EEAD4]">
  Learning Management System
</span>
```

---

## Text Enhancement Utilities

### 1. Gradient Text
```jsx
<span className="text-gradient-primary">Seru 🚀</span>
```
**Effect:** Purple-to-teal gradient
**Colors:** `#6C63FF → #5EEAD4`

### 2. Background Highlight
```jsx
<span className="text-highlight">Coding</span>
```
**Effect:** Subtle gradient background with padding
**Opacity:** 15% gradient

### 3. Playful Gradient
```jsx
<span className="text-gradient-playful">Amazing!</span>
```
**Effect:** Warm gradient (red-orange-yellow)
**Colors:** `#FF6B6B → #FFA07A → #FFD93D`

---

## Emoji Guidelines

### ✅ DO:
- Use **1 emoji per phrase** maximum
- Place emoji at **end of phrase** (not interrupting)
- Choose **meaningful & contextual** emojis
- Keep emoji **text-size** (not oversized)

### ❌ DON'T:
- Use multiple emojis in one line
- Use decorative emoji rows
- Place emoji mid-sentence
- Use random/irrelevant emojis

### Approved Emoji List:
- 🚀 = Launch, progress, excitement
- 🎉 = Celebration, achievement
- ⚡ = Fast, powerful, energy
- 💡 = Ideas, learning
- 🎯 = Goals, precision
- ✨ = Magic, quality

---

## Responsive Behavior

### Desktop (> 1024px)
```
H1: 72px (4.5rem)
H2: 36px (2.25rem)
Body: 18px (1.125rem)
Caption: 14px
```

### Tablet (768px - 1024px)
```
H1: ~60px (3.75rem)
H2: ~32px (2rem)
Body: 17px
Caption: 14px
```

### Mobile (< 768px)
```
H1: 48px (3rem)
H2: 28px (1.75rem)
Body: 16px (1rem)
Caption: 14px
```

*All transitions are smooth thanks to `clamp()` function*

---

## Color Pairings

### Light Mode
```css
H1: text-slate-900
H2: text-slate-900
Body: text-slate-600
Caption: text-[#5EEAD4]/90
```

### Dark Mode
```css
H1: text-white
H2: text-white
Body: text-slate-300/90
Caption: text-[#5EEAD4]/90
```

---

## CSS Variables Reference

```css
:root {
  /* H1 - Display Headlines */
  --type-h1-size: clamp(3rem, 6vw + 1rem, 4.5rem);
  --type-h1-weight: 800;
  --type-h1-leading: 1.1;
  --type-h1-tracking: -0.02em;
  
  /* H2 - Section Headers */
  --type-h2-size: clamp(1.75rem, 3vw + 0.5rem, 2.25rem);
  --type-h2-weight: 600;
  --type-h2-leading: 1.2;
  --type-h2-tracking: -0.01em;
  
  /* Body - Content Text */
  --type-body-size: clamp(1rem, 1.5vw, 1.125rem);
  --type-body-weight: 400;
  --type-body-leading: 1.7;
  
  /* Caption - Labels */
  --type-caption-size: 0.875rem;
  --type-caption-weight: 500;
  --type-caption-leading: 1.5;
}
```

---

## Accessibility Checklist

- ✅ Minimum 16px body text for readability
- ✅ Line-height 1.7 for comfortable reading
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Semantic HTML headings (H1 → H2)
- ✅ No text in images (searchable/readable)
- ✅ Responsive font scaling
- ✅ Font smoothing enabled

---

## Performance Optimizations

### Font Loading Strategy
```typescript
const outfit = Outfit({
  display: "swap",  // Prevents FOIT
  preload: true,    // Faster initial load
  subsets: ["latin"]
});
```

### Only Load Required Weights
```typescript
weight: ["400", "500", "600", "700", "800"]
// Instead of loading all 9 weights
```

### Font Face Observer (Optional)
```javascript
// Detect when fonts are loaded
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}
```

---

## Migration Guide

### Old → New

**Headlines:**
```diff
- className="text-5xl font-semibold"
+ className="type-h1"
```

**Section Titles:**
```diff
- className="text-3xl font-bold"
+ className="type-h2"
```

**Body Text:**
```diff
- className="text-lg leading-relaxed"
+ className="type-body"
```

**Labels:**
```diff
- className="text-sm font-medium uppercase tracking-wide"
+ className="type-caption"
```

---

## Quick Start

### 1. Import Fonts (layout.tsx)
```typescript
import { Outfit, Inter, Fira_Code } from "next/font/google";
```

### 2. Apply to Body
```typescript
<body className={`${outfit.variable} ${inter.variable} ${firaCode.variable}`}>
```

### 3. Use Utility Classes
```jsx
<h1 className="type-h1">Your Headline</h1>
<p className="type-body">Your content</p>
```

---

**Made with 🎨 by GEMA Team**
**Version:** 2.0 - Modern Typography System
