import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * AppTeaserSection
 * --------------------------------------------------------------
 * Minimal teaser for the Grand Hotel Lysekil case study.
 * Replaces ToolsSection.tsx. Heavy content has moved to /case/grand-hotel.
 *
 * One quiet section: meta line, a single phone that auto-flips between
 * Zuve and Housekeeping screens, and a clear link to the full case.
 */

type Slide = {
  app: 'Zuve' | 'Housekeeping';
  src: string;
  label: string;
};

const slides: Slide[] = [
  { app: 'Zuve', src: '/images/zuve-2-welcome-opt.jpg', label: 'Välkomstsida' },
  { app: 'Zuve', src: '/images/zuve-5-upsell-opt.jpg', label: 'Tillval' },
  { app: 'Housekeeping', src: '/images/app-hk-reception-opt2.jpg', label: 'Reception' },
  { app: 'Housekeeping', src: '/images/app-hk-breakfast-opt2.jpg', label: 'Frukost & allergier' },
];

const ROTATE_MS = 4500;

export function AppTeaserSection() {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion || paused) return;
    intervalRef.current = window.setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, ROTATE_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused, reducedMotion]);

  const advance = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section
      id="appar"
      className="px-6 py-[120px] md:px-12 md:py-[180px] lg:px-20"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        {/* Copy column */}
        <div>
          <ScrollReveal>
            <p className="mb-6 font-sans text-xs uppercase tracking-section text-accent-gold">
              UTVALT CASE
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <h2 className="max-w-[640px] font-serif text-[clamp(36px,5.2vw,72px)] font-normal leading-[1.04] tracking-[-0.02em] text-text-primary">
              Två appar. <em className="italic">Ett hotell.</em>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.22}>
            <dl className="mt-10 grid grid-cols-3 gap-x-6 border-y border-text-muted/15 py-5 max-w-[520px]">
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">
                  Klient
                </dt>
                <dd className="mt-2 font-serif text-base text-text-primary">
                  Grand Hotel Lysekil
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">
                  Omfattning
                </dt>
                <dd className="mt-2 font-serif text-base text-text-primary">
                  Gästportal + städsystem
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">
                  År
                </dt>
                <dd className="mt-2 font-serif text-base text-text-primary">
                  2024–2025
                </dd>
              </div>
            </dl>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mt-8 max-w-[520px] font-sans text-base leading-relaxed text-text-secondary">
              En gästportal som tar gästen från SMS till incheckning, och ett
              städsystem som synkar reception och housekeeping i realtid.
              Byggda som ett ekosystem — inte som två lösa appar.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <Link
              to="/case/grand-hotel"
              className="gold-underline mt-10 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
            >
              Läs hela caset →
            </Link>
          </ScrollReveal>
        </div>

        {/* Phone column */}
        <ScrollReveal delay={0.2} direction="left">
          <div
            className="flex flex-col items-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="group relative">
              <div className="relative overflow-hidden rounded-[2.4rem] border-[5px] border-text-muted/20 bg-bg-primary shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-all duration-500 hover:border-text-muted/35">
                {/* Notch */}
                <div className="absolute left-1/2 top-0 z-20 h-[28px] w-[120px] -translate-x-1/2 rounded-b-[14px] bg-bg-primary" />

                {/* Side buttons */}
                <div className="absolute -left-[6px] top-[90px] h-[28px] w-[3px] rounded-l bg-text-muted/25" />
                <div className="absolute -left-[6px] top-[130px] h-[40px] w-[3px] rounded-l bg-text-muted/25" />
                <div className="absolute -right-[6px] top-[110px] h-[60px] w-[3px] rounded-r bg-text-muted/25" />

                {/* Screen */}
                <div
                  className="relative aspect-[9/19.5] w-[280px] cursor-pointer overflow-hidden bg-bg-primary sm:w-[300px]"
                  onClick={advance}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={current}
                      src={slide.src}
                      alt={`${slide.app} — ${slide.label}`}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      draggable={false}
                      loading="lazy"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="mt-6 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 bg-accent-gold'
                      : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
                  }`}
                  aria-label={`Visa ${slides[i].app} — ${slides[i].label}`}
                />
              ))}
            </div>

            <p className="mt-4 font-sans text-[11px] uppercase tracking-tag text-text-muted">
              {slide.app} — {slide.label}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
