"use client";

import { useEffect } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Native Intersection Observer hook to replace scrollreveal library
 * Zero dependencies, browser-native, ~2KB vs 136KB scrollreveal
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    once = true,
  } = options;

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: immediately show all elements
      const elements = document.querySelectorAll("[data-scroll-reveal]");
      elements.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add revealed class to trigger CSS animation
            entry.target.classList.add("revealed");

            // If once=true, stop observing after first reveal
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            // If once=false, remove revealed class when out of view
            entry.target.classList.remove("revealed");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all elements with data-scroll-reveal attribute
    const elements = document.querySelectorAll("[data-scroll-reveal]");
    elements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);
}

/**
 * Advanced scroll reveal with custom callbacks
 */
export function useScrollRevealWithCallback(
  onReveal?: (element: Element) => void,
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    once = true,
  } = options;

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            
            // Execute custom callback
            if (onReveal) {
              onReveal(entry.target);
            }

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("revealed");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const elements = document.querySelectorAll("[data-scroll-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, onReveal]);
}
