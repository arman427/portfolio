'use client';

import { useLocale } from '@/shared/i18n';
import { getProjectBySlug, getProjects } from './selectors';

/** Projects in the active language. */
export const useProjects = () => getProjects(useLocale());

/** A single project in the active language. */
export const useProject = (slug: string) => getProjectBySlug(slug, useLocale());
