import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import styles from './BrowserFrame.module.css';

type BrowserFrameProps = {
  /** Content of the address field — usually a `<Live>` domain. */
  address: ReactNode;
  /** Optional tab strip above the address bar. */
  tabs?: ReactNode;
  /** The page itself: a 16:10 screen. */
  children?: ReactNode;
  className?: string;
  screenClassName?: string;
};

/** A quiet browser window: optional tabs, an address bar and a 16:10 screen. */
export function BrowserFrame({ address, tabs, children, className, screenClassName }: BrowserFrameProps) {
  return (
    <div className={cn(styles.frame, className)}>
      {tabs}
      <div className={styles.bar}>
        <div className={styles.address}>{address}</div>
      </div>
      <div className={cn(styles.screen, screenClassName)}>{children}</div>
    </div>
  );
}
