"use client";

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

interface VideoLogoProps {
  src: string
  width?: number
  height?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
  fallbackImage?: string
}

export default function VideoLogo({
  src,
  width = 400,
  height = 300,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  className = "",
  fallbackImage = "/gema.svg"
}: VideoLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Auto play if enabled
    if (autoplay && !hasError) {
      video.play().catch(() => {
        // Autoplay failed, probably due to browser policy
      })
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [autoplay, hasError])

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-white rounded-lg ${className}`}>
        <Image
          src={fallbackImage}
          alt="GEMA Logo"
          width={width}
          height={height}
          className="max-w-full h-auto"
        />
      </div>
    )
  }

  return (
    <div className={`relative bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Loading Spinner */}
      {isLoading && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-white z-10`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="w-full h-auto pointer-events-none"
        poster={fallbackImage}
        style={{ pointerEvents: 'none' }}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        <p>Your browser does not support the video tag.</p>
      </video>
    </div>
  )
}