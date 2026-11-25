import { siteConfig } from '@/shared/config/site';
import type { Localized } from './config';

/**
 * Interface copy shared by several widgets. Section-specific copy lives next
 * to its widget (`widgets/<name>/model`), project copy in `entities/project`.
 */
type Dictionary = {
  site: { firstName: string; role: string; location: string; city: string };
  nav: {
    about: string;
    work: string;
    services: string;
    stack: string;
    contact: string;
    mainLabel: string;
    mobileLabel: string;
  };
  header: { home: string; cta: string; openMenu: string; closeMenu: string };
  locale: { switchLabel: string; names: Localized<string> };
  status: { available: string };
  /** Alt text suffixes: "Vellum — preview". */
  media: { preview: string; screenshot: string };
  copyEmail: { copy: string; copied: string };
  footer: {
    menu: string;
    socials: string;
    localTime: string;
    builtWith: string;
    backToTop: string;
  };
  notFound: { eyebrow: string; title: string; text: string; backHome: string };
};

const localeNames: Localized<string> = { en: 'English', ru: 'Русский' };

export const dictionaries: Localized<Dictionary> = {
  en: {
    site: {
      firstName: siteConfig.firstName,
      role: siteConfig.role,
      location: siteConfig.location,
      city: siteConfig.city,
    },
    nav: {
      about: 'About',
      work: 'Work',
      services: 'Services',
      stack: 'Stack',
      contact: 'Contact',
      mainLabel: 'Main',
      mobileLabel: 'Mobile',
    },
    header: { home: 'home', cta: 'Get in touch', openMenu: 'Open menu', closeMenu: 'Close menu' },
    locale: { switchLabel: 'Language', names: localeNames },
    status: { available: siteConfig.availability.label },
    media: { preview: 'preview', screenshot: 'screenshot' },
    copyEmail: { copy: 'Copy address', copied: 'Copied' },
    footer: {
      menu: 'Menu',
      socials: 'Socials',
      localTime: 'Local time',
      builtWith: 'Built with Next.js, GSAP and Three.js',
      backToTop: 'Back to top',
    },
    notFound: {
      eyebrow: 'Error 404',
      title: 'This page doesn’t exist',
      text: 'The link may be outdated or have a typo in it',
      backHome: 'Back home',
    },
  },
  ru: {
    site: {
      firstName: siteConfig.ru.firstName,
      role: siteConfig.ru.role,
      location: siteConfig.ru.location,
      city: siteConfig.ru.city,
    },
    nav: {
      about: 'Обо мне',
      work: 'Проекты',
      services: 'Услуги',
      stack: 'Стек',
      contact: 'Контакты',
      mainLabel: 'Основная навигация',
      mobileLabel: 'Мобильная навигация',
    },
    header: { home: 'на главную', cta: 'Связаться', openMenu: 'Открыть меню', closeMenu: 'Закрыть меню' },
    locale: { switchLabel: 'Язык', names: localeNames },
    status: { available: siteConfig.ru.availabilityLabel },
    media: { preview: 'превью', screenshot: 'скриншот' },
    copyEmail: { copy: 'Скопировать адрес', copied: 'Скопировано' },
    footer: {
      menu: 'Меню',
      socials: 'Соцсети',
      localTime: 'Местное время',
      builtWith: 'Сделано на Next.js, GSAP и Three.js',
      backToTop: 'Наверх',
    },
    notFound: {
      eyebrow: 'Ошибка 404',
      title: 'Такой страницы нет',
      text: 'Возможно, ссылка устарела или в ней опечатка',
      backHome: 'На главную',
    },
  },
};

export type { Dictionary };
