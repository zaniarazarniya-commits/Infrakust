import { useEffect, useRef, useState } from 'react';
import {
  motion,
  animate,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Segment = { text: string; gold?: boolean };

const LINE_1: Segment[] = 'Vi bygger hemsidor och appar för företag som vill växa.'
  .split(' ')
  .map((text) => ({ text }));

const LINE_2: Segment[] = [
  { text: 'SEO,', gold: true },
  { text: 'digital' },
  { text: 'infrastruktur', gold: true },
  { text: 'och' },
  { text: 'kompletta' },
  { text: 'system' },
  { text: '—' },
  { text: 'från' },
  { text: 'idé' },
  { text: 'till' },
  { text: 'drift.' },
];

// Redigerbara nyckeltal
const STATS = [
  { value: 8, suffix: '+', label: 'Projekt i drift' },
  { value: 2, suffix: '', label: 'Egenbyggda appsystem' },
  { value: 100, suffix: '%', label: 'Skräddarsytt' },
];

function Word({
  segment,
  progress,
  range,
}: {
  segment: Segment;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block ${
        segment.gold ? 'italic text-accent-gold' : ''
      }`}
    >
      {segment.text}&nbsp;
    </motion.span>
  );
}

function HighlightLine({
  segments,
  className,
}: {
  segments: Segment[];
  className: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.4'],
  });

  if (reducedMotion) {
    return (
      <p className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.gold ? 'italic text-accent-gold' : ''}>
            {s.text}{' '}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {segments.map((segment, i) => (
        <Word
          key={i}
          segment={segment}
          progress={scrollYProgress}
          range={[i / segments.length, (i + 1) / segments.length]}
        />
      ))}
    </p>
  );
}

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
          <HighlightLine
            segments={LINE_1}
            className="font-serif text-[clamp(24px,4vw,48px)] font-normal leading-[1.3] text-text-primary"
          />
          <HighlightLine
            segments={LINE_2}
            className="font-serif text-[clamp(24px,4vw,48px)] font-normal leading-[1.3] text-text-primary"
          />
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
