import type { CSSProperties } from 'react';

/**
 * Position of an element in the one load entrance (`[data-enter]` in
 * globals.css): each step starts 50ms after the previous one.
 */
export const enterStep = (index: number) => ({ '--enter-i': index }) as CSSProperties;
