"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LocaleSwitch } from "@/features/switch-locale";
import { isNavItem, navItems, routes } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useDictionary } from "@/shared/i18n";
import { useAppStore } from "@/shared/model/app-store";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { TransitionLink } from "@/shared/ui/transition-link";
import { useNavPills } from "../lib/use-nav-pills";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export function Header() {
    const pathname = usePathname();
    const dict = useDictionary();
    const activeSection = useAppStore((state) => state.activeSection);
    const isMenuOpen = useAppStore((state) => state.isMenuOpen);
    const setMenuOpen = useAppStore((state) => state.setMenuOpen);
    const [isScrolled, setIsScrolled] = useState(false);

    // A hairline under the bar once the page has moved under it.
    useEffect(() => {
        const update = () => setIsScrolled(window.scrollY > 8);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    const activeId =
        pathname === routes.home && isNavItem(activeSection)
            ? activeSection
            : null;
    const { listRef, listProps } = useNavPills(activeId);

    return (
        <>
            <header
                className={styles.header}
                data-scrolled={isScrolled || isMenuOpen || undefined}
            >
                <Container className={styles.inner}>
                    <a
                        href={routes.home}
                        aria-label={`${siteConfig.name} — ${dict.header.home}`}
                        className={styles.brand}
                    >
                        <span className={styles.mark} aria-hidden>
                            {initials}
                        </span>
                        <span className={styles.name}>{siteConfig.name}</span>
                    </a>

                    <nav aria-label={dict.nav.mainLabel} className={styles.nav}>
                        <ul
                            ref={listRef}
                            className={styles.navList}
                            {...listProps}
                        >
                            {navItems.map((id) => (
                                <li
                                    key={id}
                                    data-id={id}
                                    className={styles.navItem}
                                >
                                    <TransitionLink
                                        href={routes.section(id)}
                                        aria-current={
                                            id === activeId ? "true" : undefined
                                        }
                                        className={styles.navLink}
                                    >
                                        {dict.nav[id]}
                                    </TransitionLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.actions}>
                        <LocaleSwitch />
                        <Button
                            href={routes.section("contact")}
                            size="sm"
                            className={styles.cta}
                        >
                            {dict.header.cta}
                        </Button>
                        <button
                            type="button"
                            aria-label={
                                isMenuOpen
                                    ? dict.header.closeMenu
                                    : dict.header.openMenu
                            }
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            className={styles.menuButton}
                        >
                            {/* Two lines that fold into a cross while the menu opens */}
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                aria-hidden
                                className={styles.burger}
                            >
                                <line x1="4" y1="9" x2="20" y2="9" />
                                <line x1="4" y1="15" x2="20" y2="15" />
                            </svg>
                        </button>
                    </div>
                </Container>
            </header>
            <MobileMenu activeId={activeId} />
        </>
    );
}
