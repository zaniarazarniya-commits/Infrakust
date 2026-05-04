import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  desc: string;
};

const slides: Slide[] = [
  { app: 'Zuve', src: '/images/z1.png', label: 'Välkomstsida', desc: 'Personlig välkomstsida med gästens namn och bokningsknapp.' },
  { app: 'Zuve', src: '/images/z2.png', label: 'Ankomstinfo', desc: 'Gästen fyller i uppgifter, ankomsttid och önskemål från mobilen.' },
  { app: 'Zuve', src: '/images/z3.png', label: 'Bokningsöversikt', desc: 'Komplett översikt över rum, datum, gäster och totalpris.' },
  { app: 'Zuve', src: '/images/z5.jpg', label: 'Tillval', desc: 'Upselling av skaldjur, bubbel, spa och upplevelser i Lysekil.' },
  { app: 'Housekeeping', src: '/images/h1.jpg', label: 'Reception', desc: 'Reception ser exakt vilka rum som är klara och när.' },
  { app: 'Housekeeping', src: '/images/h2.jpg', label: 'Dagliga rutiner', desc: 'Checklistor och uppgifter för varje tidsblock under dagen.' },
  { app: 'Housekeeping', src: '/images/h3.jpg', label: 'Frukost & allergier', desc: 'Live frukostlista med allergier hämtade direkt från bokningen.' },
  { app: 'Housekeeping', src: '/images/h4.jpg', label: 'Statistik', desc: 'Produktivitetsstatistik och Excel-export för städpersonal.' },
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
  const isHK = slide.app === 'Housekeeping';
  const accentRgb = isHK ? '52,211,153' : '201,169,110';

  return (
    <section
      id="appar"
      className="relative overflow-hidden px-6 py-[120px] md:px-12 md:py-[180px] lg:px-20"
    >
      {/* Ambient background glow — transitions gold → emerald with app */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -z-0 h-[700px] w-[700px] -translate-y-1/2 translate-x-1/4 rounded-full blur-[120px]"
        style={{ backgroundColor: `rgba(${accentRgb},0.07)`, transition: 'background-color 0.8s ease' }}
      />
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
              Två <span className="text-accent-gold">appar.</span> <em className="italic">Ett hotell.</em>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.22}>
            <dl className="mt-10 grid grid-cols-3 gap-x-6 border-y border-text-muted/30 py-5 max-w-[520px]">
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">
                  Klient
                </dt>
                <dd className="mt-2 font-sans text-sm font-medium text-text-primary">
                  Grand Hotel Lysekil
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">
                  Omfattning
                </dt>
                <dd className="mt-2 font-sans text-sm font-medium text-text-primary">
                  Gästportal + städsystem
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">
                  År
                </dt>
                <dd className="mt-2 font-sans text-sm font-medium text-text-primary">
                  2025–2026
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
            className="relative flex flex-col items-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Per-phone soft glow ring */}
            <div
              className="pointer-events-none absolute inset-x-[-60px] inset-y-[-40px] -z-0 rounded-full blur-[80px]"
              style={{ backgroundColor: `rgba(${accentRgb},0.06)`, transition: 'background-color 0.8s ease' }}
            />
            <div className="group relative z-10">
              <div
                className="relative overflow-hidden rounded-[2rem] border bg-bg-primary"
                style={{
                  borderColor: `rgba(${accentRgb},0.2)`,
                  boxShadow: `0 8px 40px rgba(${accentRgb},0.12), 0 20px 60px rgba(0,0,0,0.5)`,
                  transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
                }}
              >
                {/* Screen */}
                <div
                  className="relative aspect-[9/19.5] w-[260px] cursor-pointer overflow-hidden bg-bg-primary sm:w-[280px]"
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

                  {/* Hover arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + slides.length) % slides.length); }}
                    className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary/40 text-white/60 opacity-0 transition-all hover:bg-bg-primary/70 hover:text-white group-hover:opacity-100"
                    aria-label="Föregående"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); advance(); }}
                    className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary/40 text-white/60 opacity-0 transition-all hover:bg-bg-primary/70 hover:text-white group-hover:opacity-100"
                    aria-label="Nästa"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="mt-5 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    i === current
                      ? `w-6 ${isHK ? 'bg-emerald-400' : 'bg-accent-gold'}`
                      : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
                  }`}
                  aria-label={`Visa ${slides[i].app} — ${slides[i].label}`}
                />
              ))}
            </div>

            <p
              className="mt-3 font-sans text-[11px] uppercase tracking-tag"
              style={{ color: `rgba(${accentRgb},0.7)`, transition: 'color 0.8s ease' }}
            >
              {slide.app} — {slide.label}
            </p>
            <p className="mt-3 max-w-[280px] text-center font-sans text-sm leading-relaxed text-text-secondary">
              {slide.desc}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
