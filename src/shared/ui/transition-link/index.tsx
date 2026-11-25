'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import type { ComponentProps } from 'react';
import { getHashTarget } from '@/shared/lib/dom';
import { smoothScrollTo } from '@/shared/lib/scroll-to';
import { useTransitionStore } from '@/shared/model/transition-store';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * Drop-in replacement for `next/link` that plays the page transition curtain
 * before navigating. Same-page links (`/#work` while on `/`) smooth-scroll instead.
 * Modifier-clicks / new tabs keep native behaviour because `onNavigate` only
 * fires for client-side navigations.
 */
export function TransitionLink({ href, onNavigate, scroll, ...props }: TransitionLinkProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const navigate = useTransitionStore((state) => state.navigate);

  return (
    <Link
      href={href}
      scroll={scroll ?? false}
      onNavigate={(event) => {
        onNavigate?.(event);

        const url = new URL(href, window.location.href);
        event.preventDefault();

        if (url.pathname === pathname) {
          const target = url.hash ? getHashTarget(url.hash) : null;
          smoothScrollTo(lenis, target ?? 0);
          return;
        }

        navigate(href);
      }}
      {...props}
    />
  );
}
