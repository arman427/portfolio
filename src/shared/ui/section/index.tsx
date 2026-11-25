import type { ComponentProps } from 'react';

type SectionProps = ComponentProps<'section'> & {
  id: string;
};

/**
 * Page section primitive. Exposes `data-section`, which the SectionObserver
 * tracks to highlight the matching navigation link.
 */
export function Section({ id, ...props }: SectionProps) {
  return <section id={id} data-section={id} {...props} />;
}
