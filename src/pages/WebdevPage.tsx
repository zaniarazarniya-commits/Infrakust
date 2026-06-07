import { Link } from 'react-router';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';

const features = [
  { n: '01', title: 'Responsiv design', desc: 'Ser bra ut och fungerar på alla enheter — från mobil till stor skärm.' },
  { n: '02', title: 'SEO-optimerad från start', desc: 'Teknisk SEO, schema markup och metadata inbyggda i grunden.' },
  { n: '03', title: 'Snabb laddningstid', desc: 'Optimerade bilder, statisk generering och minimal JavaScript.' },
  { n: '04', title: 'Konverteringsfokuserad', desc: 'Tydliga flöden och CTA:er som leder besökaren till handling.' },
  { n: '05', title: 'Enkel att underhålla', desc: 'Ren kodbas med tydlig struktur — lätt att bygga vidare på.' },
];

const techStack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Supabase'];

export default function WebdevPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO
        title="Webbutveckling i Lysekil — Hemsidor som konverterar | Infrakust"
        description="Vi bygger skräddarsydda hemsidor i Next.js och React som konverterar besökare till kunder. SEO-optimerade, snabba och långsiktiga. Digital byrå i Lysekil."
        canonical="https://www.infrakust.se/tjanster/webbutveckling"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              name: 'Webbutveckling',
              serviceType: 'Webbutveckling',
              description:
                'Skräddarsydda hemsidor i Next.js och React som konverterar besökare till kunder. SEO-optimerade, snabba och långsiktiga.',
              provider: { '@id': 'https://www.infrakust.se/#organization' },
              areaServed: { '@type': 'Country', name: 'Sverige' },
              url: 'https://www.infrakust.se/tjanster/webbutveckling',
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Hem', item: 'https://www.infrakust.se/' },
                { '@type': 'ListItem', position: 2, name: 'Tjänster', item: 'https://www.infrakust.se/#projekt' },
                { '@type': 'ListItem', position: 3, name: 'Webbutveckling', item: 'https://www.infrakust.se/tjanster/webbutveckling' },
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
                WEBBUTVECKLING
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h1 className="mt-6 max-w-[860px] font-serif text-[clamp(48px,6vw,88px)] font-normal leading-[1.02] tracking-[-0.025em] text-text-primary">
                Hemsidor som{' '}
                <em className="italic text-accent-gold">konverterar.</em>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <p className="mt-8 max-w-[600px] font-sans text-lg leading-relaxed text-text-secondary">
                Vi bygger skräddarsydda hemsidor med fokus på att omvandla
                besökare till kunder. Varje projekt börjar med förståelse för
                verksamheten — inte med en mall.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <Link
                to="/#kontakt"
                className="gold-underline mt-10 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                Kontakta oss →
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

        {/* Tech stack */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
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
                    className="border border-text-muted/15 bg-bg-secondary px-4 py-2 font-sans text-xs uppercase tracking-tag text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center text-center">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                NÄSTA STEG
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h2 className="mt-6 max-w-[700px] font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.1] text-text-primary">
                Redo att bygga något som faktiskt fungerar?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <a
                href="mailto:hello@infrakust.se"
                className="gold-underline mt-8 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                hello@infrakust.se
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
