"use client";

import { useLocalized } from "@/shared/i18n";
import { Container } from "@/shared/ui/container";
import { Reveal } from "@/shared/ui/reveal";
import { Section } from "@/shared/ui/section";
import { SectionHead } from "@/shared/ui/section-head";
import { stackContent } from "../model/stack";
import styles from "./Stack.module.css";

/** The toolbox as a plain table: area, what it is for, the tools. */
export function Stack() {
    const content = useLocalized(stackContent);

    return (
        <Section
            id="stack"
            aria-labelledby="stack-title"
            className={styles.stack}
        >
            <Container>
                <SectionHead
                    id="stack-title"
                    title={content.title}
                    lead={content.lead}
                />

                <Reveal>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">{content.columns.area}</th>
                                <th scope="col">{content.columns.purpose}</th>
                                <th scope="col">{content.columns.tools}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content.groups.map((group) => (
                                <tr key={group.id}>
                                    <th scope="row" className={styles.area}>
                                        {group.title}
                                    </th>
                                    <td className={styles.purpose}>
                                        {group.description}
                                    </td>
                                    <td className={styles.tools}>
                                        {group.items.join(" · ")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Reveal>
            </Container>
        </Section>
    );
}
