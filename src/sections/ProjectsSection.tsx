import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProjectModal } from '@/components/ProjectModal';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface Project {
  id: number;
  image: string;
  extraImages?: string[];
  name: string;
  description: string;
  tags: string;
  url?: string;
}

const projects: Project[] = [
  {
    id: 1,
    image: '/images/project-zentai.png',
    name: 'ZentAi',
    description: 'Externt teknikteam i Lysekil. Hemsidor, Notion-verksamhetssystem och AI-agenter — byggda och förvaltade som en helhet.',
    tags: 'HTML · CSS · JS · SEO · Lysekil',
    url: 'https://www.zentai.se',
  },
  {
    id: 2,
    image: '/images/project-lionpaw.png',
    name: 'Lionpaw',
    description: 'Premium herbal wellness-varumärke med produktportfölj, ingrediensutforskare och varumärkesstory. Byggd med React, Vite och Tailwind CSS.',
    tags: 'React · Vite · Tailwind · shadcn/ui',
    url: 'https://www.lionpaw.se',
  },
  {
    id: 4,
    image: '/images/project-infrakust-1.jpg',
    name: 'Infrakust Projekt 1',
    description: 'Skräddarsydd webblösning hostad på infrakust.se.',
    tags: 'Webb · React · Custom',
    url: 'https://example.infrakust.se',
  },
  {
    id: 5,
    image: '/images/project-infrakust-2.jpg',
    name: 'Infrakust Projekt 2',
    description: 'Anpassad digital lösning med modern teknisk stack.',
    tags: 'Webb · App · Integration',
    url: 'https://example1.infrakust.se',
  },
  {
    id: 6,
    image: '/images/project-infrakust-3.jpg',
    name: 'Infrakust Projekt 3',
    description: 'Komplett digital produkt från idé till driftsatt lösning.',
    tags: 'Fullstack · React · API',
    url: 'https://example2.infrakust.se',
  },
];

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] as const,
      }}
      className="group w-[85vw] flex-shrink-0 md:w-[80vw] lg:w-[70vw]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Overlay */}
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer"
        onClick={() => onOpen(project)}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {/* Base Image with zoom */}
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
            draggable={false}
          />

          {/* Hover Overlay - "Wakes to life" */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/60 backdrop-blur-sm"
              >
                {/* Gold accent line top */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-0 left-0 right-0 h-[2px] bg-accent-gold origin-left"
                />

                {/* Open button */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-gold text-accent-gold">
                    <Eye size={28} />
                  </div>
                  <span className="font-sans text-sm uppercase tracking-nav text-accent-gold">
                    Klicka för att öppna
                  </span>
                </motion.div>

                {/* Project info peek */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <p className="font-sans text-xs uppercase tracking-tag text-accent-gold">
                    {project.tags}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Info */}
      <div className="mt-5">
        <h3 className="font-serif text-[clamp(24px,3vw,40px)] font-normal leading-[1.1] tracking-[-0.01em] text-text-primary transition-transform duration-300 group-hover:translate-x-1">
          {project.name}
        </h3>
        <p className="mt-2 max-w-[480px] font-sans text-sm leading-relaxed text-text-secondary">
          {project.description}
        </p>
        <p className="mt-3 font-sans text-xs uppercase tracking-tag text-text-muted">
          {project.tags}
        </p>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    // Delay clearing project to allow exit animation
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onScroll();
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, onScroll]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <>
      <section id="projekt" className="bg-bg-secondary py-[80px] md:py-[120px]">
        {/* Header */}
        <div className="mx-auto mb-12 flex max-w-[1280px] items-end justify-between px-6 md:px-12 lg:px-20">
          <div>
            <ScrollReveal>
              <p className="mb-4 font-sans text-xs uppercase tracking-section text-accent-gold">
                BLÄDDRA I VÅRA PROJEKT
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <h2 className="font-serif text-[clamp(32px,5vw,72px)] font-normal leading-[1.05] tracking-[-0.02em] text-text-primary">
                Hemsidor som <em className="italic">konverterar</em>
              </h2>
            </ScrollReveal>
          </div>

          {/* Arrow Controls */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-text-muted/30 text-text-secondary transition-all hover:border-accent-gold hover:text-accent-gold disabled:opacity-30 disabled:hover:border-text-muted/30 disabled:hover:text-text-secondary"
              aria-label="Previous project"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-text-muted/30 text-text-secondary transition-all hover:border-accent-gold hover:text-accent-gold disabled:opacity-30 disabled:hover:border-text-muted/30 disabled:hover:text-text-secondary"
              aria-label="Next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden px-6 md:px-12 lg:px-20" ref={emblaRef}>
          <div className="flex gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={openModal}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-10 max-w-[1280px] px-6 md:px-12 lg:px-20">
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-text-muted/10">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-accent-gold"
              style={{ width: `${(1 / projects.length) * 100}%` }}
              animate={{
                x: `${scrollProgress * (projects.length - 1) * 100}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            />
          </div>

          {/* Dot indicators */}
          <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-6 bg-accent-gold'
                    : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
