import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

/**
 * CaseGrandHotel
 * --------------------------------------------------------------
 * Dedicated case study page — replaces the bloated case block that
 * previously lived inside ToolsSection.tsx.
 *
 * Route: /case/grand-hotel
 */

const zuveFlow = [
  { src: '/images/zuve-1-sms-opt.jpg', label: 'SMS-bekräftelse', desc: 'Gästen får ett personligt SMS med länk till sin gästportal.' },
  { src: '/images/zuve-2-welcome-opt.jpg', label: 'Välkomstsida', desc: 'Personlig välkomstsida med gästens namn och bokningsknapp.' },
  { src: '/images/zuve-3-arrival-opt.jpg', label: 'Ankomstinfo', desc: 'Telefon, e-post, ankomsttid och önskemål — direkt från mobilen.' },
  { src: '/images/zuve-4-booking-opt.jpg', label: 'Bokningsdetaljer', desc: 'Komplett översikt över rum, datum, gäster och pris.' },
  { src: '/images/zuve-5-upsell-opt.jpg', label: 'Tillval', desc: 'Upselling av skaldjur, bubbel, spa och upplevelser.' },
  { src: '/images/zuve-6-explore-opt.jpg', label: 'Utforska Lysekil', desc: 'Lokal guide med aktiviteter, natur och restauranger.' },
];

const hkFlow = [
  { src: '/images/app-hk-reception-opt2.jpg', label: 'Reception', desc: 'Reception ser exakt vilka rum som är klara och när.' },
  { src: '/images/app-hk-routines-opt2.jpg', label: 'Dagliga rutiner', desc: 'Checklistor och uppgifter för varje tidsblock under dagen.' },
  { src: '/images/app-hk-breakfast-opt2.jpg', label: 'Frukost & allergier', desc: 'Live frukostlista med allergier hämtade direkt från bokningen.' },
];

const techStack = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Supabase', 'Express', 'Sirvoy API', 'Notion API',
  '46elks SMS', 'Web Push', 'SSE', 'Excel-export',
];

const results = [
  'Färre samtal till receptionen',
  'Ökad försäljning av tillval',
  'Reception ser exakt vilka rum som är klara',
  'Bildbaserade felanmälningar med full spårbarhet',
  'Statistik över städtider och produktivitet',
  'Allt synkat i realtid mellan alla enheter',
];

interface FlowSlide {
  src: string;
  label: string;
  desc: string;
}

function PhoneCarousel({
  slides,
  accentColorClass,
}: {
  slides: FlowSlide[];
  accentColorClass: string;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > current ? 1 : -1);
      setCurrent(i);
    },
    [current],
  );

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  const slide = slides[current];

  return (
    <div className="flex flex-col items-center">
      <div className="group relative">
        <div className="relative overflow-hidden rounded-[2.4rem] border-[5px] border-text-muted/20 bg-bg-primary shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div className="absolute left-1/2 top-0 z-20 h-[28px] w-[120px] -translate-x-1/2 rounded-b-[14px] bg-bg-primary" />
          <div className="absolute -left-[6px] top-[90px] h-[28px] w-[3px] rounded-l bg-text-muted/25" />
          <div className="absolute -left-[6px] top-[130px] h-[40px] w-[3px] rounded-l bg-text-muted/25" />
          <div className="absolute -right-[6px] top-[110px] h-[60px] w-[3px] rounded-r bg-text-muted/25" />

          <div
            className="relative aspect-[9/19.5] w-[280px] cursor-pointer overflow-hidden bg-bg-primary sm:w-[320px]"
            onClick={next}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                src={slide.src}
                alt={slide.label}
                className="absolute inset-0 h-full w-full object-cover object-top"
                draggable={false}
                loading="lazy"
              />
            </AnimatePresence>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary/40 text-white/60 opacity-0 transition-all hover:bg-bg-primary/70 hover:text-white group-hover:opacity-100"
              aria-label="Föregående"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary/40 text-white/60 opacity-0 transition-all hover:bg-bg-primary/70 hover:text-white group-hover:opacity-100"
              aria-label="Nästa"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === current ? `w-6 ${accentColorClass}` : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
            }`}
            aria-label={`Steg ${i + 1}`}
          />
        ))}
      </div>

      <p className="mt-3 font-sans text-[11px] uppercase tracking-tag text-text-muted">
        {slide.label} — {current + 1} / {slides.length}
      </p>

      <p className="mt-4 max-w-[320px] text-center font-sans text-sm leading-relaxed text-text-secondary">
        {slide.desc}
      </p>
    </div>
  );
}

export default function CaseGrandHotel() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />

      <main>
        {/* Hero */}
        <section className="px-6 pb-24 pt-[160px] md:px-12 md:pb-32 md:pt-[200px] lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-section text-text-muted transition-colors hover:text-accent-gold"
              >
                <ArrowLeft size={14} />
                Tillbaka till start
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-12 font-sans text-xs uppercase tracking-section text-accent-gold">
                CASE STUDY
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.18}>
              <h1 className="mt-6 max-w-[920px] font-serif text-[clamp(48px,7vw,108px)] font-normal leading-[0.98] tracking-[-0.025em] text-text-primary">
                Två appar.<br />
                <em className="italic">Ett hotell.</em>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.28}>
              <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-text-muted/15 py-8 sm:grid-cols-4">
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">Klient</dt>
                  <dd className="mt-2 font-serif text-base text-text-primary">Grand Hotel Lysekil</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">Omfattning</dt>
                  <dd className="mt-2 font-serif text-base text-text-primary">Gästportal + städsystem</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">År</dt>
                  <dd className="mt-2 font-serif text-base text-text-primary">2024–2025</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-text-muted">Roll</dt>
                  <dd className="mt-2 font-serif text-base text-text-primary">Design + utveckling</dd>
                </div>
              </dl>
            </ScrollReveal>
          </div>
        </section>

        {/* Challenge */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[1fr_2fr] lg:gap-24">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                UTMANINGEN
              </p>
            </ScrollReveal>
            <div className="space-y-6 font-sans text-lg leading-relaxed text-text-secondary">
              <ScrollReveal delay={0.1}>
                <p>
                  Hotellet hade två separata problem: gäster ringde receptionen för
                  sådant som kunde lösas digitalt, och städpersonalen jobbade med
                  papperslistor som var inaktuella samma stund de skrevs ut.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p>
                  Vi byggde inte två lösningar — vi byggde ett ekosystem. Zuve tar
                  gästen från SMS till incheckning. Housekeeping synkar reception,
                  städpersonal och frukostavdelning i realtid. Båda apparna pratar
                  med Sirvoy, Notion och varandra.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Zuve */}
        <section className="bg-bg-secondary px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <ScrollReveal>
                <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                  GÄSTPORTAL
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <h2 className="mt-6 font-serif text-[clamp(40px,5vw,72px)] font-normal leading-[1.02] tracking-[-0.02em] text-text-primary">
                  Zuve
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.22}>
                <p className="mt-6 font-sans text-lg leading-relaxed text-text-secondary">
                  Från personligt SMS till incheckning — ett flöde som tar bort
                  friktionen mellan bokning och ankomst. Gästen fyller i sina
                  uppgifter, väljer tillval och utforskar Lysekil från sin telefon.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <ul className="mt-10 space-y-4">
                  {[
                    'Personliga SMS-länkar via 46elks',
                    'Live-data från Sirvoy-bokningssystemet',
                    'Upselling av tillval i samma flöde',
                    'Lokal guide skräddarsydd för Lysekil',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-2.5 h-1 w-4 flex-shrink-0 bg-accent-gold" />
                      <span className="font-sans text-base text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2} direction="left">
              <PhoneCarousel slides={zuveFlow} accentColorClass="bg-accent-gold" />
            </ScrollReveal>
          </div>
        </section>

        {/* Pull quote */}
        <section className="px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto max-w-[1080px] text-center">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-text-muted">
                EN PRINCIP
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <blockquote className="mt-8 font-serif text-[clamp(32px,4.5vw,56px)] font-normal leading-[1.15] tracking-[-0.015em] text-text-primary">
                <em className="italic">&ldquo;Två appar som pratar samma språk&rdquo;</em> är
                bättre än en app som gör allt.
              </blockquote>
            </ScrollReveal>
          </div>
        </section>

        {/* Housekeeping — mirrored layout */}
        <section className="bg-bg-secondary px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <ScrollReveal delay={0.2} direction="right" className="lg:order-2">
              <div className="lg:order-2">
                <PhoneCarousel slides={hkFlow} accentColorClass="bg-emerald-400" />
              </div>
            </ScrollReveal>

            <div className="lg:order-1">
              <ScrollReveal>
                <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                  STÄDDASHBOARD
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <h2 className="mt-6 font-serif text-[clamp(40px,5vw,72px)] font-normal leading-[1.02] tracking-[-0.02em] text-text-primary">
                  Housekeeping
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.22}>
                <p className="mt-6 font-sans text-lg leading-relaxed text-text-secondary">
                  Inga papper, inga walkie-talkies. Reception och städpersonal ser
                  samma data i realtid — vilka rum är klara, vilka behöver fokus,
                  och hur många frukostgäster med allergier som kommer imorgon.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <ul className="mt-10 space-y-4">
                  {[
                    'Rollbaserad åtkomst (städ, reception, admin)',
                    'Bildbaserade felanmälningar med full spårbarhet',
                    'Live frukostlista — antal gäster och allergier',
                    'Produktivitetsstatistik och Excel-export',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-2.5 h-1 w-4 flex-shrink-0 bg-emerald-400" />
                      <span className="font-sans text-base text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                RESULTAT
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Sex saker som blev annorlunda.
              </h2>
            </ScrollReveal>

            <ol className="mt-16 space-y-6">
              {results.map((r, i) => (
                <ScrollReveal key={r} delay={0.05 * i}>
                  <li className="grid gap-6 border-t border-text-muted/15 pt-6 md:grid-cols-[80px_1fr]">
                    <span className="font-serif text-3xl text-accent-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif text-[clamp(20px,2.4vw,32px)] font-normal leading-[1.25] text-text-primary">
                      {r}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Tech stack */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                TEKNISK STACK
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-text-muted/15 bg-bg-primary px-4 py-2 font-sans text-xs uppercase tracking-tag text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto max-w-[860px] text-center">
            <ScrollReveal>
              <h2 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary">
                Har ni ett liknande problem?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="mt-6 font-sans text-lg leading-relaxed text-text-secondary">
                Vi bygger system som automatiserar just era processer — och ger
                er tid tillbaka.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <a
                href="mailto:info@infrakust.se"
                className="gold-underline mt-10 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                Berätta om ditt projekt →
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
