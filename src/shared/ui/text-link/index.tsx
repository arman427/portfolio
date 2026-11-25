import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from '@/shared/ui/icons';
import { TransitionLink } from '@/shared/ui/transition-link';
import styles from './TextLink.module.css';

type TextLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href: string;
  children: ReactNode;
  /** `back` puts ← in front; links to other sites get ↗, internal ones →. */
  direction?: 'forward' | 'back' | 'none';
  tone?: 'dark' | 'paper';
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** Underlined inline link — the quiet alternative to a button. */
export function TextLink({ href, children, direction = 'forward', tone = 'dark', className, ...rest }: TextLinkProps) {
  const classes = cn(styles.link, tone === 'paper' && styles.paper, className);
  const external = isExternal(href);

  const content = (
    <>
      {direction === 'back' ? <ArrowLeftIcon /> : null}
      {children}
      {direction === 'forward' ? external ? <ArrowUpRightIcon /> : <ArrowRightIcon /> : null}
    </>
  );

  if (external) {
    const opensTab = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        target={opensTab ? '_blank' : undefined}
        rel={opensTab ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <TransitionLink href={href} className={classes} {...rest}>
      {content}
    </TransitionLink>
  );
}
