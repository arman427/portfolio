'use client';

import { create } from 'zustand';
import type { Locale } from '@/shared/i18n/config';

/**
 * idle      — nothing is happening
 * leaving   — the curtain is covering the current page
 * entering  — navigated, waiting for the new page to mount
 * revealing — the curtain is lifting off the new page
 */
export type TransitionStatus = 'idle' | 'leaving' | 'entering' | 'revealing';

/**
 * Reading position captured before a language switch: the section in view and
 * how far into it (0…1) the viewport was. The translated copy changes section
 * heights, so a ratio lands on the same content where a pixel offset would not.
 */
export type ScrollAnchor = { section: string; progress: number };

type TransitionState = {
  status: TransitionStatus;
  /** Where the running transition is heading (may include a #hash). */
  targetHref: string | null;
  /** Set when the running transition switches the language instead of the route. */
  targetLocale: Locale | null;
  /** Where to land after a language switch (see `ScrollAnchor`). */
  scrollAnchor: ScrollAnchor | null;
  /** Pathname of the last page whose content finished mounting. */
  readyPath: string | null;

  /** Ask the transition overlay to cover the screen and navigate to `href`. */
  navigate: (href: string) => void;
  /**
   * Cover the screen, swap the language, and reveal the same page again at
   * `href` (current path + the section to land on), restoring `anchor`.
   */
  switchLocale: (locale: Locale, href: string, anchor?: ScrollAnchor | null) => void;
  setStatus: (status: TransitionStatus) => void;
  markReady: (pathname: string) => void;
  reset: () => void;
};

export const useTransitionStore = create<TransitionState>()((set, get) => ({
  status: 'idle',
  targetHref: null,
  targetLocale: null,
  scrollAnchor: null,
  readyPath: null,

  navigate: (href) => {
    if (get().status !== 'idle') return;
    set({ status: 'leaving', targetHref: href, targetLocale: null, scrollAnchor: null });
  },
  switchLocale: (locale, href, anchor = null) => {
    if (get().status !== 'idle') return;
    set({ status: 'leaving', targetHref: href, targetLocale: locale, scrollAnchor: anchor });
  },
  setStatus: (status) => set({ status }),
  markReady: (readyPath) => set({ readyPath }),
  reset: () => set({ status: 'idle', targetHref: null, targetLocale: null, scrollAnchor: null }),
}));
