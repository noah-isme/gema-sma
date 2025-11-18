"use client";

import { useEffect } from "react";

interface ParallaxOptions {
  /**
   * Scale factor applied to the base scroll value before it is sent to CSS.
   * Keep at 1 for a 1:1 mapping with scrollY.
   */
  multiplier?: number;
  /**
   * Disable effect entirely (e.g., for reduced motion preference).
   */
  disabled?: boolean;
}

/**
 * Lightweight parallax controller that exposes the global scroll position
 * through CSS custom properties. Elements declare their speed via
 * `[data-parallax]` and CSS handles the actual transform, so we avoid
 * per-element JS work during scroll.
 */
export const useParallaxMotion = ({
  multiplier = 1,
  disabled = false,
}: ParallaxOptions = {}) => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;

    if (disabled) {
      root.style.setProperty("--parallax-base", "0px");
      return;
    }

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );

    if (elements.length === 0) {
      root.style.setProperty("--parallax-base", "0px");
      return;
    }

    elements.forEach((element) => {
      const rawSpeed = parseFloat(element.getAttribute("data-parallax") ?? "0");
      const speed = Number.isFinite(rawSpeed) ? rawSpeed : 0;
      element.style.setProperty("--parallax-speed", speed.toString());
    });

    let rafId: number | null = null;

    const updateBase = () => {
      root.style.setProperty(
        "--parallax-base",
        `${window.scrollY * multiplier}px`,
      );
      rafId = null;
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateBase);
      }
    };

    // Sync immediately so first paint already uses the current scroll position.
    updateBase();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      root.style.setProperty("--parallax-base", "0px");
      elements.forEach((element) => {
        element.style.removeProperty("--parallax-speed");
      });
    };
  }, [disabled, multiplier]);
};
