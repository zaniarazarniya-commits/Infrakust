import { useRef } from 'react';

type Step = { src: string; alt: string; caption: string; width: number; height: number };

/**
 * JourneyStrip
 * --------------------------------------------------------------
 * Horisontell remsa med bilder i ordning och en rad under varje.
 * En tunn guldlinje under bilderna binder ihop stegen. Mus-drag
 * enligt mönstret i ProjectsRailSection; touch scrollar nativt.
 */
export function JourneyStrip({ steps }: { steps: Step[] }) {
  const railRef = useRef<HTMLOListElement>(null);

  // ---------- Pointer-drag (mus) med klickskydd ----------
  const dragState = useRef({
    down: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const rail = railRef.current;
    if (!rail) return;
    dragState.current = {
      down: true,
      startX: e.clientX,
      scrollLeft: rail.scrollLeft,
      moved: false,
    };
    // Snäpp och mjuk scroll bråkar med scrollLeft under draget.
    rail.style.scrollBehavior = 'auto';
    rail.style.scrollSnapType = 'none';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const state = dragState.current;
    const rail = railRef.current;
    if (!state.down || !rail) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 5) state.moved = true;
    rail.scrollLeft = state.scrollLeft - dx;
  };

  const endDrag = () => {
    const rail = railRef.current;
    if (!dragState.current.down) return;
    dragState.current.down = false;
    if (rail) {
      rail.style.scrollBehavior = '';
      rail.style.scrollSnapType = '';
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <ol
      ref={railRef}
      tabIndex={0}
      aria-label="Resan från marmorblock till marklyft"
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      className="flex gap-10 snap-x snap-mandatory overflow-x-auto overflow-y-hidden px-6 pb-4 scroll-pl-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-gold/60 motion-safe:scroll-smooth md:px-12 md:scroll-pl-12 lg:px-[max(5rem,calc((100%-1280px)/2))] lg:scroll-pl-[max(5rem,calc((100%-1280px)/2))] [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >
      {steps.map((step, i) => (
        <li key={step.src} className="w-[min(640px,80vw)] flex-shrink-0 snap-start">
          <figure>
            <div className="flex h-[340px] items-center justify-center bg-bg-tertiary sm:h-[420px] md:h-[480px]">
              <img
                src={step.src}
                alt={step.alt}
                width={step.width}
                height={step.height}
                loading="lazy"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="h-full w-full object-contain"
              />
            </div>
            {/* Guldlinjen: sträcker sig över mellanrummet till nästa steg. */}
            <div
              aria-hidden="true"
              className={`mt-5 h-px bg-accent-gold/40 ${i < steps.length - 1 ? 'w-[calc(100%+2.5rem)]' : 'w-full'}`}
            />
            <figcaption className="mt-4 max-w-[52ch] pr-6 font-sans text-sm text-text-muted">
              {step.caption}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
