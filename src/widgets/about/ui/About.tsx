"use client";

import { routes } from "@/shared/config/navigation";
import { siteConfig } from "@/shared/config/site";
import { useLocalized } from "@/shared/i18n";
import { Container } from "@/shared/ui/container";
import { CountUp } from "@/shared/ui/count-up";
import { Reveal } from "@/shared/ui/reveal";
import { Section } from "@/shared/ui/section";
import { SectionHead } from "@/shared/ui/section-head";
import { TextLink } from "@/shared/ui/text-link";
import { aboutContent } from "../model/content";
import styles from "./About.module.css";

export function About() {
    const content = useLocalized(aboutContent);
    const github = siteConfig.socials.find(
        (social) => social.label === "GitHub",
    );

    return (
        <Section
            id="about"
            aria-labelledby="about-title"
            className={styles.about}
        >
            <Container>
                <SectionHead
                    id="about-title"
                    title={content.title}
                    lead={content.lead}
                />

                <Reveal className={styles.body}>
                    <div>
                        <div className={styles.text}>
                            {content.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                        <div className={styles.links}>
                            <TextLink href={routes.section("work")}>
                                {content.links.projects}
                            </TextLink>
                            {github ? (
                                <TextLink href={github.href}>
                                    {content.links.github}
                                </TextLink>
                            ) : null}
                        </div>
                    </div>

                    <dl className={styles.stats}>
                        {/* Keyed by position, not label: switching the language
                            must not remount the counters and replay them. */}
                        {content.stats.map((stat, index) => (
                            <div key={index} className={styles.stat}>
                                <dt className={styles.label}>
                                    {stat.label}
                                </dt>
                                <dd className={styles.figure}>
                                    <CountUp
                                        value={stat.value}
                                        delay={index * 0.1}
                                    />
                                    {stat.suffix}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>
            </Container>
        </Section>
    );
}
