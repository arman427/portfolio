"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { useProjects } from "@/entities/project";
import { siteConfig } from "@/shared/config/site";
import { useDictionary, useLocalized } from "@/shared/i18n";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/shared/lib/gsap";
import { useTransitionStore } from "@/shared/model/transition-store";
import { Container } from "@/shared/ui/container";
import { Live } from "@/shared/ui/live";
import { preloaderContent } from "../model/content";
import styles from "./Preloader.module.css";

const SESSION_KEY = "portfolio:preloaded";

/** Set once the intro has played; client-side returns to the home page skip it. */
let played = false;

const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

function seenThisSession() {
    try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
        return false;
    }
}

/** Resolves on the window `load` event (fonts, the portrait, the first screenshot) or after `timeout`. */
function pageLoaded(timeout: number) {
    return new Promise<void>((resolve) => {
        if (document.readyState === "complete") return resolve();
        const timer = window.setTimeout(resolve, timeout);
        window.addEventListener(
            "load",
            () => {
                window.clearTimeout(timer);
                resolve();
            },
            { once: true },
        );
    });
}

/**
 * Intro screen of the home page on a hard load. Counts to 100 while the page
 * loads, then lifts away. The hero's entrance waits for it: see the
 * `[data-preloader]` rule in globals.css. A repeat visit in the same session
 * gets a short version; navigating back to home inside the site skips it.
 */
export function Preloader() {
    const [isVisible, setIsVisible] = useState(
        () => !played && useTransitionStore.getState().status === "idle",
    );
    const root = useRef<HTMLDivElement>(null);
    const counter = useRef<HTMLSpanElement>(null);
    const lenis = useLenis();
    const dict = useDictionary();
    const content = useLocalized(preloaderContent);
    const projectCount = useProjects().length;

    // Keep the page still while the screen is up.
    useEffect(() => {
        if (!isVisible) return;
        lenis?.stop();
        return () => lenis?.start();
    }, [lenis, isVisible]);

    useGSAP(
        () => {
            const el = root.current;
            if (!el || !isVisible) return;

            const quick = prefersReducedMotion() || seenThisSession();
            const ready = Promise.all([
                document.fonts?.ready ?? Promise.resolve(),
                pageLoaded(quick ? 1500 : 3500),
            ]);
            const parts = el.querySelectorAll("[data-preloader-part]");
            const progress = { value: 0 };

            const render = () => {
                if (counter.current)
                    counter.current.textContent = String(
                        Math.round(progress.value),
                    );
                el.style.setProperty(
                    "--progress",
                    String(progress.value / 100),
                );
            };

            const tl = gsap.timeline({
                onComplete: () => {
                    played = true;
                    try {
                        sessionStorage.setItem(SESSION_KEY, "1");
                    } catch {
                        // Storage unavailable — the full intro just plays again next time.
                    }
                    setIsVisible(false);
                },
            });

            tl.fromTo(
                parts,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.4, ease: EASE, stagger: 0.05 },
            )
                .to(
                    progress,
                    {
                        value: 100,
                        duration: quick ? 0.5 : 1.4,
                        ease: "power2.inOut",
                        onUpdate: render,
                    },
                    0.1,
                )
                .addPause(">", () => {
                    void ready.then(() => tl.resume());
                })
                .to(parts, {
                    opacity: 0,
                    y: -8,
                    duration: 0.25,
                    ease: EASE,
                    stagger: 0.03,
                })
                .addLabel("lift", "-=0.1")
                .to(
                    el,
                    {
                        clipPath: "inset(0% 0% 100% 0%)",
                        duration: 0.8,
                        ease: EASE,
                    },
                    "lift",
                )
                // Let the hero start its entrance while the screen is still lifting.
                .add(() => {
                    el.dataset.state = "leaving";
                }, "lift+=0.15");
        },
        { dependencies: [isVisible], scope: root },
    );

    if (!isVisible) return null;

    return (
        <div ref={root} data-preloader aria-hidden className={styles.preloader}>
            <Container className={styles.top}>
                <span data-preloader-part className={styles.brand}>
                    <span className={styles.mark}>{initials}</span>
                    <span className={styles.name}>{siteConfig.name}</span>
                </span>
                <span data-preloader-part className={styles.role}>
                    {dict.site.role}, {dict.site.city}
                </span>
            </Container>

            <Container className={styles.bottom}>
                <span data-preloader-part className={styles.status}>
                    <Live mono={false}>{content.status(projectCount)}</Live>
                </span>
                <span data-preloader-part className={styles.counter}>
                    <span ref={counter}>0</span>
                    <span className={styles.percent}>%</span>
                </span>
            </Container>
        </div>
    );
}
