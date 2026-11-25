'use client';

import type { Project } from '@/entities/project';
import { useLocalized } from '@/shared/i18n';
import { Container } from '@/shared/ui/container';
import { Reveal } from '@/shared/ui/reveal';
import { Section } from '@/shared/ui/section';
import { projectPageContent } from '../model/content';
import styles from './ProjectPage.module.css';

export function ProjectResults({ project }: { project: Project }) {
  const { results } = useLocalized(projectPageContent);

  return (
    <Section id="results" aria-labelledby="results-title" className={styles.block}>
      <Container>
        <h2 id="results-title" className={styles.blockTitle}>
          {results.title}
        </h2>

        <Reveal>
          <dl className={styles.results}>
            {project.results.map((result) => (
              <div key={result.label} className={styles.result}>
                <dt className={styles.resultLabel}>{result.label}</dt>
                <dd className={styles.resultValue}>
                  {result.prefix}
                  {result.value}
                  {result.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal as="figure" className={styles.quote}>
          <blockquote>{project.learnings}</blockquote>
          <figcaption>{results.learned}</figcaption>
        </Reveal>
      </Container>
    </Section>
  );
}
