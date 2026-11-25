'use client';

import type { Project } from '@/entities/project';
import { useLocalized } from '@/shared/i18n';
import { Container } from '@/shared/ui/container';
import { Reveal } from '@/shared/ui/reveal';
import { Section } from '@/shared/ui/section';
import { projectPageContent } from '../model/content';
import styles from './ProjectPage.module.css';

export function ProjectFeatures({ project }: { project: Project }) {
  const { features } = useLocalized(projectPageContent);

  return (
    <Section id="features" aria-labelledby="features-title" className={styles.block}>
      <Container>
        <h2 id="features-title" className={styles.blockTitle}>
          {features.title}
        </h2>

        <Reveal as="ol" className={styles.features}>
          {project.features.map((feature) => (
            <li key={feature.title} className={styles.feature}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
