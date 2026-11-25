"use client";

import { CopyEmail } from "@/features/copy-email";
import { siteConfig } from "@/shared/config/site";
import { useDictionary, useLocalized } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { SocialIcon } from "@/shared/ui/icons";
import { Live } from "@/shared/ui/live";
import { Reveal } from "@/shared/ui/reveal";
import { Section } from "@/shared/ui/section";
import { contactContent } from "../model/content";
import styles from "./Contact.module.css";

export function Contact() {
    const content = useLocalized(contactContent);
    const dict = useDictionary();

    return (
        <Section
            id="contact"
            aria-labelledby="contact-title"
            className={styles.contact}
        >
            <Container>
                <Reveal className={styles.grid}>
                    <div>
                        <h2 id="contact-title" className={styles.title}>
                            {content.title}
                        </h2>
                        <p className={styles.text}>{content.text}</p>
                    </div>

                    <div className={styles.card}>
                        {siteConfig.availability.isAvailable ? (
                            <Live mono={false}>{dict.status.available}</Live>
                        ) : null}

                        <div className="flex flex-col gap-3">
                            <div>
                                <p className={styles.label}>
                                    {content.emailLabel}
                                </p>
                                <a
                                    href={`mailto:${siteConfig.email}`}
                                    className={styles.email}
                                >
                                    {siteConfig.email}
                                </a>
                            </div>

                            <div className={styles.actions}>
                                <Button href={`mailto:${siteConfig.email}`}>
                                    {content.emailCta}
                                </Button>
                                <CopyEmail email={siteConfig.email} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div>
                                <a
                                    href={`mailto:${siteConfig.yandex}`}
                                    className={styles.email}
                                >
                                    {siteConfig.yandex}
                                </a>
                            </div>

                            <div className={styles.actions}>
                                <Button href={`mailto:${siteConfig.yandex}`}>
                                    {content.emailCta}
                                </Button>
                                <CopyEmail email={siteConfig.yandex} />
                            </div>
                        </div>
                        <ul className={styles.socials}>
                            {siteConfig.socials.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.social}
                                    >
                                        <SocialIcon name={social.label} />
                                        {social.label}
                                        <span className={styles.handle}>
                                            {social.handle}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Reveal>
            </Container>
        </Section>
    );
}
