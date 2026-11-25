import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';
import styles from './Container.module.css';

type ContainerProps = ComponentProps<'div'>;

/** Page width: content capped at 1344px with the responsive page padding. */
export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn(styles.container, className)} {...props} />;
}
