import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

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
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          handleClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // If in fullscreen, exit first
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIframeLoaded(false);
    }, 300);
  }, [onClose]);

  const toggleFullscreen = useCallback(() => {
    const el = document.getElementById('iframe-container');
    if (!el) return;
    
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

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
                  onClick={toggleFullscreen}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-muted/10 hover:text-accent-gold"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-muted/10 hover:text-accent-gold"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Iframe Container */}
            <div id="iframe-container" className="relative flex-1 bg-bg-primary">
              {/* Loading State */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-text-muted/20 border-t-accent-gold" />
                  <p className="font-sans text-sm text-text-secondary">Laddar förhandsvisning...</p>
                </div>
              )}

              {hasUrl ? (
                <iframe
                  src={project.url}
                  title={project.name}
                  className={`h-full w-full border-0 transition-opacity duration-500 ${
                    iframeLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setIframeLoaded(true)}
                  allow="fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="mb-6 max-h-[60%] max-w-[80%] rounded-lg object-contain shadow-xl"
                  />
                  <p className="font-serif text-2xl text-text-primary">{project.name}</p>
                  <p className="mt-2 max-w-md text-center font-sans text-sm text-text-secondary">
                    {project.description}
                  </p>
                  <p className="mt-4 font-sans text-xs uppercase tracking-tag text-accent-gold-muted">
                    Live-preview kommer snart
                  </p>
                </div>
              )}
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
