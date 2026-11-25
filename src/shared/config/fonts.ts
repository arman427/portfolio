import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

/*
 * One superfamily for both languages. IBM Plex was drawn as an engineer's
 * typeface and ships a real Cyrillic, so English and Russian share the same
 * metrics and nothing reflows when the language changes.
 *
 *  - Plex Sans (variable weight): interface, headings, body.
 *  - Plex Mono: domains, times, figures and small meta.
 *
 * `subsets` only controls which files are preloaded; other glyphs are fetched
 * on demand through `unicode-range`.
 */

export const fontSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const fontMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

export const fontVariables = [fontSans.variable, fontMono.variable].join(' ');
