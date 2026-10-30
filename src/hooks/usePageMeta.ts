import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  canonical?: string;
}

const setMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

/**
 * Setzt Titel, Description und Canonical beim Navigieren innerhalb der App.
 * Für Google sind diese Werte zusätzlich schon im vorgerenderten HTML enthalten
 * (siehe scripts/prerender.ts).
 */
export const usePageMeta = ({ title, description, canonical }: PageMeta) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
    }
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical]);
};
