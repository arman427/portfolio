'use client';

import { useId, useRef, useState } from 'react';
import { useLocalized } from '@/shared/i18n';
import { EASE, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/shared/lib/gsap';
import { Container } from '@/shared/ui/container';
import { ChevronDownIcon } from '@/shared/ui/icons';
import { ParticleDemo } from '@/shared/ui/particle-demo';
import { Reveal } from '@/shared/ui/reveal';
import { Section } from '@/shared/ui/section';
import { SectionHead } from '@/shared/ui/section-head';
import { servicesContent, type Service } from '../model/services';
import styles from './Services.module.css';

/** Services as an accordion (one open at a time), then how a project goes. */
export function Services() {
  const content = useLocalized(servicesContent);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section id="services" aria-labelledby="services-title" className={styles.services}>
      <Container className={styles.inner}>
        <SectionHead id="services-title" tone="paper" title={content.title} />

        <div className={styles.list}>
          {content.items.map((service, index) => (
            <ServiceRow
              key={service.title}
              service={service}
              labels={{ deliverables: content.deliverablesLabel, tags: content.tagsLabel, demo: content.demoCaption }}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <Reveal className={styles.process}>
          <div className={styles.processHead}>
            <h3 className={styles.processTitle}>{content.process.title}</h3>
            <p className={styles.processLead}>{content.process.lead}</p>
          </div>
          <ol className={styles.steps}>
            {content.process.steps.map((step) => (
              <li key={step.title} className={styles.step}>
                <p className={styles.when}>{step.when}</p>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepText}>{step.description}</p>
                <ul className={styles.stepList}>
                  {step.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}

type ServiceRowProps = {
  service: Service;
  labels: { deliverables: string; tags: string; demo: string };
  isOpen: boolean;
  onToggle: () => void;
};

function ServiceRow({ service, labels, isOpen, onToggle }: ServiceRowProps) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  // Only the server/first render sets the height; after that GSAP owns it.
  const [initialStyle] = useState(() => (isOpen ? undefined : { height: 0 }));
  // The demo mounts on first open and stays, so closing doesn't make the panel jump.
  const [hasOpened, setHasOpened] = useState(isOpen);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
      gsap.killTweensOf(el);
      // The accordion changes the page height — let the section tracking re-measure.
      const refresh = () => ScrollTrigger.refresh();
      const target = isOpen ? 'auto' : 0;

      if (prefersReducedMotion()) {
        gsap.set(el, { height: target });
        refresh();
        return;
      }
      gsap.fromTo(el, { height: el.offsetHeight }, { height: target, duration: 0.4, ease: EASE, onComplete: refresh });
    },
    { dependencies: [isOpen] },
  );

  return (
    <div className={styles.row}>
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={() => {
            if (!isOpen) setHasOpened(true);
            onToggle();
          }}
          className={styles.trigger}
        >
          <span className={styles.rowTitle}>{service.title}</span>
          <ChevronDownIcon className={styles.chevron} />
        </button>
      </h3>

      <div
        ref={panel}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        inert={!isOpen}
        style={initialStyle}
        className={styles.panel}
      >
        <div className={styles.panelInner}>
          <div>
            <p className={styles.description}>{service.description}</p>
            {service.demo && hasOpened ? (
              <ParticleDemo caption={labels.demo} className={styles.demo} captionClassName={styles.demoCaption} />
            ) : null}
          </div>

          <div>
            <h4 className={styles.subhead}>{labels.deliverables}</h4>
            <ul className={styles.deliverables}>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4 className={`${styles.subhead} ${styles.tagsHead}`}>{labels.tags}</h4>
            <p className={styles.tags}>{service.tags.join(' · ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
