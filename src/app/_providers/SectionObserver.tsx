'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from '@/shared/i18n';
import { queryRendered } from '@/shared/lib/dom';
import { ScrollTrigger } from '@/shared/lib/gsap';
import { useAppStore } from '@/shared/model/app-store';
import { useTransitionStore } from '@/shared/model/transition-store';

/**
 * Publishes the `[data-section]` that currently crosses the middle of the
 * viewport to the app store (navigation highlight).
 *
 * The active section is derived from geometry on every scroll frame instead of
 * IntersectionObserver crossing events: crossings can be missed or arrive out
 * of order during fast programmatic scrolls, which left the highlight stale.
 * "The last section whose top is above the middle line" is always well defined.
 */
export function SectionObserver() {
  const pathname = usePathname();
  const readyPath = useTransitionStore((state) => state.readyPath);
  const locale = useLocale();

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      // A language switch remounts the page at scroll 0 under the curtain, then
      // restores the reading position — don't flash "no section" meanwhile.
      const { status, targetLocale } = useTransitionStore.getState();
      if (targetLocale && (status === 'leaving' || status === 'entering')) return;

      // Previously visited pages stay in the DOM hidden (cacheComponents →
      // <Activity>); their zero rects would read as "above the middle".
      const sections = queryRendered('[data-section]');
      if (!sections.length) return;

      const middle = window.innerHeight / 2;
      let current: HTMLElement | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= middle) current = section;
        else break;
      }
      current ??= sections[0];

      const { activeSection, setActiveSection } = useAppStore.getState();
      const id = current.dataset.section ?? null;
      if (id !== activeSection) setActiveSection(id);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    ScrollTrigger.addEventListener('refresh', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ScrollTrigger.removeEventListener('refresh', schedule);
    };
  }, [pathname, readyPath, locale]);

  return null;
}
