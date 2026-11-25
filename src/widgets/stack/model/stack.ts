import type { Localized } from "@/shared/i18n";

export type StackGroupId =
    | "frontend"
    | "motion"
    | "backend"
    | "tooling"
    | "exploring";

export type StackGroup = {
    id: StackGroupId;
    title: string;
    description: string;
    items: string[];
};

type StackContent = {
    title: string;
    lead: string;
    columns: { area: string; purpose: string; tools: string };
    groups: StackGroup[];
};

const items: Record<StackGroupId, string[]> = {
    frontend: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Zustand",
        "TanStack Query",
    ],
    motion: ["GSAP", "ScrollTrigger", "Three.js", "R3F", "GLSL"],
    backend: ["Node.js", "Prisma", "PostgreSQL", "Supabase", "tRPC"],
    tooling: [
        "Git",
        "Turbopack",
        "ESLint",
        "Vitest",
        "Playwright",
        "Figma",
        "Vercel",
    ],
    exploring: ["WebGPU", "React Compiler", "Go", "AI SDKs"],
};

export const stackContent: Localized<StackContent> = {
    en: {
        title: "Next.js at the core, and the tools around it",
        lead: "Tools I reach for every day\u00a0— and a few I am exploring right now",
        columns: { area: "Area", purpose: "What for", tools: "Tools" },
        groups: [
            {
                id: "frontend",
                title: "Frontend",
                description:
                    "Type-safe, component-driven interfaces with modern React",
                items: items.frontend,
            },
            {
                id: "motion",
                title: "Motion and 3D",
                description: "Scroll stories, shaders and micro-interactions",
                items: items.motion,
            },
            {
                id: "backend",
                title: "Backend and data",
                description:
                    "Databases, forms and APIs\u00a0— the part of a site you don't see",
                items: items.backend,
            },
            {
                id: "tooling",
                title: "Tooling",
                description:
                    "Fast feedback loops from local dev to production",
                items: items.tooling,
            },
            {
                id: "exploring",
                title: "Currently exploring",
                description: "What I am playing with after hours",
                items: items.exploring,
            },
        ],
    },
    ru: {
        title: "Next.js в основе и инструменты вокруг него",
        lead: "Инструменты, с которыми я работаю каждый день,\u00a0— и несколько, которые изучаю прямо сейчас",
        columns: { area: "Область", purpose: "Зачем", tools: "Инструменты" },
        groups: [
            {
                id: "frontend",
                title: "Фронтенд",
                description:
                    "Типобезопасные компонентные интерфейсы на современном React",
                items: items.frontend,
            },
            {
                id: "motion",
                title: "Анимация и 3D",
                description:
                    "Истории на скролле, шейдеры и микровзаимодействия",
                items: items.motion,
            },
            {
                id: "backend",
                title: "Бэкенд и данные",
                description:
                    "Базы данных, формы и API\u00a0— та часть сайта, которую не видно",
                items: items.backend,
            },
            {
                id: "tooling",
                title: "Инструменты",
                description:
                    "Быстрая обратная связь\u00a0— от локальной разработки до продакшена",
                items: items.tooling,
            },
            {
                id: "exploring",
                title: "Сейчас изучаю",
                description: "То, с чем экспериментирую в свободное время",
                items: items.exploring,
            },
        ],
    },
};
