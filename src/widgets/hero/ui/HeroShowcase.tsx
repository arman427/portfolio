'use client';

import Image from 'next/image';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { Project } from '@/entities/project';
import { routes } from '@/shared/config/navigation';
import { useDictionary } from '@/shared/i18n';
import { BrowserFrame } from '@/shared/ui/browser-frame';
import { Live } from '@/shared/ui/live';
import { TextLink } from '@/shared/ui/text-link';
import { TransitionLink } from '@/shared/ui/transition-link';
import styles from './HeroShowcase.module.css';

type HeroShowcaseProps = {
  projects: Project[];
  labels: { tabsLabel: string; caseLink: string };
};

/**
 * The hero's visual: one browser window with a tab per live project. Tabs
 * follow the WAI-ARIA pattern (arrows, Home, End); the screen opens the case.
 */
export function HeroShowcase({ projects, labels }: HeroShowcaseProps) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dict = useDictionary();
  const id = useId();
  const project = projects[active];

  if (!project) return null;

  const select = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = projects.length - 1;
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  const tabStrip = (
    <div role="tablist" aria-label={labels.tabsLabel} className={styles.tabs} onKeyDown={onKeyDown}>
      {projects.map((item, index) => (
        <button
          key={item.slug}
          ref={(node) => {
            tabs.current[index] = node;
          }}
          type="button"
          role="tab"
          id={`${id}-tab-${index}`}
          aria-selected={index === active}
          aria-controls={`${id}-panel`}
          tabIndex={index === active ? 0 : -1}
          onClick={() => setActive(index)}
          className={styles.tab}
          style={{ '--tab-color': item.color } as CSSProperties}
        >
          {item.title}
        </button>
      ))}
    </div>
  );

  return (
    <figure>
      <BrowserFrame
        tabs={tabStrip}
        address={<Live>{project.domain}</Live>}
        className={styles.window}
        screenClassName={styles.screen}
      >
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} className={styles.panel}>
          <TransitionLink
            href={routes.project(project.slug)}
            aria-label={`${project.title} — ${labels.caseLink}`}
            className={styles.screenLink}
          >
            {projects.map((item, index) =>
              item.cover ? (
                <Image
                  key={item.slug}
                  src={item.cover}
                  alt={index === active ? `${item.title} — ${dict.media.preview}` : ''}
                  aria-hidden={index !== active || undefined}
                  fill
                  sizes="(min-width: 1440px) 1344px, 100vw"
                  preload={index === 0}
                  data-active={index === active || undefined}
                  className={styles.shot}
                />
              ) : null,
            )}
          </TransitionLink>
        </div>
      </BrowserFrame>

      <figcaption className={styles.caption}>
        <span>{project.tagline}</span>
        <TextLink href={routes.project(project.slug)}>{labels.caseLink}</TextLink>
      </figcaption>
    </figure>
  );
}
