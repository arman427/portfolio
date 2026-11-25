import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

/** One set: 24px grid, drawn at 16px with a 1.5 stroke, colored by the text it sits in. */
const stroke = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
} as const;

const solid = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
} as const;

export function ArrowUpRightIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M7 17 17 7M8.5 7H17v8.5" />
        </svg>
    );
}

export function ArrowRightIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
    );
}

export function ArrowLeftIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M20 12H4M10 6l-6 6 6 6" />
        </svg>
    );
}

export function ArrowUpIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 20V4M6 10l6-6 6 6" />
        </svg>
    );
}

export function ChevronDownIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 9h16M4 15h16" />
        </svg>
    );
}

export function CloseIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    );
}

export function CopyIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
    );
}

export function MailIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
    );
}

export function GithubIcon(props: IconProps) {
    return (
        <svg {...solid} {...props}>
            <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
    );
}

export function TelegramIcon(props: IconProps) {
    return (
        <svg {...solid} {...props}>
            <path d="M21.2 3.6 2.9 10.7c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.7-1.4ZM8.2 13.4l10.4-6.6c.5-.3 1-.1.6.2l-8.9 8-.3 3.7-1.8-5.3Z" />
        </svg>
    );
}

export function MaxIcon(props: IconProps) {
    return (
        <svg {...solid} {...props} viewBox="0 0 720 720">
            <path d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z" />
        </svg>
    );
}

const socialIcons = {
    GitHub: GithubIcon,
    Telegram: TelegramIcon,
    Max: MaxIcon,
    Email: MailIcon,
} as const;

export function SocialIcon({ name, ...props }: IconProps & { name: string }) {
    const Icon =
        socialIcons[name as keyof typeof socialIcons] ?? ArrowUpRightIcon;
    return <Icon {...props} />;
}
