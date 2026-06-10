import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChevronDown } from 'lucide-react';

const TITLE = 'Infrakust';

const ROTATING_WORDS = [
  'hemsidor som konverterar',
  'appar som används',
  'SEO för Google & AI',
  'infrastruktur som håller',
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Maskerad reveal vid sidladdning — innehållet glider ur en osynlig ficka. */
function MaskIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`${done ? '' : 'overflow-hidden'} ${className}`}>
      <motion.div
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
        onAnimationComplete={() => setDone(true)}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // --- Musföljande guldglow ---
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowXSpring = useSpring(glowX, { stiffness: 60, damping: 20 });
  const glowYSpring = useSpring(glowY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set(e.clientX - rect.left - 350);
    glowY.set(e.clientY - rect.top - 350);
  };

  // --- Scroll-exit: heron skalar ner och tonar ut ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  // --- Roterande ord ---
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      2600
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-12"
    >
      {/* Musföljande glow */}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          style={{ x: glowXSpring, y: glowYSpring }}
          className="pointer-events-none absolute left-0 top-0 h-[700px] w-[700px] rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.03) 35%, transparent 65%)',
            }}
          />
        </motion.div>
      )}

      <motion.div
        style={
          reducedMotion
            ? undefined
            : { opacity: contentOpacity, scale: contentScale, y: contentY }
        }
        className="flex flex-col items-center text-center"
      >
        {/* Huvudtitel — bokstavsreveal */}
        <h1
          aria-label={TITLE}
          className="font-serif text-[clamp(48px,14vw,160px)] font-normal leading-[0.95] tracking-[-0.03em] text-text-primary"
        >
          {TITLE.split('').map((char, i) => (
            <span
              key={i}
              aria-hidden
              className="inline-block overflow-hidden align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={reducedMotion ? false : { y: '115%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.25 + i * 0.05,
                  ease: EASE_OUT_EXPO,
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <MaskIn delay={0.85} className="mt-6">
          <p className="font-sans text-[clamp(18px,2.5vw,28px)] font-normal leading-relaxed text-text-secondary">
            Digital byrå från Lysekil.
          </p>
        </MaskIn>

        {/* Roterande ord */}
        <MaskIn delay={1.0} className="mt-3">
          <p className="font-sans text-base text-text-muted">
            Vi bygger{' '}
          <span className="relative inline-block text-left" style={{ minWidth: '15ch' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={
                  reducedMotion
                    ? false
                    : { y: 14, opacity: 0, filter: 'blur(6px)' }
                }
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={
                  reducedMotion
                    ? undefined
                    : { y: -14, opacity: 0, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                className="inline-block text-accent-gold"
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
            </span>
          </p>
        </MaskIn>

        {/* CTA */}
        <MaskIn delay={1.15} className="mt-10">
          <a
            href="#projekt"
            className="gold-underline font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
          >
            Se våra projekt →
          </a>
        </MaskIn>
      </motion.div>

      {/* Scroll Indicator */}
      {!reducedMotion && (
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute bottom-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="h-10 w-[1px] bg-accent-gold animate-float" />
            <ChevronDown className="h-4 w-4 text-accent-gold" />
          </motion.div>
        </motion.div>
      )}

      {/* Side Panel - Desktop only */}
      <motion.a
        href="#kontakt"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="fixed right-6 top-1/2 hidden -translate-y-1/2 md:block"
      >
        <span
          className="font-sans text-xs uppercase tracking-[0.1em] text-text-muted transition-colors hover:text-accent-gold"
          style={{ writingMode: 'vertical-rl' }}
        >
          Kontakta oss
        </span>
      </motion.a>
    </section>
  );
}
