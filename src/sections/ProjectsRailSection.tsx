import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

/**
 * ProjectsRailSection
 * --------------------------------------------------------------
 * Replaces ProjectsSection.tsx (embla version).
 *
 * Single horizontal rail of huge editorial-style website previews.
 * - Each card up to 1100px wide on desktop, 86vw on smaller screens
 * - Pointer drag to scroll (mouse, trackpad, touch)
 * - Arrow buttons + golden progress bar
 * - Click-suppression so dragging doesn't open the project URL
 * - Native CSS scroll-snap on a flex row (no embla dependency)
 */

type Project = {
  name: string;
  description: string;
  tags: string;
  image: string;
  url: string;
  eyebrow?: string;
};

const projects: Project[] = [
  {
    name: 'ZentAi',
    description:
      'Externt teknikteam i Lysekil. Hemsidor, Notion-verksamhetssystem och AI-agenter — byggda och förvaltade som en helhet.',
    tags: 'HTML · CSS · JS · SEO · Lysekil',
    image: '/images/project-zentai.png',
    url: 'https://www.zentai.se',
    eyebrow: 'WEBB · 2025',
  },
  {
    name: 'Lionpaw',
    description:
      'Premium herbal wellness-varumärke med produktportfölj, ingrediensutforskare och varumärkesstory.',
    tags: 'React · Vite · Tailwind · shadcn/ui',
    image: '/images/project-lionpaw.png',
    url: 'https://www.lionpaw.se',
    eyebrow: 'WEBB · 2025',
  },
  // Add more projects here as the portfolio grows.
  // Each card stretches the rail naturally — no layout work needed.
];

const DRAG_THRESHOLD = 6;

export function ProjectsRailSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visibleFraction, setVisibleFraction] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // ---------- Progress / arrow state ----------
  const updateRail = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const ratio = max > 0 ? rail.scrollLeft / max : 0;
    const frac = Math.min(1, rail.clientWidth / rail.scrollWidth);
    setProgress(ratio);
    setVisibleFraction(frac);
    setCanPrev(rail.scrollLeft > 4);
    setCanNext(rail.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateRail();
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    return () => {
      rail.removeEventListener('scroll', updateRail);
      window.removeEventListener('resize', updateRail);
    };
  }, [updateRail]);

  const step = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>('[data-project-card]');
    if (!card) return;
    const distance = card.getBoundingClientRect().width + 56; // gap-14
    rail.scrollBy({ left: dir * distance, behavior: 'smooth' });
  };

  // ---------- Pointer drag ----------
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragState.current = {
      isDown: true,
      startX: e.clientX,
      startScroll: rail.scrollLeft,
      moved: false,
    };
    rail.style.scrollBehavior = 'auto';
    rail.style.scrollSnapType = 'none';
    rail.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragState.current.isDown) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
      rail.classList.add('is-dragging');
    }
    rail.scrollLeft = dragState.current.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragState.current.isDown) return;
    dragState.current.isDown = false;
    rail.classList.remove('is-dragging');
    rail.style.scrollBehavior = '';
    requestAnimationFrame(() => {
      if (rail) rail.style.scrollSnapType = '';
    });
    try {
      rail.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  // Suppress click after drag (prevents drag-then-release from opening links)
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <section id="projekt" className="bg-bg-secondary py-[120px] md:py-[140px]">
      {/* Header */}
      <div className="mx-auto mb-14 flex max-w-[1400px] items-end justify-between gap-8 px-6 md:px-12 lg:px-20">
        <div>
          <ScrollReveal>
            <p className="mb-4 font-sans text-xs uppercase tracking-section text-accent-gold">
              UTVALDA PROJEKT
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="font-serif text-[clamp(36px,5vw,72px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
              Hemsidor som <em className="italic">konverterar</em>
            </h2>
          </ScrollReveal>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => step(-1)}
            disabled={!canPrev}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-text-muted/20 text-text-primary transition-all hover:border-accent-gold hover:bg-accent-gold hover:text-bg-primary disabled:cursor-default disabled:opacity-30 disabled:hover:border-text-muted/20 disabled:hover:bg-transparent disabled:hover:text-text-primary"
            aria-label="Föregående projekt"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => step(1)}
            disabled={!canNext}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-text-muted/20 text-text-primary transition-all hover:border-accent-gold hover:bg-accent-gold hover:text-bg-primary disabled:cursor-default disabled:opacity-30 disabled:hover:border-text-muted/20 disabled:hover:bg-transparent disabled:hover:text-text-primary"
            aria-label="Nästa projekt"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="projects-rail flex cursor-grab snap-x snap-mandatory gap-14 overflow-x-auto overflow-y-hidden px-6 pb-6 md:px-12 lg:px-20"
        style={{ scrollbarWidth: 'none' }}
      >
        {projects.map((project, i) => (
          <a
            key={project.name}
            data-project-card
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[min(1100px,86vw)] flex-shrink-0 snap-start flex-col"
            onDragStart={(e) => e.preventDefault()}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="relative aspect-[16/10] w-full overflow-hidden bg-bg-tertiary shadow-[0_50px_120px_rgba(0,0,0,0.55)]"
            >
              <img
                src={project.image}
                alt={project.name}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </motion.div>

            <div className="mt-9 grid gap-4 md:grid-cols-2 md:items-end md:gap-14">
              <div>
                {project.eyebrow && (
                  <p className="mb-2 font-sans text-xs uppercase tracking-tag text-text-muted">
                    {project.eyebrow}
                  </p>
                )}
                <h3 className="font-serif text-[clamp(40px,5vw,72px)] font-normal leading-[1.02] tracking-[-0.02em] text-text-primary transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-accent-gold">
                  {project.name}
                </h3>
              </div>
              <div>
                <p className="max-w-[560px] font-sans text-base leading-relaxed text-text-secondary">
                  {project.description}
                </p>
                <p className="mt-4 font-sans text-xs uppercase tracking-tag text-text-muted">
                  {project.tags}
                </p>
                <span className="mt-4 inline-block font-sans text-sm text-accent-gold">
                  Besök webbplats{' '}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Progress */}
      <div className="mx-auto mt-8 max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="relative h-[2px] w-full overflow-hidden bg-text-muted/10">
          <div
            className="absolute inset-y-0 left-0 bg-accent-gold transition-[width,transform] duration-200 ease-out"
            style={{
              width: `${visibleFraction * 100}%`,
              transform: `translateX(${
                progress * (100 / Math.max(visibleFraction, 0.0001) - 100)
              }%)`,
            }}
          />
        </div>
      </div>

      {/* Local style: hide scrollbar + dragging cursor.
          Add to src/App.css or a global stylesheet if you prefer not to inline. */}
      <style>{`
        .projects-rail::-webkit-scrollbar { display: none; }
        .projects-rail.is-dragging { cursor: grabbing; user-select: none; }
        .projects-rail.is-dragging a { pointer-events: none; }
      `}</style>
    </section>
  );
}
