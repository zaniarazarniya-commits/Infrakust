import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Clip = { name: string; label: string };

/**
 * ClipGrid
 * --------------------------------------------------------------
 * Rutnät med muskelklipp som loopar tyst. Klippen spelar bara medan
 * minst hälften av rutan syns och pausas annars. En enda observer
 * sköter alla rutor. Vid reduced motion spelar inget: posterbilden
 * står kvar. Prerenderingen bär <video>-taggarna; observern skapas
 * först i effekten.
 */
export function ClipGrid({ clips }: { clips: Clip[] }) {
  const reducedMotion = useReducedMotion();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const videos = videoRefs.current.filter((v): v is HTMLVideoElement => v !== null);

    if (reducedMotion) {
      // Prerenderad HTML kan ha autoplay kvar innan hooken hunnit läsa inställningen.
      for (const video of videos) {
        video.autoplay = false;
        video.removeAttribute('autoplay');
        video.pause();
      }
      return;
    }
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // play() avvisas om webbläsaren stoppar autoplay. Stillbilden räcker då.
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.5 },
    );
    for (const video of videos) observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
      {clips.map((clip, i) => (
        <li key={clip.name}>
          <div className="aspect-[4/5] overflow-hidden bg-bg-tertiary">
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={`/formad/klipp/${clip.name}-muskler.mp4`}
              poster={`/formad/klipp/${clip.name}-muskler.webp`}
              width={720}
              height={900}
              muted
              loop
              playsInline
              preload="none"
              autoPlay={!reducedMotion}
              aria-label={`${clip.label}, klipp med muskler som lyser`}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 font-sans text-sm text-text-muted">{clip.label}</p>
        </li>
      ))}
    </ul>
  );
}
