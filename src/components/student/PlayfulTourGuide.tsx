'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type TourStep = {
  selector: string
  emoji?: string
  title: string
  subtitle?: string
  text: string
}

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

type TriggerRenderProps = {
  startTour: () => void
  endTour: () => void
  resetTour: () => void
  isRunning: boolean
  hasSeenTutorial: boolean
  storageReady: boolean
}

interface PlayfulTourGuideProps {
  tourId: string
  steps: TourStep[]
  autoStart?: boolean
  autoStartDelay?: number
  renderTrigger?: (helpers: TriggerRenderProps) => ReactNode
}

const STORAGE_PREFIX = 'gema-student-tour-'
const TRANSITION_DURATION = 220

const buildStorageKey = (tourId: string) => `${STORAGE_PREFIX}${tourId}`

export default function PlayfulTourGuide({
  tourId,
  steps,
  autoStart = true,
  autoStartDelay = 900,
  renderTrigger
}: PlayfulTourGuideProps) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipActive, setTooltipActive] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number
    left: number
    placement: TooltipPlacement
  }>({
    top: 0,
    left: 0,
    placement: 'bottom'
  })
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)
  const [storageReady, setStorageReady] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [tooltipBounds, setTooltipBounds] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  const highlightRef = useRef<HTMLElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const tooltipTimeoutRef = useRef<number | null>(null)
  const particleIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setPortalTarget(document.body)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(buildStorageKey(tourId))
    const hasSeenValue = Boolean(stored)
    setHasSeenTutorial(hasSeenValue)
    setStorageReady(true)
  }, [tourId])

  const generateParticles = useCallback(() => {
    if (!targetRect) return
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: targetRect.left + targetRect.width * Math.random(),
      y: targetRect.top + targetRect.height * Math.random(),
      delay: Math.random() * 0.5
    }))
    setParticles(newParticles)
    
    if (particleIntervalRef.current) {
      window.clearInterval(particleIntervalRef.current)
    }
    
    particleIntervalRef.current = window.setInterval(() => {
      const refreshedParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (targetRect?.left ?? 0) + (targetRect?.width ?? 0) * Math.random(),
        y: (targetRect?.top ?? 0) + (targetRect?.height ?? 0) * Math.random(),
        delay: Math.random() * 0.5
      }))
      setParticles(refreshedParticles)
    }, 3000)
  }, [targetRect])

  const clearHighlight = useCallback(() => {
    // Clear current highlighted element
    if (highlightRef.current) {
      highlightRef.current.classList.remove('tour-highlight', 'tour-highlight-active')
      highlightRef.current = null
    }
    
    // Also clear any leftover highlights in DOM
    const allHighlights = document.querySelectorAll('.tour-highlight, .tour-highlight-active')
    allHighlights.forEach(el => {
      el.classList.remove('tour-highlight', 'tour-highlight-active')
    })
    
    setParticles([])
    if (particleIntervalRef.current) {
      window.clearInterval(particleIntervalRef.current)
      particleIntervalRef.current = null
    }
  }, [])

  const updateTooltipPosition = useCallback((target: HTMLElement | null) => {
    if (!target || !tooltipRef.current) return

    const rect = target.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const margin = 16
    const approxWidth = tooltipRect.width || 320
    const approxHeight = tooltipRect.height || 160
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const candidates: Array<{ placement: TooltipPlacement; top: number; left: number }> = []

    const fitHorizontalCenter = Math.min(
      Math.max(rect.left + rect.width / 2 - approxWidth / 2, margin),
      viewportWidth - approxWidth - margin
    )
    const fitVerticalCenter = Math.min(
      Math.max(rect.top + rect.height / 2 - approxHeight / 2, margin),
      viewportHeight - approxHeight - margin
    )

    if (rect.right + margin + approxWidth <= viewportWidth) {
      candidates.push({
        placement: 'right',
        top: fitVerticalCenter,
        left: rect.right + margin
      })
    }

    if (rect.left - margin - approxWidth >= margin) {
      candidates.push({
        placement: 'left',
        top: fitVerticalCenter,
        left: rect.left - approxWidth - margin
      })
    }

    if (rect.bottom + margin + approxHeight <= viewportHeight) {
      candidates.push({
        placement: 'bottom',
        top: rect.bottom + margin,
        left: fitHorizontalCenter
      })
    }

    if (rect.top - margin - approxHeight >= margin) {
      candidates.push({
        placement: 'top',
        top: rect.top - approxHeight - margin,
        left: fitHorizontalCenter
      })
    }

    const chosen = candidates[0] ?? {
      placement: 'bottom',
      top: Math.min(rect.bottom + margin, viewportHeight - approxHeight - margin),
      left: fitHorizontalCenter
    }

    const newTooltipPosition = {
      top: Math.max(margin, chosen.top),
      left: Math.max(margin, Math.min(chosen.left, viewportWidth - approxWidth - margin)),
      placement: chosen.placement
    }
    
    const newTargetRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }

    // Only update if position actually changed (prevent infinite loop)
    setTooltipPosition(prev => {
      if (prev.top === newTooltipPosition.top && 
          prev.left === newTooltipPosition.left && 
          prev.placement === newTooltipPosition.placement) {
        return prev
      }
      return newTooltipPosition
    })
    
    setTargetRect(prev => {
      if (prev && 
          prev.top === newTargetRect.top && 
          prev.left === newTargetRect.left && 
          prev.width === newTargetRect.width && 
          prev.height === newTargetRect.height) {
        return prev
      }
      return newTargetRect
    })

    requestAnimationFrame(() => {
      if (!tooltipRef.current) return
      const bounds = tooltipRef.current.getBoundingClientRect()
      const newBounds = {
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      }
      
      setTooltipBounds(prev => {
        if (prev && 
            prev.top === newBounds.top && 
            prev.left === newBounds.left && 
            prev.width === newBounds.width && 
            prev.height === newBounds.height) {
          return prev
        }
        return newBounds
      })
    })

  }, [])

  const hideWithDelay = useCallback((setter: (value: boolean) => void, timeoutRef: React.MutableRefObject<number | null>) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    timeoutRef.current = window.setTimeout(() => {
      setter(false)
      timeoutRef.current = null
    }, TRANSITION_DURATION)
  }, [])

  const markTourSeen = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(buildStorageKey(tourId), '1')
    }
    setHasSeenTutorial(true)
  }, [tourId])

  const stopTour = useCallback(
    (options?: { showCompletion?: boolean }) => {
      console.log('[Tour] Stopping tour and cleaning up...')
      markTourSeen()
      setIsRunning(false)
      setTooltipActive(false)
      hideWithDelay(setTooltipVisible, tooltipTimeoutRef)
      setShowCompletion(Boolean(options?.showCompletion))
      
      // Clear highlight immediately
      clearHighlight()
      
      // Multiple cleanup attempts to ensure all highlights are removed
      requestAnimationFrame(() => {
        clearHighlight()
        setTargetRect(null)
        setTooltipBounds(null)
      })
      
      // Final cleanup after animation
      setTimeout(() => {
        clearHighlight()
        console.log('[Tour] Final cleanup complete')
      }, 300)
    },
    [clearHighlight, hideWithDelay, markTourSeen]
  )

  const closeCompletion = useCallback(() => {
    console.log('[Tour] Closing completion modal...')
    setShowCompletion(false)
    clearHighlight()
    setTargetRect(null)
    setTooltipBounds(null)
    
    // Extra cleanup for any lingering highlights
    setTimeout(() => {
      clearHighlight()
    }, 100)
  }, [clearHighlight])

  const endTour = useCallback(() => {
    stopTour()
  }, [stopTour])

  const startTour = useCallback(() => {
    if (!steps.length || isRunning) return
    if (tooltipTimeoutRef.current) {
      window.clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
    setShowCompletion(false)
    setCurrentStep(0)
    setIsRunning(true)
    setTooltipVisible(true)
    requestAnimationFrame(() => {
      setTooltipActive(true)
    })
  }, [isRunning, steps.length])

  const showStep = useCallback(
    (index: number) => {
      const step = steps[index]
      if (!step) return

      const target = document.querySelector<HTMLElement>(step.selector)
      if (target) {
        const rect = target.getBoundingClientRect()
        const isVisible = rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
        
        if (!isVisible) {
          console.warn('[StudentTour] target not visible for selector', step.selector)
          setTargetRect(null)
          setTooltipBounds(null)
          if (index < steps.length - 1) {
            setCurrentStep(index + 1)
          } else {
            stopTour()
          }
          return
        }
      } else {
        console.warn('[StudentTour] target not found for selector', step.selector)
        setTargetRect(null)
        setTooltipBounds(null)
        if (index < steps.length - 1) {
          setCurrentStep(index + 1)
        } else {
          stopTour()
        }
        return
      }

      clearHighlight()
      highlightRef.current = target
      target.classList.add('tour-highlight')
      
      // Ensure sidebar is expanded if target is in sidebar
      if (target.closest('.sidebar-nav-link') && window.innerWidth >= 768) {
        const sidebar = target.closest('[class*="md:w-64"], [class*="md:w-16"]')
        if (sidebar && sidebar.classList.contains('md:w-16')) {
          // Try to expand sidebar by clicking collapse button
          const collapseBtn = sidebar.querySelector('button[title*="Collapse"], button[title*="Expand"]') as HTMLButtonElement
          if (collapseBtn) {
            collapseBtn.click()
            // Wait a bit for animation
            setTimeout(() => {
              requestAnimationFrame(() => {
                target.classList.add('tour-highlight-active')
                generateParticles()
              })
            }, 350)
          } else {
            requestAnimationFrame(() => {
              target.classList.add('tour-highlight-active')
              generateParticles()
            })
          }
        } else {
          requestAnimationFrame(() => {
            target.classList.add('tour-highlight-active')
            generateParticles()
          })
        }
      } else {
        requestAnimationFrame(() => {
          target.classList.add('tour-highlight-active')
          generateParticles()
        })
      }
    },
    [clearHighlight, stopTour, steps, updateTooltipPosition, generateParticles]
  )

  useEffect(() => {
    if (!isRunning) return
    showStep(currentStep)
  }, [currentStep, isRunning, showStep])

  const goNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= steps.length - 1) {
        stopTour({ showCompletion: true })
        return prev
      }
      return prev + 1
    })
  }, [steps.length, stopTour])

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  useEffect(() => {
    if (!isRunning) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') endTour()
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [endTour, goNext, goPrev, isRunning])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isRunning, updateTooltipPosition])

  useEffect(() => {
    if (!isRunning) return
    const updatePosition = () => {
      updateTooltipPosition(highlightRef.current)
    }
    window.addEvent