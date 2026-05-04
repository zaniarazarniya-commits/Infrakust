import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: object;
}

export function SEO({ title, description, canonical, jsonLd }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    const SCRIPT_ID = 'ld-json-page';
    let ldScript = document.getElementById(SCRIPT_ID);
    if (jsonLd) {
      if (!ldScript) {
        ldScript = document.createElement('script');
        ldScript.id = SCRIPT_ID;
        ldScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(jsonLd);
    } else if (ldScript) {
      ldScript.remove();
    }
  }, [title, description, canonical, jsonLd]);

  return null;
}
