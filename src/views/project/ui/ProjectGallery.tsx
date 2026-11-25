'use client';

import Image from 'next/image';
import type { Project } from '@/entities/project';
import { useDictionary, useLocalized } from '@/shared/i18n';
import { Container } from '@/shared/ui/container';
import { Reveal } from '@/shared/ui/reveal';
import { Section } from '@/shared/ui/section';
import { projectPageContent } from '../model/content';
import styles from './ProjectPage.module.css';

/** Real screenshots: a large desktop shot next to the phone version, then two more below. */
export function ProjectGallery({ project }: { project: Project }) {
  const dict = useDictionary();
  const { gallery } = useLocalized(projectPageContent);
  const [first, second, third] = project.gallery ?? [];

  if (!first && !project.mobile) return null;

  const alt = (n: number) => `${project.title} — ${dict.media.screenshot} ${n}`;

  return (
    <Section id="gallery" aria-labelledby="gallery-title" className={styles.block}>
      <Container>
        <h2 id="gallery-title" className="sr-only">
          {gallery.title}
        </h2>

        <Reveal className={styles.gallery}>
          {first ? (
            <figure className={styles.galleryMain}>
              <div className={styles.shot}>
                <Image src={first} alt={alt(1)} fill sizes="(min-width: 768px) 66vw, 100vw" />
              </div>
              <figcaption className={styles.caption}>{gallery.desktop}</figcaption>
            </figure>
          ) : null}

          {project.mobile ? (
            <figure className={styles.galleryPhone}>
              <div className={styles.phone}>
                <div className={styles.phoneScreen}>
                  <Image
                    src={project.mobile}
                    alt={`${project.title} — ${gallery.mobile}`}
                    fill
                    sizes="(min-width: 768px) 248px, 70vw"
                  />
                </div>
              </div>
              <figcaption className={styles.caption}>{gallery.mobile}</figcaption>
            </figure>
          ) : null}

          {second ? (
            <figure className={styles.galleryHalf}>
              <div className={styles.shot}>
                <Image src={second} alt={alt(2)} fill sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
            </figure>
          ) : null}

          {third ? (
            <figure className={styles.galleryHalf}>
              <div className={styles.shot}>
                <Image src={third} alt={alt(3)} fill sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
            </figure>
          ) : null}
        </Reveal>
      </Container>
    </Section>
  );
}
