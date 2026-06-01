import { ScrollReveal } from '@/components/ScrollReveal';
import { ContactForm } from '@/components/ContactForm';
import { site } from '@/lib/site';

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
            Skicka ett meddelande, så tar vi en kaffe — digitalt eller i Lysekil.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.45}>
          <ContactForm />
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <div className="mt-12 flex flex-col items-center gap-4">
            {site.bookingUrl && (
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm uppercase tracking-section text-text-secondary transition-colors hover:text-accent-gold"
              >
                Boka 20 min →
              </a>
            )}
            <p className="font-sans text-sm text-text-muted">
              Eller maila direkt:{' '}
              <a
                href={`mailto:${site.email}`}
                className="gold-underline-center font-serif text-base text-accent-gold transition-colors hover:text-accent-gold-hover"
              >
                {site.email}
              </a>
            </p>
            {site.phone && (
              <p className="font-sans text-sm text-text-muted">
                Ring:{' '}
                <a href={`tel:${site.phone}`} className="text-accent-gold">
                  {site.phone}
                </a>
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
