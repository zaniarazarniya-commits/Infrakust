# Tech Spec — Infrakust (ZDB)

## 1. Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — minimal UI primitives
- **Framer Motion** — scroll-triggered reveals, page load orchestration, hover animations
- **Lenis** — smooth scroll (lerp 0.08)
- **Google Fonts** — DM Serif Display + Inter

## 2. Tailwind Configuration

Add to `tailwind.config.js`:

```js
extend: {
  colors: {
    'bg-primary': '#0C0D0E',
    'bg-secondary': '#141516',
    'bg-tertiary': '#1A1B1C',
    'surface-light': '#F5F0EB',
    'text-primary': '#F5F0EB',
    'text-secondary': '#9A9590',
    'text-muted': '#6B6560',
    'accent-gold': '#C9A96E',
    'accent-gold-hover': '#D4B87A',
    'accent-gold-muted': '#8A7A5A',
  },
  fontFamily: {
    'serif': ['"DM Serif Display"', 'Georgia', 'serif'],
    'sans': ['Inter', '-apple-system', 'sans-serif'],
  },
  letterSpacing: {
    'section': '0.15em',
    'nav': '0.05em',
    'tag': '0.08em',
  },
}
```

## 3. Component Inventory

### shadcn/ui (minimal usage)
| Component | Usage | Customization |
|-----------|-------|---------------|
| `button` | CTA outline buttons | Remove default radius, add gold border variant |

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Navigation` | - | Fixed top nav, transparent→blur on scroll. Mobile hamburger overlay. |
| `HeroSection` | - | Full viewport. Orchestrated load animation. Side panel. |
| `WhatWeDoSection` | - | Two large lines of text. |
| `ProjectsSection` | - | Horizontal scrolling project carousel. |
| `ProjectCard` | `image, name, description, tags` | Large card with image, name, description, tags. |
| `CarouselArrows` | `onPrev, onNext` | Circular nav arrows for carousel. |
| `ContactSection` | - | Centered CTA with email link. |
| `Footer` | - | Minimal bottom bar. |
| `ScrollReveal` | `children, delay?, direction?` | Wrapper: IntersectionObserver + Framer Motion fade-in. |
| `SectionLabel` | `text` | Gold uppercase label used by all sections. |
| `GoldLink` | `href, children` | Text link with animated underline. |

## 4. Animation Implementation

| Animation | Library | Implementation | Complexity |
|-----------|---------|------------------|------------|
| Hero load sequence (orchestrated) | Framer Motion | `motion.div` with `initial/animate`, manual `transition.delay` per element | Medium |
| Scroll indicator sine wave | CSS @keyframes | `translateY` oscillation, 2s infinite ease-in-out | Low |
| Section scroll reveals | Framer Motion | `whileInView` + `viewport={{ once: true, amount: 0.15 }}` | Low |
| Staggered card entrance | Framer Motion | Parent `staggerChildren: 0.1` in `variants` | Low |
| Nav background blur transition | React state + CSS | Scroll listener → toggle class with `backdrop-filter` transition | Low |
| Nav link underline hover | CSS `::after` | `scaleX(0→1)`, `transform-origin: left`, 0.3s | Low |
| Project card hover | CSS + Framer Motion | Image `scale(1.03)`, shadow deepens, name `translateX(4px)` | Low |
| Carousel drag/scroll | CSS | `scroll-snap-type: x mandatory`, `overflow-x: auto` | Low |
| Email underline hover | CSS `::after` | `scaleX(0→1)`, `transform-origin: center`, 0.3s | Low |
| Mobile menu stagger | Framer Motion | `staggerChildren: 0.08`, `AnimatePresence` | Medium |
| Smooth scroll | Lenis | Initialize in `useEffect`, `lerp: 0.08` | Low |
| Reduced motion support | Framer Motion + CSS | `useReducedMotion()` hook, disable continuous anims, simplify entrances | Low |

### Animation Specs Reference

```js
// Easing tokens
const EASE_SMOOTH = [0.4, 0, 0.2, 1];
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

// Standard reveal variant
const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SMOOTH } }
};

// Stagger container
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};
```

## 5. State & Logic

- **Nav scroll state** (`useState<boolean>`) — toggles nav background after 100vh scroll.
- **Mobile menu open** (`useState<boolean>`) — controls hamburger overlay.
- **Carousel scroll** (`useRef<HTMLDivElement>`) — reference to scroll container for arrow navigation.
- **Lenis instance** — stored in a ref, initialized once on mount, destroyed on unmount.

## 6. Project File Structure

```
src/
  sections/
    HeroSection.tsx
    WhatWeDoSection.tsx
    ProjectsSection.tsx
    ContactSection.tsx
  components/
    Navigation.tsx
    Footer.tsx
    ProjectCard.tsx
    CarouselArrows.tsx
    ScrollReveal.tsx
    SectionLabel.tsx
    GoldLink.tsx
  hooks/
    useScrollPosition.ts
    useReducedMotion.ts
  types/
    index.ts
  App.tsx
  main.tsx
  index.css
public/
  images/
    web-main.jpg
    web-thumb-1.jpg
    web-thumb-2.jpg
    web-thumb-3.jpg
```

## 7. Dependencies

```bash
npm install framer-motion lenis
```

Fonts loaded via Google Fonts CDN in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

## 8. Notes

- **No custom cursor** — default system cursor throughout.
- **No 3D libraries** — pure 2D, typographically driven.
- **Image strategy**: 4 images placed in `public/images/`. All are opaque JPGs.
- **Performance**: All animations use `transform` + `opacity`. Apply `will-change` sparingly, remove after animation.
- **Accessibility**: WCAG AA contrast ratios verified in design. Focus states use `outline: 2px solid #C9A96E` with `outline-offset: 2px`.
- **Carousel**: CSS scroll-snap for smooth horizontal scrolling. Arrow buttons programmatically scroll by card width + gap.
