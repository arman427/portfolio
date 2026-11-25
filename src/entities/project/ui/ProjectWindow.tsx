import Image from 'next/image';
import { BrowserFrame } from '@/shared/ui/browser-frame';
import { Live } from '@/shared/ui/live';
import type { Project } from '../model/types';

type ProjectWindowProps = {
  project: Pick<Project, 'title' | 'domain' | 'cover'>;
  /** Screenshot to show; defaults to the cover. */
  src?: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

/**
 * A project in its own browser window: the live address with the green dot
 * and the real screenshot. Without a screenshot the screen stays an empty
 * surface of the same size.
 */
export function ProjectWindow({ project, src = project.cover, alt, sizes, preload, className }: ProjectWindowProps) {
  return (
    <BrowserFrame address={<Live>{project.domain}</Live>} className={className}>
      {src ? <Image src={src} alt={alt} fill sizes={sizes} preload={preload} /> : null}
    </BrowserFrame>
  );
}
