import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

const TITLE = 'Formad: från idé till app i Google Play — Infrakust';
const DESCRIPTION =
  'Formad är vår egen produkt: en dagsplanerare för skiftarbetare. Här är berättelsen om hur vi byggde den, från idé till app i Google Play, med kropparna, mentorn och klockan.';
const CANONICAL = 'https://www.infrakust.se/case/formad';

const caseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Formad: från idé till app i Google Play',
  description: DESCRIPTION,
  url: CANONICAL,
  image: 'https://www.infrakust.se/formad/og.jpg',
  author: { '@type': 'Organization', name: 'Infrakust', url: 'https://www.infrakust.se' },
  datePublished: '2026-10-17',
  dateModified: '2026-10-17',
  keywords: ['app för skiftarbetare', 'dagsplanerare', 'app-utveckling', 'Android-app', 'Wear OS-app', 'Health Connect', 'träningsapp'],
  about: {
    '@type': 'SoftwareApplication',
    name: 'Formad',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, Android, Wear OS',
  },
};

const underHuven = [
  'Webbapp och Android-app ur samma kodbas, och en egen Wear OS-app',
  'Supabase för konton och data',
  'Vercel för webbappen och funktionerna, i Dublin bredvid databasen',
  'Health Connect mot Samsung Health',
  'Anthropic bakom mentorn och matfotona',
  'Blender, MPFB2 och en egen renderkö för kropparna och klippen',
  'Stripe för Bas, Pro och Max på webben',
];

const GOLD = '201,169,110';

const dagenRuntPasset = [
  'Ett nattpass delas i två block, så att idag betyder något klockan tre på natten',
  'Planen räknas om när ett pass flyttas',
  'Nya konton får en färdig startrutin',
];

/** Telefonram med guldkant, samma som i heron. */
function Phone({
  src,
  alt,
  eager = false,
}: {
  src: string;
  alt: string;
  eager?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-[2rem] border bg-bg-primary"
      style={{
        borderColor: `rgba(${GOLD},0.2)`,
        boxShadow: `0 8px 40px rgba(${GOLD},0.12), 0 20px 60px rgba(0,0,0,0.5)`,
      }}
    >
      <img
        src={src}
        alt={alt}
        width={1080}
        height={1920}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        className="block h-auto w-[260px] sm:w-[280px]"
      />
    </div>
  );
}

/**
 * CaseFormad
 * --------------------------------------------------------------
 * Caset om vår egen produkt Formad. Strukturen följer CaseGrandHotel.
 *
 * Route: /case/formad
 */
export default function CaseFormad() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        canonical={CANONICAL}
        image="https://www.infrakust.se/formad/og.jpg"
        jsonLd={caseJsonLd}
      />
      <Navigation />

      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden px-6 pb-24 pt-[160px] md:px-12 md:pb-32 md:pt-[200px] lg:px-20">
          <div
            className="pointer-events-none absolute right-0 top-1/2 -z-0 h-[700px] w-[700px] -translate-y-1/2 translate-x-1/4 rounded-full blur-[120px]"
            style={{ backgroundColor: `rgba(${GOLD},0.07)` }}
          />
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-section text-text-muted transition-colors hover:text-accent-gold"
              >
                <ArrowLeft size={14} />
                Tillbaka till start
              </Link>

              <p className="mt-12 font-sans text-xs uppercase tracking-section text-accent-gold">
                CASE · EGEN PRODUKT
              </p>

              <h1 className="mt-6 max-w-[920px] font-serif text-[clamp(48px,7vw,108px)] font-normal leading-[0.98] tracking-[-0.025em] text-text-primary">
                En app som vet<br />
                när du <em className="italic text-accent-gold">jobbar.</em>
              </h1>

              <p className="mt-8 max-w-[560px] font-sans text-lg leading-relaxed text-text-secondary">
                Formad är vår egen produkt. En dagsplanerare för skiftarbetare som
                lägger rutin, träning och mat runt passen, med en mentor som läser
                hela dagen. Vi byggde den för att vi behövde den själva. Så här gick
                det till.
              </p>

              <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-text-muted/30 py-8 sm:grid-cols-3">
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Plattformar</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Webb · Android · Wear OS</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Status</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">Sluten beta i Google Play</dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-section text-accent-gold">Tid</dt>
                  <dd className="mt-2 font-sans text-sm font-medium text-text-primary">2026</dd>
                </div>
              </dl>
            </div>

            <div className="mx-auto lg:mx-0">
              <Phone
                src="/formad/tel-traning.webp"
                alt="Formad, Träning-sidan med lagerkransen"
                eager
              />
            </div>
          </div>
        </section>

        {/* 2. Varför */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
              VARFÖR
            </p>
            <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
              Fem appar, en AI och ett schema som aldrig var detsamma.
            </h2>
            <div className="mt-12 grid gap-8 font-sans text-lg leading-relaxed text-text-secondary md:grid-cols-2 md:gap-16">
              <p className="max-w-[60ch]">
                Skiftjobb gör vanliga hälsoappar meningslösa. De antar att dagen
                börjar på morgonen. Rutinen låg i en app, träningen i en annan och
                maten i en tredje. Utanför alltihop fanns en AI-assistent som inte
                visste något om passen. Vi ville ha ett ställe som visste när vi
                jobbade och planerade resten.
              </p>
              <p className="max-w-[60ch]">
                Tonen kom från ett intresse vi delar för stoikerna, Iliaden, Sokrates
                och Marcus Aurelius. Ordning utan pekpinnar. Det blev appens hållning
                och till slut dess utseende: lagerkransen, ΓΥΜΝΑΣΙΟΝ över träningen
                och romerska siffror i passen.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Dagen runt passet */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
              <div>
                <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                  DAGEN RUNT PASSET
                </p>
                <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                  Passet är <em className="italic text-accent-gold">axeln.</em> Allt annat snurrar runt det.
                </h2>
                <p className="mt-8 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
                  Dag-, kvälls- och nattpass läggs in först. Sedan lägger appen
                  rutin, träning och måltider runt dem.
                </p>
                <ul className="mt-8 space-y-4">
                  {dagenRuntPasset.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-2.5 h-1 w-4 flex-shrink-0 bg-accent-gold" />
                      <span className="font-sans text-base text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                <Phone src="/formad/tel-idag.webp" alt="Formad, Idag-sidan med dagens pass och plan" />
                <Phone src="/formad/tel-vecka.webp" alt="Formad, Kommande pass i veckan" />
              </div>
            </div>

            <figure className="mx-auto mt-20 max-w-[960px] md:mt-28">
              <img
                src="/formad/sisyfos.webp"
                alt="Veckan som Sisyfos: Herkules puttar stenen uppför veckan och är förgylld på söndagen"
                width={1098}
                height={1104}
                loading="lazy"
                className="block h-auto w-full"
              />
              <figcaption className="mt-4 font-sans text-sm text-text-muted">
                Varje hel dag lyfter han stenen lite högre. Sju dagar och han står i guld.
              </figcaption>
            </figure>
          </div>
        </section>
        <section>{/* Task 6: Kropparna */}</section>
        <section>{/* Task 7: Statyn i 3D */}</section>
        <section>{/* Task 8: Övningarna */}</section>
        <section>{/* Task 9: Mentorn */}</section>
        <section>{/* Task 9: Klockan */}</section>
        <section>{/* Task 9: Formen */}</section>

        {/* 10. Under huven */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[1fr_2fr] lg:gap-24">
            <div>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                UNDER HUVEN
              </p>
              <h2 className="mt-6 font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Ett team, hela kedjan.
              </h2>
            </div>
            <ul className="space-y-4 lg:pt-12">
              {underHuven.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-2.5 h-1 w-4 flex-shrink-0 bg-accent-gold" />
                  <span className="font-sans text-base text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 11. Avslut */}
        <section className="px-6 py-32 md:px-12 md:py-40 lg:px-20">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="font-serif text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.2] tracking-[-0.01em] text-text-primary">
              Vi byggde Formad för att vi behövde den. Det är samma sätt vi bygger
              åt andra: från ett riktigt problem, hela vägen till en app folk har i
              fickan.
            </p>
            <a
              href="mailto:hello@infrakust.se"
              className="gold-underline mt-10 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
            >
              Hör av dig →
            </a>
            <p className="mt-8 font-sans text-sm text-text-muted">
              Formad får en egen sida när den lanseras.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
