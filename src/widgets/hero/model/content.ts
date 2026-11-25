import { routes } from '@/shared/config/navigation';
import { siteConfig } from '@/shared/config/site';
import type { Localized } from '@/shared/i18n';

/**
 * Your portrait on the first screen. Drop a vertical photo (4:5, at least
 * 800×1000) into /public and set the path, e.g. '/me.jpg'. While it is `null`
 * the frame stays an empty surface of the same size — no placeholder text.
 */
export const heroPhotoSrc: string | null = null;

type HeroContent = {
  /** Who, what and where — one quiet line above the headline. */
  intro: string;
  title: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  photoAlt: string;
  showcase: {
    /** Accessible name of the tab strip. */
    tabsLabel: string;
    caseLink: string;
  };
};

export const heroContent: Localized<HeroContent> = {
  en: {
    intro: `${siteConfig.name}\u00a0— Next.js developer in ${siteConfig.city}`,
    title: 'Fast websites and online stores for small businesses',
    lead: 'From the first sketch to launch and the changes after it\u00a0— for clinics, cafés, contractors and shops',
    primaryCta: { label: 'View work', href: routes.section('work') },
    secondaryCta: { label: 'Discuss a project', href: routes.section('contact') },
    photoAlt: `${siteConfig.name}, portrait`,
    showcase: { tabsLabel: 'Projects', caseLink: 'Case study' },
  },
  ru: {
    intro: `${siteConfig.name}\u00a0— Next.js-разработчик из ${siteConfig.ru.cityFrom}`,
    title: 'Быстрые сайты и интернет-магазины для малого бизнеса',
    lead: 'От первого наброска до запуска и доработок после него\u00a0— для клиник, кофеен, подрядчиков и магазинов',
    primaryCta: { label: 'Смотреть работы', href: routes.section('work') },
    secondaryCta: { label: 'Обсудить проект', href: routes.section('contact') },
    photoAlt: `${siteConfig.ru.firstName}, портрет`,
    showcase: { tabsLabel: 'Проекты', caseLink: 'Кейс' },
  },
};
