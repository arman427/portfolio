import { create } from 'zustand';
import { defaultLocale, LOCALE_STORAGE_KEY, type Locale } from '../config';

type LocaleState = {
  /**
   * Starts as the default locale on both server and client so hydration
   * matches; `LocaleSync` applies the stored preference right after.
   */
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>()((set) => ({
  locale: defaultLocale,
  setLocale: (locale) => {
    set({ locale });
    if (typeof document === 'undefined') return;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Private mode / storage disabled — the choice just won't persist.
    }
  },
}));

export const useLocale = () => useLocaleStore((state) => state.locale);
