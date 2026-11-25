'use client';

import { routes } from '@/shared/config/navigation';
import { useDictionary } from '@/shared/i18n';
import { enterStep as enter } from '@/shared/lib/enter';
import { PageReady } from '@/shared/lib/page-ready';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { notFound } = useDictionary();

  return (
    <>
      <Section id="not-found" aria-labelledby="not-found-title" className={styles.page}>
        <Container>
          <p data-enter style={enter(0)} className={styles.code}>
            {notFound.eyebrow}
          </p>
          <h1 id="not-found-title" data-enter style={enter(1)} className={styles.title}>
            {notFound.title}
          </h1>
          <p data-enter style={enter(2)} className={styles.text}>
            {notFound.text}
          </p>
          <div data-enter style={enter(3)} className={styles.action}>
            <Button href={routes.home}>{notFound.backHome}</Button>
          </div>
        </Container>
      </Section>
      <PageReady />
    </>
  );
}
