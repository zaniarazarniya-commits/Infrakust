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
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

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

  const enter = (delay: number) => ({
    initial: reducedMotion ? false : ({ opacity: 0, y: 40 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_SMOOTH },
  });

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
        <motion.p
          {...enter(0.9)}
          className="mt-6 font-sans text-[clamp(18px,2.5vw,28px)] font-normal leading-relaxed text-text-secondary"
        >
          Digital byrå från Lysekil.
        </motion.p>

        {/* Roterande ord */}
        <motion.p
          {...enter(1.1)}
          className="mt-3 font-sans text-base text-text-muted"
        >
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
        </motion.p>

        {/* CTA */}
        <motion.a
          {...enter(1.3)}
          href="#projekt"
          className="gold-underline mt-10 font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
        >
          Se våra projekt →
        </motion.a>
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
