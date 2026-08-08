import { useEffect } from 'react';
import type { Funding } from '@/hooks/useFundingResults';
import { ApplyButton, CategoryChip, CloseButton, DetailRows } from './DetailParts';
import { categoryOf, r, schemeOf } from './resultsTheme';

/**
 * Mobile Detailansicht: Blatt, das von unten hochfährt.
 * Kopf bleibt weiß — Farbe steckt nur im Kategorie-Chip und im Anbieternamen.
 */
const DetailSheet = ({ funding, onClose }: { funding: Funding | null; onClose: () => void }) => {
  // Hintergrund nicht mitscrollen lassen, solange das Blatt offen ist
  useEffect(() => {
    if (!funding) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [funding, onClose]);

  if (!funding) return null;
  const scheme = schemeOf(funding);

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(24,21,17,.4)' }}
      />

      <div
        className="animate-slide-in-bottom"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '90%',
          background: '#fff',
          borderRadius: `${r(9)} ${r(9)} 0 0`,
          boxShadow: '0 -10px 44px rgba(0,0,0,.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 'none', padding: '11px 0 0' }}>
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 99,
              background: '#e0ddd7',
              margin: '0 auto',
            }}
          />
        </div>

        <div
          style={{
            flex: 'none',
            padding: '20px 26px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 14,
          }}
        >
          <div>
            <CategoryChip funding={funding} label={categoryOf(funding)} />
            <div
              style={{
                font: "800 29px/1.14 'Outfit', system-ui, sans-serif",
                color: '#111',
                margin: '14px 0 7px',
              }}
            >
              {funding.title}
            </div>
            <div style={{ font: "600 15px 'Outfit', system-ui, sans-serif", color: scheme.accent }}>
              {funding.organization}
            </div>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div
          className="[&::-webkit-scrollbar]:hidden"
          style={{ overflowY: 'auto', flex: 1, padding: '0 26px', scrollbarWidth: 'none' }}
        >
          <div
            style={{
              font: "400 15.5px/1.68 'Outfit', system-ui, sans-serif",
              color: '#403d39',
              paddingBottom: 20,
              borderBottom: '1px solid #f0eeea',
            }}
          >
            {funding.description}
          </div>
          <div style={{ paddingTop: 20 }}>
            <DetailRows funding={funding} />
          </div>
        </div>

        <div style={{ flex: 'none', padding: '18px 26px 24px' }}>
          <ApplyButton funding={funding} block />
        </div>
      </div>
    </div>
  );
};

export default DetailSheet;
