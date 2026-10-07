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
  name: 'Gästportal och driftsystem för hotell — Grand Hotel Lysekil och Fjordhotellet',
  description: 'Infrakust byggde två appar för hotellen i Lysekil: Zuve (gästportal från SMS till incheckning) och en housekeeping-app som har vuxit till ett driftsystem för två hotell — städstatus, uppgifter, frukostinköp, rumsbesiktning och felanmälningar i realtid.',
  url: 'https://www.infrakust.se/case/grand-hotel',
  author: { '@type': 'Organization', name: 'Infrakust', url: 'https://www.infrakust.se' },
  datePublished: '2026-01-01',
  dateModified: '2026-10-07',
  keywords: ['gästportal hotell', 'housekeeping app', 'app hotell Sverige', 'felanmälan hotell', 'rumsbesiktning', 'digital infrastruktur hotell', 'webbutveckling Lysekil'],
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
  { src: '/images/zuve-1-sms.jpg', label: 'E-postutskick', desc: 'Gästen får ett personligt e-postmeddelande med länk till sin gästportal — innan ankomst.' },
  { src: '/images/z1.jpg', label: 'Välkomstsida', desc: 'Personlig välkomstsida med gästens namn och knapp till bokningen.' },
  { src: '/images/z2.jpg', label: 'Förbered ankomst', desc: 'Gästen fyller i telefonnummer, ankomsttid och önskemål — direkt från mobilen.' },
  { src: '/images/z3.jpg', label: 'Bokningsöversikt', desc: 'Komplett översikt över datum, rum, gäster och totalpris.' },
  { src: '/images/z4.jpg', label: 'Tillval', desc: 'Upselling av godispaket, bubbel, spa och upplevelser direkt på rummet.' },
  { src: '/images/z5.jpg', label: 'Restauranger', desc: 'Lokala restauranger och vingårdar — bokas direkt i appen.' },
  { src: '/images/z6.jpg', label: 'Utforska Lysekil', desc: 'Sevärdheter och utomhusaktiviteter handplockade åt gästen.' },
  { src: '/images/z7.jpg', label: 'Gästportal', desc: 'Startsida där gästen kan söka fram sin bokning med bokningsnummer.' },
];

// Skärmdumparna är tagna mot en demokopia med påhittade gäster och personal.
const hkFlow = [
  { src: '/images/hk-rum.jpg', label: 'Rumsöversikt', desc: 'Städstatus per våning i realtid, synkad åt båda hållen med Sirvoy. Receptionen sätter prio när en gäst kommer tidigt.' },
  { src: '/images/hk-rumkort.jpg', label: 'Rumskortet', desc: 'Anmälda fel, rummets uppgifter, när det senast städades och rum som behöver dammas av efter lång tomgång.' },
  { src: '/images/hk-uppgifter.jpg', label: 'Uppgifter', desc: 'Dagens att göra i en lista: rutiner i tidsblock, rumsbyten, tillval från bokningen och det som blev kvar från igår.' },
  { src: '/images/hk-frukost.jpg', label: 'Frukost', desc: 'Sju dagar framåt med antal gäster och allergier, hämtat direkt ur bokningarna.' },
  { src: '/images/hk-inkop.jpg', label: 'Inköp & inventering', desc: 'Beställningar räknade på frukostgästerna, leveranser som scannas in och lager som inventeras med kameran.' },
  { src: '/images/hk-runda.jpg', label: 'Rumsbesiktning', desc: 'Besiktningsrundor genom alla rum. Varje åtgärd går till städ eller hantverkare och följs tills den är klar.' },
  { src: '/images/hk-fel.jpg', label: 'Fel & hantverkare', desc: 'Felanmälan med foto hamnar direkt i hantverkarens lista. Receptionen lämnar över iPaden i hantverkarläge.' },
  { src: '/images/hk-fjord.jpg', label: 'Fjordhotellet', desc: 'Samma app för ett andra hotell, med eget tema, egna rum och veckostäd i stället för daglig städning.' },
];

const hkModules = [
  {
    title: 'Rum & städstatus',
    desc: 'Tvåvägssynk med Sirvoy, prio från receptionen, stör ej-skylt, «spara rummet till imorgon» och refresh av rum som stått tomma länge.',
  },
  {
    title: 'Uppgifter',
    desc: 'Rutiner i tidsblock med «läst och förstått», rumsuppgifter med foto, brådska i tre nivåer och påminnelse om det som missades igår.',
  },
  {
    title: 'Frukost & inköp',
    desc: 'Sju dagars prognos med allergier. Beställning, leverans och inventering med streckkodsscanning. Grossistens inköpsrapport läses in med ett klick.',
  },
  {
    title: 'Rumsbesiktning',
    desc: 'Klagomål och besiktningsrundor med checklista. Åtgärderna går vidare till städ eller hantverkare och loggas tills de är gjorda.',
  },
  {
    title: 'Fel & hantverkare',
    desc: 'Felanmälningar med foto, tidslinje och «ur funktion». Hantverkaren får en egen läsplattevy med två val: Klart eller Kan inte lösas.',
  },
  {
    title: 'Två hotell',
    desc: 'Fjordhotellet med eget tema, lägenheter, hostelytor och veckostäd. Push-notiser går bara till rätt hotell och rätt roll.',
  },
];

const techStack = [
  'React', 'Next.js', 'TypeScript', 'Vite', 'Tailwind CSS',
  'Node.js', 'Express', 'Supabase', 'Sirvoy', 'Notion API',
  '46elks SMS', 'Web Push', 'SSE', 'PWA', 'Streckkodsscanning',
];

const results = [
  'Färre samtal till receptionen om rutinsaker',
  'Reception ser exakt vilka rum som är klara — på båda hotellen',
  'Rutiner, uppgifter och rumsbyten på ett ställe i stället för papperslistor',
  'Felanmälningar följs i appen tills hantverkaren trycker Klart',
  'Frukostbeställningen räknas fram ur bokningarna, inte på känn',
  'Besiktningar där varje åtgärd syns tills den är gjord',
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
        title="Gästportal och driftsystem för hotell — Infrakust"
        description="Hur Infrakust byggde en gästportal och ett driftsystem för Grand Hotel Lysekil och Fjordhotellet: städstatus, uppgifter, frukostinköp, rumsbesiktning och felanmälningar i realtid."
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
                <em className="italic">Två hotell.</em>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.28}>
              <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-text-muted/30 py-8 sm:grid-cols-4">
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Klient</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Grand Hotel Lysekil · Fjordhotellet</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Omfattning</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Gästportal + driftsystem</dd>
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
              <ScrollReveal delay={0.3}>
                <p>
                  Sedan lanseringen har housekeeping-appen vuxit med hur hotellet
                  faktiskt jobbar. I dag driver den även Fjordhotellet, och samlar
                  frukostinköp, rumsbesiktningar och felanmälningar till
                  hantverkarna på samma ställe som städet.
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
                  DRIFTSYSTEM
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <h2 className="mt-6 font-serif text-[clamp(40px,5vw,72px)] font-normal leading-[1.02] tracking-[-0.02em] text-text-primary">
                  Housekeeping
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.22}>
                <p className="mt-6 font-sans text-lg leading-relaxed text-text-secondary">
                  Inga papper, inga walkie-talkies. Reception, städpersonal och
                  hantverkare ser samma data i realtid — vilka rum är klara, vad
                  som är trasigt, vad som ska göras idag och hur många
                  frukostgäster med allergier som kommer imorgon.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <ul className="mt-10 space-y-4">
                  {[
                    'Två hotell i samma app, med egna rum och eget tema',
                    'Tvåvägssynk med Sirvoy — bokningar in, städstatus ut',
                    'Roller för städ, reception, admin och hantverkare',
                    'Push-notiser till rätt person när något händer',
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

        {/* Modules — what Housekeeping covers today */}
        <section className="px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                SEDAN LANSERINGEN
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Från städlista till <em className="italic">driftsystem.</em>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mt-4 max-w-[560px] font-sans text-base leading-relaxed text-text-secondary">
                Varje del byggdes för ett problem personalen faktiskt hade — och
                finns kvar för att den används varje dag.
              </p>
            </ScrollReveal>

            <ul className="mt-14 grid gap-px overflow-hidden border border-text-muted/10 bg-text-muted/10 sm:grid-cols-2 lg:grid-cols-3">
              {hkModules.map((m, i) => (
                <li key={m.title} className="bg-bg-primary p-8 md:p-10">
                  <span className="font-serif text-xl text-accent-gold/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-sans text-lg font-medium text-text-primary">
                    {m.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary">
                    {m.desc}
                  </p>
                </li>
              ))}
            </ul>
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
                Konkreta förbättringar som personalen märker av varje dag.
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
                href="mailto:hello@infrakust.se"
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
