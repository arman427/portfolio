'use client';

import { useLayoutEffect, useRef } from 'react';
import { EASE, gsap, prefersReducedMotion } from '@/shared/lib/gsap';

type CountUpProps = {
  value: number;
  /** Seconds to wait after the number scrolls into view. */
  delay?: number;
  className?: string;
};

/**
 * Counts from 0 up to `value` the first time the number scrolls into view.
 * The server renders the final value, and a number that is already on screen
 * when the page mounts is left alone (same rule as `Reveal`). Screen readers
 * get the final value only, never the intermediate frames.
 */
export function CountUp({ value, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    // The span's only child is the number, which React keeps as the element's
    // text content, so writing textContent does not detach any React node.
    const counter = { n: 0 };
    const render = () => {
      el.textContent = String(Math.round(counter.n));
    };
    render();

    let tween: gsap.core.Tween | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        tween = gsap.to(counter, {
          n: value,
          duration: 1.6,
          delay,
          ease: EASE,
          onUpdate: render,
        });
      },
      // Matches Reveal, so the count starts together with the block's fade-in.
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      tween?.kill();
      el.textContent = String(value);
    };
  }, [value, delay]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
