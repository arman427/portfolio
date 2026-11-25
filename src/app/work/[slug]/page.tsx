import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProjectBySlug, getProjectSlugs } from '@/entities/project';
import { ProjectPage, ProjectPageSkeleton } from '@/views/project';

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      ...(project.cover ? { images: [{ url: project.cover, width: 2160, height: 1350, alt: project.title }] } : {}),
    },
  };
}

export default function Page({ params }: PageProps<'/work/[slug]'>) {
  // URL data is read inside Suspense so the route's App Shell stays shareable.
  return (
    <Suspense fallback={<ProjectPageSkeleton />}>
      <ProjectRoute params={params} />
    </Suspense>
  );
}

async function ProjectRoute({ params }: Pick<PageProps<'/work/[slug]'>, 'params'>) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectPage slug={project.slug} />;
}
