import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { WhatWeDoSection } from '@/sections/WhatWeDoSection';
import { ToolsSection } from '@/sections/ToolsSection';
import { ProjectsSection } from '@/sections/ProjectsSection';
import { ContactSection } from '@/sections/ContactSection';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.0,
    });

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
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <ToolsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
