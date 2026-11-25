/**
 * Home page sections listed in the navigation, in page order. Every section
 * is listed so the nav always has an active item while scrolling.
 * Labels are localized in `shared/i18n` (`dictionary.nav`).
 */
export const navItems = ['about', 'work', 'services', 'stack', 'contact'] as const;

/** Matches the `id` of a home page section. */
export type NavItem = (typeof navItems)[number];

export const isNavItem = (value: unknown): value is NavItem =>
  typeof value === 'string' && (navItems as readonly string[]).includes(value);

export const routes = {
  home: '/',
  project: (slug: string) => `/work/${slug}`,
  section: (id: string) => `/#${id}`,
} as const;
