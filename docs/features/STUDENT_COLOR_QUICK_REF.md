# 🎨 Student Color System - Quick Reference

## 🚀 Quick Start

```tsx
// Import sudah otomatis via globals.css
// Langsung gunakan classes!

<div className="student-card">
  <h3 className="student-heading-3">Title</h3>
  <p className="student-body">Content</p>
</div>
```

## 📦 Most Used Classes

### Cards & Containers
```tsx
.student-card          // Complete card dengan auto contrast
.student-stat-card     // Stat display card
.student-bg-main       // Page background
.student-bg-card       // Card background
```

### Typography
```tsx
.student-heading-1     // Page title (36px)
.student-heading-2     // Section title (30px)
.student-heading-3     // Card title (24px)
.student-body          // Normal text (16px)
.student-caption       // Small text (12px)
```

### Text Colors
```tsx
.student-text-primary    // Main text
.student-text-secondary  // Supporting text
.student-text-muted      // Meta info
```

### Status Badges
```tsx
.student-badge-success   // ✅ Completed
.student-badge-warning   // ⚠️ Pending
.student-badge-error     // ❌ Overdue
.student-badge-info      // ℹ️ In Progress
```

### Buttons
```tsx
.student-btn-primary     // Main action
.student-btn-secondary   // Secondary action
```

### Accent Cards
```tsx
.student-blue-card      // Blue theme
.student-green-card     // Green theme
.student-orange-card    // Orange theme
.student-pink-card      // Pink theme
```

## 🎯 Common Patterns

### Dashboard Stat
```tsx
<div className="student-stat-card">
  <div className="student-stat-label">Label</div>
  <div className="student-stat-value">42</div>
  <div className="student-stat-helper">+5 this week</div>
</div>
```

### Assignment Card
```tsx
<div className="student-card">
  <h3 className="student-card-header">Title</h3>
  <p className="student-card-subtext">Due date</p>
  <p className="student-body">Description...</p>
  <span className="student-badge-warning">Pending</span>
</div>
```

### Form Field
```tsx
<div>
  <label className="student-label">Field Name</label>
  <input className="student-input" placeholder="Enter..." />
</div>
```

### Button Group
```tsx
<div className="flex gap-3">
  <button className="student-btn-primary">Save</button>
  <button className="student-btn-secondary">Cancel</button>
</div>
```

## 🎨 Color Variables

Use in inline styles or custom CSS:

```tsx
// Background colors
var(--student-bg-main)
var(--student-bg-card)

// Text colors
var(--student-text-primary)
var(--student-text-secondary)

// Accent colors
var(--student-blue-icon)
var(--student-green-text)
```

## ✅ Do's & Don'ts

### ✅ DO
```tsx
// Use semantic classes
<div className="student-card">
<h3 className="student-heading-3">
<span className="student-badge-success">
```

### ❌ DON'T
```tsx
// Don't hardcode colors
<div className="bg-white text-gray-900">
<h3 className="text-2xl font-bold text-slate-900">
<span className="bg-green-100 text-green-800">
```

## 🌗 Dark Mode

**Automatic!** No need for `dark:` prefix.

```tsx
// This works in both modes
<div className="student-bg-card">
  <p className="student-text-primary">Auto contrast!</p>
</div>
```

## 📱 Responsive

All classes are responsive by default. Typography scales down on mobile.

## ♿ Accessibility

- ✅ WCAG AAA contrast ratios
- ✅ Focus states on all interactive elements
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Screen reader friendly

## 🔗 Full Documentation

- [`STUDENT_COLOR_TYPOGRAPHY_GUIDE.md`](./STUDENT_COLOR_TYPOGRAPHY_GUIDE.md) - Complete guide
- [`STUDENT_COLOR_AUDIT.md`](./STUDENT_COLOR_AUDIT.md) - Audit report
- [`/src/styles/student-colors.css`](./src/styles/student-colors.css) - Source code

## 🆘 Need Help?

Check the full guides or ask the team!

---

**Status**: ✅ Ready to use  
**Last Updated**: November 21, 2024
