'use client';

import { ProjectWindow, type Project } from '@/entities/project';
import { routes } from '@/shared/config/navigation';
import { useDictionary, useLocalized } from '@/shared/i18n';
import { enterStep as enter } from '@/shared/lib/enter';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { ArrowUpRightIcon, GithubIcon } from '@/shared/ui/icons';
import { Live } from '@/shared/ui/live';
import { Section } from '@/shared/ui/section';
import { TagList } from '@/shared/ui/tag';
import { TextLink } from '@/shared/ui/text-link';
import { projectPageContent } from '../model/content';
import styles from './ProjectPage.module.css';

export function ProjectHero({ project }: { project: Project }) {
  const { hero } = useLocalized(projectPageContent);
  const dict = useDictionary();

  return (
    <Section id="project-hero" aria-labelledby="project-title" className={styles.hero}>
      <Container>
        <div data-enter style={enter(0)}>
          <TextLink href={routes.section('work')} direction="back">
            {hero.back}
          </TextLink>
        </div>

        <div className={styles.head}>
          <div>
            <p data-enter style={enter(1)} className={styles.kicker}>
              {project.category} · {project.kind} · {project.year}
            </p>
            <h1 id="project-title" data-enter style={enter(1)} className={styles.title}>
              {project.title}
            </h1>
            <p data-enter style={enter(2)} className={styles.description}>
              {project.description}
            </p>
            <div data-enter style={enter(3)} className={styles.actions}>
              {project.links.live ? (
                <Button href={project.links.live} iconEnd={<ArrowUpRightIcon />}>
                  {hero.live}
                </Button>
              ) : null}
              {project.links.source ? (
                <Button href={project.links.source} variant="secondary" icon={<GithubIcon />}>
                  {hero.source}
                </Button>
              ) : null}
            </div>
          </div>

          <dl data-enter style={enter(3)} className={styles.meta}>
            <div>
              <dt>{hero.meta.role}</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>{hero.meta.address}</dt>
              <dd>
                <Live href={project.links.live}>{project.domain}</Live>
              </dd>
            </div>
            <div>
              <dt>{hero.meta.stack}</dt>
              <dd>
                <TagList items={project.stack} />
              </dd>
            </div>
          </dl>
        </div>

        <div data-enter style={enter(4)} className={styles.cover}>
          <ProjectWindow
            project={project}
            alt={`${project.title} — ${dict.media.preview}`}
            sizes="(min-width: 1440px) 1344px, 100vw"
            preload
          />
        </div>
      </Container>
    </Section>
  );
}
