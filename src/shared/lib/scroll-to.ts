'use client';

import type Lenis from 'lenis';
import { prefersReducedMotion } from '@/shared/lib/gsap';

/** Gentle start, gentle landing — no sudden jump at the beginning of the ride. */
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Longer trips get more time, but with diminishing returns so a jump across
 * the whole page never drags on: ~1.3s for one screen, capped at 2.4s.
 */
export function scrollDuration(distance: number) {
  const screens = Math.abs(distance) / Math.max(window.innerHeight, 1);
  return Math.min(2.4, Math.max(1, 0.9 + Math.sqrt(screens) * 0.45));
}

type ScrollTarget = HTMLElement | number;

/**
 * The single smooth-scroll entry point for in-page anchors and "back to top".
 * Falls back to native smooth scrolling when Lenis is not available.
 */
export function smoothScrollTo(lenis: Lenis | undefined | null, target: ScrollTarget, onComplete?: () => void) {
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;

  if (!lenis) {
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    onComplete?.();
    return;
  }

  lenis.scrollTo(target, {
    duration: scrollDuration(top - window.scrollY),
    easing: easeInOutCubic,
    force: true,
    onComplete: () => onComplete?.(),
  });
}
