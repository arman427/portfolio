"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { getRenderedById } from "@/shared/lib/dom";
import { locales, useDictionary, useLocale, type Locale } from "@/shared/i18n";
import { useAppStore } from "@/shared/model/app-store";
import { useTransitionStore } from "@/shared/model/transition-store";
import styles from "./LocaleSwitch.module.css";

/** How far (0…1) the viewport top has scrolled into `section`. */
function readProgress(section: string) {
    const el = getRenderedById(section);
    if (!el) return 0;
    const { top, height } = el.getBoundingClientRect();
    return height > 0 ? Math.min(1, Math.max(0, -top / height)) : 0;
}

/**
 * EN / RU segmented control. Switching plays the page curtain, swaps the copy
 * underneath and lands back on the exact spot the visitor was reading.
 */
export function LocaleSwitch({ className }: { className?: string }) {
    const locale = useLocale();
    const dict = useDictionary();
    const pathname = usePathname();
    const switchLocale = useTransitionStore((state) => state.switchLocale);
    // The copy only swaps once the curtain covers the page — highlight the
    // requested language right away so the click gets instant feedback.
    const pendingLocale = useTransitionStore((state) => state.targetLocale);
    const shownLocale = pendingLocale ?? locale;

    const select = (next: Locale) => {
        if (next === shownLocale) return;
        const section = useAppStore.getState().activeSection;
        switchLocale(
            next,
            section ? `${pathname}#${section}` : pathname,
            section ? { section, progress: readProgress(section) } : null,
        );
    };

    return (
        <div
            role="group"
            aria-label={dict.locale.switchLabel}
            className={cn(styles.switch, className)}
        >
            {locales.map((option) => (
                <button
                    key={option}
                    type="button"
                    lang={option}
                    aria-pressed={option === shownLocale}
                    title={dict.locale.names[option]}
                    onClick={() => select(option)}
                    className={styles.option}
                >
                    {option.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
