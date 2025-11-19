'use client'

import { useEffect } from 'react'

export function useAnimatedAuthBackground() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReducedMotion.matches) {
      return
    }

    const root = document.documentElement
    let frame = 0
    const start = performance.now()

    const animate = (time: number) => {
      const elapsed = (time - start) / 1000
      const angle = 125 + Math.sin(elapsed / 3) * 15
      const shift = 40 + Math.cos(elapsed / 4) * 20
      root.style.setProperty('--auth-gradient-angle', `${angle}deg`)
      root.style.setProperty('--auth-gradient-shift', `${shift}%`)
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      root.style.setProperty('--auth-gradient-angle', '128deg')
      root.style.setProperty('--auth-gradient-shift', '50%')
    }
  }, [])
}
