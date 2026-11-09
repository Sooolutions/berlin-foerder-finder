import { useEffect, useRef, useState } from 'react';
import { tr } from '@/i18n/LanguageContext';

/**
 * Gemeinsame Bausteine des Fragebogens: Farben und Schrift, Fragezeichen mit
 * Begründung und die Einführung vor der ersten Frage.
 */
export const FONT = "'Outfit', system-ui, sans-serif";
export const ACCENT = '#4F90DE';
export const KICKER = '#EE7A82';

export const iconButton = (size = 38): React.CSSProperties => ({
  width: size,
  height: size,
  border: 0,
  borderRadius: 11,
  background: '#f1f1f1',
  color: '#111',
  cursor: 'pointer',
  flex: 'none',
});

/* ------------------------------------------------------------------ *
 * Fragezeichen mit kurzer Begründung (Hover am Laptop, Tippen am Handy)
 * ------------------------------------------------------------------ */
export const InfoButton = ({ text, resetKey, size = 38 }: { text: string; resetKey: string; size?: number }) => {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const open = pinned || hover;

  useEffect(() => {
    setPinned(false);
    setHover(false);
  }, [resetKey]);

  useEffect(() => {
    if (!pinned) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [pinned]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', flex: 'none' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        aria-label={tr("Warum fragen wir das?")}
        aria-expanded={open}
        onClick={() => setPinned((p) => !p)}
        style={{
          ...iconButton(size),
          background: open ? '#eef4fc' : '#f1f1f1',
          color: open ? ACCENT : '#111',
          font: `700 17px ${FONT}`,
        }}
      >
        ?
      </button>
      {open && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            top: size + 8,
            right: 0,
            zIndex: 20,
            width: 'min(270px, 78vw)',
            padding: '12px 14px',
            borderRadius: 12,
            background: '#fff',
            border: '1px solid #e6e3dd',
            boxShadow: '0 10px 28px rgba(17,17,17,.12)',
            textAlign: 'start',
          }}
        >
          <div style={{ font: `700 12px ${FONT}`, letterSpacing: '.05em', textTransform: 'uppercase', color: KICKER, marginBottom: 5 }}>
            {tr("Warum fragen wir das?")}
          </div>
          <div style={{ font: `400 13.5px/1.5 ${FONT}`, color: '#3f3d39' }}>{text}</div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Einstieg vor der ersten Frage
 * ------------------------------------------------------------------ */
export const IntroOverlay = ({ onStart, inline = false }: { onStart: () => void; inline?: boolean }) => {
  const points = [
    tr('Fünf kurze Abschnitte, rund zwei Minuten'),
    tr('Keine Anmeldung, keine Namen, keine Kontaktdaten'),
    tr('Über das Fragezeichen erfährst du, warum wir etwas fragen'),
  ];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      style={{
        // Im Feed steht die Einführung als Block oben, in der Karte lag sie darüber
        position: inline ? 'relative' : 'absolute',
        inset: inline ? undefined : 0,
        zIndex: 30,
        background: inline ? '#fff' : 'rgba(255,255,255,.96)',
        borderRadius: inline ? 16 : undefined,
        border: inline ? '1px solid #eceae5' : undefined,
        backdropFilter: inline ? undefined : 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px 24px 12px' }}>
        <div style={{ font: `700 13px ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: KICKER, marginBottom: 9 }}>
          {tr("Bevor es losgeht")}
        </div>
        <div id="intro-title" style={{ font: `800 28px/1.12 ${FONT}`, color: '#111', marginBottom: 14 }}>
          {tr("Nur Fragen, die für deine Förderung zählen")}
        </div>
        <div style={{ font: `400 15.5px/1.55 ${FONT}`, color: '#4a4844', marginBottom: 20 }}>
          {tr("Wir stellen dir nur Fragen, die relevant sind, um dir passende Förderungen und Angebote anzuzeigen. Nichts davon speichern wir. Deine Antworten nutzen wir ausschließlich, um unsere Datenbank passend zu deiner Situation zu filtern.")}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {points.map((p) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: 'none',
                  borderRadius: '50%',
                  background: '#eef4fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span style={{ font: `600 14.5px ${FONT}`, color: '#111' }}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{ font: `400 12.5px/1.5 ${FONT}`, color: '#9a968f', marginTop: 18 }}>
          {tr("Deine Antworten bleiben nur in diesem Browserfenster und werden gelöscht, sobald du es schließt.")}
        </div>
      </div>
      <div style={{ padding: '12px 24px 22px', flex: 'none' }}>
        <button
          type="button"
          onClick={onStart}
          autoFocus
          style={{
            width: '100%',
            border: 0,
            font: `700 17px ${FONT}`,
            padding: 16,
            borderRadius: 13,
            background: ACCENT,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {tr("Los geht's")}
        </button>
      </div>
    </div>
  );
};

