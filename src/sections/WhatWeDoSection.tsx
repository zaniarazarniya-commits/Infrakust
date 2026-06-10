import { ScrollReveal } from '@/components/ScrollReveal';

export function WhatWeDoSection() {
  return (
    <section className="px-6 py-[120px] md:px-12 md:py-[160px] lg:px-20">
      <div className="mx-auto max-w-[1280px]">
        <ScrollReveal delay={0}>
          <p className="mb-8 font-sans text-xs uppercase tracking-section text-accent-gold">
            VAD VI GÖR
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal delay={0.15}>
            <p className="font-serif text-[clamp(24px,4vw,48px)] font-normal leading-[1.3] text-text-primary">
              Vi bygger hemsidor och appar för företag som vill växa.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="font-serif text-[clamp(24px,4vw,48px)] font-normal leading-[1.3] text-text-secondary">
              <span className="italic text-accent-gold">SEO</span>, digital{' '}
              <span className="italic text-accent-gold">infrastruktur</span> och kompletta system
              — från idé till drift.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
