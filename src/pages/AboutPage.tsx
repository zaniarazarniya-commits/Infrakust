import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO
        title="Om oss — Infrakust"
        description="Infrakust drivs av en person med lång erfarenhet av både IT och hotellbranschen. Vi förstår verksamheten bakom varje beställning — inte bara koden."
        canonical="https://www.infrakust.se/om-oss"
      />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="px-6 pb-24 pt-[160px] md:px-12 md:pb-32 md:pt-[200px] lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                OM OSS
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h1 className="mt-6 max-w-[860px] font-serif text-[clamp(48px,6vw,88px)] font-normal leading-[1.02] tracking-[-0.025em] text-text-primary">
                Teknik och hotell.{' '}
                <em className="italic">Inifrån.</em>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <p className="mt-8 max-w-[600px] font-sans text-lg leading-relaxed text-text-secondary">
                Infrakust drivs av en person med lång erfarenhet av både IT och
                hotellbranschen. Det ger oss en ovanlig förmåga att förstå
                verksamheten bakom varje beställning — inte bara koden.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Philosophy */}
        <section className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[1fr_2fr] lg:gap-24">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                FILOSOFI
              </p>
            </ScrollReveal>
            <div className="space-y-6">
              <ScrollReveal delay={0.1}>
                <p className="max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
                  Vi tror att det bästa digitala arbetet sker när teknikern förstår
                  problemet inifrån — inte bara på papper. Varje projekt börjar
                  med att förstå hur verksamheten faktiskt fungerar.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="max-w-[60ch] font-sans text-lg leading-relaxed text-text-secondary">
                  Vår princip är enkel: <span className="text-text-primary">less is more.</span>{' '}
                  Rätt lösning är sällan den mest komplexa — det är den som
                  personalen faktiskt använder och som håller över tid.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* What we value */}
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                VAD VI PRIORITERAR
              </p>
            </ScrollReveal>
            <ol className="mt-14 divide-y divide-text-muted/10">
              {[
                { n: '01', title: 'Förståelse först', desc: 'Vi förstår din verksamhet innan vi skriver en rad kod.' },
                { n: '02', title: 'Långsiktighet', desc: 'Vi bygger system som håller — inte lösningar som kräver konstant underhåll.' },
                { n: '03', title: 'Ärlighet', desc: 'Om ett projekt inte passar oss säger vi det. Vi tar bara uppdrag vi kan leverera med hög kvalitet.' },
                { n: '04', title: 'Enkelhet', desc: 'Rätt lösning är nästan alltid enklare än man tror.' },
              ].map(({ n, title, desc }) => (
                <ScrollReveal key={n} delay={0.06 * parseInt(n)}>
                  <li className="group flex items-start gap-8 py-6 transition-all duration-300 hover:bg-text-muted/[0.03] md:px-4">
                    <span className="w-10 flex-shrink-0 font-serif text-2xl text-accent-gold/50 transition-colors duration-300 group-hover:text-accent-gold">
                      {n}
                    </span>
                    <div>
                      <p className="font-sans text-base font-medium text-text-primary">{title}</p>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-text-secondary">{desc}</p>
                    </div>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section id="kontakt" className="bg-bg-secondary px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
                KONTAKT
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <h2 className="mt-6 max-w-[700px] font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.1] text-text-primary">
                Låt oss bygga något tillsammans
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.22}>
              <p className="mt-6 max-w-[480px] font-sans text-base leading-relaxed text-text-secondary">
                Har du ett projekt i tankarna? Hör av dig så pratar vi om vad
                som är möjligt.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
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
