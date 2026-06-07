import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import { ServerHeadContext, type HeadData } from './lib/head';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HeroSection } from './sections/HeroSection';
import { WhatWeDoSection } from './sections/WhatWeDoSection';
import { AppTeaserSection } from './sections/AppTeaserSection';
import { ProjectsRailSection } from './sections/ProjectsRailSection';
import { ContactSection } from './sections/ContactSection';
import { SEO } from './components/SEO';
import CaseGrandHotel from './pages/CaseGrandHotel';
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
 */
function PrerenderApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/case/grand-hotel" element={<CaseGrandHotel />} />
      <Route path="/om-oss" element={<AboutPage />} />
      <Route path="/tjanster/webbutveckling" element={<WebdevPage />} />
      <Route path="/tjanster/apputveckling" element={<AppdevPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function render(url: string): { html: string; head: HeadData | null } {
  const sink: HeadData[] = [];
  const html = renderToString(
    <ServerHeadContext.Provider value={sink}>
      <StaticRouter location={url}>
        <PrerenderApp />
      </StaticRouter>
    </ServerHeadContext.Provider>,
  );
  return { html, head: sink[sink.length - 1] ?? null };
}
