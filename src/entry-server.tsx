import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ServerHeadContext, type HeadData } from './lib/head';
import { PrerenderApp } from './PrerenderApp';

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
