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
    console.log('[Tour Debug] tourId:', tourId)
    console.log('[Tour Debug] localStorage key:', buildStorageKey(tourId))
    console.log('[Tour Debug] localStorage value:', stored)
    console.log('[Tour Debug] hasSeenTutorial:', hasSeenValue)
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
      if (!target) {
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
      requestAnimationFrame(() => {
        target.classList.add('tour-highlight-active')
        generateParticles()
      })
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => updateTooltipPosition(target))
      })
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
    console.log('[Tour Debug] Auto-start check:')
    console.log('  - storageReady:', storageReady)
    console.log('  - autoStart:', autoStart)
    console.log('  - hasSeenTutorial:', hasSeenTutorial)
    console.log('  - steps.length:', steps.length)
    
    if (!storageReady || !autoStart || hasSeenTutorial || !steps.length) {
      console.log('[Tour Debug] Auto-start BLOCKED:')
      if (!storageReady) console.log('  ❌ Storage not ready')
      if (!autoStart) console.log('  ❌ Auto-start disabled')
      if (hasSeenTutorial) console.log('  ❌ User has seen tutorial before')
      if (!steps.length) console.log('  ❌ No steps defined')
      return
    }
    
    console.log('[Tour Debug] ✅ Starting tour in', autoStartDelay, 'ms')
    const timeout = window.setTimeout(() => {
      console.log('[Tour Debug] 🚀 Auto-start triggered!')
      startTour()
    }, autoStartDelay)
    return () => window.clearTimeout(timeout)
  }, [autoStart, autoStartDelay, hasSeenTutorial, startTour, steps.length, storageReady])

  useEffect(() => {
    if (showCompletion) {
      // Clear highlight when completion modal shows
      clearHighlight()
      setTargetRect(null)
      setTooltipBounds(null)
    }
  }, [showCompletion, clearHighlight])

  useEffect(() => {
    return () => {
      clearHighlight()
      if (tooltipTimeoutRef.current) window.clearTimeout(tooltipTimeoutRef.current)
      if (particleIntervalRef.current) window.clearInterval(particleIntervalRef.current)
    }
  }, [clearHighlight])

  const currentStepData = useMemo(() => steps[currentStep] ?? null, [currentStep, steps])
  const stepIndicator = `Langkah ${Math.min(currentStep + 1, steps.length)} dari ${steps.length}`

  const resetTour = useCallback(() => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(buildStorageKey(tourId))
    setHasSeenTutorial(false)
  }, [tourId])

  const tooltipClassNames = ['tour-tooltip', tooltipPosition.placement === 'top' ? 'top' : 'bottom']
  if (!tooltipVisible) tooltipClassNames.push('hidden')
  if (tooltipActive) tooltipClassNames.push('active')

  const arrowElement = useMemo(() => {
    if (!targetRect || !tooltipBounds) return null

    const start = {
      x: targetRect.left + targetRect.width / 2,
      y: targetRect.top + targetRect.height / 2
    }

    let end = { x: tooltipBounds.left, y: tooltipBounds.top }
    if (tooltipPosition.placement === 'right') {
      end = { x: tooltipBounds.left, y: tooltipBounds.top + tooltipBounds.height / 2 }
    } else if (tooltipPosition.placement === 'left') {
      end = { x: tooltipBounds.left + tooltipBounds.width, y: tooltipBounds.top + tooltipBounds.height / 2 }
    } else if (tooltipPosition.placement === 'top') {
      end = { x: tooltipBounds.left + tooltipBounds.width / 2, y: tooltipBounds.top + tooltipBounds.height }
    } else {
      end = { x: tooltipBounds.left + tooltipBounds.width / 2, y: tooltipBounds.top }
    }

    const box = {
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      width: Math.max(2, Math.abs(end.x - start.x)),
      height: Math.max(2, Math.abs(end.y - start.y))
    }

    const path = {
      x1: start.x - box.left,
      y1: start.y - box.top,
      x2: end.x - box.left,
      y2: end.y - box.top
    }

    return (
      <svg className="tour-arrow" style={{ left: box.left, top: box.top, width: box.width, height: box.height }}>
        <line className="tour-arrow-line" x1={path.x1} y1={path.y1} x2={path.x2} y2={path.y2} />
      </svg>
    )
  }, [targetRect, tooltipBounds, tooltipPosition.placement])

  const portalContent =
    portalTarget && steps.length > 0
      ? createPortal(
          <>
            {isRunning && targetRect && (
              <>
                <div className="tour-backdrop">
                  <svg className="tour-spotlight" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <defs>
                      <mask id={`tour-mask-${tourId}`}>
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                          x={targetRect.left - 12}
                          y={targetRect.top - 12}
                          width={targetRect.width + 24}
                          height={targetRect.height + 24}
                          rx="20"
                          fill="black"
                        />
                      </mask>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="rgba(0, 0, 0, 0.8)"
                      mask={`url(#tour-mask-${tourId})`}
                    />
                  </svg>
                </div>
                <div className="tour-particles-container">
                  {particles.map((particle) => (
                    <div
                      key={particle.id}
                      className="tour-particle"
                      style={{
                        left: particle.x,
                        top: particle.y,
                        animationDelay: `${particle.delay}s`
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            {arrowElement}
            <div
              ref={tooltipRef}
              className={tooltipClassNames.join(' ')}
              style={
                {
                  top: tooltipPosition.top,
                  left: tooltipPosition.left
                } as CSSProperties
              }
              role="dialog"
              aria-modal="true"
            >
              <div className="tour-tooltip-inner">
                <div className="tour-badge" aria-hidden="true">
                  {currentStepData?.emoji ?? '✨'}
                </div>
                <div>
                  <div className="tour-header">
                    <div id="tour-title" className="tour-title">
                      {currentStepData?.title ?? ''}
                    </div>
                    <div id="tour-subtitle" className="tour-subtitle">
                      {currentStepData?.subtitle ?? ''}
                    </div>
                  </div>

                  <div id="tour-tooltip-text" className="tour-tooltip-text">
                    {currentStepData?.text ?? ''}
                  </div>

                  {steps.length > 1 && (
                    <div className="tour-progress">
                      {steps.map((_, index) => {
                        const classes = ['tour-progress-dot']
                        if (index === currentStep) classes.push('is-active')
                        if (index < currentStep) classes.push('is-complete')
                        return <span key={`tour-dot-${tourId}-${index}`} className={classes.join(' ')} />
                      })}
                    </div>
                  )}

                  <div className="tour-tooltip-footer">
                    <button
                      id="tour-prev"
                      type="button"
                      className="tour-btn-ghost"
                      onClick={goPrev}
                      disabled={currentStep === 0}
                    >
                      ← Balik
                    </button>
                    <div id="tour-step-indicator" className="tour-step-indicator">
                      {stepIndicator}
                    </div>
                    <button id="tour-next" type="button" className="tour-btn" onClick={goNext}>
                      {currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut →'}
                    </button>
                  </div>
                </div>

                <button id="tour-skip" type="button" className="tour-skip" onClick={endTour}>
                  Skip aja
                </button>
              </div>
            </div>
            {showCompletion && <div className="tour-complete-backdrop" />}
            {showCompletion && (
              <div className={`tour-complete-modal ${showCompletion ? 'active' : ''}`}>
                <div className="tour-complete-icon">🎉</div>
                <p className="tour-complete-title">Yey, udah paham!</p>
                <p className="tour-complete-text">Sekarang kamu udah siap jelajahi GEMA tanpa bingung lagi.</p>
                <div className="tour-complete-actions">
                  <button type="button" className="tour-btn-primary" onClick={closeCompletion}>
                    Gas belajar
                  </button>
                  <button
                    type="button"
                    className="tour-btn-secondary"
                    onClick={() => {
                      closeCompletion()
                      if (typeof window !== 'undefined') {
                        window.setTimeout(() => startTour(), 300)
                      }
                    }}
                  >
                    Ulang lagi deh
                  </button>
                </div>
              </div>
            )}
          </>,
          portalTarget
        )
      : null

  const triggerNode = renderTrigger
    ? renderTrigger({
        startTour,
        endTour,
        resetTour,
        isRunning,
        hasSeenTutorial,
        storageReady
      })
    : null

  return (
    <>
      {portalContent}
      {triggerNode}
    </>
  )
}
