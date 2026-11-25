# Portfolio — Next.js

Портфолио Next.js-разработчика: быстрые сайты, интернет-магазины и онлайн-запись для малого бизнеса.
Тёплая тёмная палитра, один светлый «лист» с услугами, настоящие скриншоты проектов в окнах
браузера и живой адрес каждого сайта с зелёной точкой.

**Стек:** Next.js 16 (App Router, Cache Components, полностью статичный) · TypeScript ·
CSS Modules + токены в `globals.css` · GSAP (переходы, аккордеон) · Lenis · Three.js + React Three Fiber
(живое демо в услуге «Анимация и 3D») · Zustand.

```bash
npm run dev        # http://localhost:3000
npm run build      # production-сборка (все страницы пререндерятся)
npm run start
npm run lint
npm run typecheck
```

## Где менять контент

| Что | Файл |
| --- | --- |
| Имя, роль, email, соцсети, город, часовой пояс, статус «Открыт к предложениям» | `src/shared/config/site.ts` |
| Проекты (окна, страницы кейсов, sitemap, метаданные) | `src/entities/project/model/projects.ts` и `projects.ru.ts` |
| Hero: строка-представление, заголовок, подзаголовок, кнопки, фото | `src/widgets/hero/model/content.ts` |
| About: заголовок, текст, цифры | `src/widgets/about/model/content.ts` |
| Услуги и этапы работы | `src/widgets/services/model/services.ts` |
| Work / Stack / Contact | `src/widgets/*/model/*.ts` |
| Общие подписи интерфейса | `src/shared/i18n/dictionary.ts` |
| Пункты меню | `src/shared/config/navigation.ts` |
| Цвета, размеры шрифта, отступы, радиусы, easing | `src/app/globals.css` (`:root`) |

**Портрет:** положите вертикальное фото (4:5, от 800×1000) в `public/`, например `public/me.jpg`,
и укажите путь в `heroPhotoSrc` (`src/widgets/hero/model/content.ts`). Пока там `null`, на первом
экране пустая рамка того же размера, без надписей.

**Прелоадер** (`src/widgets/preloader`) — только на главной и только при полной загрузке страницы:
считает до 100, пока грузятся шрифты, фото и первый скриншот, и уезжает вверх. Повторный заход в той же
вкладке получает короткую версию, переход на главную внутри сайта — без прелоадера. Вход hero ждёт его
(правило `body:has([data-preloader])` в `globals.css`).

**Окно с проектами** под первым экраном приподнимается при скролле (scroll-linked parallax на GSAP
ScrollTrigger, `Hero.tsx`). На телефонах и при `prefers-reduced-motion` стоит на месте.

**Скриншоты проектов:** `public/projects/<slug>/` — `cover.jpg` (первый экран, 16:10), `shot-1…3.jpg`
(16:10) и `mobile.jpg` (390×844). Без `cover` окно показывает пустой экран того же размера.

**Цвет проекта** (`color`) — его «фавикон» во вкладках окна в hero.

**Тире:** перед « — » в текстах стоит неразрывный пробел (`\u00a0`), чтобы тире не переносилось в начало строки.

## Дизайн-система

- **Палитра** — тёплая тёмная шкала (`--bg-deep`, `--bg`, `--bg-card`, `--bg-raised`), три роли текста
  (`--text`, `--text-2`, `--text-3`), волосяные линии 8–14%. Светлая «бумага» (`--paper*`) — только у услуг.
- **Акцент** `--accent` (#ff5a1f) — метка, а не поверхность: логотип, выделение текста, фокус,
  активная вкладка, этап «Запуск». На бумаге — `--accent-ink`.
- **Подпись** — компонент `Live` (`shared/ui/live`): домен моноширинным и статичная зелёная точка.
- **Шрифты** — IBM Plex Sans (вариативный, латиница + кириллица) и IBM Plex Mono для доменов,
  времени и цифр. Веса 400 и 500.
- **Движение** — одна кривая `--ease` (в GSAP — `EASE = 'power4.out'`), 150/200/450 мс. Единственный вход
  при загрузке — `[data-enter]` в `globals.css`; блоки ниже первого экрана мягко появляются через `Reveal`.
  `prefers-reduced-motion` отключает анимации.

## Архитектура — Feature-Sliced Design

```
src/
├─ app/                Next.js роутинг + слой app (провайдеры, глобальные стили)
│  ├─ _providers/      Lenis ↔ GSAP ticker, SectionObserver, синхронизация языка
│  ├─ work/[slug]/     страницы кейсов (generateStaticParams)
│  └─ layout.tsx       глобальные виджеты: Header, Footer, TransitionOverlay
├─ views/              слой pages (переименован, чтобы не конфликтовать с Next.js)
│  ├─ home/  project/  not-found/
├─ widgets/            hero/ about/ work/ services/ stack/ contact/ header/ footer/ preloader/ page-transition/
├─ features/           copy-email/ switch-locale/
├─ entities/
│  └─ project/         модель, данные, селекторы, ProjectWindow
└─ shared/
   ├─ config/          site, navigation, fonts
   ├─ i18n/            словари EN/RU, стор языка
   ├─ lib/             gsap, cn, dom, enter, хуки
   ├─ model/           zustand-сторы (app, transition)
   └─ ui/              Button, TextLink, TagList, Live, BrowserFrame, SectionHead, Section,
                       Container, Reveal, LocalTime, ParticleDemo, иконки
```

Импорты идут только сверху вниз (`app → views → widgets → features → entities → shared`),
у каждого слайса публичный API в `index.ts`. Стили компонента лежат рядом с ним в `*.module.css`
и используют токены из `globals.css`; Tailwind подключён только ради reset (см. `turbopack.rules`
в `next.config.ts` — лоадер Tailwind применяется лишь к `globals.css`, чтобы CSS-модули остались модулями).

### Живое демо 3D

`shared/ui/particle-demo` — 12 000 точек (6 000 на телефоне), которые в вершинном шейдере
перетекают между формами и расступаются под курсором. three.js загружается, только когда пункт
«Анимация и 3D» открыт и демо попало в экран; вне экрана кадры не считаются.

### Правила

- В обработчиках скролла и поиске по документу — хелперы из `shared/lib/dom` (скрытые страницы
  `cacheComponents` остаются в DOM).
- Каждая view заканчивается `<PageReady />`: он пересчитывает ScrollTrigger и сообщает
  шторке перехода, что страница готова.
