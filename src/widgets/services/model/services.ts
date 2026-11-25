import type { Localized } from '@/shared/i18n';

export type Service = {
  title: string;
  /** The client's situation and the problem this service solves — in plain words. */
  description: string;
  /** What the client concretely gets. */
  deliverables: string[];
  tags: string[];
  /** Renders the live WebGL demo inside the open panel. */
  demo?: boolean;
};

export type ProcessStep = {
  /** When it happens: "Day 1–3". */
  when: string;
  title: string;
  description: string;
  deliverables: string[];
};

type ServicesContent = {
  title: string;
  deliverablesLabel: string;
  tagsLabel: string;
  items: Service[];
  /** Caption under the WebGL demo; `{count}` is replaced with the number of points. */
  demoCaption: string;
  process: {
    title: string;
    lead: string;
    steps: ProcessStep[];
  };
};

export const servicesContent: Localized<ServicesContent> = {
  en: {
    title: 'Websites, online stores, bots, motion and upgrades',
    deliverablesLabel: 'What you get',
    tagsLabel: 'Built with',
    items: [
      {
        title: 'Business websites',
        description:
          'You need a website that explains what you do and turns visitors into calls and requests\u00a0— for a clinic, a café, a contractor or a studio.',
        deliverables: [
          'A clear structure: services, prices, reviews and contacts in the order people look for them',
          'Request forms that land straight in your inbox',
          'A site that looks right on phones\u00a0— that is where most visitors come from',
          'Basic SEO: page titles, descriptions and neat link previews in messengers',
        ],
        tags: ['Next.js', 'Tailwind CSS', 'GSAP', 'SEO'],
      },
      {
        title: 'Online stores',
        description: 'When the site has to sell, not just inform.',
        deliverables: [
          'A catalog with filters and search, and product pages with sizes and colors',
          'A cart and a wishlist that respond instantly',
          'Sign-up and sign-in with email confirmation',
          'Products and orders stored in a database, ready to grow with you',
        ],
        tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Server Actions'],
      },
      {
        title: 'Telegram bots',
        description:
          'When it is easier for your clients to message you in Telegram than to open a website: the bot takes requests and bookings, answers common questions and notifies you right away.',
        deliverables: [
          'Bookings, requests and orders right in the chat — with buttons instead of long back-and-forth',
          'A notification about every new request to you or to your team chat',
          'Answers to common questions: prices, address, opening hours',
          'A link to your website and database, so requests from the bot and the site end up in one place',
        ],
        tags: ['Telegram Bot API', 'Node.js', 'TypeScript', 'PostgreSQL'],
      },
      {
        title: 'Motion and 3D',
        description:
          'For brands and products that need to stand out: animation that guides attention and makes the site memorable without slowing it down.',
        deliverables: [
          'Scroll-driven animations and smooth page transitions',
          'Interactive 3D scenes right in the browser, like this demo',
          'Micro-interactions on buttons, cards and menus',
          'A calm version for slower devices and for people who turn motion off',
        ],
        tags: ['GSAP', 'Three.js', 'R3F', 'WebGL'],
        demo: true,
      },
      {
        title: 'Site upgrades',
        description:
          'You already have a site, but it is slow, breaks on phones or is painful to change. I find what holds it back and fix it\u00a0— without rebuilding everything from scratch.',
        deliverables: [
          'An audit: what slows the site down and what gets in visitors’ way',
          'Faster loading and better Core Web Vitals',
          'Layout fixes for phones and tablets',
          'Cleaner code that is easier and cheaper to change later',
        ],
        tags: ['Core Web Vitals', 'Lighthouse', 'a11y', 'Refactoring'],
      },
    ],
    demoCaption: 'Live demo · {count} points drawn on the GPU',
    process: {
      title: 'How a project goes',
      lead: 'You always know what is happening, what comes next and when it will be ready',
      steps: [
        {
          when: 'Days 1–3',
          title: 'Discover',
          description:
            'We talk about your business, your clients and what the site should achieve. I ask questions before writing a single line of code.',
          deliverables: ['Goals and audience', 'Site structure', 'Estimate and timeline'],
        },
        {
          when: 'Week 1',
          title: 'Plan',
          description: 'I map out the pages, forms and data, and choose technologies that fit the task\u00a0— not the trendiest ones.',
          deliverables: ['Page map', 'UI kit', 'Technical plan'],
        },
        {
          when: 'Weeks 2–5',
          title: 'Build',
          description:
            'I build in stages and share a working version along the way, so you can comment early\u00a0— not at the very end.',
          deliverables: ['Preview link', 'Forms and integrations', 'Animations'],
        },
        {
          when: 'Launch',
          title: 'Polish and ship',
          description:
            'I check speed, phones and SEO, connect the domain and analytics, and launch. After that I stay in touch and help with changes.',
          deliverables: ['Speed and SEO', 'Domain and analytics', 'Support after launch'],
        },
      ],
    },
  },
  ru: {
    title: 'Сайты, магазины, боты, анимация и доработки',
    deliverablesLabel: 'Что вы получите',
    tagsLabel: 'Технологии',
    items: [
      {
        title: 'Сайты для бизнеса',
        description:
          'Нужен сайт, который понятно рассказывает, чем вы занимаетесь, и превращает посетителей в звонки и заявки,\u00a0— для клиники, кофейни, подрядчика или студии.',
        deliverables: [
          'Понятную структуру: услуги, цены, отзывы и контакты\u00a0— в том порядке, в котором их ищут',
          'Формы заявок, которые сразу приходят вам на почту',
          'Сайт, который удобен на телефоне,\u00a0— оттуда приходит большинство посетителей',
          'Базовое SEO: заголовки, описания страниц и аккуратные превью ссылок в мессенджерах',
        ],
        tags: ['Next.js', 'Tailwind CSS', 'GSAP', 'SEO'],
      },
      {
        title: 'Интернет-магазины',
        description: 'Когда сайт должен продавать, а не просто рассказывать.',
        deliverables: [
          'Каталог с фильтрами и поиском, карточки товаров с размерами и цветами',
          'Корзину и избранное, которые откликаются мгновенно',
          'Регистрацию и вход с подтверждением по почте',
          'Товары и заказы в базе данных\u00a0— с запасом на рост',
        ],
        tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Server Actions'],
      },
      {
        title: 'Telegram-боты',
        description:
          'Когда клиентам проще написать в Telegram, чем открывать сайт: бот принимает заявки и записи, отвечает на частые вопросы и сразу сообщает вам.',
        deliverables: [
          'Запись, заявки и заказы прямо в чате — кнопками, без долгой переписки',
          'Уведомление о каждой новой заявке вам или в рабочий чат команды',
          'Ответы на частые вопросы: цены, адрес, часы работы',
          'Связку с сайтом и базой данных, чтобы заявки из бота и с сайта были в одном месте',
        ],
        tags: ['Telegram Bot API', 'Node.js', 'TypeScript', 'PostgreSQL'],
      },
      {
        title: 'Анимация и 3D',
        description:
          'Для брендов и продуктов, которым важно выделиться: анимация, которая ведёт внимание и делает сайт запоминающимся, но не тормозит его.',
        deliverables: [
          'Анимации на скролле и плавные переходы между страницами',
          'Интерактивные 3D-сцены прямо в браузере, как в этом демо',
          'Микровзаимодействия на кнопках, карточках и в меню',
          'Спокойную версию для слабых устройств и для тех, кто отключил анимацию',
        ],
        tags: ['GSAP', 'Three.js', 'R3F', 'WebGL'],
        demo: true,
      },
      {
        title: 'Доработка сайта',
        description:
          'Сайт уже есть, но он медленный, разваливается на телефонах или его больно менять. Найду, что ему мешает, и исправлю\u00a0— без переделки всего с нуля.',
        deliverables: [
          'Аудит: что тормозит сайт и что мешает посетителям',
          'Быструю загрузку и хорошие показатели Core Web Vitals',
          'Исправленную вёрстку на телефонах и планшетах',
          'Чистый код, который проще и дешевле менять дальше',
        ],
        tags: ['Core Web Vitals', 'Lighthouse', 'a11y', 'Рефакторинг'],
      },
    ],
    demoCaption: 'Живое демо · {count} точек на видеокарте',
    process: {
      title: 'Как проходит проект',
      lead: 'Вы всегда знаете, что происходит сейчас, что будет дальше и когда всё будет готово',
      steps: [
        {
          when: 'Дни 1–3',
          title: 'Исследование',
          description:
            'Обсуждаем ваш бизнес, клиентов и то, чего должен добиться сайт. Задаю вопросы до того, как написать первую строчку кода.',
          deliverables: ['Цели и аудитория', 'Структура сайта', 'Оценка и сроки'],
        },
        {
          when: 'Неделя 1',
          title: 'Планирование',
          description: 'Продумываю страницы, формы и данные и выбираю технологии под задачу, а не самые модные.',
          deliverables: ['Карта страниц', 'UI-кит', 'Технический план'],
        },
        {
          when: 'Недели 2–5',
          title: 'Разработка',
          description:
            'Делаю сайт по этапам и показываю рабочую версию по ходу, чтобы правки появлялись сразу, а не в самом конце.',
          deliverables: ['Ссылка на превью', 'Формы и интеграции', 'Анимации'],
        },
        {
          when: 'Запуск',
          title: 'Полировка и запуск',
          description:
            'Проверяю скорость, мобильную версию и SEO, подключаю домен и аналитику и запускаю. После запуска остаюсь на связи и помогаю с доработками.',
          deliverables: ['Скорость и SEO', 'Домен и аналитика', 'Поддержка после запуска'],
        },
      ],
    },
  },
};
