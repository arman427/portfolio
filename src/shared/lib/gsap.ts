'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

if (typeof window !== 'undefined') {
  // Mobile address bar show/hide should not re-trigger expensive refreshes.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * The single easing curve of the site. `power4.out` is the quint ease-out,
 * the GSAP twin of `--ease: cubic-bezier(0.22, 1, 0.36, 1)` in globals.css.
 */
export const EASE = 'power4.out';

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches;
}

export { gsap, ScrollTrigger, useGSAP };
