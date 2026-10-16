import { useSyncExternalStore } from 'react';

/**
 * Prenumererar på en media query. På servern och under hydreringen är värdet
 * `false`; klienten uppdateras direkt efter hydrering, så den prerenderade
 * HTML:en matchar alltid första klientrenderingen.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
