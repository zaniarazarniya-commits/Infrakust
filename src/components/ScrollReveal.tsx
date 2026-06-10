interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

/**
 * ScrollReveal — medvetet avanimerad.
 * Scroll-triggade entrance-animationer togs bort (kändes generiskt/AI).
 * Innehållet renderas statiskt; rörelse ligger i interaktioner istället
 * (cursor, rail-drag, hovers, herons laddsekvens).
 * Props behålls för bakåtkompatibilitet med alla anropsplatser.
 */
export function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}
