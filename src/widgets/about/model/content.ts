import type { Localized } from '@/shared/i18n';

type AboutContent = {
  title: string;
  lead: string;
  /** Body copy, rendered as separate paragraphs. */
  paragraphs: readonly string[];
  links: { projects: string; github: string };
  stats: readonly { value: number; suffix?: string; label: string }[];
};

export const aboutContent: Localized<AboutContent> = {
  en: {
    title: 'I turn business ideas into websites people enjoy using',
    lead: 'I think about the person on the other side of the screen and sweat the details nobody asks for, but everybody notices',
    paragraphs: [
      'Over the last few years I have gone from tweaking templates to building complete products: an online store with accounts and a database, table booking for a coffee shop, websites for a dental clinic and a paving contractor.',
      'What I care about: clear structure, smooth motion and the hundred milliseconds that make an interface feel alive.',
      'I explain things in plain language, show progress along the way and stay in touch after launch. I take on client projects\u00a0— and I am open to a team where craft matters.',
    ],
    links: { projects: 'See projects', github: 'GitHub' },
    stats: [
      { value: 4, label: 'Projects live online' },
      { value: 3, suffix: '+', label: 'Years with React' },
      { value: 98, label: 'Average Lighthouse score' },
    ],
  },
  ru: {
    title: 'Превращаю идеи бизнеса в сайты, которыми приятно пользоваться',
    lead: 'Думаю о человеке по ту сторону экрана и прорабатываю детали, о которых никто не просит, но которые замечает каждый',
    paragraphs: [
      'За последние несколько лет я прошёл путь от правки шаблонов до полноценных продуктов: интернет-магазина с личным кабинетом и базой данных, онлайн-бронирования для кофейни, сайтов для стоматологии и дорожной компании.',
      'Мне важны понятная структура, плавное движение и те сто миллисекунд, благодаря которым интерфейс ощущается живым.',
      'Объясняю всё простыми словами, показываю промежуточные результаты и остаюсь на связи после запуска. Беру проекты от заказчиков и открыт к работе в команде, где ценят качество.',
    ],
    links: { projects: 'Смотреть проекты', github: 'GitHub' },
    stats: [
      { value: 4, label: 'Проекта работают онлайн' },
      { value: 3, suffix: '+', label: 'Года с React' },
      { value: 98, label: 'Средний балл Lighthouse' },
    ],
  },
};
