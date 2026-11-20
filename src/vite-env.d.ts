/// <reference types="vite/client" />

interface Window {
  /** Vom Build vorgerenderter Seiteninhalt, siehe scripts/prerender.ts */
  __PRERENDER_HTML__?: string;
}
