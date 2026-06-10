const ITEMS = [
  'Webbutveckling',
  'App-utveckling',
  'SEO & AI-synlighet',
  'Digital infrastruktur',
  'Design',
];

function MarqueeRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={`whitespace-nowrap font-serif italic text-[clamp(28px,4.5vw,56px)] leading-none ${
              i % 2 === 0 ? 'text-text-primary/90' : 'text-stroke-gold'
            }`}
          >
            {item}
          </span>
          <span className="mx-8 text-[clamp(14px,1.5vw,20px)] text-accent-gold md:mx-12">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Marquee — oändligt rullande band med tjänsteord.
 * Två identiska rader i ett w-max-spår som translateX:as -50% (sömlös loop).
 * Pausar vid hover; stannar helt vid prefers-reduced-motion (CSS).
 */
export function Marquee() {
  return (
    <section className="marquee-section overflow-hidden border-y border-text-muted/10 bg-bg-primary py-10 md:py-14">
      <div className="marquee-track flex w-max">
        <MarqueeRow />
        <MarqueeRow ariaHidden />
      </div>
    </section>
  );
}
