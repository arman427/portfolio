'use client';

import type { Project } from '@/entities/project';
import { useLocalized } from '@/shared/i18n';
import { Container } from '@/shared/ui/container';
import { Reveal } from '@/shared/ui/reveal';
import { Section } from '@/shared/ui/section';
import { SectionHead } from '@/shared/ui/section-head';
import { projectPageContent } from '../model/content';
import styles from './ProjectPage.module.css';

export function ProjectStory({ project }: { project: Project }) {
  const { story } = useLocalized(projectPageContent);

  return (
    <Section id="overview" aria-labelledby="overview-title" className={styles.block}>
      <Container>
        <SectionHead id="overview-title" title={story.title} lead={project.tagline} />

        <Reveal>
          <p className={styles.overview}>{project.overview}</p>
        </Reveal>

        <Reveal className={styles.columns}>
          <div>
            <h3 className={styles.columnTitle}>{story.challenge}</h3>
            <p className={styles.columnText}>{project.challenge}</p>
          </div>
          <div>
            <h3 className={styles.columnTitle}>{story.solution}</h3>
            <p className={styles.columnText}>{project.solution}</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
