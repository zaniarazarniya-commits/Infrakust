import { useEffect, useRef, useState } from 'react';
import type { Mesh } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { shouldLoad3d } from './shouldLoad3d';

const AUTO_ROTATE = 0.15; // rad/s tills första pointerdown
const DRAG_SPEED = 0.01; // rad per pixel

/**
 * HerculesViewer
 * --------------------------------------------------------------
 * Stillbilden renderas alltid (det är den prerenderingen bär). När
 * visaren är inom 600 px från viewporten och enheten klarar det
 * hämtas three dynamiskt, modellen laddas och canvasen tonas in över
 * bilden. Drag roterar runt Y, ingen zoom eller panorering. Går något
 * fel står bilden kvar och felet loggas med console.warn.
 */
export function HerculesViewer({ still, model }: { still: string; model: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof IntersectionObserver === 'undefined') return;
    if (!shouldLoad3d(navigator, reducedMotion)) return;

    let cancelled = false;
    let teardown: (() => void) | null = null;

    async function start(host: HTMLDivElement): Promise<() => void> {
      const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
      ]);
      if (cancelled) return () => {};

      // Canvasen skapas här och tas bort i städningen, så att en ny
      // körning av effekten aldrig ärver en förlorad WebGL-kontext.
      const canvas = document.createElement('canvas');
      canvas.className =
        'absolute inset-0 h-full w-full cursor-grab opacity-0 [touch-action:pan-y_pinch-zoom] transition-opacity duration-700 ease-out active:cursor-grabbing';
      canvas.setAttribute('aria-hidden', 'true');

      const cleanups: Array<() => void> = [];
      const dispose = () => {
        for (const fn of cleanups.splice(0).reverse()) fn();
      };

      try {
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        cleanups.push(() => {
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        // three r170 räknar ljus i fysiska enheter; de här värdena ger
        // samma nästan vita marmor som stillbilden.
        scene.add(new THREE.AmbientLight(0xffffff, 1.9));
        const sun = new THREE.DirectionalLight(0xffffff, 3.8);
        sun.position.set(1.5, 3, 2.5); // snett ovanifrån, framifrån
        scene.add(sun);

        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        const gltf = await loader.loadAsync(model);
        cleanups.push(() => {
          gltf.scene.traverse((obj) => {
            const mesh = obj as Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry.dispose();
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const material of materials) {
              for (const value of Object.values(material)) {
                if (value instanceof THREE.Texture) value.dispose();
              }
              material.dispose();
            }
          });
        });
        if (cancelled) return dispose;

        // Centrera statyn i en pivot som drag och autorotation vrider.
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        const pivot = new THREE.Group();
        pivot.add(gltf.scene);
        scene.add(pivot);

        // Kameran ser hela statyn i 3:4 även när den vrids: bredden
        // räknas som diagonalen i XZ-planet.
        const fov = 30;
        const aspect = 3 / 4;
        const halfV = THREE.MathUtils.degToRad(fov / 2);
        const halfH = Math.atan(Math.tan(halfV) * aspect);
        const radiusXZ = Math.hypot(size.x, size.z) / 2;
        const distance =
          Math.max(size.y / 2 / Math.tan(halfV), radiusXZ / Math.tan(halfH)) * 1.08 + radiusXZ;
        const camera = new THREE.PerspectiveCamera(fov, aspect, distance / 100, distance * 10);
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);

        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          if (width === 0 || height === 0) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);
        cleanups.push(() => ro.disconnect());

        // Drag runt Y. Ingen wheel-lyssnare, alltså ingen zoom.
        let autoRotate = true;
        let dragId: number | null = null;
        let lastX = 0;
        const onDown = (e: PointerEvent) => {
          autoRotate = false;
          dragId = e.pointerId;
          lastX = e.clientX;
          canvas.setPointerCapture(e.pointerId);
        };
        const onMove = (e: PointerEvent) => {
          if (e.pointerId !== dragId) return;
          pivot.rotation.y += (e.clientX - lastX) * DRAG_SPEED;
          lastX = e.clientX;
        };
        const onUp = (e: PointerEvent) => {
          if (e.pointerId === dragId) dragId = null;
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onUp);
        canvas.addEventListener('pointercancel', onUp);
        cleanups.push(() => {
          canvas.removeEventListener('pointerdown', onDown);
          canvas.removeEventListener('pointermove', onMove);
          canvas.removeEventListener('pointerup', onUp);
          canvas.removeEventListener('pointercancel', onUp);
        });

        // Loopen går bara när visaren syns.
        let frame = 0;
        let last = 0;
        const tick = (now: number) => {
          const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
          last = now;
          if (autoRotate) pivot.rotation.y += AUTO_ROTATE * dt;
          renderer.render(scene, camera);
          frame = requestAnimationFrame(tick);
        };
        const stop = () => {
          cancelAnimationFrame(frame);
          frame = 0;
        };
        const visibility = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !frame) {
            last = 0;
            frame = requestAnimationFrame(tick);
          } else if (!entry.isIntersecting) {
            stop();
          }
        });
        visibility.observe(host);
        cleanups.push(() => {
          visibility.disconnect();
          stop();
        });

        renderer.render(scene, camera);
        host.appendChild(canvas);
        // Två bildrutor så att opacity-0 hinner målas innan övergången.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (cancelled) return;
            canvas.classList.replace('opacity-0', 'opacity-100');
            setReady(true);
          }),
        );
        return dispose;
      } catch (error) {
        dispose();
        throw error;
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        start(wrap).then(
          (fn) => {
            if (cancelled) fn();
            else teardown = fn;
          },
          (error: unknown) => {
            console.warn('HerculesViewer: 3D-modellen kunde inte laddas, stillbilden står kvar.', error);
          },
        );
      },
      { rootMargin: '600px' },
    );
    io.observe(wrap);

    return () => {
      cancelled = true;
      io.disconnect();
      teardown?.();
      teardown = null;
      setReady(false);
    };
  }, [model, reducedMotion]);

  return (
    <div
      ref={wrapRef}
      data-ready={ready ? 'true' : undefined}
      className="relative aspect-[3/4] w-full overflow-hidden"
    >
      <img
        src={still}
        alt="Herkules-statyn i vit marmor, med foten på en klippa och lejonhuden över axeln"
        width={1120}
        height={1494}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}
