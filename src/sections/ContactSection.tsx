import { ScrollReveal } from '@/components/ScrollReveal';

export function ContactSection() {
  return (
    <section id="kontakt" className="px-6 py-[120px] md:px-12 md:py-[160px] lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center text-center">
        <ScrollReveal>
          <p className="mb-6 font-sans text-xs uppercase tracking-section text-accent-gold">
            KONTAKT
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h2 className="max-w-[700px] font-serif text-[clamp(32px,5vw,64px)] font-normal leading-[1.1] text-text-primary">
            Låt oss bygga något tillsammans
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-6 font-sans text-base text-text-secondary">
            Skicka ett mail, så tar vi en kaffe — digitalt eller i Lysekil.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.45}>
          <a
            href="mailto:hello@infrakust.se"
            className="gold-underline-center mt-8 font-serif text-[clamp(20px,2.5vw,28px)] text-accent-gold transition-colors hover:text-accent-gold-hover"
          >
            hello@infrakust.se
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
