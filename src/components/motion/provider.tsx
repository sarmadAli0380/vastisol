"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" makes every motion component in the tree respect the
 * OS-level "reduce motion" setting automatically: transform and layout
 * animations are dropped, opacity still cross-fades.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
