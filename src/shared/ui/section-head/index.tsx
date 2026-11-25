import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import styles from './SectionHead.module.css';

type SectionHeadProps = {
  /** Used as `aria-labelledby` target by the section. */
  id?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  /** `paper` — on the light services sheet. */
  tone?: 'dark' | 'paper';
  className?: string;
};

/** Section heading: the title on the left, an optional lead aligned to its baseline on the right. */
export function SectionHead({ id, title, lead, as: Heading = 'h2', tone = 'dark', className }: SectionHeadProps) {
  return (
    <header className={cn(styles.head, tone === 'paper' && styles.paper, className)}>
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}
