import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Redigerbara nyckeltal
const STATS = [
  { value: 8, suffix: '+', label: 'Projekt i drift' },
  { value: 2, suffix: '', label: 'Egenbyggda appsystem' },
  { value: 100, suffix: '%', label: 'Skräddarsytt' },
];

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reducedMotion]);

  return (
    <div ref={ref}>
      <p className="font-serif text-[clamp(40px,5vw,64px)] leading-none text-text-primary">
        {display}
        <span className="text-accent-gold">{suffix}</span>
      </p>
      <p className="mt-3 font-sans text-sm uppercase tracking-tag text-text-muted">
        {label}
      </p>
    </div>
  );
}

export function WhatWeDoSection() {
  return (
    <section className="px-6 py-[120px] md:px-12 md:py-[160px] lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal delay={0}>
          <p className="mb-8 font-sans text-xs uppercase tracking-section text-accent-gold">
            VAD VI GÖR
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal delay={0.15}>
            <p className="font-serif text-[clamp(24px,4vw,48px)] font-normal leading-[1.3] text-text-primary">
              Vi bygger hemsidor och appar för företag som vill växa.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="font-serif text-[clamp(24px,4vw,48px)] font-normal leading-[1.3] text-text-secondary">
              <span className="italic text-accent-gold">SEO</span>, digital{' '}
              <span className="italic text-accent-gold">infrastruktur</span> och kompletta system
              — från idé till drift.
            </p>
          </ScrollReveal>
        </div>

        {/* Nyckeltal */}
        <div className="mt-20 grid grid-cols-1 gap-12 border-t border-text-muted/10 pt-14 sm:grid-cols-3 md:mt-24">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.12}>
              <StatCounter {...stat} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
