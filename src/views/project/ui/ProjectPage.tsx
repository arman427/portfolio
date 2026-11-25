'use client';

import { getNextProject, useProject } from '@/entities/project';
import { useLocale } from '@/shared/i18n';
import { PageReady } from '@/shared/lib/page-ready';
import { NextProject } from './NextProject';
import { ProjectFeatures } from './ProjectFeatures';
import { ProjectGallery } from './ProjectGallery';
import { ProjectHero } from './ProjectHero';
import { ProjectResults } from './ProjectResults';
import { ProjectStory } from './ProjectStory';

/** Case page. Receives the slug (validated by the route) and reads the copy in the active language. */
export function ProjectPage({ slug }: { slug: string }) {
  const locale = useLocale();
  const project = useProject(slug);
  if (!project) return null;

  return (
    <>
      <ProjectHero project={project} />
      <ProjectStory project={project} />
      <ProjectFeatures project={project} />
      <ProjectGallery project={project} />
      <ProjectResults project={project} />
      <NextProject project={getNextProject(slug, locale)} />
      <PageReady />
    </>
  );
}

/** Static fallback shown while the URL-specific content streams in. */
export function ProjectPageSkeleton() {
  return <div aria-hidden style={{ minHeight: '100svh' }} />;
}
