import { Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HeroSection } from './sections/HeroSection';
import { WhatWeDoSection } from './sections/WhatWeDoSection';
import { AppTeaserSection } from './sections/AppTeaserSection';
import { ProjectsRailSection } from './sections/ProjectsRailSection';
import { ContactSection } from './sections/ContactSection';
import { SEO } from './components/SEO';
import CaseGrandHotel from './pages/CaseGrandHotel';
import CaseFormad from './pages/CaseFormad';
import AboutPage from './pages/AboutPage';
import WebdevPage from './pages/WebdevPage';
import AppdevPage from './pages/AppdevPage';
import NotFoundPage from './pages/NotFoundPage';

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

/**
 * Synkron route-träd för SSG — undviker React.lazy som annars bara renderar Suspense-fallback.
 * Suspense-gränsen finns med för att serverns HTML ska få samma <!--$-->-markörer som
 * klientens AppShell; utan den hittar hydreringen ingen gräns att fästa vid (React #418).
 */
export function PrerenderApp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case/grand-hotel" element={<CaseGrandHotel />} />
        <Route path="/case/formad" element={<CaseFormad />} />
        <Route path="/om-oss" element={<AboutPage />} />
        <Route path="/tjanster/webbutveckling" element={<WebdevPage />} />
        <Route path="/tjanster/apputveckling" element={<AppdevPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
