'use client';

import { ProjectWindow, type Project } from '@/entities/project';
import { routes } from '@/shared/config/navigation';
import { useLocalized } from '@/shared/i18n';
import { Container } from '@/shared/ui/container';
import { ArrowRightIcon } from '@/shared/ui/icons';
import { Section } from '@/shared/ui/section';
import { TransitionLink } from '@/shared/ui/transition-link';
import { projectPageContent } from '../model/content';
import styles from './ProjectPage.module.css';

export function NextProject({ project }: { project: Project }) {
  const { next } = useLocalized(projectPageContent);

  return (
    <Section id="next-project" aria-label={next.label} className={styles.next}>
      <Container>
        <TransitionLink href={routes.project(project.slug)} prefetch className={styles.nextLink}>
          <div>
            <p className={styles.nextLabel}>{next.label}</p>
            <p className={styles.nextTitle}>
              {project.title}
              <ArrowRightIcon />
            </p>
            <p className={styles.nextTagline}>{project.tagline}</p>
          </div>
          <div className={styles.nextWindow}>
            {/* The link already names the project — the screenshot is decorative here. */}
            <ProjectWindow project={project} alt="" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </TransitionLink>
      </Container>
    </Section>
  );
}
