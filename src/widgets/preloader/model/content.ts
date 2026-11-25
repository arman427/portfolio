import { plural, type Localized } from '@/shared/i18n';

type PreloaderContent = {
  /** The live signature: how many projects are online right now. */
  status: (count: number) => string;
};

export const preloaderContent: Localized<PreloaderContent> = {
  en: {
    status: (count) => `${count} ${plural('en', count, { one: 'project', other: 'projects' })} online`,
  },
  ru: {
    status: (count) =>
      `${count} ${plural('ru', count, { one: 'проект', few: 'проекта', many: 'проектов', other: 'проекта' })} онлайн`,
  },
};
