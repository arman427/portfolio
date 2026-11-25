import { plural, type Localized } from '@/shared/i18n';

type WorkContent = {
  title: string;
  lead: (count: number) => string;
  item: { caseLink: string; liveLink: string; stack: string; phoneAlt: string };
  more: { text: string; link: string };
};

export const workContent: Localized<WorkContent> = {
  en: {
    title: 'Sites you can open and click through',
    lead: (count) =>
      `${count} ${plural('en', count, { one: 'project', other: 'projects' })} built from idea to deploy, all of them live`,
    item: { caseLink: 'Case study', liveLink: 'Open the site', stack: 'Stack', phoneAlt: 'on a phone' },
    more: {
      text: 'Smaller experiments, open-source bits and work in progress live on GitHub',
      link: 'GitHub',
    },
  },
  ru: {
    title: 'Сайты, которые можно открыть и потрогать',
    lead: (count) =>
      `${count} ${plural('ru', count, { one: 'проект', few: 'проекта', many: 'проектов', other: 'проекта' })} от идеи до деплоя, и все они работают`,
    item: { caseLink: 'Кейс', liveLink: 'Открыть сайт', stack: 'Стек', phoneAlt: 'на телефоне' },
    more: {
      text: 'Небольшие эксперименты, open-source и работа в процессе\u00a0— на GitHub',
      link: 'GitHub',
    },
  },
};
