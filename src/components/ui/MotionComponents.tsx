import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// Lazy load motion components from framer-motion
export const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export const MotionH1 = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.h1),
  { ssr: false }
);

export const MotionP = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.p),
  { ssr: false }
);

export const MotionA = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.a),
  { ssr: false }
);

export const MotionButton = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.button),
  { ssr: false }
);

// Type exports for convenience
export type MotionDivProps = ComponentProps<typeof MotionDiv>;
export type MotionH1Props = ComponentProps<typeof MotionH1>;
export type MotionPProps = ComponentProps<typeof MotionP>;
export type MotionAProps = ComponentProps<typeof MotionA>;
export type MotionButtonProps = ComponentProps<typeof MotionButton>;
