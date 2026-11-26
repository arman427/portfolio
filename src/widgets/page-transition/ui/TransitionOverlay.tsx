'use client';

import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getProjectBySlug } from '@/entities/project';
import { dictionaries, useLocaleStore, type Locale } from '@/shared/i18n';
import { documentTop, getHashTarget, getRenderedById } from '@/shared/lib/dom';
import { EASE, gsap, ScrollTrigger, useGSAP } from '@/shared/lib/gsap';
import { useAppStore } from '@/shared/model/app-store';
import { useTransitionStore } from '@/shared/model/transition-store';
import styles from './TransitionOverlay.module.css';

function labelFor(href: string, locale: Locale) {
  const { pathname } = new URL(href, 'http://local');
  const slug = pathname.match(/^\/work\/([^/]+)/)?.[1];
  if (slug) return getProjectBySlug(slug, locale)?.title ?? dictionaries[locale].nav.work;
  return dictionaries[locale].site.firstName;
}

/**
 * Resolves once the fonts needed by the freshly rendered copy have loaded,
 * so the page is measured with its final line breaks. Never waits longer
 * than `timeout`.
 */
function waitForFonts(timeout: number) {
  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, timeout);
    // Two frames: let the browser apply the new styles and request the faces.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        void (document.fonts?.ready ?? Promise.resolve()).then(() => {
          window.clearTimeout(timer);
          resolve();
        });
      }),
    );
  });
}

/**
 * A short fade to the page color between routes and when the language
 * changes: cover → router.push / locale swap → page reports ready → uncover.
 */
export function TransitionOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const status = useTransitionStore((state) => state.status);
  const targetHref = useTransitionStore((state) => state.targetHref);
  const targetLocale = useTransitionStore((state) => state.targetLocale);
  const readyPath = useTransitionStore((state) => state.readyPath);

  // 1 — cover, then navigate (or swap the language)
  useGSAP(
    () => {
      const el = root.current;
      if (status !== 'leaving' || !targetHref || !el) return;

      const locale = useLocaleStore.getState().locale;
      if (label.current) {
        label.current.textContent = targetLocale
          ? dictionaries[targetLocale].locale.names[targetLocale]
          : labelFor(targetHref, locale);
      }
      lenis?.stop();

      gsap
        .timeline({
          onComplete: () => {
            lenis?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
            useTransitionStore.getState().setStatus('entering');
            if (targetLocale) {
              useAppStore.getState().setMenuOpen(false);
              // Remounts the page (LocaleBoundary) with the new copy under the curtain.
              useLocaleStore.getState().setLocale(targetLocale);
            } else {
              // The #hash only picks the landing section (step 2) — keep it out of the address bar.
              const { pathname: path, search } = new URL(targetHref, window.location.href);
              router.push(path + search, { scroll: false });
            }
          },
        })
        .set(el, { visibility: 'visible', pointerEvents: 'auto' })
        .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: EASE })
        .fromTo(label.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: EASE }, 0.1);
    },
    { dependencies: [status, targetHref, targetLocale] },
  );

  // 2 — uncover once the destination has mounted
  useEffect(() => {
    const el = root.current;
    if (status !== 'entering' || !targetHref || !el) return;

    const url = new URL(targetHref, window.location.href);

    const reveal = () => {
      ScrollTrigger.refresh();
      lenis?.resize();
      const { scrollAnchor } = useTransitionStore.getState();
      // Hidden (preserved) pages may share ids with this one — look up the shown copy only.
      const anchorEl = scrollAnchor && getRenderedById(scrollAnchor.section);
      const hashTarget = url.hash ? getHashTarget(url.hash) : null;
      // Measured offsets, not elements: Lenis is stopped under the curtain and
      // its own scroll value can be stale after the refresh above.
      let landing: number | null = null;
      if (scrollAnchor && anchorEl) {
        // Language switch: land on the same spot inside the section, not on its top.
        landing = Math.round(documentTop(anchorEl) + scrollAnchor.progress * anchorEl.offsetHeight);
      } else if (hashTarget) {
        landing = Math.round(documentTop(hashTarget));
      }
      if (landing !== null) {
        if (lenis) lenis.scrollTo(landing, { immediate: true, force: true });
        else window.scrollTo(0, landing);
      }
      lenis?.start();
      useTransitionStore.getState().setStatus('revealing');

      // Uncover after React has committed the status change, so the first
      // frames of the fade are not dropped.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gsap
            .timeline({
              onComplete: () => {
                gsap.set(el, { visibility: 'hidden', pointerEvents: 'none' });
                useTransitionStore.getState().reset();
              },
            })
            .to(label.current, { opacity: 0, duration: 0.15, ease: EASE })
            .to(el, { opacity: 0, duration: 0.4, ease: EASE }, 0.05);
        });
      });
    };

    if (targetLocale) {
      // Same route, new copy: wait for the new fonts so the page measures correctly.
      let cancelled = false;
      void waitForFonts(2500).then(() => {
        if (!cancelled) reveal();
      });
      return () => {
        cancelled = true;
      };
    }

    const arrived = pathname === url.pathname && readyPath === url.pathname;
    // Safety net: never leave the curtain down if a page forgets to report.
    const fallback = window.setTimeout(reveal, arrived ? 60 : 4000);
    return () => window.clearTimeout(fallback);
  }, [status, targetHref, targetLocale, pathname, readyPath, lenis]);

  return (
    <div ref={root} aria-hidden className={styles.overlay}>
      <span ref={label} className={styles.label} />
    </div>
  );
}
