import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// Schriften liegen selbst gehostet im Build, keine Anfrage an Google
import '@fontsource-variable/outfit/wght.css'
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import './index.css'

// Vorgerendertes HTML merken, bevor React den Inhalt ersetzt (Fallback beim Nachladen)
const root = document.getElementById("root")!;
window.__PRERENDER_HTML__ = root.innerHTML.trim() || undefined;

createRoot(root).render(<App />);
