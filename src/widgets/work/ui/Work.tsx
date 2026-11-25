'use client';

import Image from 'next/image';
import { ProjectWindow, useProjects, type Project } from '@/entities/project';
import { routes } from '@/shared/config/navigation';
import { siteConfig } from '@/shared/config/site';
import { useDictionary, useLocalized } from '@/shared/i18n';
import { Container } from '@/shared/ui/container';
import { Reveal } from '@/shared/ui/reveal';
import { Section } from '@/shared/ui/section';
import { SectionHead } from '@/shared/ui/section-head';
import { TextLink } from '@/shared/ui/text-link';
import { TransitionLink } from '@/shared/ui/transition-link';
import { workContent } from '../model/content';
import styles from './Work.module.css';

export function Work() {
  const projects = useProjects();
  const content = useLocalized(workContent);
  const github = siteConfig.socials.find((social) => social.label === 'GitHub');

  return (
    <Section id="work" aria-labelledby="work-title" className={styles.work}>
      <Container>
        <SectionHead id="work-title" title={content.title} lead={content.lead(projects.length)} />

        <ol className={styles.list}>
          {projects.map((project) => (
            <WorkItem key={project.slug} project={project} />
          ))}
        </ol>

        {github ? (
          <p className={styles.more}>
            <span>{content.more.text}</span>
            <TextLink href={github.href}>{content.more.link}</TextLink>
          </p>
        ) : null}
      </Container>
    </Section>
  );
}

function WorkItem({ project }: { project: Project }) {
  const { item } = useLocalized(workContent);
  const dict = useDictionary();
  const href = routes.project(project.slug);

  return (
    <Reveal as="li" className={styles.item}>
      <div className={styles.meta}>
        <p className={styles.kicker}>
          {project.category} · {project.kind} · {project.year}
        </p>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.tagline}>{project.tagline}</p>
        <p className={styles.stack}>
          <span className="sr-only">{item.stack}: </span>
          {project.stack.join(' · ')}
        </p>
        <div className={styles.links}>
          <TextLink href={href}>{item.caseLink}</TextLink>
          {project.links.live ? <TextLink href={project.links.live}>{item.liveLink}</TextLink> : null}
        </div>
      </div>

      {/* The window repeats the "Case study" link for the pointer; keyboard and screen readers use the text link. */}
      <div className={styles.media}>
        <TransitionLink href={href} tabIndex={-1} aria-hidden className={styles.windowLink}>
          <ProjectWindow
            project={project}
            alt={`${project.title} — ${dict.media.preview}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </TransitionLink>
        {project.mobile ? (
          <div className={styles.phone}>
            <div className={styles.phoneScreen}>
              <Image src={project.mobile} alt={`${project.title} ${item.phoneAlt}`} fill sizes="164px" />
            </div>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
