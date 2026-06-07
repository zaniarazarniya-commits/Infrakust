import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import Lenis from 'lenis';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { WhatWeDoSection } from '@/sections/WhatWeDoSection';
import { AppTeaserSection } from '@/sections/AppTeaserSection';
import { ProjectsRailSection } from '@/sections/ProjectsRailSection';
import { ContactSection } from '@/sections/ContactSection';
import { SEO } from '@/components/SEO';
import { Analytics } from '@vercel/analytics/react';

const CaseGrandHotel = lazy(() => import('@/pages/CaseGrandHotel'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const WebdevPage = lazy(() => import('@/pages/WebdevPage'));
const AppdevPage = lazy(() => import('@/pages/AppdevPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

/**
 * AppShell — router-agnostiskt innehåll (routes + smooth scroll).
 * Renderas under <BrowserRouter> på klienten och <StaticRouter> vid prerendering.
 */
export function AppShell() {
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
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case/grand-hotel" element={<CaseGrandHotel />} />
          <Route path="/om-oss" element={<AboutPage />} />
          <Route path="/tjanster/webbutveckling" element={<WebdevPage />} />
          <Route path="/tjanster/apputveckling" element={<AppdevPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
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
  return (
    <BrowserRouter>
      <AppShell />
      <Analytics />
    </BrowserRouter>
  );
}
