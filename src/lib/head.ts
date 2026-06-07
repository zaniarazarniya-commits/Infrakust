import { createContext } from 'react';

export interface HeadData {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: object;
}

/**
 * Under prerendering (SSG) samlas varje sidas head-data in via denna context.
 * På klienten är värdet `null` och SEO-komponenten faller tillbaka på att
 * uppdatera document.head direkt (för klient-navigering i SPA:t).
 */
export const ServerHeadContext = createContext<HeadData[] | null>(null);
