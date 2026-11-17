import { tr } from '@/i18n/LanguageContext';
import type { Funding } from '@/hooks/useFundingResults';

/**
 * Zentrale Design-Tokens für Fragebogen + Ergebnisse.
 * Ein einziger Radius-Wert steuert die Rundung im ganzen Screen.
 */
export const RADIUS = 12;

/** Radius mit Abweichung, z. B. r(-6) für Chips, r(3) für große Karten. */
export const r = (delta = 0): string => `${Math.max(2, RADIUS + delta)}px`;

export type FundingType = 'staatlich' | 'privat' | 'karitativ';

export interface Scheme {
  /** kräftiger Ton für Text, Buttons, Ränge */
  accent: string;
  /** dunkler Textton auf hellen Flächen */
  ink: string;
  /** gesättigte Verlaufsfarben — nur im Story-Modus */
  g1: string;
  g2: string;
  /** helle Kachelfläche im Übersichts-Modus */
  cardBg: string;
  cardBorder: string;
  /** heller Chip-Hintergrund */
  chipBg: string;
  /** Verlauf der Top-Treffer-Karte im Übersichts-Modus */
  heroBg: string;
}

const build = (h: number, s: number, accent: string, ink: string, g1: string, g2: string): Scheme => ({
  accent,
  ink,
  g1,
  g2,
  cardBg: `hsl(${h}, ${s}%, 97%)`,
  cardBorder: `hsl(${h}, ${s}%, 90%)`,
  chipBg: `hsl(${h}, ${s}%, 95%)`,
  heroBg: `linear-gradient(150deg, hsl(${h}, ${s}%, 95%), hsl(${h}, ${s}%, 88%))`,
});

/**
 * Jede Kategorie hat ihre eigene Farbe, damit gleiche Farbe immer gleiches
 * Thema bedeutet. Reihenfolge der Kategorien entspricht der Datenbank.
 */
export const CATEGORY_SCHEMES: Record<string, Scheme> = {
  Soziales: build(7, 72, '#d9452f', '#4a1610', '#f47a68', '#d9452f'),
  Gesundheit: build(152, 55, '#138a5b', '#0b3a27', '#3fbf8a', '#138a5b'),
  Bildung: build(226, 75, '#2f5bea', '#14215e', '#5f82f2', '#2f5bea'),
  Familie: build(330, 65, '#d23c7f', '#4d1530', '#ec74a8', '#d23c7f'),
  Wohnen: build(182, 60, '#0e8a8f', '#0b3b3d', '#3dbcc0', '#0e8a8f'),
  Arbeit: build(25, 85, '#d9690f', '#4a2306', '#f59a4f', '#d9690f'),
  'Finanzielle Unterstützung': build(42, 90, '#b07600', '#3d2a00', '#ffc23d', '#d99400'),
  Integration: build(258, 70, '#6d4ce6', '#2a1966', '#987cf2', '#6d4ce6'),
  Kultur: build(292, 55, '#a43fc4', '#3f1650', '#c97ae0', '#a43fc4'),
  Wirtschaft: build(208, 35, '#3d6382', '#1c2f40', '#6f93b0', '#3d6382'),
  Sport: build(88, 65, '#5a8a10', '#263a07', '#8dbf3a', '#5a8a10'),
};

const PALETTE = Object.values(CATEGORY_SCHEMES);

/** Farbschema eines Angebots nach seiner ersten Kategorie, sonst stabil über die id */
export const schemeOf = (funding: { id?: string; categories?: string[] | null }): Scheme => {
  const cat = funding.categories?.find((c) => CATEGORY_SCHEMES[c]);
  if (cat) return CATEGORY_SCHEMES[cat];
  const seed = [...(funding.id ?? '')].reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return PALETTE[seed % PALETTE.length];
};

/** Kategorie-Label für Chips — erste Kategorie, sonst der Fördertyp. */
export const categoryOf = (funding: Funding): string =>
  tr(funding.categories?.[0] ?? funding.funding_type ?? 'Angebot');

export interface DetailRow {
  label: string;
  value: string;
  /** hervorgehoben (Förderhöhe) */
  strong?: boolean;
  /** klickbarer Kontakt */
  href?: string;
}

/** Die Detailzeilen eines Angebots — leere Felder fallen raus. */
export const rowsOf = (funding: Funding): DetailRow[] =>
  [
    funding.amount && { label: tr('Förderhöhe'), value: funding.amount, strong: true },
    funding.application_deadline && { label: tr('Antragsfrist'), value: funding.application_deadline },
    funding.application_process && { label: tr('Antragsprozess'), value: funding.application_process },
    funding.contact_email && {
      label: tr('Kontakt'),
      value: funding.contact_email,
      href: `mailto:${funding.contact_email}`,
    },
    funding.contact_phone && {
      label: tr('Telefon'),
      value: funding.contact_phone,
      href: `tel:${funding.contact_phone.replace(/\s/g, '')}`,
    },
  ].filter(Boolean) as DetailRow[];
