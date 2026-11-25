import { defaultLocale, type Locale } from '@/shared/i18n/config';
import { projects } from '../model/projects';
import { projectsRu } from '../model/projects.ru';
import type { Project, ProjectText } from '../model/types';

const translations: Partial<Record<Locale, Record<string, ProjectText>>> = { ru: projectsRu };

// One stable array per locale, so components can depend on it by reference.
const cache = new Map<Locale, Project[]>();

/** All projects with their copy in `locale` (English is the source of truth). */
export const getProjects = (locale: Locale = defaultLocale): Project[] => {
  let list = cache.get(locale);
  if (!list) {
    const text = translations[locale];
    list = text ? projects.map((project) => ({ ...project, ...text[project.slug] })) : projects;
    cache.set(locale, list);
  }
  return list;
};

export const getProjectSlugs = () => projects.map((project) => project.slug);

export const getProjectBySlug = (slug: string, locale?: Locale) =>
  getProjects(locale).find((project) => project.slug === slug);

export const getProjectIndex = (slug: string) => projects.findIndex((project) => project.slug === slug);

/** Next project in the list, looping back to the first one. */
export const getNextProject = (slug: string, locale?: Locale) => {
  const list = getProjects(locale);
  return list[(getProjectIndex(slug) + 1) % list.length];
};
