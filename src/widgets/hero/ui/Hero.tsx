"use client";

import Image from "next/image";
import { useRef } from "react";
import { useProjects } from "@/entities/project";
import { siteConfig } from "@/shared/config/site";
import { useDictionary, useLocalized } from "@/shared/i18n";
import { enterStep as enter } from "@/shared/lib/enter";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Live } from "@/shared/ui/live";
import { LocalTime } from "@/shared/ui/local-time";
import { Section } from "@/shared/ui/section";
import { heroContent, heroPhotoSrc } from "../model/content";
import { HeroShowcase } from "./HeroShowcase";
import styles from "./Hero.module.css";

/** The window starts lower and a little smaller, and settles into place as the page scrolls. */
const RISE = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function Hero() {
    const content = useLocalized(heroContent);
    const dict = useDictionary();
    const projects = useProjects();
    const showcase = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const trigger = showcase.current;
            const target = trigger?.querySelector<HTMLElement>("[data-rise]");
            if (!trigger || !target) return;

            const mm = gsap.matchMedia();
            mm.add(RISE, () => {
                gsap.fromTo(
                    target,
                    { y: 72, scale: 0.94 },
                    {
                        y: 0,
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger,
                            start: "top bottom",
                            end: "top 15%",
                            scrub: true,
                        },
                    },
                );
            });
        },
        { scope: showcase },
    );

    return (
        <Section id="home" aria-labelledby="hero-title" className={styles.hero}>
            <Container className={styles.top}>
                <div>
                    <p data-enter style={enter(0)} className={styles.intro}>
                        {content.intro}
                    </p>
                    <h1
                        id="hero-title"
                        data-enter
                        style={enter(1)}
                        className={styles.title}
                    >
                        {content.title}
                    </h1>
                    <p data-enter style={enter(2)} className={styles.lead}>
                        {content.lead}
                    </p>
                    <div data-enter style={enter(3)} className={styles.actions}>
                        <Button href={content.primaryCta.href}>
                            {content.primaryCta.label}
                        </Button>
                        <Button
                            href={content.secondaryCta.href}
                            variant="secondary"
                        >
                            {content.secondaryCta.label}
                        </Button>
                    </div>
                </div>

                <figure data-enter style={enter(2)} className={styles.portrait}>
                    <div className={styles.photo}>
                        {heroPhotoSrc ? (
                            <Image
                                src={heroPhotoSrc}
                                alt={content.photoAlt}
                                fill
                                sizes="(min-width: 640px) 400px, 100vw"
                                preload
                            />
                        ) : null}
                    </div>
                    <figcaption className={styles.photoCaption}>
                        {siteConfig.availability.isAvailable ? (
                            <Live mono={false}>{dict.status.available}</Live>
                        ) : null}
                        <span className={styles.time}>
                            {dict.site.city},{" "}
                            <LocalTime timeZone={siteConfig.timezone} />
                        </span>
                    </figcaption>
                </figure>
            </Container>

            <Container ref={showcase} className={styles.showcase}>
                <div data-enter style={enter(4)}>
                    <div data-rise className={styles.rise}>
                        <HeroShowcase
                            projects={projects}
                            labels={content.showcase}
                        />
                    </div>
                </div>
            </Container>
        </Section>
    );
}
