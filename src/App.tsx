import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import Lenis from 'lenis';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { WhatWeDoSection } from '@/sections/WhatWeDoSection';
import { AppTeaserSection } from '@/sections/AppTeaserSection';
import { ProjectsRailSection } from '@/sections/ProjectsRailSection';
import { ContactSection } from '@/sections/ContactSection';
import CaseGrandHotel from '@/pages/CaseGrandHotel';
import AboutPage from '@/pages/AboutPage';
import WebdevPage from '@/pages/WebdevPage';
import AppdevPage from '@/pages/AppdevPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { SEO } from '@/components/SEO';

/**
 * App.tsx — updated with routing.
 *
 * Routes:
 *   /                  → home (Hero, WhatWeDo, AppTeaser, ProjectsRail, Contact)
 *   /case/grand-hotel  → CaseGrandHotel
 *
 * react-router is already in package.json — no new dependencies.
 */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO
        title="Infrakust — Digital byrå från Lysekil"
        description="Vi bygger hemsidor som konverterar, appar som används och digital infrastruktur som håller. Premium digital byrå i Lysekil, Sverige."
        canonical="https://www.infrakust.se/"
      />
      <Navigation />
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <AppTeaserSection />
        <ProjectsRailSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, duration: 1.0 });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case/grand-hotel" element={<CaseGrandHotel />} />
        <Route path="/om-oss" element={<AboutPage />} />
        <Route path="/tjanster/webbutveckling" element={<WebdevPage />} />
        <Route path="/tjanster/apputveckling" element={<AppdevPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
