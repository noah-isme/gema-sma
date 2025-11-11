"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface LogoAnimatedProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

export default function LogoAnimated({ 
  size = "lg", 
  className = "",
  priority = false 
}: LogoAnimatedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
      } else if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Autoplay failed, fallback handled
        });
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Check if video sources exist
    const checkVideo = async () => {
      try {
        const response = await fetch("/gema-animation.webm", { method: "HEAD" });
        setHasVideo(response.ok);
      } catch {
        setHasVideo(false);
      }
    };
    
    if (!prefersReducedMotion) {
      checkVideo();
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  // If reduced motion or no video, show static logo
  if (prefersReducedMotion || !hasVideo) {
    return (
      <div className={`relative select-none ${sizeClasses[size]} ${className}`}>
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(79,70,229,0.25)] bg-white dark:bg-slate-800/80 backdrop-blur-sm border border-white/10">
          <Image
            src="/gema.svg"
            alt="Logo GEMA - Learning Management System"
            fill
            className="object-contain p-3"
            priority={priority}
          />
        </div>
        
        {/* Subtle static glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl opacity-15 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),transparent_60%)]"
        />
      </div>
    );
  }

  return (
    <div className={`relative select-none ${sizeClasses[size]} ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.25)] object-cover"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster="/gema.svg"
        aria-label="Animasi logo GEMA"
        onError={() => setHasVideo(false)}
      >
        {/* WebM first for better compression */}
        <source src="/gema-animation.webm" type="video/webm" />
        <source src="/gema-animation.mp4" type="video/mp4" />
        
        {/* Fallback content */}
        <Image
          src="/gema.svg"
          alt="Logo GEMA"
          width={160}
          height={160}
          className="object-contain"
        />
      </video>

      {/* Idle glow - very subtle, CSS-only */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-breathe bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),transparent_60%)]"
      />
      
      {/* Optional: Shimmer effect overlay */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
      >
        <span className="absolute inset-[-100%] animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </span>
    </div>
  );
}
