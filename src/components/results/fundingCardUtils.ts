
export interface ColorScheme {
  bg: string;
  border: string;
  accent: string;
  bgExpanded: string;
  borderExpanded: string;
}

export interface GridPosition {
  gridColumn: string;
  gridRow: string;
}

type FundingType = 'staatlich' | 'privat' | 'karitativ' | null | undefined;

const SCHEMES: Record<'staatlich' | 'privat' | 'karitativ', ColorScheme> = {
  staatlich: {
    bg: 'hsl(212, 67%, 94%)',
    border: 'hsl(212, 67%, 82%)',
    accent: '#4F90DE',
    bgExpanded: 'hsl(212, 67%, 90%)',
    borderExpanded: 'hsl(212, 67%, 70%)',
  },
  karitativ: {
    bg: 'hsl(39, 100%, 93%)',
    border: 'hsl(39, 100%, 80%)',
    accent: '#8a6015',
    bgExpanded: 'hsl(39, 100%, 88%)',
    borderExpanded: 'hsl(39, 100%, 68%)',
  },
  privat: {
    bg: 'hsl(356, 76%, 94%)',
    border: 'hsl(356, 76%, 84%)',
    accent: '#c0444d',
    bgExpanded: 'hsl(356, 76%, 90%)',
    borderExpanded: 'hsl(356, 76%, 74%)',
  },
};

const FALLBACK_TYPES = ['staatlich', 'karitativ', 'privat'] as const;

export const getColorScheme = (fundingType: FundingType, id: string): ColorScheme => {
  const type = fundingType ?? FALLBACK_TYPES[id.charCodeAt(0) % 3];
  return SCHEMES[type];
};

// Desktop: 4-column grid — 6 cards per cycle, 3 rows per cycle
// Left half:  horizontal → two verticals → …
// Right half: two verticals → horizontal → … (offset)
export const getCardGridPosition = (index: number): GridPosition => {
  const cycle = Math.floor(index / 6);
  const pos = index % 6;
  const o = cycle * 3; // row offset

  switch (pos) {
    case 0: return { gridColumn: '1 / 3', gridRow: `${o + 1} / ${o + 2}` }; // left horizontal
    case 1: return { gridColumn: '3 / 4', gridRow: `${o + 1} / ${o + 3}` }; // right vertical 1
    case 2: return { gridColumn: '4 / 5', gridRow: `${o + 1} / ${o + 3}` }; // right vertical 2
    case 3: return { gridColumn: '1 / 2', gridRow: `${o + 2} / ${o + 4}` }; // left vertical 1
    case 4: return { gridColumn: '2 / 3', gridRow: `${o + 2} / ${o + 4}` }; // left vertical 2
    default: return { gridColumn: '3 / 5', gridRow: `${o + 3} / ${o + 4}` }; // right horizontal
  }
};

export const isHorizontalCard = (index: number): boolean => {
  const pos = index % 6;
  return pos === 0 || pos === 5;
};

// Mobile/tablet: 2-column grid — 3 cards per cycle, 3 rows per cycle
export const getCardGridPositionSimple = (index: number): GridPosition => {
  const cycle = Math.floor(index / 3);
  const pos = index % 3;
  const o = cycle * 3;

  switch (pos) {
    case 0: return { gridColumn: '1 / 3', gridRow: `${o + 1} / ${o + 2}` }; // horizontal
    case 1: return { gridColumn: '1 / 2', gridRow: `${o + 2} / ${o + 4}` }; // vertical left
    default: return { gridColumn: '2 / 3', gridRow: `${o + 2} / ${o + 4}` }; // vertical right
  }
};

export const isHorizontalCardSimple = (index: number): boolean => index % 3 === 0;
