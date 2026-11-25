import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { TransitionLink } from '@/shared/ui/transition-link';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'sm';

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `paper` — on the light services sheet. */
  tone?: 'dark' | 'paper';
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing icon, e.g. ↗ for links that leave the site. */
  iconEnd?: ReactNode;
  className?: string;
};

type AsButton = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps & Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps | 'href'> & { href: string };

export type ButtonProps = AsButton | AsLink;

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', tone = 'dark', icon, iconEnd, className } = props;

  const classes = cn(
    styles.button,
    styles[variant],
    size === 'sm' && styles.small,
    tone === 'paper' && styles.paper,
    className,
  );

  const content = (
    <>
      {icon}
      {children}
      {iconEnd}
    </>
  );

  if (props.href !== undefined) {
    const {
      href,
      variant: _variant,
      size: _size,
      tone: _tone,
      icon: _icon,
      iconEnd: _iconEnd,
      className: _className,
      children: _children,
      ...rest
    } = props;

    if (isExternal(href)) {
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

  const {
    variant: _variant,
    size: _size,
    tone: _tone,
    icon: _icon,
    iconEnd: _iconEnd,
    className: _className,
    children: _children,
    ...rest
  } = props;
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
