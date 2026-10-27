import { useMemo, useState } from 'react';
import type { Funding } from '@/hooks/useFundingResults';
import type { UserAnswers } from '@/context/QuestionnaireContext';
import { buildReasonGroups, type ReasonGroup } from '@/utils/answerMappingUtils';
import DetailSheet from './DetailSheet';
import { ApplyButton, CategoryChip, CloseButton, DetailPanel, DetailRows } from './DetailParts';
import { categoryOf, r, schemeOf } from './resultsTheme';
import { useCountUp } from './useCountUp';

type Mode = 'overview' | 'story';

const FONT = "'Outfit', system-ui, sans-serif";

/* ------------------------------------------------------------------ *
 * Umschalter: zeigt immer das Symbol der jeweils ANDEREN Ansicht
 * ------------------------------------------------------------------ */
const ModeToggle = ({ mode, onToggle, large = false }: { mode: Mode; onToggle: () => void; large?: boolean }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={mode === 'overview' ? 'Zur Story-Ansicht' : 'Zur Übersicht'}
    title={mode === 'overview' ? 'Story-Ansicht' : 'Übersicht'}
    style={{
      width: large ? 46 : 40,
      height: large ? 46 : 40,
      flex: 'none',
      borderRadius: r(-3),
      border: '1px solid #e5e3de',
      background: '#fff',
      color: '#3f3d39',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    }}
  >
    {mode === 'overview' ? (
      <svg width={large ? 21 : 19} height={large ? 21 : 19} viewBox="0 0 18 18" fill="none">
        <rect x="4.6" y="1" width="8.8" height="16" rx="2.4" fill="currentColor" />
        <rect x="1" y="4.2" width="2.2" height="9.6" rx="1.1" fill="currentColor" opacity=".45" />
        <rect x="14.8" y="4.2" width="2.2" height="9.6" rx="1.1" fill="currentColor" opacity=".45" />
      </svg>
    ) : (
      <svg width={large ? 21 : 19} height={large ? 21 : 19} viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6.6" height="6.6" rx="1.7" fill="currentColor" />
        <rect x="10.4" y="1" width="6.6" height="6.6" rx="1.7" fill="currentColor" opacity=".5" />
        <rect x="1" y="10.4" width="6.6" height="6.6" rx="1.7" fill="currentColor" opacity=".5" />
        <rect x="10.4" y="10.4" width="6.6" height="6.6" rx="1.7" fill="currentColor" />
      </svg>
    )}
  </button>
);

/* ------------------------------------------------------------------ *
 * Bezirksfilter und Chips mit den eigenen Antworten
 * ------------------------------------------------------------------ */
const BEZIRKE = [
  'Charlottenburg-Wilmersdorf',
  'Friedrichshain-Kreuzberg',
  'Lichtenberg',
  'Marzahn-Hellersdorf',
  'Mitte',
  'Neukölln',
  'Pankow',
  'Reinickendorf',
  'Spandau',
  'Steglitz-Zehlendorf',
  'Tempelhof-Schöneberg',
  'Treptow-Köpenick',
] as const;

const DISTRICT_KEY = 'resultsDistrict';

const readDistrict = (): string => {
  try {
    const saved = sessionStorage.getItem(DISTRICT_KEY) ?? '';
    return (BEZIRKE as readonly string[]).includes(saved) ? saved : '';
  } catch {
    return '';
  }
};

const DistrictSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const active = value !== '';
  return (
    <label
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 28px 5px 10px',
        borderRadius: r(-6),
        border: `1.5px solid ${active ? '#4F90DE' : '#d9d6cf'}`,
        background: active ? '#eef4fc' : '#fff',
        color: active ? '#2f6fbf' : '#3f3d39',
        font: `700 11.5px ${FONT}`,
        cursor: 'pointer',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      <span style={{ font: 'inherit' }}>{value || 'Alle Bezirke'}</span>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        aria-hidden="true"
        style={{ position: 'absolute', right: 10 }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <select
        aria-label="Nach Bezirk filtern"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
      >
        <option value="">Alle Bezirke</option>
        {BEZIRKE.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </label>
  );
};

const FilterBar = ({
  answers,
  district,
  onDistrictChange,
}: {
  answers: UserAnswers;
  district: string;
  onDistrictChange: (v: string) => void;
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7, marginBottom: 18 }}>
    <DistrictSelect value={district} onChange={onDistrictChange} />
    <AnswerChips answers={answers} />
  </div>
);

const AnswerChips = ({ answers }: { answers: UserAnswers }) => {

  const labels = Object.values(answers)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === 'string' && value.length > 0 && value.length < 40)
    .slice(0, 6);

  if (!labels.length) return null;

  return (
    <>
      {labels.map((label) => (
        <span
          key={label}
          style={{
            font: `600 11.5px ${FONT}`,
            padding: '5px 10px',
            borderRadius: r(-6),
            background: '#f2f1ed',
            color: '#6f6c65',
            border: '1px solid #e8e6e0',
          }}
        >
          {label}
        </span>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ *
 * Story-Karte (mobil) — gesättigte Farbe, ein Angebot pro Screen
 * ------------------------------------------------------------------ */
const StoryCard = ({ funding, onOpen }: { funding: Funding; onOpen: () => void }) => {
  const scheme = schemeOf(funding);
  const circle: React.CSSProperties = {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'rgba(255,255,255,.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 19,
    color: '#fff',
    cursor: 'pointer',
  };

  return (
    <div
      className="snap-start"
      style={{
        minHeight: '100%',
        boxSizing: 'border-box',
        padding: '32px 26px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `linear-gradient(160deg, ${scheme.g1}, ${scheme.g2})`,
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CategoryChip funding={funding} label={categoryOf(funding)} onDark />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={circle}>♡</div>
          <div style={circle}>↗</div>
        </div>
      </div>

      <div>
        <div style={{ font: `800 30px/1.1 ${FONT}`, marginBottom: 10 }}>{funding.title}</div>
        <div style={{ font: `600 14px ${FONT}`, opacity: 0.75, marginBottom: 12 }}>
          {funding.organization}
        </div>
        <div style={{ font: `400 15px/1.55 ${FONT}`, opacity: 0.9, marginBottom: 18 }}>
          {funding.description}
        </div>
        {funding.amount && (
          <div
            style={{
              display: 'inline-block',
              font: `700 14px ${FONT}`,
              color: scheme.g2,
              background: '#fff',
              padding: '9px 15px',
              borderRadius: r(-5),
              marginBottom: 16,
            }}
          >
            {funding.amount}
          </div>
        )}
        <button
          type="button"
          onClick={onOpen}
          style={{
            width: '100%',
            border: 0,
            textAlign: 'center',
            font: `700 16px ${FONT}`,
            color: scheme.g2,
            background: '#fff',
            padding: 14,
            borderRadius: r(-2),
            cursor: 'pointer',
          }}
        >
          Details ansehen
        </button>
        <div style={{ textAlign: 'center', font: `600 12px ${FONT}`, opacity: 0.6, marginTop: 12 }}>
          ↑ weiter wischen
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Aufklappbare Kachel (Desktop) — Klick auf die Kachel genügt
 * ------------------------------------------------------------------ */
const ExpandableCard = ({
  funding,
  isOpen,
  onToggle,
  onClose,
}: {
  funding: Funding;
  isOpen: boolean;
  onToggle: () => void;
  onClose: (e: React.MouseEvent) => void;
}) => {
  const scheme = schemeOf(funding);

  const base: React.CSSProperties = {
    background: scheme.cardBg,
    border: `1px solid ${scheme.cardBorder}`,
    borderRadius: r(2),
    cursor: 'pointer',
  };

  if (!isOpen) {
    return (
      <div
        onClick={onToggle}
        style={{ ...base, padding: 20, minHeight: 186, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CategoryChip funding={funding} label={categoryOf(funding)} />
          <div style={{ font: `800 20px/1.18 ${FONT}`, color: '#111', margin: '13px 0 7px' }}>
            {funding.title}
          </div>
          <div style={{ font: `400 13.5px/1.55 ${FONT}`, color: '#6d6a65', flex: 1 }}>
            {funding.organization}
          </div>
          {funding.amount && (
            <div style={{ font: `700 14px ${FONT}`, color: scheme.accent, marginTop: 12 }}>
              {funding.amount}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onToggle}
      style={{
        ...base,
        gridColumn: '1 / -1',
        padding: 28,
        boxShadow: '0 10px 34px rgba(0,0,0,.07)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 }}>
        <div>
          <CategoryChip funding={funding} label={categoryOf(funding)} />
          <div style={{ font: `800 30px/1.12 ${FONT}`, color: '#111', margin: '14px 0 7px' }}>
            {funding.title}
          </div>
          <div style={{ font: `600 14px ${FONT}`, color: scheme.accent }}>{funding.organization}</div>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div style={{ marginTop: 20 }}>
        <DetailPanel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
              gap: 38,
              alignItems: 'start',
            }}
          >
            <div style={{ font: `400 16px/1.7 ${FONT}`, color: '#403d39' }}>{funding.description}</div>
            <DetailRows funding={funding} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
            <ApplyButton funding={funding} />
          </div>
        </DetailPanel>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Desktop-Story: eine Karte, wächst beim Klick in die Breite
 * ------------------------------------------------------------------ */
const DesktopStory = ({ fundings }: { fundings: Funding[] }) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const funding = fundings[index];
  const scheme = schemeOf(funding);

  const step = (delta: number) => {
    setOpen(false);
    setIndex((prev) => (prev + delta + fundings.length) % fundings.length);
  };

  const arrow: React.CSSProperties = {
    width: 52,
    height: 52,
    flex: 'none',
    borderRadius: '50%',
    background: '#fff',
    border: '1px solid #e2e2e2',
    fontSize: 24,
    color: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };
  const circle: React.CSSProperties = {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'rgba(255,255,255,.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 19,
    color: '#fff',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ font: `600 13px ${FONT}`, color: '#9a9a9a' }}>
        Fokus-Modus — ein Angebot nach dem anderen
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, maxWidth: '100%' }}>
        <button type="button" onClick={() => step(-1)} style={{ ...arrow, border: '1px solid #e2e2e2' }}>
          ‹
        </button>

        <div
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: open ? 820 : 520,
            maxWidth: '100%',
            minHeight: 376,
            boxSizing: 'border-box',
            borderRadius: r(4),
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `linear-gradient(160deg, ${scheme.g1}, ${scheme.g2})`,
            color: '#fff',
            cursor: 'pointer',
            transition: 'width .4s cubic-bezier(.4,.85,.2,1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <CategoryChip funding={funding} label={categoryOf(funding)} onDark />
            <div style={{ display: 'flex', gap: 10 }}>
              {open ? (
                <CloseButton
                  onDark
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                />
              ) : (
                <>
                  <div style={circle}>♡</div>
                  <div style={circle}>↗</div>
                </>
              )}
            </div>
          </div>

          <div>
            <div style={{ font: `800 35px/1.08 ${FONT}`, marginBottom: 12 }}>{funding.title}</div>
            <div style={{ font: `600 16px ${FONT}`, opacity: 0.75, marginBottom: 14 }}>
              {funding.organization}
            </div>

            {open ? (
              <DetailPanel>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                    gap: 34,
                    alignItems: 'start',
                  }}
                >
                  <div style={{ font: `400 15.5px/1.7 ${FONT}`, color: '#403d39' }}>
                    {funding.description}
                  </div>
                  <DetailRows funding={funding} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <ApplyButton funding={funding} />
                </div>
              </DetailPanel>
            ) : (
              <div>
                <div
                  style={{
                    font: `400 17px/1.6 ${FONT}`,
                    opacity: 0.9,
                    marginBottom: 22,
                    maxWidth: 460,
                  }}
                >
                  {funding.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {funding.amount && (
                    <span
                      style={{
                        font: `700 15px ${FONT}`,
                        color: scheme.g2,
                        background: '#fff',
                        padding: '11px 18px',
                        borderRadius: r(-5),
                      }}
                    >
                      {funding.amount}
                    </span>
                  )}
                  <span
                    style={{
                      font: `700 15px ${FONT}`,
                      color: scheme.g2,
                      background: '#fff',
                      padding: '11px 18px',
                      borderRadius: r(-5),
                    }}
                  >
                    Details ansehen →
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="button" onClick={() => step(1)} style={arrow}>
          ›
        </button>
      </div>

      <div style={{ font: `700 14px ${FONT}`, color: '#9a9a9a' }}>
        {index + 1} / {fundings.length}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * Zeilen "Weil du … angeklickt hast"
 * ------------------------------------------------------------------ */
const VISIBLE_PER_ROW = 6;
const REST_KEY = '__rest__';

const reasonTitle = (group: ReasonGroup<Funding>) =>
  group.key === REST_KEY ? 'Weitere Angebote für deine Altersgruppe' : `Weil du „${group.option}“ angeklickt hast`;

const ReasonHeading = ({ group, large = false }: { group: ReasonGroup<Funding>; large?: boolean }) => (
  <div style={{ padding: large ? '0 0 14px' : '26px 0 8px' }}>
    <div style={{ font: `800 ${large ? 20 : 18}px/1.25 ${FONT}`, color: '#111' }}>{reasonTitle(group)}</div>
    <div style={{ font: `500 ${large ? 13 : 12}px ${FONT}`, color: '#8d8d8d', marginTop: 3 }}>
      {group.fundings.length} {group.fundings.length === 1 ? 'passendes Angebot' : 'passende Angebote'}
    </div>
  </div>
);

const RailCard = ({ funding, onOpen }: { funding: Funding; onOpen: () => void }) => {
  const scheme = schemeOf(funding);
  return (
    <div
      onClick={onOpen}
      className="snap-start"
      style={{
        flex: 'none',
        width: 178,
        height: 152,
        background: scheme.cardBg,
        border: `1px solid ${scheme.cardBorder}`,
        borderTop: `4px solid ${scheme.accent}`,
        borderRadius: r(),
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      <CategoryChip funding={funding} label={categoryOf(funding)} />
      <div
        style={{
          font: `800 17px/1.2 ${FONT}`,
          color: '#111',
          marginTop: 'auto',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {funding.title}
      </div>
      <div
        style={{
          font: `500 12px ${FONT}`,
          color: '#8d8d8d',
          marginTop: 5,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {funding.organization}
      </div>
    </div>
  );
};

const MoreCard = ({ hidden, onClick }: { hidden: number; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="snap-start"
    style={{
      flex: 'none',
      width: 120,
      height: 152,
      borderRadius: r(),
      border: '1px dashed #d6d3cc',
      background: '#faf9f6',
      color: '#3f3d39',
      font: `700 14px/1.3 ${FONT}`,
      cursor: 'pointer',
    }}
  >
    +{hidden}
    <br />
    weitere
  </button>
);

/* ------------------------------------------------------------------ *
 * Hauptkomponente
 * ------------------------------------------------------------------ */
const ResultsScreen = ({ fundings: allFundings, answers }: { fundings: Funding[]; answers: UserAnswers }) => {
  // Bezirksfilter: berlinweite Angebote (ohne Bezirk) bleiben immer sichtbar,
  // bezirkliche Angebote nur im gewählten Bezirk.
  const [district, setDistrictState] = useState<string>(readDistrict);
  const setDistrict = (value: string) => {
    setDistrictState(value);
    try {
      if (value) sessionStorage.setItem(DISTRICT_KEY, value);
      else sessionStorage.removeItem(DISTRICT_KEY);
    } catch {
      /* Speicher nicht verfügbar, Filter gilt dann nur bis zum Neuladen */
    }
  };
  const fundings = useMemo(
    () =>
      district
        ? allFundings.filter((f) => !f.district || f.district.length === 0 || f.district.includes(district))
        : allFundings,
    [allFundings, district],
  );

  // Handy und Laptop haben getrennte Modi: mobil startet die Story-Ansicht
  // genauso ruhig in der Übersicht, kann aber unabhängig umgeschaltet werden.
  const [mobileMode, setMobileMode] = useState<Mode>('overview');
  const [desktopMode, setDesktopMode] = useState<Mode>('overview');

  const [sheetFunding, setSheetFunding] = useState<Funding | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const expand = (key: string) => setExpanded((prev) => new Set(prev).add(key));

  // Top-Treffer oben, darunter je angeklickter Antwort eine eigene Zeile.
  // Jedes Angebot erscheint genau einmal. Angebote ohne Bezug zu einer
  // Antwort (Auffüllung bei sehr wenigen Treffern) landen in einer Restzeile.
  const { groups, ordered } = useMemo(() => {
    const top = fundings.slice(0, 4);
    const exclude = new Set(top.map((f) => f.id));
    const reasonGroups = buildReasonGroups(fundings, answers, { exclude });
    const placed = new Set<string>(exclude);
    reasonGroups.forEach((g) => g.fundings.forEach((f) => placed.add(f.id)));
    const rest = fundings.filter((f) => !placed.has(f.id));
    if (rest.length > 0) {
      reasonGroups.push({ key: REST_KEY, option: '', question: '', tag: '', fundings: rest });
    }
    return { groups: reasonGroups, ordered: [...top, ...reasonGroups.flatMap((g) => g.fundings)] };
  }, [fundings, answers]);

  const count = useCountUp(fundings.length);

  if (!fundings.length) {
    return (
      <div style={{ padding: '20px 0' }}>
        <FilterBar answers={answers} district={district} onDistrictChange={setDistrict} />
        <div style={{ textAlign: 'center', padding: '50px 20px', font: `500 16px ${FONT}`, color: '#6d6a65' }}>
          Für deine Angaben haben wir noch keine passenden Angebote gefunden.
        </div>
      </div>
    );
  }

  const [hero, ...rest] = fundings;
  const ranked = rest.slice(0, 3);
  const heroScheme = schemeOf(hero);

  const toggleCard = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <>
      {/* ============================= HANDY ============================= */}
      <div className="lg:hidden">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '4px 0 14px',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ font: `800 23px ${FONT}`, color: '#111' }}>Deine Ergebnisse</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 7,
                font: `500 13px ${FONT}`,
                color: '#9a9a9a',
                marginTop: 4,
              }}
            >
              <span style={{ ...count.style, fontSize: 39, lineHeight: 1, transformOrigin: 'left bottom' }}>
                {count.value}
              </span>
              <span style={{ font: 'inherit' }}>
                {district ? `Angebote passen zu dir in ${district}` : 'Angebote passen zu dir'}
              </span>
            </div>
          </div>
          <ModeToggle mode={mobileMode} onToggle={() => setMobileMode(mobileMode === 'overview' ? 'story' : 'overview')} />
        </div>

        {mobileMode === 'overview' ? (
          <div>
            <FilterBar answers={answers} district={district} onDistrictChange={setDistrict} />

            {/* Top-Treffer */}
            <div
              onClick={() => setSheetFunding(hero)}
              style={{
                borderRadius: r(3),
                padding: 22,
                background: heroScheme.heroBg,
                color: heroScheme.ink,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <CategoryChip funding={hero} label="Top-Treffer" />
              <div style={{ font: `800 25px/1.14 ${FONT}`, margin: '13px 0 8px' }}>{hero.title}</div>
              <div style={{ font: `400 14px/1.55 ${FONT}`, opacity: 0.78, marginBottom: 16 }}>
                {hero.description}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {hero.amount && (
                  <span
                    style={{
                      font: `700 14px ${FONT}`,
                      color: heroScheme.ink,
                      background: 'rgba(255,255,255,.75)',
                      border: '1px solid rgba(0,0,0,.05)',
                      padding: '9px 14px',
                      borderRadius: r(-5),
                    }}
                  >
                    {hero.amount}
                  </span>
                )}
                <span
                  style={{
                    font: `700 14px ${FONT}`,
                    color: '#fff',
                    background: heroScheme.accent,
                    padding: '9px 16px',
                    borderRadius: r(-5),
                  }}
                >
                  Details →
                </span>
              </div>
            </div>

            {/* Weitere Top-Treffer */}
            {ranked.length > 0 && (
              <>
                <div style={{ font: `800 18px ${FONT}`, color: '#111', padding: '24px 0 11px' }}>
                  Weitere Top-Treffer
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ranked.map((funding, i) => {
                    const scheme = schemeOf(funding);
                    return (
                      <div
                        key={funding.id}
                        onClick={() => setSheetFunding(funding)}
                        style={{
                          display: 'flex',
                          gap: 13,
                          alignItems: 'center',
                          padding: 14,
                          border: `1px solid ${scheme.cardBorder}`,
                          background: scheme.cardBg,
                          borderRadius: r(-2),
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            flex: 'none',
                            borderRadius: r(-5),
                            background: 'rgba(255,255,255,.75)',
                            color: scheme.accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            font: `800 15px ${FONT}`,
                          }}
                        >
                          {i + 2}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ font: `800 16px/1.25 ${FONT}`, color: '#111' }}>{funding.title}</div>
                          <div style={{ font: `500 12.5px ${FONT}`, color: '#8b8781', marginTop: 4 }}>
                            {funding.organization}
                            {funding.amount ? ` · ${funding.amount}` : ''}
                          </div>
                        </div>
                        <CategoryChip funding={funding} label={categoryOf(funding)} />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Je angeklickter Antwort eine Reihe */}
            {groups.map((group) => {
              const visible = expanded.has(group.key) ? group.fundings : group.fundings.slice(0, VISIBLE_PER_ROW);
              const hidden = group.fundings.length - visible.length;
              return (
                <section key={group.key}>
                  <ReasonHeading group={group} />
                  <div
                    className="snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                    style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '2px 0 12px', scrollbarWidth: 'none' }}
                  >
                    {visible.map((funding) => (
                      <RailCard key={funding.id} funding={funding} onOpen={() => setSheetFunding(funding)} />
                    ))}
                    {hidden > 0 && <MoreCard hidden={hidden} onClick={() => expand(group.key)} />}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div
            className="snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{
              height: 'calc(100vh - 210px)',
              overflowY: 'auto',
              borderRadius: r(2),
              overflowX: 'hidden',
              scrollbarWidth: 'none',
            }}
          >
            {ordered.map((funding) => (
              <StoryCard key={funding.id} funding={funding} onOpen={() => setSheetFunding(funding)} />
            ))}
          </div>
        )}
      </div>

      {/* ============================ LAPTOP ============================ */}
      <div className="hidden lg:block">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                font: `600 13px ${FONT}`,
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                color: '#4F90DE',
              }}
            >
              Deine Ergebnisse
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                font: `800 32px ${FONT}`,
                color: '#111',
                marginTop: 3,
              }}
            >
              <span style={{ ...count.style, fontSize: 96, lineHeight: 0.95, transformOrigin: 'left bottom' }}>
                {count.value}
              </span>
              <span style={{ font: 'inherit' }}>
                Angebote passen zu dir
                {district && (
                  <span style={{ display: 'block', font: `600 16px ${FONT}`, color: '#8d8d8d', marginTop: 4 }}>
                    berlinweit und in {district}
                  </span>
                )}
              </span>
            </div>
          </div>
          <ModeToggle
            large
            mode={desktopMode}
            onToggle={() => setDesktopMode(desktopMode === 'overview' ? 'story' : 'overview')}
          />
        </div>

        {desktopMode === 'overview' ? (
          <div>
            <FilterBar answers={answers} district={district} onDistrictChange={setDistrict} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: openId === hero.id ? '1fr' : 'minmax(0, 1.25fr) minmax(0, 1fr)',
                gap: 20,
                marginBottom: 32,
                alignItems: 'start',
              }}
            >
              {/* Top-Treffer — klappt an Ort und Stelle auf */}
              <div
                onClick={() => toggleCard(hero.id)}
                style={{
                  borderRadius: r(3),
                  padding: openId === hero.id ? 28 : '30px 32px',
                  background: heroScheme.heroBg,
                  color: heroScheme.ink,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: openId === hero.id ? undefined : 270,
                  cursor: 'pointer',
                }}
              >
                {openId === hero.id ? (
                  <div>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 }}
                    >
                      <div>
                        <CategoryChip funding={hero} label="Top-Treffer" />
                        <div style={{ font: `800 32px/1.1 ${FONT}`, color: '#111', margin: '14px 0 7px' }}>
                          {hero.title}
                        </div>
                        <div style={{ font: `600 14px ${FONT}`, color: heroScheme.accent }}>
                          {hero.organization}
                        </div>
                      </div>
                      <CloseButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId(null);
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <DetailPanel>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                            gap: 38,
                            alignItems: 'start',
                          }}
                        >
                          <div style={{ font: `400 16px/1.7 ${FONT}`, color: '#403d39' }}>
                            {hero.description}
                          </div>
                          <DetailRows funding={hero} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
                          <ApplyButton funding={hero} />
                        </div>
                      </DetailPanel>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}
                  >
                    <CategoryChip funding={hero} label="Top-Treffer" />
                    <div>
                      <div style={{ font: `800 33px/1.1 ${FONT}`, margin: '0 0 10px' }}>{hero.title}</div>
                      <div
                        style={{ font: `400 16px/1.6 ${FONT}`, opacity: 0.78, marginBottom: 22, maxWidth: 420 }}
                      >
                        {hero.description}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {hero.amount && (
                          <span
                            style={{
                              font: `700 15px ${FONT}`,
                              color: heroScheme.ink,
                              background: 'rgba(255,255,255,.75)',
                              border: '1px solid rgba(0,0,0,.05)',
                              padding: '10px 16px',
                              borderRadius: r(-5),
                            }}
                          >
                            {hero.amount}
                          </span>
                        )}
                        <span
                          style={{
                            font: `700 15px ${FONT}`,
                            color: '#fff',
                            background: heroScheme.accent,
                            padding: '10px 18px',
                            borderRadius: r(-5),
                          }}
                        >
                          Details ansehen →
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rangliste — jede Zeile klappt an Ort und Stelle auf */}
              {openId !== hero.id && ranked.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ font: `800 17px ${FONT}`, color: '#111' }}>Weitere Top-Treffer</div>
                  {ranked.map((funding, i) => {
                    const scheme = schemeOf(funding);
                    const isOpen = openId === funding.id;
                    return (
                      <div
                        key={funding.id}
                        onClick={() => toggleCard(funding.id)}
                        style={{
                          padding: isOpen ? 18 : 14,
                          border: `1px solid ${scheme.cardBorder}`,
                          background: scheme.cardBg,
                          borderRadius: r(-2),
                          cursor: 'pointer',
                          boxShadow: isOpen ? '0 8px 26px rgba(0,0,0,.07)' : undefined,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 13, alignItems: isOpen ? 'flex-start' : 'center' }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              flex: 'none',
                              borderRadius: r(-5),
                              background: 'rgba(255,255,255,.75)',
                              color: scheme.accent,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              font: `800 15px ${FONT}`,
                            }}
                          >
                            {i + 2}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ font: `800 ${isOpen ? 19 : 16}px/1.25 ${FONT}`, color: '#111' }}>
                              {funding.title}
                            </div>
                            <div
                              style={{
                                font: `${isOpen ? 600 : 500} 12.5px ${FONT}`,
                                color: isOpen ? scheme.accent : '#8b8781',
                                marginTop: 4,
                              }}
                            >
                              {funding.organization}
                              {!isOpen && funding.amount ? ` · ${funding.amount}` : ''}
                            </div>
                          </div>
                          {isOpen ? (
                            <CloseButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenId(null);
                              }}
                            />
                          ) : (
                            <CategoryChip funding={funding} label={categoryOf(funding)} />
                          )}
                        </div>

                        {isOpen && (
                          <div style={{ marginTop: 16 }}>
                            <DetailPanel>
                              <div
                                style={{
                                  font: `400 14.5px/1.65 ${FONT}`,
                                  color: '#403d39',
                                  paddingBottom: 18,
                                  borderBottom: '1px solid #f0eeea',
                                }}
                              >
                                {funding.description}
                              </div>
                              <div style={{ paddingTop: 18 }}>
                                <DetailRows funding={funding} />
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                                <ApplyButton funding={funding} />
                              </div>
                            </DetailPanel>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {groups.map((group) => {
              const visible = expanded.has(group.key) ? group.fundings : group.fundings.slice(0, VISIBLE_PER_ROW);
              const hidden = group.fundings.length - visible.length;
              return (
                <section key={group.key} style={{ marginBottom: 36 }}>
                  <ReasonHeading group={group} large />
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: 16,
                      alignItems: 'start',
                    }}
                  >
                    {visible.map((funding) => (
                      <ExpandableCard
                        key={funding.id}
                        funding={funding}
                        isOpen={openId === funding.id}
                        onToggle={() => toggleCard(funding.id)}
                        onClose={(e) => {
                          e.stopPropagation();
                          setOpenId(null);
                        }}
                      />
                    ))}
                  </div>
                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={() => expand(group.key)}
                      style={{
                        marginTop: 14,
                        padding: '10px 18px',
                        borderRadius: r(-3),
                        border: '1px solid #e5e3de',
                        background: '#fff',
                        color: '#3f3d39',
                        font: `700 14px ${FONT}`,
                        cursor: 'pointer',
                      }}
                    >
                      Alle {group.fundings.length} anzeigen
                    </button>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <DesktopStory fundings={ordered} />
        )}
      </div>

      {/* Bottom-Sheet nur mobil */}
      <DetailSheet funding={sheetFunding} onClose={() => setSheetFunding(null)} />
    </>
  );
};

export default ResultsScreen;
