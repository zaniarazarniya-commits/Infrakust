import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Ringens omkrets i viewBox-enheter (r = 46), för att rita den med stroke-dash.
const RADIE = 46;

/**
 * Rutan i startsidans hero som leder till Formad-caset: appens emblem (Herkules med
 * lagerkransen) i en tunn guldring som ritar upp sig själv när titeln landat, och
 * namnet bredvid. På stora skärmar ligger den i heroens nedre vänstra hörn, under lg
 * i flödet under knappen. Vid reduced motion står allt still från början.
 */
export function NewProjectBadge({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const fadeIn = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 1.7, ease: EASE_OUT_EXPO },
      };

  return (
    <motion.div {...fadeIn} className={className}>
      <Link
        to="/case/formad"
        className="group flex items-center gap-5 text-left"
        aria-label="Nytt projekt: Formad. Läs om projektet"
      >
        <span className="relative block h-[88px] w-[88px] flex-shrink-0">
          <span className="absolute inset-[6px] overflow-hidden rounded-full bg-black">
            <img
              src="/formad/lagerkrans.webp"
              alt=""
              width={320}
              height={320}
              className="h-full w-full scale-[1.18] object-cover transition-transform duration-700 ease-out [object-position:55%_38%] group-hover:scale-[1.28]"
            />
          </span>
          <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={RADIE} fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="1" />
            <motion.circle
              cx="50"
              cy="50"
              r={RADIE}
              fill="none"
              stroke="#C9A96E"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={reducedMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 2.0, ease: EASE_OUT_EXPO }}
              className="opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            />
            {/* En kort ljus båge som vandrar runt ringen när den ritats klart, som kransen i appen. */}
            {!reducedMotion && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 3.4 }}
              >
                <g className="origin-center animate-[spin_14s_linear_infinite] [transform-box:fill-box]">
                  <circle
                    cx="50"
                    cy="50"
                    r={RADIE}
                    fill="none"
                    stroke="#E8CF9A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="10 90"
                  />
                </g>
              </motion.g>
            )}
          </svg>
        </span>

        <span className="block">
          <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-section text-accent-gold">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              {!reducedMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-gold opacity-60" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-gold" />
            </span>
            Nytt projekt
          </span>
          <span className="mt-1 block font-serif text-[28px] leading-none tracking-[-0.01em] text-text-primary">
            Formad
          </span>
          <span className="mt-2 block max-w-[30ch] font-sans text-sm leading-snug text-text-muted">
            En app för vanor, träning och mat, med en coach som läser allt man loggar.
          </span>
          <span className="mt-2 inline-flex items-center gap-1.5 font-sans text-sm text-accent-gold">
            <span className="gold-underline">Läs om projektet</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
