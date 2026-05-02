import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.25,
        delayChildren: reducedMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 md:px-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center"
      >
        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-[clamp(48px,14vw,160px)] font-normal leading-[0.95] tracking-[-0.03em] text-text-primary"
        >
          Infrakust
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-6 font-sans text-[clamp(18px,2.5vw,28px)] font-normal leading-relaxed text-text-secondary"
        >
          Digital byrå från Lysekil.
        </motion.p>

        {/* Sub-tagline */}
        <motion.p
          variants={itemVariants}
          className="mt-3 font-sans text-base text-text-muted"
        >
          Hemsidor som konverterar. SEO för Google & AI.
        </motion.p>

        {/* CTA */}
        <motion.a
          variants={itemVariants}
          href="#projekt"
          className="gold-underline mt-10 font-sans text-lg text-accent-gold transition-colors hover:text-accent-gold-hover"
        >
          Se våra projekt →
        </motion.a>
      </motion.div>

      {/* Scroll Indicator */}
      {!reducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <div className="h-10 w-[1px] bg-accent-gold animate-float" />
          <ChevronDown className="h-4 w-4 text-accent-gold" />
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
