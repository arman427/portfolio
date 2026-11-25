import type { Localized } from '@/shared/i18n';

type ContactContent = {
  title: string;
  text: string;
  emailCta: string;
  emailLabel: string;
};

export const contactContent: Localized<ContactContent> = {
  en: {
    title: 'Tell me what you need\u00a0— I reply within a day',
    text: 'A website, an online store or improvements to an existing site: a couple of sentences is enough. I’ll come back with questions or a rough estimate. Open roles are welcome too.',
    emailCta: 'Email me',
    emailLabel: 'Email',
  },
  ru: {
    title: 'Напишите, что нужно,\u00a0— отвечу в течение дня',
    text: 'Сайт, интернет-магазин или доработка существующего: хватит пары предложений. Вернусь с уточняющими вопросами или примерной оценкой. Вакансии тоже рассматриваю.',
    emailCta: 'Написать на почту',
    emailLabel: 'Почта',
  },
};
