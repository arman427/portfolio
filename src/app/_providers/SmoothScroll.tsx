'use client';

import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/shared/lib/gsap';

function ScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/** Lenis smooth scrolling driven by the GSAP ticker, synced with ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const raf = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Web fonts change line wrapping → recalculate every trigger once they land.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Faces can also arrive later (e.g. Cyrillic subsets after switching to
    // Russian) — refresh again whenever a late batch finishes loading, unless
    // something already refreshed since (the language-switch reveal does).
    // A redundant refresh would land mid-reveal and make the curtain stutter.
    let refreshTimer = 0;
    let lastRefresh = 0;
    const onRefresh = () => {
      lastRefresh = performance.now();
    };
    const onFontsLoaded = () => {
      const loadedAt = performance.now();
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        if (lastRefresh < loadedAt) ScrollTrigger.refresh();
      }, 120);
    };
    ScrollTrigger.addEventListener('refresh', onRefresh);
    document.fonts?.addEventListener('loadingdone', onFontsLoaded);

    return () => {
      gsap.ticker.remove(raf);
      window.clearTimeout(refreshTimer);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      document.fonts?.removeEventListener('loadingdone', onFontsLoaded);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.09,
        // In-page anchors go through `smoothScrollTo` (TransitionLink) for one consistent feel.
        anchors: false,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
