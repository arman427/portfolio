"use client";

import { useSyncExternalStore } from "react";
import styles from "./LocalTime.module.css";

const subscribe = (onTick: () => void) => {
    const id = window.setInterval(onTick, 10_000);
    return () => window.clearInterval(id);
};

const formatters = new Map<string, Intl.DateTimeFormat>();
const getFormatter = (timeZone: string) => {
    let formatter = formatters.get(timeZone);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone,
        });
        formatters.set(timeZone, formatter);
    }
    return formatter;
};

/** Live clock for the given time zone. Renders "--:--" on the server. */
export function LocalTime({
    timeZone,
    className,
}: {
    timeZone: string;
    className?: string;
}) {
    const time = useSyncExternalStore(
        subscribe,
        () => getFormatter(timeZone).format(Date.now()),
        () => null,
    );

    const [hours, minutes] = (time ?? "--:--").split(":");

    return (
        <time className={className} suppressHydrationWarning>
            {hours}
            <span className={time ? styles.colon : undefined}>:</span>
            {minutes}
        </time>
    );
}

const noopSubscribe = () => () => {};

/** Current year on the client, a static fallback on the server. */
export function CurrentYear({ fallback }: { fallback: number }) {
    const year = useSyncExternalStore(
        noopSubscribe,
        () => new Date().getFullYear(),
        () => fallback,
    );
    return <>{year}</>;
}
