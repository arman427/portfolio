'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useLocale } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';
import { useMediaQuery } from '@/shared/lib/use-media-query';
import type { DemoPointer } from './ParticleCanvas';
import styles from './ParticleDemo.module.css';

const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false });

type ParticleDemoProps = {
  /** `{count}` is replaced with the formatted number of points. */
  caption: string;
  className?: string;
  captionClassName?: string;
};

/**
 * A live WebGL sample: thousands of points that morph between shapes on the
 * GPU and step aside from the cursor. three.js is fetched only when the demo
 * first scrolls into view, and frames stop while it is off screen.
 */
export function ParticleDemo({ caption, className, captionClassName }: ParticleDemoProps) {
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<DemoPointer>({ x: 0, y: 0, active: false });
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const isNarrow = useMediaQuery('(max-width: 767px)');
  const locale = useLocale();
  const count = isNarrow ? 6000 : 12000;

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = Boolean(entry?.isIntersecting);
      setInView(visible);
      if (visible) setSeen(true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      active: true,
    };
  };

  const onPointerLeave = () => {
    pointer.current = { ...pointer.current, active: false };
  };

  return (
    <figure className={className}>
      <div
        ref={stage}
        aria-hidden
        className={styles.stage}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {seen ? <ParticleCanvas count={count} active={inView} pointer={pointer} /> : null}
      </div>
      <figcaption className={cn(styles.caption, captionClassName)}>
        {caption.replace('{count}', new Intl.NumberFormat(locale).format(count))}
      </figcaption>
    </figure>
  );
}
