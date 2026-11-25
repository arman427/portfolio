"use client";

import { useLenis } from "lenis/react";
import { navItems, routes } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useDictionary } from "@/shared/i18n";
import { smoothScrollTo } from "@/shared/lib/scroll-to";
import { Container } from "@/shared/ui/container";
import { ArrowUpIcon, SocialIcon } from "@/shared/ui/icons";
import { TransitionLink } from "@/shared/ui/transition-link";
import { CurrentYear, LocalTime } from "@/shared/ui/local-time";
import styles from "./Footer.module.css";
import { cn } from "@/shared/lib/cn";

export function Footer() {
    const lenis = useLenis();
    const dict = useDictionary();

    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.top}>
                    <div>
                        <p className={styles.name}>{siteConfig.name}</p>
                        <p className={styles.role}>{dict.site.role}</p>
                    </div>

                    <nav aria-label={dict.footer.menu}>
                        <p className={styles.label}>{dict.footer.menu}</p>
                        <ul className={styles.links}>
                            {navItems.map((id) => (
                                <li key={id}>
                                    <TransitionLink
                                        href={routes.section(id)}
                                        className={styles.link}
                                    >
                                        {dict.nav[id]}
                                    </TransitionLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <p className={styles.label}>{dict.footer.socials}</p>
                        <ul className={styles.links}>
                            {siteConfig.socials.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                    >
                                        <SocialIcon name={social.label} />
                                        {social.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className={styles.label}>{dict.footer.localTime}</p>
                        <LocalTime
                            timeZone={siteConfig.timezone}
                            className={styles.time}
                        />
                        <p className={styles.city}>{dict.site.location}</p>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <button
                        type="button"
                        onClick={() => smoothScrollTo(lenis, 0)}
                        className={cn(styles.toTop, "ml-auto")}
                    >
                        {dict.footer.backToTop}
                        <ArrowUpIcon />
                    </button>
                </div>
            </Container>
        </footer>
    );
}
