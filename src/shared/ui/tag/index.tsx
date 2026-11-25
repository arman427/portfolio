import { cn } from '@/shared/lib/cn';
import styles from './Tag.module.css';

/** A row of small mono tags, e.g. the stack of a project. */
export function TagList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn(styles.list, className)}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  );
}
