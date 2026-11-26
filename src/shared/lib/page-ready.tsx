'use client';

import { useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { documentTop, getHashTarget } from '@/shared/lib/dom';
import { ScrollTrigger } from '@/shared/lib/gsap';
import { useTransitionStore } from '@/shared/model/transition-store';

/**
 * Render as the LAST child of every view. Its effect runs after all sibling
 * layout effects (GSAP setup), so it can safely refresh ScrollTrigger and tell
 * the transition overlay that the new page is ready to be revealed.
 */
export function PageReady() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Triggers may have been created out of DOM order (parents after children,
    // layout widgets before the page) — sort them before recalculating.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    useTransitionStore.getState().markReady(pathname);

    // Deep link on a hard load (e.g. /#work): re-apply after pins were added.
    const { hash } = window.location;
    if (hash && useTransitionStore.getState().status === 'idle') {
      const frame = requestAnimationFrame(() => {
        // Honour the deep link once, then drop the hash so a reload starts clean.
        const { pathname: path, search } = window.location;
        window.history.replaceState(window.history.state, '', path + search);
        const target = getHashTarget(hash);
        if (!target) return;
        // Pass a measured offset, not the element: Lenis resolves elements
        // against its own scroll value, which goes stale while it is stopped
        // (preloader) and ScrollTrigger.refresh() moves the window underneath.
        // Re-measure first too — pin spacers just grew the page, and Lenis
        // would clamp the jump to the old (shorter) scroll limit.
        lenis?.resize();
        const y = documentTop(target);
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname, lenis]);

  return null;
}
