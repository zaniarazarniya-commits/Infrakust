import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { JourneyStrip } from '@/components/formad/JourneyStrip';
import { FaultTable } from '@/components/formad/FaultTable';
import { HerculesViewer } from '@/components/formad/HerculesViewer';
import { ClipGrid } from '@/components/formad/ClipGrid';

const TITLE = 'Formad: från idé till app i Google Play — Infrakust';
const DESCRIPTION =
  'Formad är min egen app: en dagsplanerare för skiftarbetare. Här är hur jag byggde den, från idé till app i Google Play, med det som gick sönder på vägen: kropparna, mentorn och klockan.';
const CANONICAL = 'https://www.infrakust.se/case/formad';

const caseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Formad: från idé till app i Google Play',
  description: DESCRIPTION,
  url: CANONICAL,
  image: 'https://www.infrakust.se/formad/og.jpg',
  author: { '@type': 'Organization', name: 'Infrakust', url: 'https://www.infrakust.se' },
  datePublished: '2026-10-16',
  dateModified: '2026-10-16',
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

const klippen = [
  { name: 'marklyft', label: 'Marklyft' },
  { name: 'knaboj', label: 'Knäböj' },
  { name: 'banpress', label: 'Bänkpress' },
  { name: 'militarpress', label: 'Militärpress' },
  { name: 'skivstangsrodd', label: 'Skivstångsrodd' },
  { name: 'bicepscurl-hantel', label: 'Hantelcurl' },
];

const dagenRuntPasset = [
  'Ett nattpass delas i två block, så att idag betyder något klockan tre på natten',
  'Planen räknas om när ett pass flyttas',
  'Nya konton får en färdig startrutin',
];

const resan = [
  {
    src: '/formad/resa-01-block.webp',
    alt: 'Ett ohugget marmorblock på en sockel, med prickade linjer inritade',
    caption: 'Statyn finns redan där inne.',
    width: 768,
    height: 1152,
  },
  {
    src: '/formad/resa-02-huggen.webp',
    alt: 'Herkules halvvägs ute ur marmorblocket, överkroppen huggen och benen kvar i stenen',
    caption: 'Formen kom ur en AI-skulptur av referensbilder.',
    width: 768,
    height: 1152,
  },
  {
    src: '/formad/resa-03-gra.webp',
    alt: 'Statyn som grå 3D-modell, med ena foten på en klippa',
    caption: 'Statyn som mesh: 176 601 trianglar.',
    width: 640,
    height: 960,
  },
  {
    src: '/formad/resa-04-tre-kroppar.webp',
    alt: 'Tre grå kroppar bredvid varandra: statyn, den nya kroppen och den nya kroppen med statyns form',
    caption: 'Statyn, den nya kroppen, och formen överförd.',
    width: 1600,
    height: 888,
  },
  {
    src: '/formad/resa-05-muskelatlas.webp',
    alt: 'Kroppen framifrån, bakifrån och från sidan med 23 muskler i var sin färg och en förklaring till höger',
    caption: '23 muskler målade på kroppen.',
    width: 2000,
    height: 702,
  },
  {
    src: '/formad/resa-06-marklyft.webp',
    alt: 'Herkules i marklyft med rygg och säte färgade efter sin roll i lyftet',
    caption: 'Varje övning visar vad den tränar.',
    width: 720,
    height: 900,
  },
];

const felen = [
  {
    saw: 'Utdragna armar, tunna handleder',
    cause:
      'Armlängderna mättes från axelspetsen, inte mellan ledcentra. Överarmen var 24 % för lång.',
    fix: 'De Levas mått mellan ledcentra, hårda regler i passningen',
  },
  {
    saw: 'Armbågen böjde fel i nästan varje klipp',
    cause: 'IK-kedjan hade statyns gamla längder, så armbågen hamnade 5–10 cm från meshens.',
    fix: 'IK-benen satta lika med deformbenen',
  },
  {
    saw: 'Ansiktet sönderrivet',
    cause: 'Projektion längs normalerna missade 46 % av punkterna.',
    fix: 'ICP som bara fäster arm mot arm, bål mot bål',
  },
  {
    saw: 'Axeln blev aldrig rätt',
    cause: 'Riggen saknade skulderblad, så all rörelse kom ur en led.',
    fix: 'Skulderbladsben som följer forskningens skulderrytm, efter sex kasserade försök',
  },
  {
    saw: '15 klipp gick inte att spela till slutet',
    cause: 'Två renderare skrev samma fil samtidigt.',
    fix: 'Varje klipp avkodas i testet innan det går in i appen',
  },
];

// Klockans sidor, som emulatorbilder (454×454). Ordningen är ett varv genom appen.
const klockan = [
  { src: '/formad/klocka-01.webp', alt: 'Klockan: Nu, ett glas vatten med magnesium, med bock, skippa och dagen', caption: 'Idag: nästa moment, bocka av eller skippa.' },
  { src: '/formad/klocka-02.webp', alt: 'Klockan: vattnet 1,3 av 2,5 liter med glas- och flaskknapp, och Morgonen med 8 kvar', caption: 'Dagen som lista. Vattnet loggas med ett tryck.' },
  { src: '/formad/klocka-03.webp', alt: 'Klockan: Nästa, Pass 2 Rygg, 3 övningar 10 min, med startknapp', caption: 'Träning: nästa pass, start med ett tryck.' },
  { src: '/formad/klocka-04.webp', alt: 'Klockan: Axelpress med hantlar, set 1 av 2, kg och reps med minus och plus, puls 100', caption: 'Varje set: kg, reps och pulsen längs kanten.' },
  { src: '/formad/klocka-05.webp', alt: 'Klockan: Vila 2:42 med guldbåge runt kanten, nästa 8 reps, plus 30 sekunder och hoppa över', caption: 'Vilan räknar ner som en guldbåge och surrar när det är dags.' },
  { src: '/formad/klocka-06.webp', alt: 'Klockan: Mat, 0 av 1 850 kcal, favoriterna Min frukost och Proteinshake', caption: 'Mat: favoriterna loggas med ett tryck.' },
  { src: '/formad/klocka-07.webp', alt: 'Rutan: Nu, ett glas vatten med magnesium, 2 av 20 klara, bock och nästa pass', caption: 'Rutan, ett svep från urtavlan: bocka av utan att öppna appen.' },
  { src: '/formad/klocka-08.webp', alt: 'Formad-urtavlan: 7:44, lördag 17 okt, Nu: ett glas vatten med magnesium, puls 89 och 800 steg', caption: 'Formad-urtavlan: tiden, Nu, dagens båge, puls och steg.' },
].map((s) => ({ ...s, width: 454, height: 454 }));

// 3D-modellerna genom bygget. Bilderna är arbetsmapparnas egna renderingar; se scripts/material/formad.mjs.
const formen = [
  {
    src: '/formad/modell-01.webp',
    alt: 'Herkules-statyn som grå 3D-modell, framifrån, med ena foten på en klippa',
    caption: 'Statyn som den kom ur AI-verktyget. Vacker, och omöjlig att böja.',
    width: 640,
    height: 960,
  },
  {
    src: '/formad/modell-02.webp',
    alt: 'Samma staty med varm marmoryta, framifrån',
    caption: 'Marmorn räknas fram i appen, inte som en bild.',
    width: 768,
    height: 1152,
  },
  {
    src: '/formad/modell-03.webp',
    alt: 'Statyn riggad i viloläge med armarna ut från kroppen, grå, snett framifrån',
    caption: 'Första riggen, rakt i statyn. Den som aldrig böjde rätt.',
    width: 1200,
    height: 1200,
  },
  {
    src: '/formad/modell-04.webp',
    alt: 'Den nya kroppen framifrån med armarna ut, grå, med Herkules huvud',
    caption: 'Den nya kroppen på MPFB2, passad mot statyn.',
    width: 540,
    height: 900,
  },
  {
    src: '/formad/modell-05.webp',
    alt: 'Den nya kroppen med statyns yta överförd, armarna rödmarkerade',
    caption: 'Statyns yta flyttad över på den nya kroppen.',
    width: 540,
    height: 900,
  },
  {
    src: '/formad/modell-06.webp',
    alt: 'Herkules i vit marmor puttar ett stort klot upp på en marmorkub',
    caption: 'Veckans Herkules med stenen, så som han står i appen.',
    width: 1030,
    height: 966,
  },
  {
    src: '/formad/modell-07.webp',
    alt: 'Statyn på klippan med troféer vid fötterna: ett vildsvinshuvud, horn, ett lejonhuvud och en kedja',
    caption: 'Troféerna vid hans fötter, en för varje nivå.',
    width: 800,
    height: 1200,
  },
  {
    src: '/formad/modell-08.webp',
    alt: 'Ett marmorblock i en mörk hall med pelare, Herkules huvud sticker upp ur överkanten',
    caption: 'Årets staty i 3D: blocket, med 52 nivåer att hugga.',
    width: 900,
    height: 1600,
  },
  {
    src: '/formad/modell-09.webp',
    alt: 'Statyn fri ur blocket i vit marmor med ådror, i hallen',
    caption: 'Fri ur blocket.',
    width: 900,
    height: 1600,
  },
  {
    src: '/formad/modell-10.webp',
    alt: 'Statyn i hallen, överkroppen förgylld och resten marmor, troféerna svävar runt klippan',
    caption: 'Guldet börjar uppifrån, trofé för trofé.',
    width: 900,
    height: 1600,
  },
  {
    src: '/formad/modell-11.webp',
    alt: 'Hela statyn och alla troféer i guld, i hallen',
    caption: 'Förgylld, med alla tolv troféer.',
    width: 900,
    height: 1600,
  },
  {
    src: '/formad/modell-12.webp',
    alt: 'En tallrik med skivad kyckling, ris, broccoli och en skål sås, renderad i 3D',
    caption: 'Tallriken på Mat-sidan är också en modell.',
    width: 640,
    height: 640,
  },
];

/** Telefonram med guldkant, samma som i heron. */
function Phone({
  src,
  alt,
  width = 1080,
  height = 1920,
  eager = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
        width={width}
        height={height}
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
                Formad är min egen app. Jag jobbar skift och ville ha rutin,
                träning och mat på ett ställe som vet när passen ligger. Infrakust
                är en person, och det här är hur jag byggde den: vad jag ville, vad
                som gick sönder på vägen och hur det löste sig.
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
              Det började med att ingenting passade ihop.
            </h2>
            <div className="mt-12 grid gap-8 font-sans text-lg leading-relaxed text-text-secondary md:grid-cols-2 md:gap-16">
              <p className="max-w-[60ch]">
                Jag jobbar skift. Vanliga hälsoappar antar att dagen börjar på
                morgonen, och min gjorde inte det. Rutinen låg i en app, träningen
                i en annan, maten i en tredje, och en AI-assistent utanför alltihop
                som inte visste när jag jobbade. Jag ville ha ett ställe som visste
                det och planerade resten.
              </p>
              <p className="max-w-[60ch]">
                Tonen kom från det jag läser: stoikerna, Iliaden, Sokrates och
                Marcus Aurelius. Ordning utan pekpinnar. Det blev appens hållning
                och till slut dess utseende, med lagerkransen, ΓΥΜΝΑΣΙΟΝ över
                träningen och romerska siffror i passen.
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
                  Först passen. Sedan allt annat <em className="italic text-accent-gold">runt dem.</em>
                </h2>
                <p className="mt-8 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
                  Jag lägger in dag-, kvälls- och nattpass först. Sedan lägger appen
                  rutin, träning och måltider runt dem. Det låter enkelt, men
                  nattpasset tog tid att få rätt. Ett pass som börjar klockan 22 och
                  slutar klockan 06 hör till två dagar, och appen måste veta vad
                  idag betyder klockan tre på natten.
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
              {/* Tre kolumner från 768 px, två på telefoner så att staplarna går att läsa. */}
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet="/formad/sisyfos-bred.webp"
                  width={1106}
                  height={1108}
                />
                <img
                  src="/formad/sisyfos-smal.webp"
                  alt="Veckan som Sisyfos: Herkules puttar stenen uppför veckan och är förgylld på söndagen"
                  width={732}
                  height={1670}
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </picture>
              <figcaption className="mt-4 font-sans text-sm text-text-muted">
                Varje hel dag lyfter han stenen lite högre. Sju dagar och han står i guld.
              </figcaption>
            </figure>
          </div>
        </section>
        {/* 4. Kropparna */}
        <section className="bg-bg-secondary py-24 md:py-32">
          <div className="px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1280px]">
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                KROPPARNA
              </p>
              <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Jag ville att appen skulle visa vad en övning tränar. Det krävde en <em className="italic text-accent-gold">egen kropp.</em>
              </h2>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <JourneyStrip steps={resan} label="Resan från marmorblock till marklyft" />
          </div>

          <div className="px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1280px]">
              <p className="mt-16 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary md:mt-20">
                Statyns form skulpterades med ett AI-verktyg ur referensbilder. Den
                var vacker, och den gick inte att böja. Allt efter det gjorde jag
                själv: riggen, den nya kroppen, musklerna och klippen. Det tog
                betydligt längre tid än jag trodde.
              </p>

              <div className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-[1fr_2fr] lg:gap-24">
                <h3 className="font-serif text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.01em] text-text-primary">
                  Den första kroppen gick inte att böja.
                </h3>
                <div className="space-y-6 font-sans text-lg leading-relaxed text-text-secondary">
                  <p className="max-w-[60ch]">
                    Första försöket var att rigga statyn direkt. Jag satte ett
                    skelett i den, målade vikter, delade de hopvuxna fingrarna,
                    byggde korrektiv för armbågar och axlar, skrev en volymbevarande
                    lösare och renderade 28 rörelser. Armarna såg utdragna ut,
                    armbågarna böjde fel i nästan varje klipp och axeln blev aldrig
                    rätt, hur mycket jag än la på den.
                  </p>
                  <p className="max-w-[60ch]">
                    Orsaken satt i meshen själv: en genererad triangelmesh utan
                    kantslingor runt lederna. Ingen mängd handpåläggning hade löst
                    det. Så jag började om, byggde kroppen på en animationsfärdig
                    bas (MPFB2) och flyttade statyns form över på den. Det kändes
                    som att kasta bort allt jag gjort. Det var rätt beslut.
                  </p>
                </div>
              </div>

              <p className="mt-16 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary md:mt-20">
                Det här är fel jag såg med egna ögon i bilderna, vad de berodde
                på och vad jag gjorde åt dem.
              </p>
              <div className="mt-8">
                <FaultTable rows={felen} />
              </div>

              <figure className="mt-24 md:mt-32">
                <img
                  src="/formad/punktmoln.webp"
                  alt="Sex diagram där statyns fot, hand och huvud är punktmoln och lederna röda prickar"
                  width={1470}
                  height={980}
                  loading="lazy"
                  className="block h-auto w-full"
                />
                <figcaption className="mt-4 font-sans text-sm text-text-muted">
                  Så här såg det ut mest hela tiden: punktmoln och ledmarkörer, inte marmor.
                </figcaption>
              </figure>

              <p className="mt-24 font-serif text-[clamp(18px,2.2vw,28px)] text-accent-gold md:mt-32">
                176 601 trianglar · 23 muskler · 172 övningar · 344 klipp · ~2 min per klipp i renderkön · 19 MB totalt
              </p>
            </div>
          </div>
        </section>
        {/* 5. Statyn i 3D */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[560px] text-center">
            <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
              DRA RUNT HONOM
            </p>
            <div className="mt-10">
              <HerculesViewer still="/formad/herkules-still.webp" model="/formad/3d/herkules.glb" />
            </div>
            <p className="mt-6 font-sans text-sm text-text-muted">
              Statyn som allt började med. Hans form lever kvar i kroppen som visar varje övning.
            </p>
          </div>
        </section>
        {/* 6. Övningarna */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
              ÖVNINGARNA
            </p>
            <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
              Varje övning är ett klipp ur samma kropp.
            </h2>
            <div className="mt-12 grid gap-8 font-sans text-lg leading-relaxed text-text-secondary md:grid-cols-2 md:gap-16">
              <p className="max-w-[60ch]">
                Övningsklippen renderas ur riggen här ovanför, så kroppen som visar
                marklyftet är samma kropp som lyser i heatmapen. Jag skrev omkring
                40 rörelseklasser med parametrar för grepp, redskap, bänkvinkel och
                en eller två armar. De täcker 172 övningar.
              </p>
              <p className="max-w-[60ch]">
                Tre renderare körde parallellt, ungefär två minuter per klipp, och
                jag granskade varje omgång mot kontaktark innan den gick in i appen.
                Passet loggas set för set med RPE, dropset och set till failure.
                Superset körs övning efter övning utan vila, och vilan kommer efter
                varvet.
              </p>
            </div>

            <div className="mt-16 md:mt-20">
              <ClipGrid clips={klippen} />
            </div>

            <div className="mt-24 flex flex-wrap justify-center gap-6 sm:gap-8 md:mt-32">
              <Phone
                src="/formad/tel-pass.webp"
                alt="Formad, passvyn med set och RPE"
                width={1080}
                height={2338}
              />
              <Phone
                src="/formad/tel-ovning.webp"
                alt="Formad, en övning med musklerna markerade"
                width={1080}
                height={2338}
              />
            </div>
          </div>
        </section>
        {/* 7. Mentorn */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
            <div>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                MENTORN
              </p>
              <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Mentorn var <em className="italic text-accent-gold">dålig</em> i början.
              </h2>
              <p className="mt-8 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
                Mentorn bygger på Anthropics modell och ser det appen ser: pass,
                sömn, mat, vikt och träning. Maten loggas med foto, streckkod eller
                sökning. De första versionerna var för pratiga, räknade fel på
                avlastningar och bytte program tre gånger i samma samtal. Jag hade
                inte velat betala för den.
              </p>
              <h3 className="mt-16 font-serif text-[clamp(28px,3.5vw,44px)] font-normal leading-[1.1] tracking-[-0.01em] text-text-primary">
                Hur jag tränade fram den.
              </h3>
              <div className="mt-6 space-y-6 font-sans text-lg leading-relaxed text-text-secondary">
                <p className="max-w-[60ch]">
                  Jag tränade den med AI-agenter som spelade användare. Varje agent
                  fick ett liv: skiftarbetare efter ett nattpass, ledig dag, mitt i
                  en viktnedgång, ny i gymmet, van lyftare. De tog samtalen med
                  mentorn, och en bedömare gick igenom varje svar: vad hjälpte, vad
                  irriterade, vad var fel.
                </p>
                <p className="max-w-[60ch]">
                  Bedömningarna blev regler i prompten. Färre uppslag i taget. Inga
                  frågor som lämnas hängande. Tider i timmar och minuter som i resten
                  av appen. Mentorn tänker längre innan den svarar och säger mindre.
                  Samtalen var simuleringar med AI-agenter, inte riktiga användare.
                  Sedan fick betatestarna ta över, och deras samtal rättade det som
                  simuleringarna missade.
                </p>
              </div>
            </div>

            <figure className="mx-auto flex flex-col items-center lg:mx-0">
              <Phone
                src="/formad/tel-mentor.webp"
                alt="Formad, Mentor-samtalet: en fråga om gårdagens marklyft och mentorns svar med vikt, RPE och nästa steg"
                width={1080}
                height={2338}
              />
              <figcaption className="mt-4 font-sans text-sm text-text-muted">
                Demosamtal med påhittad data.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 8. Klockan och kroppsdatan */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
              <div>
                <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                  KLOCKAN OCH KROPPSDATAN
                </p>
                <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                  På handleden, och in från Samsung Health.
                </h2>
              </div>
              <div className="space-y-6 font-sans text-lg leading-relaxed text-text-secondary lg:pt-12">
                <p className="max-w-[60ch]">
                  Jag ville slippa ta fram telefonen mellan momenten, så jag byggde
                  en egen Wear OS-app. Den gör det jag gör mest under en dag: bockar
                  av momenten, loggar vattnet, kör passet set för set med vilan som
                  en nedräkning på handleden, och loggar favoritmåltiderna med ett
                  tryck. En ruta ett svep från urtavlan, och en egen urtavla med Nu
                  och dagens båge. Det mesta av formspråket fick göras om när jag
                  såg det på den runda skärmen: det som funkade på telefonen klipptes
                  av cirkeln.
                </p>
                <p className="max-w-[60ch]">
                  Health Connect hämtar steg, sömn, aktiva kalorier och vikt från
                  vågen. Förbränningen räknas från vikttrenden mot det som loggats,
                  inte från en tabell, för tabellen stämde aldrig på mig.
                </p>
              </div>
            </div>

            <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4 md:gap-x-8">
              {klockan.map((sida) => (
                <li key={sida.src} className="flex flex-col items-center text-center">
                  <div
                    className="w-full max-w-[260px] overflow-hidden rounded-full border bg-bg-primary"
                    style={{
                      borderColor: `rgba(${GOLD},0.2)`,
                      boxShadow: `0 8px 40px rgba(${GOLD},0.12), 0 20px 60px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <img
                      src={sida.src}
                      alt={sida.alt}
                      width={sida.width}
                      height={sida.height}
                      loading="lazy"
                      className="block h-auto w-full"
                    />
                  </div>
                  <p className="mt-4 max-w-[26ch] font-sans text-sm leading-relaxed text-text-muted">
                    {sida.caption}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 9. Formen */}
        <section className="py-24 md:py-32">
          <div className="px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-[1280px]">
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                FORMEN
              </p>
              <h2 className="mt-6 max-w-[860px] font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Marmorn är inte <em className="italic text-accent-gold">pynt.</em>
              </h2>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <JourneyStrip steps={formen} label="3D-modellerna genom bygget, från statyn ur AI-verktyget till den förgyllda i appen" />
          </div>

          <div className="px-6 md:px-12 lg:px-20">
            <div className="mx-auto mt-16 grid max-w-[1280px] items-center gap-16 md:mt-20 lg:grid-cols-[1fr_auto] lg:gap-24">
              <div className="space-y-6 font-sans text-lg leading-relaxed text-text-secondary">
                <p className="max-w-[60ch]">
                  Allt i 3D i appen är mina egna modeller: statyn, veckans Herkules
                  med stenen, troféerna, årets staty som huggs fram nivå för nivå,
                  och tallriken på Mat-sidan. Remsan ovanför är de modellerna i den
                  ordning de kom till. Statyn i marmor är användarens egen vecka och
                  förändras med den. Typografin och färgerna är lånade ur samma
                  värld. Rubrikerna med grekisk prägel är satta i Cinzel, resten i
                  EB Garamond och Hanken Grotesk.
                </p>
                <p className="max-w-[60ch]">
                  Varje skärm är ritad för en tumme och den information som behövs
                  just där. Det som ser enkelt ut tog längst tid, och det mesta av
                  det gjorde jag om flera gånger.
                </p>
              </div>

              <div className="mx-auto lg:mx-0">
                <Phone
                  src="/formad/tel-mat.webp"
                  alt="Formad, Mat-sidan med dagens kalorier i en marmorbåge, makrona och knappar för att söka och skanna"
                  width={1080}
                  height={2338}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 10. Under huven */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[1fr_2fr] lg:gap-24">
            <div>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                UNDER HUVEN
              </p>
              <h2 className="mt-6 font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
En person, hela kedjan.
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
              Jag byggde Formad för att jag behövde den. Infrakust är jag, och det
              är så här jag bygger åt andra också: från ett riktigt problem, hela
              vägen till en app folk har i fickan.
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
