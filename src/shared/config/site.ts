/**
 * Personal information used across the whole site.
 * Replace the placeholders with your own data — every widget reads from here.
 */
export const siteConfig = {
    name: "Arman Babayan",
    firstName: "Arman",
    role: "Next.js developer",
    url: "https://armanbabayan.site",
    email: "babayananuta11@gmail.com",
    yandex: "arman.babayan.dev@yandex.ru",
    location: "Volgograd, Russia",
    city: "Volgograd",
    timezone: "Europe/Moscow",
    /** Shown next to the contacts. Set `isAvailable` to false to hide it. */
    availability: {
        isAvailable: true,
        label: "Available for work",
    },
    description:
        "Next.js developer building fast websites, online stores and web apps for businesses — with clean code, thoughtful motion and attention to detail.",
    keywords: [
        "Next.js developer",
        "React",
        "TypeScript",
        "Frontend",
        "Three.js",
        "GSAP",
        "Portfolio",
    ],
    /** Used as a static fallback before the client clock hydrates. */
    copyrightYear: 2026,
    socials: [
        {
            label: "GitHub",
            href: "https://github.com/arman427",
            handle: "@arman427",
        },
        {
            label: "Telegram",
            href: "https://t.me/armanhik7",
            handle: "@armanhik7",
        },
        {
            label: "Max",
            href: "https://max.ru/u/f9LHodD0cOIqQXbsaeIRL_cHw4chwelpxNM8O3SlsLW1NbSofPZ4o4Nz38k",
            handle: "Arman Babayan",
        },
    ],
    /**
     * Russian versions of the personal details above (used when the visitor
     * switches the site to Russian). The full name stays in Latin as a brand mark.
     */
    ru: {
        firstName: "Арман",
        role: "Next.js-разработчик",
        location: "Волгоград, Россия",
        city: "Волгоград",
        availabilityLabel: "Открыт к предложениям",
    },
} as const;

export type Social = (typeof siteConfig.socials)[number];
