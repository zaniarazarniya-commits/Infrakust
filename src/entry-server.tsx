import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppShell } from './App';
import { ServerHeadContext, type HeadData } from './lib/head';

/**
 * Renderar appen till en HTML-sträng för en given URL vid byggtid (SSG).
 * Returnerar även den head-data som samlats in via SEO-komponenten.
 */
export function render(url: string): { html: string; head: HeadData | null } {
  const sink: HeadData[] = [];
  const html = renderToString(
    <ServerHeadContext.Provider value={sink}>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </ServerHeadContext.Provider>,
  );
  return { html, head: sink[sink.length - 1] ?? null };
}
