import { Link } from 'react-router';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO
        title="404 — Infrakust"
        description="Sidan hittades inte."
        canonical="https://www.infrakust.se/404"
      />
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-section text-accent-gold">
          404
        </p>
        <h1 className="mt-6 font-serif text-[clamp(48px,6vw,88px)] font-normal leading-[1.02] tracking-[-0.025em] text-text-primary">
          Sidan finns inte.
        </h1>
        <p className="mt-6 max-w-[400px] font-sans text-base leading-relaxed text-text-secondary">
          Den här adressen leder ingenstans. Gå tillbaka till startsidan.
        </p>
        <Link
          to="/"
          className="gold-underline mt-8 inline-block font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
        >
          ← Tillbaka till start
        </Link>
      </main>
      <Footer />
    </div>
  );
}
