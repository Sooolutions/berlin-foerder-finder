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

export const SCHEMES: Record<FundingType, Scheme> = {
  staatlich: build(212, 52, '#3a75ad', '#17324e', '#5a9be6', '#2f6fb0'),
  karitativ: build(38, 58, '#8f6b26', '#3d2e0f', '#f5b955', '#c9871a'),
  privat: build(354, 52, '#b0606a', '#462126', '#ef8b91', '#c0444d'),
};

const FALLBACK: FundingType[] = ['staatlich', 'karitativ', 'privat'];

/** Farbschema eines Angebots — mit stabilem Fallback über die id. */
export const schemeOf = (funding: Pick<Funding, 'funding_type' | 'id'>): Scheme => {
  const type = funding.funding_type as FundingType | null | undefined;
  if (type && SCHEMES[type]) return SCHEMES[type];
  return SCHEMES[FALLBACK[(funding.id?.charCodeAt(0) ?? 0) % 3]];
};

/** Kategorie-Label für Chips — erste Kategorie, sonst der Fördertyp. */
export const categoryOf = (funding: Funding): string =>
  funding.categories?.[0] ?? funding.funding_type ?? 'Angebot';

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
    funding.amount && { label: 'Förderhöhe', value: funding.amount, strong: true },
    funding.application_deadline && { label: 'Antragsfrist', value: funding.application_deadline },
    funding.application_process && { label: 'Antragsprozess', value: funding.application_process },
    funding.contact_email && {
      label: 'Kontakt',
      value: funding.contact_email,
      href: `mailto:${funding.contact_email}`,
    },
    funding.contact_phone && {
      label: 'Telefon',
      value: funding.contact_phone,
      href: `tel:${funding.contact_phone.replace(/\s/g, '')}`,
    },
  ].filter(Boolean) as DetailRow[];
