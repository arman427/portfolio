/**
 * Locale configuration. Server-safe (no hooks) — the root layout imports it
 * to build the pre-paint locale script.
 */
export const locales = ['en', 'ru'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** localStorage key holding the visitor's explicit choice. */
export const LOCALE_STORAGE_KEY = 'portfolio:locale';

/** Set on <html> by the pre-paint script while the stored locale is not applied yet. */
export const LOCALE_PENDING_CLASS = 'locale-pending';

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);

/** Content that exists once per locale. */
export type Localized<T> = Record<Locale, T>;

/**
 * Runs synchronously in <head> before the first paint: applies the stored
 * locale to <html lang> and hides the page (see `globals.css`) until React
 * swaps the server-rendered English copy. A timer shows the page anyway if
 * hydration never happens, so a script error can't leave it blank.
 */
export const localeBootScript = `(function(){try{var l=localStorage.getItem(${JSON.stringify(
  LOCALE_STORAGE_KEY,
)});if(l&&l!==${JSON.stringify(defaultLocale)}&&${JSON.stringify(locales)}.indexOf(l)>-1){var d=document.documentElement,c=${JSON.stringify(
  LOCALE_PENDING_CLASS,
)};d.lang=l;d.classList.add(c);setTimeout(function(){d.classList.remove(c)},3000)}}catch(e){}})()`;
