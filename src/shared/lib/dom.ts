/**
 * With `cacheComponents` Next.js keeps the pages you navigated away from in the
 * DOM, hidden by React `<Activity>` (`display: none`). Document-wide lookups
 * must skip them: a hidden element reports a zero rect (top = 0, "above the
 * middle of the viewport") and can share an `id` with the visible page.
 */

/** The element takes part in layout (not inside a hidden, preserved page). */
export function isRendered(el: Element) {
  return el.getClientRects().length > 0;
}

/** `document.querySelectorAll`, limited to the page that is actually shown. */
export function queryRendered<T extends HTMLElement = HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector)).filter(isRendered);
}

/** `document.getElementById` that ignores copies living in hidden pages. */
export function getRenderedById(id: string): HTMLElement | null {
  if (!id) return null;
  return queryRendered(`[id="${CSS.escape(id)}"]`)[0] ?? null;
}

/** Element targeted by a URL hash (`#contact`), if it is on the shown page. */
export function getHashTarget(hash: string): HTMLElement | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    // Malformed escape sequence — fall back to the raw value.
  }
  return getRenderedById(id);
}

/** Absolute document offset of `el`, independent of any smooth-scroll state. */
export function documentTop(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY;
}
