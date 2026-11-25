import type { Project } from './types';

/**
 * Portfolio projects. The home page, the case pages, the sitemap and metadata
 * are all generated from here. Russian copy lives in `projects.ru.ts`.
 *
 * Screenshots live in /public/projects/<slug>/: `cover.jpg` and `shot-*.jpg`
 * are 1440×900 desktop captures, `mobile.jpg` is a 390×844 phone capture.
 */
export const projects: Project[] = [
  {
    slug: 'vellum',
    title: 'Vellum',
    tagline: 'Clothing store with a catalog, cart and customer accounts',
    description:
      'A complete online store for a fictional clothing atelier: a catalog with filters, product pages with colors and sizes, a cart, a wishlist and sign-up with email confirmation\u00a0— in Russian and English.',
    category: 'E-commerce',
    kind: 'Pet project',
    year: 2026,
    role: 'Full-stack development',
    stack: ['Next.js', 'Prisma', 'PostgreSQL · Neon', 'Server Actions', 'Tailwind CSS', 'Nodemailer'],
    links: { live: 'https://cloth-shop-lac.vercel.app/' },
    domain: 'cloth-shop-lac.vercel.app',
    color: '#3046e0',
    cover: '/projects/vellum/cover.jpg',
    gallery: ['/projects/vellum/shot-1.jpg', '/projects/vellum/shot-2.jpg', '/projects/vellum/shot-3.jpg'],
    mobile: '/projects/vellum/mobile.jpg',
    overview:
      'Vellum is a store for an imaginary atelier in Porto that sews clothes in small batches. I wanted it to behave like a real shop rather than a pretty home page: real accounts, a cart that is still there after a reload, and a catalog you can actually filter.',
    challenge:
      'An online store is dozens of small scenarios: pick a color and a size, add to the cart, sign up, confirm the email, come back a week later and find everything in place. Each of them has to be fast and obvious\u00a0— otherwise the buyer simply leaves.',
    solution:
      'The catalog, product pages and cart run on Next.js server components and Server Actions. Adding to the cart or the wishlist responds instantly thanks to optimistic updates. Data lives in PostgreSQL (Neon) and is accessed through Prisma. Sign-up uses my own session-based auth with a one-time code sent by email over SMTP, and a demo account lets anyone look around in one click.',
    features: [
      {
        title: 'Catalog with filters',
        description: 'Filter by category, size and color, then sort the results\u00a0— 42 items across five categories.',
      },
      {
        title: 'Product page',
        description:
          'Photo gallery, color and size selection with sold-out sizes crossed out, materials and care, and “you may also like”.',
      },
      {
        title: 'Cart and wishlist',
        description: 'Add from a card or from the product page\u00a0— the counters in the header update instantly.',
      },
      {
        title: 'Customer accounts',
        description: 'Sign-up with a code sent to your email, sign-in, and a demo account for a quick look.',
      },
      {
        title: 'Two languages',
        description: 'The whole store is available in Russian and English, and the chosen language is remembered.',
      },
    ],
    results: [
      { value: 42, label: 'Products in the catalog' },
      { value: 5, label: 'Product categories' },
      { value: 2, label: 'Interface languages' },
    ],
    learnings:
      'In e-commerce it is the small things that sell: a crossed-out sold-out size, a counter that reacts instantly, a cart that is still there tomorrow.',
  },
  {
    slug: 'brew-and-bean',
    title: 'Brew & Bean',
    tagline: 'Specialty coffee shop website with online table booking',
    description:
      'A website for a specialty coffee shop that makes you want to drop in: a menu by category, a seasonal offer, spaces for work and events, and a booking form where the guest picks a zone, a date and a time.',
    category: 'Café & restaurant',
    kind: 'Pet project',
    year: 2026,
    role: 'Frontend development',
    stack: ['Next.js', 'React Hook Form', 'Zod', 'Tailwind CSS', 'Base UI', 'React Day Picker', 'Swiper', 'IMask'],
    links: { live: 'https://coffee-next-five.vercel.app/' },
    domain: 'coffee-next-five.vercel.app',
    color: '#2f8a5c',
    cover: '/projects/brew-and-bean/cover.jpg',
    gallery: [
      '/projects/brew-and-bean/shot-1.jpg',
      '/projects/brew-and-bean/shot-2.jpg',
      '/projects/brew-and-bean/shot-3.jpg',
    ],
    mobile: '/projects/brew-and-bean/mobile.jpg',
    overview:
      'Brew & Bean is a concept site for a small chain of specialty coffee shops in three cities. In a few seconds it has to convey the atmosphere, show the menu with prices and let a guest book a table without calling.',
    challenge:
      'Booking forms are where people usually give up: too many fields, unclear time slots, errors that appear only after pressing “Send”. And the site still has to feel cozy, not like a form builder.',
    solution:
      'The form guides the guest step by step: first the zone and the date, and only then the times that fit them. The date is picked in a calendar, the phone number gets a mask, and every field is validated with React Hook Form and Zod. The request goes to a Next.js Route Handler. The atmosphere comes from large photos, a serif headline and calm motion.',
    features: [
      {
        title: 'Table booking',
        description: 'Zone, number of guests, date and time\u00a0— the available times depend on the chosen zone and date.',
      },
      {
        title: 'Menu by category',
        description: 'Hot and iced coffee, matcha and tea, pastries\u00a0— switched with tabs, with serving sizes and prices.',
      },
      {
        title: 'Spaces and events',
        description: 'A work zone, a shared table, a meeting room and an event space\u00a0— each with a short description.',
      },
      {
        title: 'Locations',
        description: 'Three coffee shops with addresses, opening hours and a “Get directions” button.',
      },
      {
        title: 'Guest reviews',
        description: 'A slider with guest reviews that can be swiped on a phone.',
      },
    ],
    results: [
      { value: 4, label: 'Zones to book' },
      { value: 3, label: 'Coffee shop locations' },
      { value: 4, label: 'Menu categories' },
    ],
    learnings:
      'A good form is a conversation: ask one thing at a time and never offer an option that is not available.',
  },
  {
    slug: 'briz',
    title: 'Briz',
    tagline: 'Dental clinic website that eases the fear of the dentist',
    description:
      'A multi-page website for a dental clinic in Volgograd: services with honest prices, doctors, patient reviews and booking in a couple of clicks\u00a0— through a callback form or Telegram.',
    category: 'Healthcare',
    kind: 'Pet project',
    year: 2026,
    role: 'Frontend development',
    stack: ['Next.js', 'GSAP', 'Tailwind CSS', 'Base UI'],
    links: { live: 'https://dentist-landing-liart.vercel.app/' },
    domain: 'dentist-landing-liart.vercel.app',
    color: '#1a8f93',
    cover: '/projects/briz/cover.jpg',
    gallery: ['/projects/briz/shot-1.jpg', '/projects/briz/shot-2.jpg', '/projects/briz/shot-3.jpg'],
    mobile: '/projects/briz/mobile.jpg',
    overview:
      'Briz is a concept site for a private dental clinic. People open such sites anxious: will it hurt, how much will it cost, can I trust this doctor? Every block on the page answers one of these questions.',
    challenge:
      'Fourteen services, prices that depend on diagnostics, and a visitor who is afraid of the dentist. The site had to explain all of this calmly and lead to booking without pressure.',
    solution:
      'The first screen gives the essentials: a warm photo, a free consultation offer, guarantees and installments. Services open in an accordion on the home page, and each one has its own page with what is included and a price list. Doctors are shown with their experience and specialization, while the callback form and Telegram are always at hand. GSAP adds soft scroll animations.',
    features: [
      {
        title: 'A page for every service',
        description: 'What is included, indicative prices and the leading specialists\u00a0— for each of the 14 services.',
      },
      {
        title: 'Services accordion',
        description: 'All treatments on one screen: open one to see a photo, a short description and the starting price.',
      },
      {
        title: 'Doctors',
        description: 'Cards with experience and specialization, and a “Book this doctor” button on each one.',
      },
      {
        title: 'Quick booking',
        description: 'A callback form with a phone mask, booking via Telegram and a phone number in the header.',
      },
      {
        title: 'Answers before questions',
        description: 'Guarantees, 0% installments, help with the tax deduction and reviews from Yandex and 2GIS.',
      },
    ],
    results: [
      { value: 14, label: 'Services with their own page' },
      { value: 3, label: 'Ways to book a visit' },
      { value: 4, label: 'Key benefits on the first screen' },
    ],
    learnings:
      'In healthcare, design works when it reduces anxiety: prices up front, the doctors’ faces and no surprises.',
  },
  {
    slug: 'asphalt-vlg',
    title: 'Asphalt VLG',
    tagline: 'Lead generation site for an asphalt paving contractor',
    description:
      'A one-page website for a road works company in Volgograd: services, work stages, a cost estimate request and contacts. Requests from both forms arrive by email.',
    category: 'Construction',
    kind: 'Pet project',
    year: 2026,
    role: 'Frontend development',
    stack: ['Next.js', 'GSAP', 'React Hook Form', 'Zod', 'Tailwind CSS', 'Server Actions', 'Swiper', 'IMask'],
    links: { live: 'https://asphalt-vlg.vercel.app/' },
    domain: 'asphalt-vlg.vercel.app',
    color: '#f5a623',
    cover: '/projects/asphalt-vlg/cover.jpg',
    gallery: [
      '/projects/asphalt-vlg/shot-1.jpg',
      '/projects/asphalt-vlg/shot-2.jpg',
      '/projects/asphalt-vlg/shot-3.jpg',
    ],
    mobile: '/projects/asphalt-vlg/mobile.jpg',
    overview:
      'Asphalt VLG is a concept site for a paving contractor. Its clients are homeowners, businesses and housing associations, and all of them want the same thing: to understand what the job involves and how much it will cost.',
    challenge:
      'In construction a website is judged by one thing: does it bring requests. A visitor has to see quickly that the company handles their kind of site, understand the process and leave their contacts without extra phone calls.',
    solution:
      'A bold yellow-and-black style borrowed from road machinery, services as cards over a site photo, and six work stages from request to handover. The estimate form asks only what the estimator needs: site type, load, current base and extra work. Both forms are validated with React Hook Form and Zod, the phone number gets a mask, and a Server Action sends the request by email with a toast confirming it.',
    features: [
      {
        title: 'Estimate request',
        description:
          'Site type, load, base and extra work\u00a0— curbs, drainage, removing the old surface, hauling soil.',
      },
      {
        title: 'Requests by email',
        description: 'Both forms are sent by a Server Action; a hidden honeypot field filters out spam bots.',
      },
      {
        title: 'Services',
        description: 'Six directions\u00a0— from roads and parking lots to asphalt crumb for country communities.',
      },
      {
        title: 'Work stages',
        description: 'Six clear steps from the request to handing over the site, including when the advance is paid.',
      },
      {
        title: 'Always in reach',
        description: 'Telegram and WhatsApp links, a floating call button and a “back to top” button.',
      },
    ],
    results: [
      { value: 6, label: 'Services' },
      { value: 6, label: 'Steps from request to handover' },
      { value: 2, label: 'Request forms' },
    ],
    learnings:
      'For a contractor the website is a sales manager: it answers the main questions and makes leaving a request effortless.',
  },
];
