import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * ScrollReveal — maskerad linje-reveal (editorial stil).
 * 'up'/'down': innehållet glider ur en osynlig overflow-mask, ingen opacity-fade.
 * Masken släpps när animationen är klar så hovers/underlines inte klipps.
 * 'left'/'right': mjuk x-glidning med fade (för bildblock).
 */
export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 1,
  className = '',
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [done, setDone] = useState(false);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (direction === 'up' || direction === 'down') {
    const from = direction === 'up' ? '110%' : '-110%';
    return (
      <div
        ref={ref}
        className={`${done ? '' : 'overflow-hidden'} ${className}`}
      >
        <motion.div
          initial={{ y: from }}
          animate={inView ? { y: '0%' } : undefined}
          transition={{ duration, delay, ease: EASE_OUT_EXPO }}
          onAnimationComplete={() => setDone(true)}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  const fromX = direction === 'left' ? 48 : -48;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromX }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
