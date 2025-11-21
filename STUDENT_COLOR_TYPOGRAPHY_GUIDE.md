# 🎨 Student Dashboard - Color & Typography System

## 📋 Overview

Sistem warna dan tipografi yang konsisten untuk semua halaman student dengan prinsip:
- **Background cerah → Font gelap** (High contrast untuk readability)
- **Background gelap → Font cerah** (Dark mode support)
- Accessible color combinations (WCAG AA compliant)
- Consistent typography scale

## 🎯 Design Principles

### Contrast Rules
1. **Light backgrounds (#F8FAFC, #FFFFFF)** → Dark text (#0F172A, #475569)
2. **Dark backgrounds (#0F172A, #1E293B)** → Light text (#F1F5F9, #CBD5E1)
3. **Colored backgrounds** → Contrasting text color
4. **Minimum contrast ratio**: 4.5:1 for normal text, 3:1 for large text

### Typography Hierarchy
- **Heading 1**: 36px, Bold → Page titles
- **Heading 2**: 30px, Bold → Section titles
- **Heading 3**: 24px, Semibold → Card titles
- **Heading 4**: 20px, Semibold → Subsections
- **Body Large**: 18px → Emphasized text
- **Body**: 16px → Main content
- **Body Small**: 14px → Supporting text
- **Caption**: 12px → Labels, meta info

## 🎨 Color Palette

### Light Mode

#### Backgrounds
```css
Main Background:    #F8FAFC  /* Light gray-blue */
Card Background:    #FFFFFF  /* Pure white */
Hover State:        #F1F5F9  /* Slightly darker */
Active State:       #E2E8F0  /* More emphasis */
```

#### Text Colors
```css
Primary Text:       #0F172A  /* Almost black */
Secondary Text:     #475569  /* Dark gray */
Muted Text:         #64748B  /* Medium gray */
Disabled Text:      #94A3B8  /* Light gray */
```

#### Accent Colors (Light Mode)
```css
Blue:
  Background: #EFF6FF
  Text:       #1E40AF
  Icon:       #3B82F6

Purple:
  Background: #F5F3FF
  Text:       #6D28D9
  Icon:       #8B5CF6

Green:
  Background: #F0FDF4
  Text:       #166534
  Icon:       #22C55E

Orange:
  Background: #FFF7ED
  Text:       #C2410C
  Icon:       #F97316

Pink:
  Background: #FDF2F8
  Text:       #BE185D
  Icon:       #EC4899

Cyan:
  Background: #ECFEFF
  Text:       #0E7490
  Icon:       #06B6D4
```

### Dark Mode

#### Backgrounds
```css
Main Background:    #0F172A  /* Dark blue-gray */
Card Background:    #1E293B  /* Lighter dark */
Hover State:        #334155  /* Even lighter */
Active State:       #475569  /* Most emphasis */
```

#### Text Colors
```css
Primary Text:       #F1F5F9  /* Almost white */
Secondary Text:     #CBD5E1  /* Light gray */
Muted Text:         #94A3B8  /* Medium gray */
Disabled Text:      #64748B  /* Darker gray */
```

#### Accent Colors (Dark Mode)
```css
Blue:
  Background: #1E3A8A
  Text:       #BFDBFE
  Icon:       #60A5FA

Purple:
  Background: #581C87
  Text:       #E9D5FF
  Icon:       #A78BFA

Green:
  Background: #166534
  Text:       #BBF7D0
  Icon:       #4ADE80

Orange:
  Background: #9A3412
  Text:       #FED7AA
  Icon:       #FB923C

Pink:
  Background: #9F1239
  Text:       #FBCFE8
  Icon:       #F472B6

Cyan:
  Background: #164E63
  Text:       #A5F3FC
  Icon:       #22D3EE
```

## 📦 CSS Classes

### Layout Classes

```tsx
// Main container
<div className="student-bg-main">
  /* Light: #F8FAFC, Dark: #0F172A */
</div>

// Cards
<div className="student-card">
  /* Auto contrast + hover effect */
</div>

// Card headers
<h3 className="student-card-header">
  Title
</h3>
<p className="student-card-subtext">
  Description
</p>
```

### Typography Classes

```tsx
// Headings
<h1 className="student-heading-1">Main Title</h1>
<h2 className="student-heading-2">Section Title</h2>
<h3 className="student-heading-3">Card Title</h3>
<h4 className="student-heading-4">Subsection</h4>

// Body text
<p className="student-body-large">Emphasized</p>
<p className="student-body">Normal text</p>
<p className="student-body-small">Supporting text</p>
<p className="student-caption">Meta info</p>
```

### Color Classes

```tsx
// Text colors
<span className="student-text-primary">Primary</span>
<span className="student-text-secondary">Secondary</span>
<span className="student-text-muted">Muted</span>

// Accent cards
<div className="student-blue-card">Blue themed</div>
<div className="student-purple-card">Purple themed</div>
<div className="student-green-card">Green themed</div>
<div className="student-orange-card">Orange themed</div>
<div className="student-pink-card">Pink themed</div>
<div className="student-cyan-card">Cyan themed</div>
```

### Status Badges

```tsx
<span className="student-badge-success">Completed</span>
<span className="student-badge-warning">Pending</span>
<span className="student-badge-error">Overdue</span>
<span className="student-badge-info">In Progress</span>
```

### Buttons

```tsx
<button className="student-btn-primary">
  Primary Action
</button>

<button className="student-btn-secondary">
  Secondary Action
</button>
```

### Forms

```tsx
<label className="student-label">
  Field Label
</label>
<input 
  type="text" 
  className="student-input"
  placeholder="Enter value..."
/>
```

## 🔧 Implementation Examples

### Dashboard Stats Card

```tsx
<div className="student-stat-card">
  <div className="student-stat-label">
    Total Assignments
  </div>
  <div className="student-stat-value">
    24
  </div>
  <div className="student-stat-helper">
    +3 from last week
  </div>
</div>
```

### Assignment Card

```tsx
<div className="student-card">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-3 rounded-xl student-blue-card">
      <BookOpen className="w-5 h-5 text-[var(--student-blue-icon)]" />
    </div>
    <div className="flex-1">
      <h3 className="student-card-header">
        Web Development Project
      </h3>
      <p className="student-card-subtext">
        Due in 3 days
      </p>
    </div>
  </div>
  
  <p className="student-body mb-4">
    Create a responsive landing page using HTML, CSS, and JavaScript.
  </p>
  
  <div className="flex items-center gap-2">
    <span className="student-badge-warning">
      Pending
    </span>
    <span className="student-caption">
      Subject: Informatika
    </span>
  </div>
</div>
```

### Navigation Item

```tsx
<Link 
  href="/student/dashboard"
  className={`student-nav-item ${isActive ? 'active' : ''}`}
>
  <Home className="w-5 h-5" />
  <span>Dashboard</span>
</Link>
```

## 🎯 Before vs After Examples

### ❌ Before (Poor Contrast)

```tsx
// Light background with light text - BAD!
<div className="bg-white">
  <p className="text-gray-300">Hard to read</p>
</div>

// Dark background with dark text - BAD!
<div className="bg-gray-900">
  <p className="text-gray-700">Also hard to read</p>
</div>
```

### ✅ After (Good Contrast)

```tsx
// Light background with dark text - GOOD!
<div className="student-bg-card">
  <p className="student-text-primary">Easy to read</p>
</div>

// Dark background with light text - GOOD! (auto dark mode)
<div className="student-bg-card">
  <p className="student-text-primary">Easy to read in dark mode too</p>
</div>
```

## 📱 Responsive Typography

```css
/* Mobile (< 768px) */
.student-heading-1 { font-size: 1.875rem; /* 30px */ }
.student-heading-2 { font-size: 1.5rem;   /* 24px */ }
.student-heading-3 { font-size: 1.25rem;  /* 20px */ }

/* Tablet (768px - 1024px) */
@media (min-width: 768px) {
  .student-heading-1 { font-size: 2.25rem; /* 36px */ }
  .student-heading-2 { font-size: 1.875rem; /* 30px */ }
  .student-heading-3 { font-size: 1.5rem; /* 24px */ }
}

/* Desktop (> 1024px) */
/* Use base sizes */
```

## ♿ Accessibility Features

### High Contrast Mode
Automatically adjusts colors for better visibility:
```css
@media (prefers-contrast: high) {
  /* Pure black/white text */
  /* Thicker borders */
}
```

### Reduced Motion
Respects user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* Minimal animations */
}
```

### Focus States
All interactive elements have visible focus:
```css
*:focus-visible {
  outline: 2px solid var(--student-primary);
  outline-offset: 2px;
}
```

## 🧪 Testing Checklist

- [ ] Test light mode - all text readable
- [ ] Test dark mode - all text readable  
- [ ] Test high contrast mode
- [ ] Test with screen reader
- [ ] Test keyboard navigation
- [ ] Check color contrast ratios (WebAIM)
- [ ] Verify on mobile devices
- [ ] Test with different zoom levels

## 📚 Resources

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools - Lighthouse Accessibility

### Guidelines
- WCAG 2.1 Level AA
- Material Design Accessibility
- Apple Human Interface Guidelines

## 🚀 Migration Guide

### Step 1: Update Existing Pages

Replace old class names:
```tsx
// Old
<div className="bg-white text-gray-900">

// New
<div className="student-bg-card student-text-primary">
```

### Step 2: Use Semantic Classes

```tsx
// Old
<h3 className="text-2xl font-bold text-slate-900">

// New
<h3 className="student-heading-3">
```

### Step 3: Update Status Indicators

```tsx
// Old
<span className="bg-green-100 text-green-800">

// New
<span className="student-badge-success">
```

## 📝 Notes

- All variables defined in `/src/styles/student-colors.css`
- Imported in `/src/app/globals.css`
- Works with existing Tailwind classes
- Dark mode automatic via `.dark` class
- Accessible by default

---

**Status**: ✅ **IMPLEMENTED**

Sistem warna dan tipografi siap digunakan di semua halaman student!
