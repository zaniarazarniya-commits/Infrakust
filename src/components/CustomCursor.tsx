import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CursorMode = 'default' | 'hover' | 'drag' | 'visit';

const LABELS: Partial<Record<CursorMode, string>> = {
  drag: 'Dra',
  visit: 'Besök ↗',
};

/**
 * CustomCursor — guldring + punkt som följer pekaren med spring-fysik.
 * Kontextlabels via data-cursor="drag" / data-cursor="visit" på element.
 * Endast enheter med fin pekare (mus/trackpad); respekterar reduced motion.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 35, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 35, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setFinePointer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const active = finePointer && !reducedMotion;

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as Element | null;
      const labelled = target?.closest?.('[data-cursor]');
      const dataMode = labelled?.getAttribute('data-cursor');
      if (dataMode === 'drag' || dataMode === 'visit') {
        setMode(dataMode);
      } else if (target?.closest?.('a, button, [role="button"]')) {
        setMode('hover');
      } else {
        setMode('default');
      }
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [active, x, y]);

  if (!active) return null;

  const label = LABELS[mode];
  const hasLabel = Boolean(label);
  const ringSize = hasLabel ? 84 : mode === 'hover' ? 52 : 34;

  return (
    <>
      {/* Punkt — följer pekaren exakt */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        animate={{ opacity: visible && !hasLabel ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gold" />
      </motion.div>

      {/* Ring / labelbubbla — släpar efter med spring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            backgroundColor: hasLabel
              ? 'rgba(201, 169, 110, 0.95)'
              : 'rgba(201, 169, 110, 0)',
            borderColor: hasLabel
              ? 'rgba(201, 169, 110, 0)'
              : 'rgba(201, 169, 110, 0.55)',
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
        >
          <AnimatePresence mode="wait">
            {hasLabel && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap font-sans text-xs font-medium uppercase tracking-tag text-bg-primary"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
