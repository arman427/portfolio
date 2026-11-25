import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./Live.module.css";

type LiveProps = {
    children: ReactNode;
    /** Opens in a new tab when set. */
    href?: string;
    /** Mono for addresses, sans for a status sentence. */
    mono?: boolean;
    className?: string;
};

/** Text with a steady green "live" dot: a project's address or the availability status. */
export function Live({ children, href, mono = true, className }: LiveProps) {
    const classes = cn(styles.live, mono && styles.mono, className);
    const text = <span className={styles.text}>{children}</span>;

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
            >
                {text}
            </a>
        );
    }
    return <span className={classes}>{text}</span>;
}
