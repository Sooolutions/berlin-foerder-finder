import { useEffect, useRef, useState } from 'react';
import { tr } from '@/i18n/LanguageContext';

/**
 * Gemeinsame Bausteine des Fragebogens: Farben und Schrift, Fragezeichen mit
 * Begründung und die Einführung vor der ersten Frage.
 */
export const FONT = 'var(--md-font)';
/** Schrift für Überschriften, Gewicht kommt aus dem Designsystem */
export const DFONT = 'var(--md-font-display)';
export const ACCENT = 'var(--md-brand)';
export const KICKER = 'var(--md-kicker)';

/** Jeder Abschnitt hat seine eigene Farbe, sie zieht sich durch Karte, Auswahl und Fortschritt */
export const SECTION_COLORS: Record<string, string> = {
  person: '#2f5bea',
  zuhause: '#0e8a8f',
  geld: '#b07600',
  gesundheit: '#138a5b',
  anliegen: '#6d4ce6',
  wuensche: '#d23c7f',
};
export const sectionColor = (id?: string | null) => (id && SECTION_COLORS[id]) || '#2f5bea';

/** Akzent der Seite, auf der man gerade ist, gesetzt über --q-accent */
export const QA = 'var(--q-accent, var(--md-brand))';
export const QTINT = 'color-mix(in srgb, var(--q-accent, var(--md-brand)) 10%, var(--md-surface))';

export const iconButton = (size = 38): React.CSSProperties => ({
  width: size,
  height: size,
  border: 0,
  borderRadius: 11,
  background: 'var(--md-chip)',
  color: 'var(--md-ink)',
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
          background: open ? 'var(--md-brand-tint)' : 'var(--md-chip)',
          color: open ? ACCENT : 'var(--md-ink)',
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
            border: '1px solid var(--md-line-strong)',
            boxShadow: '0 10px 28px rgba(17,17,17,.12)',
            textAlign: 'start',
          }}
        >
          <div style={{ font: `700 12px ${FONT}`, letterSpacing: '.05em', textTransform: 'uppercase', color: KICKER, marginBottom: 5 }}>
            {tr("Warum fragen wir das?")}
          </div>
          <div style={{ font: `400 13.5px/1.5 ${FONT}`, color: 'var(--md-ink-2)' }}>{text}</div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Einstieg vor der ersten Frage
 * ------------------------------------------------------------------ */
export const IntroOverlay = ({ onStart, inline = false }: { onStart: () => void; inline?: boolean }) => {
  const points = [tr('Rund zwei Minuten'), tr('Keine Anmeldung, keine Namen, keine Kontaktdaten')];
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
        background: inline ? 'var(--md-surface)' : 'rgba(255,255,255,.96)',
        borderRadius: inline ? 28 : undefined,
        boxShadow: inline ? 'var(--md-shadow-lg)' : undefined,
        border: inline ? '1px solid var(--md-line)' : undefined,
        backdropFilter: inline ? undefined : 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        maxWidth: 560,
        margin: '0 auto',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(26px, 4vw, 42px) clamp(22px, 4vw, 42px) 12px' }}>
        <div
          aria-hidden
          style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--md-ink)', color: 'var(--md-sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <div style={{ font: `700 13px ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: KICKER, marginBottom: 8 }}>
          {tr("Bevor es losgeht")}
        </div>
        <div id="intro-title" style={{ font: `var(--md-display-weight) clamp(30px, 4vw, 40px)/1.05 ${DFONT}`, letterSpacing: '-0.025em', color: 'var(--md-ink)', marginBottom: 12 }}>
          {tr("Wir speichern nichts.")}
        </div>
        <div style={{ font: `400 16.5px/1.5 ${FONT}`, color: 'var(--md-ink-3)', marginBottom: 20 }}>
          {tr("Deine Antworten bleiben nur in diesem Browserfenster und werden gelöscht, sobald du es schließt.")}
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
                  background: 'var(--md-brand-tint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ stroke: ACCENT }} strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span style={{ font: `600 14.5px ${FONT}`, color: 'var(--md-ink)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px clamp(22px, 4vw, 40px) clamp(22px, 4vw, 36px)', flex: 'none' }}>
        <button
          type="button"
          className="md-press md-shine"
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

