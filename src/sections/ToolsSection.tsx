import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  Wifi,
  Shield,
  RefreshCw,
  Smartphone,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Wifi,
    title: 'Realtidsöverblick',
    description: 'Alla ser samma data direkt. Ingen dubbelarbete, inga missförstånd.',
  },
  {
    icon: Shield,
    title: 'Rollbaserad åtkomst',
    description: 'Olika vyer och rättigheter för olika roller. Städare, reception, admin.',
  },
  {
    icon: RefreshCw,
    title: 'Automatisk synkronisering',
    description: 'Webhooks och API-integrationer som pratar med bokningssystem, Notion, SMS-tjänster.',
  },
  {
    icon: Smartphone,
    title: 'Mobil-first PWA',
    description: 'Fungerar som en app på mobilen. Installera på hemskärmen, offline-stöd, push-notiser.',
  },
];

const industries = [
  'Hotell & Boende',
  'Restauranger',
  'Hälsa & Wellness',
  'Fastighet & Facility',
  'Tjänsteföretag',
  'Detaljhandel',
];

const extraFeatures = [
  'Live frukostlista — Antal frukostgäster per dag hämtas live från Sirvoy. Allergier visas automatiskt.',
  'Automatiska tillval — Extrasäng, babybed, tidig/sen incheckning appliceras direkt från Sirvoy-bokningen.',
  'Produktivitetsstatistik — Snittid per städning, uppgifter slutförda, export till Excel.',
];

// Zuve flow screenshots - OPTIMIZED
const zuveFlow = [
  { src: '/images/zuve-1-sms-opt.jpg', label: 'SMS-bekräftelse', desc: 'Gästen får ett personligt SMS med länk till sin gästportal' },
  { src: '/images/zuve-2-welcome-opt.jpg', label: 'Välkomstsida', desc: 'Personlig välkomstsida med gästens namn och bokningsknapp' },
  { src: '/images/zuve-3-arrival-opt.jpg', label: 'Ankomstinfo', desc: 'Gästen fyller i telefon, e-post, ankomsttid och önskemål' },
  { src: '/images/zuve-4-booking-opt.jpg', label: 'Bokningsdetaljer', desc: 'Komplett översikt över rum, datum, gäster och pris' },
  { src: '/images/zuve-5-upsell-opt.jpg', label: 'Tillval', desc: 'Upselling av skaldjur, bubbel, spa och upplevelser' },
  { src: '/images/zuve-6-explore-opt.jpg', label: 'Utforska Lysekil', desc: 'Lokal guide med aktiviteter, natur och restauranger' },
];

// Housekeeping flow screenshots - v2 (re-cropped to remove names)
const hkFlow = [
  { src: '/images/app-hk-reception-opt2.jpg', label: 'Reception', desc: 'Reception ser exakt vilka rum som är klara och när' },
  { src: '/images/app-hk-routines-opt2.jpg', label: 'Dagliga rutiner', desc: 'Checklistor och uppgifter för varje tidsblock under dagen' },
  { src: '/images/app-hk-breakfast-opt2.jpg', label: 'Frukost & allergier', desc: 'Live frukostlista med allergier hämtade direkt från bokningen' },
];

interface PhoneCarouselProps {
  images: { src: string; label: string; desc: string }[];
  appName: string;
  color: string;
}

function PhoneCarousel({ images, appName, color }: PhoneCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  // Preload next/prev images
  const nextIndex = (current + 1) % images.length;
  const prevIndex = (current - 1 + images.length) % images.length;

  return (
    <div className="flex flex-col items-center">
      {/* Preload hidden */}
      <div className="sr-only">
        <img src={images[nextIndex].src} alt="" loading="eager" />
        <img src={images[prevIndex].src} alt="" loading="eager" />
      </div>

      {/* Phone Frame */}
      <div className="group relative">
        <div className="relative overflow-hidden rounded-[2.2rem] border-[4px] border-text-muted/20 bg-bg-primary shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-text-muted/35 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-20 h-[28px] w-[120px] -translate-x-1/2 rounded-b-[14px] bg-bg-primary" />
          
          {/* Side buttons */}
          <div className="absolute -left-[6px] top-[90px] h-[28px] w-[3px] rounded-l bg-text-muted/25" />
          <div className="absolute -left-[6px] top-[130px] h-[40px] w-[3px] rounded-l bg-text-muted/25" />
          <div className="absolute -right-[6px] top-[110px] h-[60px] w-[3px] rounded-r bg-text-muted/25" />

          {/* Screen — aspect 9/19.5 = modern iPhone */}
          <div className="relative aspect-[9/19.5] w-[260px] overflow-hidden bg-bg-primary sm:w-[280px]">
            {/* Image slide */}
            <div className="relative h-full w-full cursor-pointer" onClick={next}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  src={images[current].src}
                  alt={images[current].label}
                  className="absolute inset-0 h-full w-full object-cover object-top will-change-transform"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />
              </AnimatePresence>

              {/* Click zones */}
              <div className="absolute inset-y-0 left-0 w-1/3" onClick={(e) => { e.stopPropagation(); prev(); }} />
              <div className="absolute inset-y-0 right-0 w-1/3" onClick={(e) => { e.stopPropagation(); next(); }} />
            </div>

            {/* Subtle nav arrows */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary/40 text-white/50 opacity-0 transition-all hover:bg-bg-primary/70 hover:text-white group-hover:opacity-100"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-bg-primary/40 text-white/50 opacity-0 transition-all hover:bg-bg-primary/70 hover:text-white group-hover:opacity-100"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Step indicators — OUTSIDE phone, below */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === current
                  ? `w-6 ${color}`
                  : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
        <p className="font-sans text-[10px] uppercase tracking-tag text-text-muted">
          {images[current].label} — {current + 1} / {images.length}
        </p>
      </div>

      {/* Description */}
      <p className="mt-3 max-w-[260px] text-center font-sans text-sm leading-relaxed text-text-secondary">
        {images[current].desc}
      </p>
      <p className="mt-1 font-sans text-xs text-text-muted">
        {appName}
      </p>
    </div>
  );
}

export function ToolsSection() {
  const reducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section id="appar" className="px-6 py-[120px] md:px-12 md:py-[160px] lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Label */}
        <ScrollReveal>
          <p className="mb-6 font-sans text-xs uppercase tracking-section text-accent-gold">
            INTERNA VERKTYG
          </p>
        </ScrollReveal>

        {/* Heading */}
        <ScrollReveal delay={0.15}>
          <h2 className="max-w-[900px] font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
            Vi bygger system som förenklar vardagen — och sparar timmar.
          </h2>
        </ScrollReveal>

        {/* Subheading */}
        <ScrollReveal delay={0.25}>
          <p className="mt-6 max-w-[640px] font-sans text-base leading-relaxed text-text-secondary">
            Skräddarsydda interna verktyg och dashboards som automatiserar arbetsflöden, ger realtidsöverblick och samlar all data på ett ställe. Från städscheman till gästkommunikation.
          </p>
        </ScrollReveal>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group border-b border-text-muted/10 pb-8 pt-2 transition-all duration-300 hover:border-accent-gold/40"
            >
              <feature.icon
                size={24}
                strokeWidth={1.5}
                className="mb-4 text-accent-gold transition-transform duration-300 group-hover:scale-110"
              />
              <h3 className="mb-2 font-serif text-xl text-text-primary">
                {feature.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Case Study — Grand Hotel Lysekil */}
        <ScrollReveal delay={0.2}>
          <div className="mt-24 rounded-xl border border-text-muted/10 bg-bg-secondary p-8 md:p-12 lg:p-16">
            {/* Case Label */}
            <p className="mb-4 font-sans text-xs uppercase tracking-section text-accent-gold">
              CASE STUDY
            </p>

            {/* Case Title */}
            <h3 className="font-serif text-[clamp(28px,4vw,48px)] font-normal leading-[1.1] text-text-primary">
              Grand Hotel Lysekil
            </h3>
            <p className="mt-2 font-sans text-base text-text-secondary">
              Ett komplett digitalt ekosystem — två appar, ett hotell.
            </p>

            {/* Two App Carousels side by side */}
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {/* Zuve */}
              <div className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  <h4 className="font-serif text-2xl text-accent-gold">Zuve</h4>
                  <p className="mt-1 font-sans text-sm text-text-secondary">Gästportal — från SMS till upplevelse</p>
                </div>
                <PhoneCarousel 
                  images={zuveFlow} 
                  appName="Zuve" 
                  color="bg-accent-gold" 
                />
                <p className="mt-4 max-w-[300px] text-center font-sans text-xs text-text-muted">
                  Klicka på telefonen för att bläddra genom hela gästflödet
                </p>
              </div>

              {/* Housekeeping */}
              <div className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  <h4 className="font-serif text-2xl text-emerald-400">Housekeeping</h4>
                  <p className="mt-1 font-sans text-sm text-text-secondary">Städdashboard — allt i realtid</p>
                </div>
                <PhoneCarousel 
                  images={hkFlow} 
                  appName="Housekeeping" 
                  color="bg-emerald-400" 
                />
                <p className="mt-4 max-w-[300px] text-center font-sans text-xs text-text-muted">
                  Klicka på telefonen för att se alla funktioner
                </p>
              </div>
            </div>

            {/* Extra Features List */}
            <div className="mt-12 space-y-3">
              {extraFeatures.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 flex-shrink-0 text-accent-gold" />
                  <p className="font-sans text-sm leading-relaxed text-text-secondary">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="mt-10 border-t border-text-muted/10 pt-8">
              <p className="mb-4 font-sans text-xs uppercase tracking-section text-accent-gold">
                RESULTAT
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  'Färre samtal till receptionen',
                  'Ökad försäljning av tillval',
                  'Reception ser exakt vilka rum som är klara',
                  'Bildbaserade felanmälningar med full spårbarhet',
                  'Statistik över städtider och produktivitet',
                  'Allt synkat i realtid mellan alla enheter',
                ].map((result) => (
                  <div key={result} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
                    <span className="font-sans text-sm text-text-secondary">{result}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                'Next.js',
                'React',
                'TypeScript',
                'Tailwind CSS',
                'Supabase',
                'Express',
                'Sirvoy API',
                'Notion API',
                '46elks SMS',
                'Web Push',
                'SSE',
                'Excel-export',
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-text-muted/10 bg-bg-primary px-3 py-1 font-sans text-xs uppercase tracking-tag text-text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Industries */}
        <ScrollReveal delay={0.2}>
          <div className="mt-24">
            <p className="mb-8 font-sans text-xs uppercase tracking-section text-accent-gold">
              TILLÄMPLIGA BRANSCHER
            </p>
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry, i) => (
                <motion.div
                  key={industry}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
                  className="flex items-center gap-3"
                >
                  <div className="h-1 w-4 rounded-full bg-accent-gold" />
                  <span className="font-sans text-sm text-text-secondary">{industry}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-24 text-center">
            <h3 className="font-serif text-[clamp(24px,3.5vw,40px)] font-normal leading-[1.15] text-text-primary">
              Slösa inte tid på papper och dubbelarbete.
            </h3>
            <p className="mx-auto mt-4 max-w-[560px] font-sans text-base leading-relaxed text-text-secondary">
              Vi bygger ett system som automatiserar just era processer — och ger er tid tillbaka.
            </p>
            <a
              href="mailto:info@infrakust.se"
              className="gold-underline mt-8 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
            >
              Berätta om ditt projekt →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
