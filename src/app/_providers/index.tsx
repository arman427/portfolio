'use client';

import type { ReactNode } from 'react';
import { LocaleSync } from './LocaleSync';
import { SectionObserver } from './SectionObserver';
import { SmoothScroll } from './SmoothScroll';

export { LocaleBoundary } from './LocaleSync';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <LocaleSync />
      <SectionObserver />
      {children}
    </SmoothScroll>
  );
}
