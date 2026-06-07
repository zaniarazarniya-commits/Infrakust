import { Link } from 'react-router';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';

const features = [
  { n: '01', title: 'Realtidssynk', desc: 'All data uppdateras direkt — ingen manuell synkronisering mellan enheter eller personal.' },
  { n: '02', title: 'Branschförståelse', desc: 'Vi känner hospitality-branschen inifrån och bygger system som faktiskt används i drift.' },
  { n: '03', title: 'Rollbaserad åtkomst', desc: 'Rätt information till rätt person — reception, städ och admin ser vad de behöver.' },
  { n: '04', title: 'Integration mot befintliga system', desc: 'Kopplingar mot bokningssystem, SMS-tjänster och externa API:er.' },
  { n: '05', title: 'Minskat pappersarbete', desc: 'Digitala flöden ersätter listor och manuell kommunikation som kostar tid varje dag.' },
];

const techStack = ['React', 'TypeScript', 'Next.js', 'Supabase', 'Express', 'Web Push', 'SSE', 'REST API'];

export default function AppdevPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO
        title="App-utveckling i Lysekil — System som används | Infrakust"
        description="Vi bygger skräddarsydda appar för hospitality och servicebranschen — realtidssystem, gästportaler och interna verktyg som faktiskt används. Digital byrå i Lysekil."
        canonical="https://www.infrakust.se/tjanster/apputveckling"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              name: 'App-utveckling',
              serviceType: 'App-utveckling',
              description:
                'Skräddarsydda appar för hospitality och servicebranschen — realtidssystem, gästportaler och interna verktyg som faktiskt används.',
              provider: { '@id': 'https://www.infrakust.se/#organization' },
              areaServed: { '@type': 'Country', name: 'Sverige' },
              url: 'https://www.infrakust.se/tjanster/apputveckling',
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://www.infrakust.se/' },
                { '@type': 'ListItem', position: 2, name: 'Tjänster', item: 'https://www.infrakust.se/#projekt' },
                { '@type': 'ListItem', position: 3, name: 'App-utveckling', item: 'https://www.infrakust.se/tjanster/apputveckling' },
              ],
            },
          ],
        }}
      />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="px-6 pb-24 pt-[160px] md:px-12 md:pb-32 md:pt-[200px] lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                APP-UTVECKLING
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h1 className="mt-6 max-w-[860px] font-serif text-[clamp(48px,6vw,88px)] font-normal leading-[1.02] tracking-[-0.025em] text-text-primary">
                Appar som{' '}
                <em className="italic text-accent-gold">används.</em>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <p className="mt-8 max-w-[600px] font-sans text-lg leading-relaxed text-text-secondary">
                Vi bygger skräddarsydda webbappar och interna system för
                hospitality och servicebranschen. Lösningar som sparar tid,
                minskar pappersarbete och skapar bättre ordning — varje dag.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <Link
                to="/case/grand-hotel"
                className="gold-underline mt-10 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                Se Grand Hotel-caset →
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Features */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                VAD VI LEVERERAR
              </p>
            </ScrollReveal>
            <ol className="mt-14 divide-y divide-text-muted/10">
              {features.map(({ n, title, desc }) => (
                <ScrollReveal key={n} delay={0.06 * parseInt(n)}>
                  <li className="group flex items-start gap-8 py-6 transition-all duration-300 hover:bg-text-muted/[0.03] md:px-4">
                    <span className="w-10 flex-shrink-0 font-serif text-2xl text-accent-gold/50 transition-colors duration-300 group-hover:text-accent-gold">
                      {n}
                    </span>
                    <div>
                      <p className="font-sans text-base font-medium text-text-primary">{title}</p>
                      <p className="mt-1 max-w-[55ch] font-sans text-sm leading-relaxed text-text-secondary">{desc}</p>
                    </div>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Case reference */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                I PRAKTIKEN
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h2 className="mt-6 max-w-[740px] font-serif text-[clamp(32px,4.5vw,64px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Två <span className="text-accent-gold">appar.</span>{' '}
                <em className="italic">Ett hotell.</em>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mt-6 max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
                För Grand Hotel Lysekil byggde vi ett ekosystem av två appar:
                en gästportal (Zuve) som tar gästen från SMS till incheckning,
                och ett housekeeping-system som synkar reception och städpersonal
                i realtid. Resultatet: mindre pappersarbete, tydligare
                kommunikation och bättre ordning varje dag.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.28}>
              <Link
                to="/case/grand-hotel"
                className="gold-underline mt-8 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                Läs hela caset →
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Tech stack */}
        <section className="bg-bg-secondary px-6 py-16 md:px-12 md:py-24 lg:px-20">
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

        {/* CTA */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center text-center">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                NÄSTA STEG
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h2 className="mt-6 max-w-[700px] font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.1] text-text-primary">
                Har du ett system som behöver byggas?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <a
                href="mailto:info@infrakust.se"
                className="gold-underline mt-8 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                info@infrakust.se
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
