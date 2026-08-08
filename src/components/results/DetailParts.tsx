import type { Funding } from '@/hooks/useFundingResults';
import { r, rowsOf, schemeOf } from './resultsTheme';

/**
 * Die Detailzeilen (Förderhöhe, Frist, Prozess, Kontakt, Telefon).
 * Wird von Bottom-Sheet (mobil) und aufgeklappter Kachel (Desktop) geteilt,
 * damit beide Ansichten garantiert dieselben Felder zeigen.
 */
export const DetailRows = ({ funding }: { funding: Funding }) => {
  const scheme = schemeOf(funding);
  const rows = rowsOf(funding);

  return (
    <div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{
            padding: i === 0 ? '0 0 17px' : '17px 0',
            borderBottom: '1px solid #f0eeea',
          }}
        >
          <div
            style={{
              font: "600 11px 'Outfit', system-ui, sans-serif",
              letterSpacing: '.09em',
              textTransform: 'uppercase',
              color: '#9c9891',
              marginBottom: 6,
            }}
          >
            {row.label}
          </div>
          {row.href ? (
            <a
              href={row.href}
              onClick={(e) => e.stopPropagation()}
              style={{
                font: "600 15px/1.5 'Outfit', system-ui, sans-serif",
                color: scheme.accent,
                textDecoration: 'none',
              }}
            >
              {row.value}
            </a>
          ) : (
            <div
              style={{
                font: row.strong
                  ? "700 19px/1.3 'Outfit', system-ui, sans-serif"
                  : "400 15px/1.62 'Outfit', system-ui, sans-serif",
                color: row.strong ? scheme.accent : '#403d39',
              }}
            >
              {row.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/** Primärbutton „Zur Antragsseite" in der Farbe des Anbieters. */
export const ApplyButton = ({ funding, block = false }: { funding: Funding; block?: boolean }) => {
  const scheme = schemeOf(funding);
  if (!funding.url) return null;

  return (
    <a
      href={funding.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        display: block ? 'block' : 'inline-block',
        textAlign: 'center',
        font: "700 15px 'Outfit', system-ui, sans-serif",
        color: '#fff',
        background: scheme.accent,
        padding: block ? '17px 26px' : '15px 26px',
        borderRadius: r(-2),
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      Zur Antragsseite ↗
    </a>
  );
};

/** Kategorie-Chip. `onDark` für die gesättigten Story-Karten. */
export const CategoryChip = ({
  funding,
  label,
  onDark = false,
}: {
  funding: Funding;
  label: string;
  onDark?: boolean;
}) => {
  const scheme = schemeOf(funding);
  return (
    <span
      style={{
        display: 'inline-block',
        alignSelf: 'flex-start',
        font: "700 10.5px 'Outfit', system-ui, sans-serif",
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        padding: '5px 11px',
        borderRadius: r(-6),
        background: onDark ? 'rgba(255,255,255,.24)' : scheme.chipBg,
        color: onDark ? '#fff' : scheme.accent,
      }}
    >
      {label}
    </span>
  );
};

/** Weißes Innenfeld, auf dem Detailinhalte über getönten Karten liegen. */
export const DetailPanel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#fff', borderRadius: r(-2), padding: '22px 24px' }}>{children}</div>
);

/** Runder Schließen-Button. */
export const CloseButton = ({
  onClick,
  onDark = false,
  glyph = '✕',
}: {
  onClick: (e: React.MouseEvent) => void;
  onDark?: boolean;
  glyph?: string;
}) => (
  <button
    type="button"
    aria-label="Schließen"
    onClick={onClick}
    style={{
      width: 36,
      height: 36,
      flex: 'none',
      border: 0,
      borderRadius: '50%',
      background: onDark ? 'rgba(255,255,255,.25)' : '#f4f2ee',
      color: onDark ? '#fff' : '#6b6862',
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    }}
  >
    {glyph}
  </button>
);
