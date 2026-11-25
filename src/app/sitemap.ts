import type { MetadataRoute } from 'next';
import { getProjectSlugs } from '@/entities/project';
import { routes } from '@/shared/config/navigation';
import { siteConfig } from '@/shared/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: 'monthly', priority: 1 },
    ...getProjectSlugs().map((slug) => ({
      url: `${siteConfig.url}${routes.project(slug)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
