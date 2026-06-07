import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const scrollY = useScrollPosition();
  const [menuOpen, setMenuOpen] = useState(false);
  const isScrolled =
    typeof window !== 'undefined' && scrollY > window.innerHeight * 0.5;

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const { pathname } = useLocation();

  const navLinks = [
    { label: 'Webbutveckling', to: '/tjanster/webbutveckling' },
    { label: 'App-utveckling', to: '/tjanster/apputveckling' },
    { label: 'Om oss', to: '/om-oss' },
    { label: 'Kontakt', to: pathname === '/' ? '#kontakt' : '/#kontakt' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-bg-primary/85 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] items-center justify-between px-6 md:px-12 lg:px-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-lg tracking-wide text-text-primary transition-colors hover:text-accent-gold"
          >
            Infrakust
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              link.to.startsWith('#') || link.to.startsWith('/#') ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="group relative font-sans text-sm font-medium uppercase tracking-nav text-text-secondary transition-colors hover:text-accent-gold"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-accent-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`group relative font-sans text-sm font-medium uppercase tracking-nav transition-colors hover:text-accent-gold ${
                    pathname === link.to ? 'text-accent-gold' : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-accent-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center text-text-secondary transition-colors hover:text-accent-gold md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg-primary"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) =>
                link.to.startsWith('#') || link.to.startsWith('/#') ? (
                  <motion.a
                    key={link.label}
                    href={link.to}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="font-serif text-4xl text-text-primary transition-colors hover:text-accent-gold"
                  >
                    {link.label}
                  </motion.a>
                ) : (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-4xl text-text-primary transition-colors hover:text-accent-gold"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
