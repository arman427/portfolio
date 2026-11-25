'use client';

import { useEffect, useRef, useState } from 'react';
import { useDictionary } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { CheckIcon, CopyIcon } from '@/shared/ui/icons';

type CopyEmailProps = {
  email: string;
  className?: string;
};

/** Copies the address to the clipboard and says so for a moment. */
export function CopyEmail({ email, className }: CopyEmailProps) {
  const dict = useDictionary();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <Button variant="secondary" onClick={copy} icon={copied ? <CheckIcon /> : <CopyIcon />} className={className}>
      <span aria-live="polite">{copied ? dict.copyEmail.copied : dict.copyEmail.copy}</span>
    </Button>
  );
}
