'use client';

import { Fragment, useEffect, useLayoutEffect, type ReactNode } from 'react';
import {
  defaultLocale,
  isLocale,
  LOCALE_PENDING_CLASS,
  LOCALE_STORAGE_KEY,
  useLocale,
  useLocaleStore,
} from '@/shared/i18n';

/**
 * Applies the stored locale right after hydration. The server always renders
 * the default locale; the page stays hidden (`html.locale-pending`) until the
 * translated copy has been committed by `LocaleBoundary`.
 */
export function LocaleSync() {
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // Storage unavailable — stay on the default locale.
    }
    if (isLocale(stored) && stored !== defaultLocale) {
      useLocaleStore.getState().setLocale(stored);
    } else {
      document.documentElement.classList.remove(LOCALE_PENDING_CLASS);
    }
  }, []);

  return null;
}

/**
 * Remounts its subtree when the locale changes, so every widget starts fresh
 * with the new copy (line breaks, measured heights). Runs under the transition
 * curtain (see `LocaleSwitch`), so the user never sees it. Once the new copy is
 * committed, the page is allowed to show.
 */
export function LocaleBoundary({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useLayoutEffect(() => {
    if (locale !== defaultLocale) document.documentElement.classList.remove(LOCALE_PENDING_CLASS);
  }, [locale]);

  return <Fragment key={locale}>{children}</Fragment>;
}
