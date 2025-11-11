# 🎬 Logo Animation Implementation Guide

## Overview
Animated logo component dengan **accessibility-first**, **performance-optimized**, dan **progressive enhancement** approach.

---

## 📦 Component: LogoAnimated

### Features
✅ **Video-based animation** (WebM + MP4 fallback)
✅ **Reduced motion support** (auto-detects preference)
✅ **Progressive enhancement** (static fallback)
✅ **Mobile-optimized** (playsInline + muted)
✅ **Performance** (lazy loading, poster frame)
✅ **Accessibility** (ARIA labels, keyboard friendly)

---

## 🎨 Usage

### Basic Usage
```tsx
import LogoAnimated from "@/components/LogoAnimated";

function Hero() {
  return (
    <div>
      <LogoAnimated />
    </div>
  );
}
```

### With Options
```tsx
<LogoAnimated 
  size="xl"           // sm | md | lg | xl
  priority={true}     // Load immediately
  className="my-4"    // Additional classes
/>
```

### Size Guide
```tsx
size="sm"  // 64x64px (4rem)
size="md"  // 80x80px (5rem)  ← Default
size="lg"  // 128x128px (8rem)
size="xl"  // 160x160px (10rem)
```

---

## 🎥 Video Requirements

### File Structure
```
/public/
  ├── gema-animation.webm  (Primary, best compression)
  ├── gema-animation.mp4   (Fallback, wider support)
  └── gema.svg             (Static fallback/poster)
```

### Video Specifications

#### WebM (Primary)
```bash
# Recommended settings
- Codec: VP9
- Resolution: 512x512px (or 1:1 aspect ratio)
- Frame Rate: 30fps
- Duration: 1-2 seconds (short, seamless loop)
- Bitrate: 500-800 kbps
- Target Size: < 1 MB

# FFmpeg command
ffmpeg -i logo-source.mp4 \
  -c:v libvpx-vp9 \
  -b:v 600k \
  -vf scale=512:512 \
  -an \
  -loop 0 \
  gema-animation.webm
```

#### MP4 (Fallback)
```bash
# Recommended settings
- Codec: H.264
- Resolution: 512x512px
- Frame Rate: 30fps
- Duration: 1-2 seconds
- Bitrate: 500-800 kbps
- Target Size: < 1 MB

# FFmpeg command
ffmpeg -i logo-source.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -vf scale=512:512 \
  -movflags +faststart \
  -an \
  gema-animation.mp4
```

#### Poster/Fallback (SVG)
```bash
- Format: SVG (vector, scalable)
- Fallback: PNG 512x512px
- High contrast for accessibility
- File size: < 50 KB
```

---

## 🎯 Animation Guidelines

### Timing
- **Reveal:** 0.8-1.2 seconds (entrance)
- **Loop:** Seamless, no visible restart
- **Total Duration:** 1-2 seconds max

### Motion
- **Subtle:** Not overwhelming
- **Smooth:** 30fps minimum
- **Purpose:** Enhance brand, not distract

### Seamless Loop
```
Frame 1 (0s)    → Start state
Frame 30 (1s)   → End state (matches Frame 1)
Loop: No visible jump
```

**Tips:**
1. Last frame should match first frame
2. Use easing (ease-in-out)
3. Test loop at 0.5x speed
4. Ensure alpha channel works

---

## ♿ Accessibility Features

### Reduced Motion
```tsx
// Auto-detects system preference
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (mediaQuery.matches) {
  // Shows static SVG logo instead
  // No animation plays
}
```

**Tested with:**
- macOS: System Preferences → Accessibility → Reduce Motion
- Windows: Settings → Ease of Access → Display → Show animations
- iOS: Settings → Accessibility → Motion → Reduce Motion
- Android: Settings → Accessibility → Remove animations

### ARIA Labels
```tsx
<video aria-label="Animasi logo GEMA">
  {/* Video sources */}
</video>

<span aria-hidden="true">
  {/* Decorative glow */}
</span>
```

### Keyboard Navigation
- Logo is focusable via Tab key
- Focus indicator visible (4px cyan outline)
- Can be activated with Enter/Space

---

## 🚀 Performance Optimizations

### Video Loading
```tsx
preload="metadata"  // Load only metadata, not full video
poster="/gema.svg"  // Show poster while loading
```

### Lazy Loading
```tsx
// Component checks if video exists
const checkVideo = async () => {
  const response = await fetch("/gema-animation.webm", { method: "HEAD" });
  setHasVideo(response.ok);
};
```

### Mobile Optimization
```tsx
autoPlay    // Start playing
muted       // No sound (required for autoplay)
playsInline // Don't fullscreen on iOS
```

### GPU Acceleration
```css
.logo-container {
  transform: translate3d(0, 0, 0);
  will-change: transform;
}
```

---

## 🎨 Visual Effects

### Idle Glow
```tsx
<span className="absolute inset-0 rounded-2xl blur-2xl opacity-20 
                 animate-breathe 
                 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),transparent_60%)]" />
```

**Character:**
- Very subtle (opacity 0.15-0.25)
- Breathes slowly (4s cycle)
- Radial gradient (soft, not harsh)
- Doesn't distract from content

### Shimmer Effect (Optional)
```tsx
<span className="absolute inset-[-100%] 
                 animate-shimmer 
                 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
```

**Character:**
- Occasional shimmer (3s interval)
- Very subtle (10% opacity)
- Diagonal movement
- Adds premium feel

---

## 🧪 Quality Gate Checklist

Before deploying:

### ✅ Visual Quality
- [ ] Loop is seamless (no visible jump)
- [ ] Animation is smooth (30fps+)
- [ ] Colors match brand (#4F46E5, #22D3EE)
- [ ] Works in light + dark mode
- [ ] High contrast ratio (WCAG AA)

### ✅ Performance
- [ ] WebM size < 1 MB
- [ ] MP4 size < 1 MB
- [ ] Poster size < 50 KB
- [ ] Lighthouse Performance ≥ 90
- [ ] CPU usage < 5% (idle)
- [ ] Memory stable (no leaks)

### ✅ Accessibility
- [ ] Reduced motion honored
- [ ] Static fallback works
- [ ] ARIA labels present
- [ ] Keyboard navigable
- [ ] Focus visible
- [ ] Screen reader friendly

### ✅ Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] iOS 12+ (Safari)
- [ ] Android 8+ (Chrome)

### ✅ Fallbacks
- [ ] No WebM → MP4 plays
- [ ] No MP4 → SVG shows
- [ ] Reduced motion → SVG shows
- [ ] Network error → SVG shows

---

## 📊 Current Implementation

### Hero Section
```tsx
<div className="mb-8 animate-scale-in" style={{ animationDelay: "0.1s" }}>
  <LogoAnimated 
    size="md" 
    priority 
    className="hover-lift icon-wiggle cursor-pointer" 
  />
</div>
```

**Effects:**
- Scale-in entrance (0.1s delay)
- Hover lift (-8px translateY)
- Wiggle on hover (rotate ±8deg)
- Cursor pointer (interactive)

### Integration Points
1. **Hero Section** - Main logo (size="md")
2. **Header** - Navbar logo (size="sm")
3. **Footer** - Brand logo (size="sm")
4. **Loading State** - Splash screen (size="xl")

---

## 🎬 Video Creation Workflow

### 1. Design Animation
```
Tool: After Effects, Figma, Blender
Duration: 1-2 seconds
Format: MP4 or MOV (high quality)
Resolution: 1024x1024px (export high, compress later)
```

### 2. Export High Quality
```
Settings:
- Codec: H.264
- Quality: 100%
- No audio
- 30fps
- Square aspect ratio
```

### 3. Compress to WebM
```bash
ffmpeg -i logo-high-quality.mp4 \
  -c:v libvpx-vp9 \
  -b:v 600k \
  -vf scale=512:512 \
  -an \
  -loop 0 \
  gema-animation.webm
```

### 4. Compress to MP4
```bash
ffmpeg -i logo-high-quality.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -vf scale=512:512 \
  -movflags +faststart \
  -an \
  gema-animation.mp4
```

### 5. Create Poster
```bash
# Extract first frame
ffmpeg -i gema-animation.mp4 \
  -vframes 1 \
  -vf scale=512:512 \
  gema-logo-poster.png

# Or use SVG (preferred)
cp gema.svg public/gema-logo-poster.svg
```

### 6. Test Loop
```bash
# Play on repeat to check seamlessness
ffplay -loop 0 gema-animation.mp4
```

---

## 🐛 Troubleshooting

### Video doesn't autoplay on mobile
**Solution:** Ensure `muted` and `playsInline` attributes are present
```tsx
<video autoPlay muted playsInline>
```

### Animation jumps at loop point
**Solution:** Ensure last frame matches first frame exactly
```
Frame 0: Position 0deg
Frame 29: Position 348deg (not 360deg!)
Frame 30 (loop to 0): Smooth transition
```

### File size too large
**Solution:** Reduce bitrate or resolution
```bash
# Lower bitrate
-b:v 400k  # Instead of 600k

# Lower resolution
-vf scale=384:384  # Instead of 512:512
```

### Reduced motion not working
**Solution:** Check media query listener
```tsx
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
mediaQuery.addEventListener("change", handleChange);
```

### Static fallback not showing
**Solution:** Ensure SVG path is correct
```tsx
<Image src="/gema.svg" alt="Logo GEMA" />
// File should be in /public/gema.svg
```

---

## 📚 Resources

### Tools
- **After Effects** - Professional animation
- **Figma** - Simple animations
- **FFmpeg** - Video compression
- **Handbrake** - GUI for compression

### Testing
- **Lighthouse** - Performance audit
- **axe DevTools** - Accessibility audit
- **Can I Use** - Browser support
- **WebPageTest** - Performance

### Inspiration
- Stripe animated logo
- Linear loading animation
- Vercel logo reveal
- GitHub logo hover
- Framer motion demos

---

## ✅ Status

**Component:** ✅ Created
**Integration:** ✅ Hero section updated
**Documentation:** ✅ Complete
**Assets Needed:** ⚠️ Video files required

---

## 🚀 Next Steps

1. **Create/obtain video animation**
   - Design reveal animation (0.8-1.2s)
   - Ensure seamless loop
   - Export at 1024x1024px

2. **Compress videos**
   ```bash
   npm run compress-logo  # Custom script
   # Or use FFmpeg commands above
   ```

3. **Place files in /public**
   ```
   /public/
     ├── gema-animation.webm
     ├── gema-animation.mp4
     └── gema.svg (already exists)
   ```

4. **Test thoroughly**
   - Desktop browsers
   - Mobile devices
   - Reduced motion
   - Network throttling
   - Different screen sizes

5. **Monitor performance**
   ```bash
   npm run lighthouse
   ```

---

**Made with 🎬 by GEMA Team**
**Version:** 1.0 - Logo Animation System
**Last Updated:** 2025-11-11
