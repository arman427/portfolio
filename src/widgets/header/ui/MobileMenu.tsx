"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navItems, routes, type NavItem } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useDictionary } from "@/shared/i18n";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/shared/lib/gsap";
import { useAppStore } from "@/shared/model/app-store";
import { Container } from "@/shared/ui/container";
import { ArrowRightIcon } from "@/shared/ui/icons";
import { TextLink } from "@/shared/ui/text-link";
import { TransitionLink } from "@/shared/ui/transition-link";
import styles from "./MobileMenu.module.css";

/** The circle grows out of the menu button and covers the farthest corner of the screen. */
function circleFromButton() {
    const button = document.querySelector<HTMLElement>(
        '[aria-controls="mobile-menu"]',
    );
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
    );
    return {
        closed: `circle(0px at ${x}px ${y}px)`,
        open: `circle(${Math.ceil(radius)}px at ${x}px ${y}px)`,
    };
}

/** Full-screen menu under the bar on small screens. */
export function MobileMenu({ activeId }: { activeId: NavItem | null }) {
    const isOpen = useAppStore((state) => state.isMenuOpen);
    const setMenuOpen = useAppStore((state) => state.setMenuOpen);
    const root = useRef<HTMLDivElement>(null);
    const isFirstRun = useRef(true);
    const wasOpen = useRef(false);
    const lenis = useLenis();
    const pathname = usePathname();
    const dict = useDictionary();

    // Close on route change
    useEffect(() => {
        useAppStore.getState().setMenuOpen(false);
    }, [pathname]);

    // Lock scrolling while open
    useEffect(() => {
        if (isOpen) lenis?.stop();
        else if (wasOpen.current) lenis?.start();
        wasOpen.current = isOpen;
    }, [isOpen, lenis]);

    // Escape closes the menu; so does growing the window to the desktop layout
    useEffect(() => {
        if (!isOpen) return;
        const desktop = window.matchMedia("(min-width: 1024px)");
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        const onResize = () => {
            if (desktop.matches) setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        desktop.addEventListener("change", onResize);
        return () => {
            window.removeEventListener("keydown", onKey);
            desktop.removeEventListener("change", onResize);
        };
    }, [isOpen, setMenuOpen]);

    useGSAP(
        () => {
            const el = root.current;
            if (!el) return;
            if (isFirstRun.current) {
                isFirstRun.current = false;
                if (!isOpen) return;
            }

            const rows = el.querySelectorAll("[data-menu-row]");
            const words = el.querySelectorAll("[data-menu-word]");
            const arrows = el.querySelectorAll("[data-menu-arrow]");
            const extras = el.querySelectorAll("[data-menu-extra]");
            gsap.killTweensOf([el, rows, words, arrows, extras]);

            // Calm version: a plain fade, no circle and no 3D.
            if (prefersReducedMotion()) {
                if (isOpen) {
                    gsap.set(el, { visibility: "visible", clipPath: "none" });
                    gsap.fromTo(
                        el,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.2 },
                    );
                } else {
                    gsap.to(el, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () =>
                            gsap.set(el, { visibility: "hidden" }),
                    });
                }
                return;
            }

            const circle = circleFromButton();

            if (isOpen) {
                gsap.timeline()
                    .set(el, { visibility: "visible", opacity: 1 })
                    .fromTo(
                        el,
                        { clipPath: circle.closed },
                        {
                            clipPath: circle.open,
                            duration: 0.9,
                            ease: "power3.inOut",
                        },
                    )
                    .fromTo(
                        rows,
                        { "--draw": 0 },
                        {
                            "--draw": 1,
                            duration: 0.9,
                            ease: EASE,
                            stagger: 0.06,
                        },
                        0.3,
                    )
                    .fromTo(
                        words,
                        { yPercent: 110, rotateX: -80, opacity: 0 },
                        {
                            yPercent: 0,
                            rotateX: 0,
                            opacity: 1,
                            duration: 1,
                            ease: EASE,
                            stagger: 0.06,
                        },
                        0.3,
                    )
                    .fromTo(
                        arrows,
                        { opacity: 0, x: -12 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.6,
                            ease: EASE,
                            stagger: 0.06,
                        },
                        0.55,
                    )
                    .fromTo(
                        extras,
                        { opacity: 0, y: 16 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: EASE,
                            stagger: 0.08,
                        },
                        0.6,
                    );
            } else {
                gsap.timeline({
                    onComplete: () => gsap.set(el, { visibility: "hidden" }),
                })
                    .to(words, {
                        yPercent: -70,
                        rotateX: 60,
                        opacity: 0,
                        duration: 0.35,
                        ease: "power2.in",
                        stagger: { each: 0.03, from: "end" },
                    })
                    .to(
                        [arrows, extras],
                        { opacity: 0, duration: 0.25, ease: "power2.in" },
                        0,
                    )
                    .to(
                        el,
                        {
                            clipPath: circle.closed,
                            duration: 0.6,
                            ease: "power3.inOut",
                        },
                        0.15,
                    );
            }
        },
        { dependencies: [isOpen], scope: root },
    );

    const close = () => {
        lenis?.start();
        setMenuOpen(false);
    };

    return (
        <div
            ref={root}
            id="mobile-menu"
            className={styles.menu}
            inert={!isOpen}
            data-lenis-prevent
        >
            <Container className={styles.inner}>
                <nav aria-label={dict.nav.mobileLabel}>
                    <ul>
                        {navItems.map((id) => (
                            <li key={id} data-menu-row className={styles.row}>
                                <TransitionLink
                                    href={routes.section(id)}
                                    onClick={close}
                                    aria-current={
                                        id === activeId ? "true" : undefined
                                    }
                                    className={styles.link}
                                >
                                    <span
                                        data-menu-word
                                        className={styles.word}
                                    >
                                        {dict.nav[id]}
                                    </span>
                                    <ArrowRightIcon
                                        data-menu-arrow
                                        className={styles.arrow}
                                    />
                                </TransitionLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <div className="flex flex-col gap-3">
                        <a
                            data-menu-extra
                            href={`mailto:${siteConfig.email}`}
                            className={styles.email}
                        >
                            {siteConfig.email}
                        </a>
                        <a
                            data-menu-extra
                            href={`mailto:${siteConfig.yandex}`}
                            className={styles.email}
                        >
                            {siteConfig.yandex}
                        </a>
                    </div>
                    <ul data-menu-extra className={styles.socials}>
                        {siteConfig.socials.map((social) => (
                            <li key={social.label}>
                                <TextLink href={social.href}>
                                    {social.label}
                                </TextLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </div>
    );
}
