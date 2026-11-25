'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { prefersReducedMotion } from '@/shared/lib/gsap';
import styles from './Reveal.module.css';

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol' | 'li' | 'section' | 'article' | 'figure';
};

/**
 * Fades a block in and lifts it 12px the first time it scrolls into view.
 * Blocks that are already on screen when the page mounts are left alone, so
 * nothing that is visible ever blinks out and back in.
 */
export function Reveal({ children, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.reveal = 'shown';
        observer.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // The ref type is widened to HTMLElement for every tag this accepts.
    <Tag ref={ref as never} className={cn(styles.reveal, className)}>
      {children}
    </Tag>
  );
}
