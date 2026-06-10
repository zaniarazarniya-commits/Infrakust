import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Magnetiskt element — dras mjukt mot pekaren, fjädrar tillbaka vid leave. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.2);
    y.set(dy * 0.35);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

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
            Skicka ett mail, så tar vi en kaffe — digitalt eller i Lysekil.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.45}>
          <Magnetic>
            <a
              href="mailto:hello@infrakust.se"
              className="gold-underline-center text-fill-sweep mt-8 inline-block font-serif text-[clamp(28px,4vw,48px)]"
            >
              hello@infrakust.se
            </a>
          </Magnetic>
        </ScrollReveal>
      </div>
    </section>
  );
}
