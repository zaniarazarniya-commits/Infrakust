import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

const caseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Gästportal och housekeeping-app för hotell — Grand Hotel Lysekil',
  description: 'Infrakust byggde ett ekosystem av två appar för Grand Hotel Lysekil: Zuve (gästportal från SMS till incheckning) och en housekeeping-app som synkar reception och städpersonal i realtid.',
  url: 'https://www.infrakust.se/case/grand-hotel',
  author: { '@type': 'Organization', name: 'Infrakust', url: 'https://www.infrakust.se' },
  datePublished: '2026-01-01',
  keywords: ['gästportal hotell', 'housekeeping app', 'app hotell Sverige', 'digital infrastruktur hotell', 'webbutveckling Lysekil'],
  about: { '@type': 'Thing', name: 'Webbutveckling och app-utveckling för hospitality' },
};

/**
 * CaseGrandHotel
 * --------------------------------------------------------------
 * Dedicated case study page — replaces the bloated case block that
 * previously lived inside ToolsSection.tsx.
 *
 * Route: /case/grand-hotel
 */

const zuveFlow = [
  { src: '/images/zuve-1-sms.jpg', label: 'SMS-länk', desc: 'Gästen får ett personligt SMS med länk till sin bokning — innan ankomst.' },
  { src: '/images/z1.jpg', label: 'Gästportal', desc: 'Startsida där gästen kan söka fram sin bokning med bokningsnummer.' },
  { src: '/images/z2.jpg', label: 'Välkomstsida', desc: 'Personlig välkomstsida med gästens namn och bokningsknapp.' },
  { src: '/images/z3.jpg', label: 'Ankomstinfo', desc: 'Gästen fyller i uppgifter, ankomsttid och önskemål — direkt från mobilen.' },
  { src: '/images/z4.jpg', label: 'Bokningsöversikt', desc: 'Komplett översikt över rum, datum, gäster och totalpris.' },
  { src: '/images/z5.jpg', label: 'Tillval', desc: 'Upselling av skaldjur, bubbel, spa och upplevelser i Lysekil.' },
  { src: '/images/z6.jpg', label: 'Bekräftelse', desc: 'Tydlig bekräftelse på att allt är klart inför ankomst.' },
  { src: '/images/z7.jpg', label: 'Incheckning', desc: 'Incheckning direkt i mobilen — utan att behöva besöka receptionen.' },
];

const hkFlow = [
  { src: '/images/h1.jpg', label: 'Reception', desc: 'Reception ser exakt vilka rum som är klara och när.' },
  { src: '/images/h2.jpg', label: 'Dagliga rutiner', desc: 'Checklistor och uppgifter för varje tidsblock under dagen.' },
  { src: '/images/h3.jpg', label: 'Frukost & allergier', desc: 'Live frukostlista med allergier hämtade direkt från bokningen.' },
  { src: '/images/h4.jpg', label: 'Statistik', desc: 'Produktivitetsstatistik och Excel-export för städpersonal.' },
];

const techStack = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Supabase', 'Express', 'Sirvoy API', 'Notion API',
  '46elks SMS', 'Web Push', 'SSE', 'Excel-export',
];

const results = [
  'Färre samtal till receptionen om rutinsaker',
  'Digitalt istället för papperslistor som var inaktuella',
  'Reception ser exakt vilka rum som är klara och när',
  'Tydligare kommunikation mellan reception och städpersonal',
  'Statistik och spårbarhet — bättre ordning varje dag',
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
      <SEO
        title="Gästportal och housekeeping-app för hotell — Infrakust"
        description="Hur Infrakust byggde två appar som ett ekosystem för Grand Hotel Lysekil: en gästportal och ett realtids-housekeeping-system."
        canonical="https://www.infrakust.se/case/grand-hotel"
        jsonLd={caseJsonLd}
      />
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
                Två <span className="text-accent-gold">appar.</span><br />
                <em className="italic">Ett hotell.</em>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.28}>
              <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-text-muted/30 py-8 sm:grid-cols-4">
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Klient</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Grand Hotel Lysekil</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Omfattning</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Gästportal + städsystem</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">År</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">2025–2026</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Roll</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Design + utveckling</dd>
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
            <div className="space-y-6 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
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
                Vad systemet <em className="italic">levererade.</em>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mt-4 max-w-[520px] font-sans text-base leading-relaxed text-text-secondary">
                Sex konkreta förbättringar som personalen märker av varje dag.
              </p>
            </ScrollReveal>

            <ol className="mt-14 divide-y divide-text-muted/10">
              {results.map((r, i) => (
                <ScrollReveal key={r} delay={0.06 * i}>
                  <li className="group flex items-center gap-6 py-5 transition-all duration-300 hover:bg-text-muted/[0.03] md:gap-10 md:px-4">
                    <span className="w-10 flex-shrink-0 font-serif text-2xl text-accent-gold/50 transition-colors duration-300 group-hover:text-accent-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-sans text-[clamp(16px,1.8vw,22px)] font-medium leading-[1.3] text-text-primary">
                      {r}
                    </span>
                    <span className="translate-x-2 text-accent-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      &rarr;
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
