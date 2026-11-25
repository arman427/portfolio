import { clsx, type ClassValue } from 'clsx';

/** Joins class names, skipping falsy values: `cn(styles.button, isOpen && styles.open)`. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
