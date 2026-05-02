import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  image: string;
  name: string;
  description: string;
  tags: string;
  url?: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  if (!project) return null;

  const hasUrl = project.url && project.url.trim() !== '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0.95 : 1, y: isClosing ? 20 : 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 flex h-[90vh] w-[95vw] flex-col overflow-hidden rounded-lg border border-text-muted/10 bg-bg-secondary shadow-2xl md:h-[85vh] md:w-[90vw] lg:w-[85vw]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-text-muted/10 px-4 py-3 md:px-6">
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-lg text-text-primary md:text-xl">
                  {project.name}
                </h3>
                <span className="hidden font-sans text-xs uppercase tracking-tag text-text-muted md:inline">
                  {project.tags}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUrl && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-muted/10 hover:text-accent-gold"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-muted/10 hover:text-accent-gold"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Preview Container */}
            <div className="relative flex-1 bg-bg-primary">
              <div className="flex h-full flex-col items-center justify-center gap-8 p-8 md:flex-row md:gap-12 md:p-12">
                {/* Screenshot */}
                <div className="w-full max-w-[600px] flex-shrink-0 md:w-[55%]">
                  <div className="overflow-hidden rounded-lg border border-text-muted/10 shadow-2xl">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-auto w-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Info + CTA */}
                <div className="flex w-full flex-col items-center text-center md:w-[45%] md:items-start md:text-left">
                  <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.01em] text-text-primary">
                    {project.name}
                  </h2>
                  <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-text-secondary md:text-base">
                    {project.description}
                  </p>
                  <p className="mt-3 font-sans text-xs uppercase tracking-tag text-text-muted">
                    {project.tags}
                  </p>

                  {hasUrl && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent-gold px-8 py-3 font-sans text-sm uppercase tracking-nav text-accent-gold transition-all duration-300 hover:bg-accent-gold hover:text-bg-primary"
                    >
                      <ExternalLink size={16} />
                      Besök webbplats
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="border-t border-text-muted/10 px-4 py-3 md:px-6">
              <p className="font-sans text-xs text-text-muted">
                {project.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
