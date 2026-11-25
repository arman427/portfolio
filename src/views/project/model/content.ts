import type { Localized } from '@/shared/i18n';

type ProjectPageContent = {
  hero: {
    back: string;
    live: string;
    source: string;
    meta: { role: string; address: string; stack: string };
  };
  story: { title: string; challenge: string; solution: string };
  features: { title: string };
  gallery: { title: string; desktop: string; mobile: string };
  results: { title: string; learned: string };
  next: { label: string };
};

export const projectPageContent: Localized<ProjectPageContent> = {
  en: {
    hero: {
      back: 'All projects',
      live: 'Open the website',
      source: 'Source code',
      meta: { role: 'Role', address: 'Address', stack: 'Stack' },
    },
    story: { title: 'About the project', challenge: 'The task', solution: 'How I solved it' },
    features: { title: 'What the site can do' },
    gallery: { title: 'Screenshots', desktop: 'Desktop', mobile: 'Phone' },
    results: { title: 'The project in numbers', learned: 'What I took away' },
    next: { label: 'Next project' },
  },
  ru: {
    hero: {
      back: 'Все проекты',
      live: 'Открыть сайт',
      source: 'Исходный код',
      meta: { role: 'Роль', address: 'Адрес', stack: 'Стек' },
    },
    story: { title: 'О проекте', challenge: 'Задача', solution: 'Как я её решил' },
    features: { title: 'Что умеет сайт' },
    gallery: { title: 'Скриншоты', desktop: 'Десктоп', mobile: 'Телефон' },
    results: { title: 'Проект в цифрах', learned: 'Что я вынес' },
    next: { label: 'Следующий проект' },
  },
};
