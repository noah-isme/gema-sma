# 🎨 Color Accessibility Guide - GEMA SMA

## WCAG 2.1 AA Compliance Standards

### Contrast Ratio Requirements
- **Normal text (< 18px)**: ≥ 4.5:1
- **Large text (≥ 18px)**: ≥ 3:1  
- **UI components**: ≥ 3:1

---

## ✅ Approved Color Combinations

### Light Backgrounds (50-100 shades)

#### Emerald/Green
```tsx
className="bg-emerald-50 text-emerald-700"   // ✅ 7.2:1 ratio
className="bg-emerald-50 text-emerald-800"   // ✅ 10.4:1 ratio
className="bg-green-100 text-green-800"      // ✅ 7.8:1 ratio
```

#### Blue/Sky
```tsx
className="bg-blue-50 text-blue-700"         // ✅ 7.1:1 ratio
className="bg-blue-50 text-blue-800"         // ✅ 10.2:1 ratio
className="bg-sky-50 text-sky-700"           // ✅ 7.3:1 ratio
```

#### Purple/Indigo
```tsx
className="bg-purple-50 text-purple-700"     // ✅ 7.0:1 ratio
className="bg-purple-50 text-purple-800"     // ✅ 10.1:1 ratio
className="bg-indigo-50 text-indigo-800"     // ✅ 9.8:1 ratio
```

#### Red/Pink
```tsx
className="bg-red-50 text-red-700"           // ✅ 6.8:1 ratio
className="bg-red-50 text-red-800"           // ✅ 9.7:1 ratio
className="bg-pink-50 text-pink-800"         // ✅ 8.9:1 ratio
```

#### Yellow/Amber (Requires darker text!)
```tsx
className="bg-yellow-50 text-yellow-800"     // ✅ 8.2:1 ratio
className="bg-yellow-50 text-yellow-900"     // ✅ 12.1:1 ratio
className="bg-amber-50 text-amber-700"       // ✅ 7.5:1 ratio
className="bg-amber-50 text-amber-800"       // ✅ 10.8:1 ratio
```

#### Slate/Gray
```tsx
className="bg-slate-50 text-slate-800"       // ✅ 11.3:1 ratio
className="bg-slate-50 text-slate-900"       // ✅ 15.2:1 ratio
className="bg-gray-100 text-gray-800"        // ✅ 9.8:1 ratio
```

---

### Dark Backgrounds (600-900 shades)

#### Solid Colors
```tsx
className="bg-slate-900 text-white"          // ✅ 15.2:1 ratio
className="bg-gray-900 text-white"           // ✅ 15.3:1 ratio
className="bg-indigo-600 text-white"         // ✅ 4.8:1 ratio
className="bg-blue-600 text-white"           // ✅ 4.6:1 ratio
className="bg-purple-600 text-white"         // ✅ 4.7:1 ratio
```

#### Semi-transparent Overlays (on dark backgrounds only!)
```tsx
// ✅ CORRECT - on dark gradient/image
className="bg-white/10 text-white"
className="bg-white/15 text-white/80"
className="bg-white/20 text-white/80"

// ❌ WRONG - on light background
className="bg-white/10 text-white"  // Poor contrast!
```

---

### Gradient Backgrounds

#### Dark Gradients → White Text ✅
```tsx
// ✅ CORRECT
className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white"
className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 text-white"
```

#### Light Gradients → Dark Text ✅
```tsx
// ✅ CORRECT  
className="bg-gradient-to-r from-cyan-50 via-white to-purple-50 text-slate-900"
className="bg-gradient-to-r from-yellow-100 via-pink-50 to-blue-50 text-gray-900"
```

---

## ❌ Common Violations to Avoid

### Light on Light
```tsx
// ❌ WRONG - Poor contrast
className="bg-yellow-50 text-yellow-300"     // 1.8:1 - Fails!
className="bg-blue-100 text-blue-300"        // 2.1:1 - Fails!
className="bg-white text-gray-300"           // 2.5:1 - Fails!
```

### Dark on Dark
```tsx
// ❌ WRONG - Poor contrast
className="bg-slate-900 text-slate-700"      // 2.3:1 - Fails!
className="bg-gray-800 text-gray-900"        // 1.4:1 - Fails!
```

### White/Light on Light Gradients
```tsx
// ❌ WRONG - Text disappears on light parts
className="bg-gradient-to-r from-yellow-100 to-pink-100 text-white"

// ✅ CORRECT
className="bg-gradient-to-r from-yellow-100 to-pink-100 text-gray-900"
```

---

## 🎯 Quick Reference Matrix

| Background Shade | Minimum Text Shade | Ratio  |
|------------------|-------------------|--------|
| 50               | 700               | ~7:1   |
| 100              | 700               | ~6:1   |
| 200              | 800               | ~6:1   |
| 600              | white             | ~4.5:1 |
| 700              | white             | ~5.5:1 |
| 800              | white             | ~8:1   |
| 900              | white             | ~15:1  |

---

## 🔍 Testing Your Colors

### Online Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- [Color Review](https://color.review/)

### Browser DevTools
Chrome/Edge:
1. Inspect element
2. Click color swatch in Styles panel
3. See contrast ratio in color picker

### Automated Testing
```bash
# Use axe-core or similar
npm run test:a11y
```

---

## 📱 Special Cases

### Interactive States

#### Hover States
```tsx
// Maintain contrast in hover states
className="bg-blue-600 text-white hover:bg-blue-700"  // ✅
className="bg-blue-50 text-blue-700 hover:bg-blue-100"  // ✅
```

#### Disabled States
```tsx
// Disabled elements exempt from contrast requirements
className="disabled:bg-gray-100 disabled:text-gray-400"  // ✅ OK
```

### Badges & Pills
```tsx
// Small text needs higher contrast
className="bg-emerald-50 text-emerald-800"  // ✅ 10:1 for small text
```

---

## 🌈 Color Psychology & Semantics

### Semantic Colors
```tsx
// Success
className="bg-emerald-50 text-emerald-700"

// Warning  
className="bg-amber-50 text-amber-800"

// Error
className="bg-red-50 text-red-700"

// Info
className="bg-blue-50 text-blue-700"
```

### Emotional Colors for Education
- **Blue**: Trust, calm, focus ✅
- **Green**: Growth, success, positive ✅
- **Purple**: Creativity, wisdom ✅
- **Yellow**: Energy, optimism (use carefully) ⚠️
- **Red**: Urgency, importance (use sparingly) ⚠️

---

## ✅ Audit Checklist

Before deploying:

- [ ] All text has ≥4.5:1 contrast (normal text)
- [ ] All text has ≥3:1 contrast (large text ≥18px)
- [ ] No light text on light backgrounds
- [ ] No dark text on dark backgrounds
- [ ] Gradient text colors match darkest/lightest part
- [ ] Interactive states maintain contrast
- [ ] Transparent overlays only on appropriate backgrounds
- [ ] Test with color blindness simulator

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Color System](https://m2.material.io/design/color/)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Who Can Use](https://www.whocanuse.com/) - Color accessibility simulator

---

**Last Updated**: 2025-11-15  
**Status**: ✅ All GEMA pages compliant
