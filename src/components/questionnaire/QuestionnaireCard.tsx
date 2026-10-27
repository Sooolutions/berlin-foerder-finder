import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { getQuestionData } from '@/data/questionnaireData';
import { getQuestionInfo } from '@/data/questionInfo';

const FONT = "'Outfit', system-ui, sans-serif";
const ACCENT = '#4F90DE';
const KICKER = '#EE7A82';
const SLIDE_MS = 420;

/** Grobe Restschätzung, damit die Fortschrittssegmente stabil bleiben. */
const remainingSteps = (questionId: string): number => {
  const match = questionId.match(/^Q(\d+)/i);
  const num = match ? parseInt(match[1], 10) : 10;
  if (num <= 1) return 9;
  if (num <= 6) return 10 - num;
  if (num <= 8) return 3;
  if (num === 9) return 1;
  return 0;
};

/**
 * Dichtestufen, damit jede Frage ohne Scrollen auf einen Bildschirm passt.
 * Die Karte misst nach dem Rendern, ob der Inhalt überläuft, und schaltet
 * so lange eine Stufe kompakter, bis alles sichtbar ist. Ab Stufe 2 stehen
 * die Antworten in zwei Spalten.
 */
const DENSITY = [
  { title: 29, hint: true, cols: 1, pad: '17px 18px', font: 16, gap: 11, radio: 22 },
  { title: 25, hint: true, cols: 1, pad: '12px 14px', font: 15, gap: 8, radio: 20 },
  { title: 23, hint: true, cols: 2, pad: '10px 12px', font: 14, gap: 8, radio: 18 },
  { title: 21, hint: false, cols: 2, pad: '8px 10px', font: 13, gap: 6, radio: 16 },
  { title: 19, hint: false, cols: 2, pad: '7px 9px', font: 12.5, gap: 5, radio: 0 },
] as const;
const MAX_DENSITY = DENSITY.length - 1;

const iconButton = (size = 38): React.CSSProperties => ({
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
const InfoButton = ({ text, resetKey, size = 38 }: { text: string; resetKey: string; size?: number }) => {
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
        aria-label="Warum fragen wir das?"
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
            textAlign: 'left',
          }}
        >
          <div style={{ font: `700 12px ${FONT}`, letterSpacing: '.05em', textTransform: 'uppercase', color: KICKER, marginBottom: 5 }}>
            Warum fragen wir das?
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
const IntroOverlay = ({ onStart }: { onStart: () => void }) => {
  const points = [
    'Etwa 10 Fragen, rund zwei Minuten',
    'Keine Anmeldung, keine Namen, keine Kontaktdaten',
    'Über das Fragezeichen erfährst du, warum wir etwas fragen',
  ];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        background: 'rgba(255,255,255,.96)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px 24px 12px' }}>
        <div style={{ font: `700 13px ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: KICKER, marginBottom: 9 }}>
          Bevor es losgeht
        </div>
        <div id="intro-title" style={{ font: `800 28px/1.12 ${FONT}`, color: '#111', marginBottom: 14 }}>
          Nur Fragen, die für deine Förderung zählen
        </div>
        <div style={{ font: `400 15.5px/1.55 ${FONT}`, color: '#4a4844', marginBottom: 20 }}>
          Wir stellen dir nur Fragen, die relevant sind, um dir passende Förderungen und Angebote anzuzeigen.
          Nichts davon speichern wir. Deine Antworten nutzen wir ausschließlich, um unsere Datenbank passend
          zu deiner Situation zu filtern.
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
          Deine Antworten bleiben nur in diesem Browserfenster und werden gelöscht, sobald du es schließt.
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
          Los geht's
        </button>
      </div>
    </div>
  );
};

/**
 * Fragebogen im Story-Stil: eine Frage pro Screen, Auswahl bestätigt man
 * mit „Weiter". Der Wechsel läuft vertikal — vorwärts scrollt nach unten,
 * „Zurück" nach oben.
 */
const QuestionnaireCard = () => {
  const navigate = useNavigate();
  const {
    currentQuestionId,
    answers,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    questionHistory,
    isLastQuestion,
  } = useQuestionnaire();

  const [multiSelections, setMultiSelections] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [transition, setTransition] = useState(true);
  const [showIntro, setShowIntro] = useState(() => questionHistory.length <= 1);
  const [density, setDensity] = useState(0);
  const [viewport, setViewport] = useState(() => `${window.innerWidth}x${window.innerHeight}`);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const fitReset = useRef(true);

  const questionData = getQuestionData(currentQuestionId);
  const isMultiSelect = questionData?.multiSelect === true;
  const maxSelections = questionData?.maxSelections ?? 3;
  const level = DENSITY[density];
  // Ab Stufe 3 wird auch der Rahmen um die Frage schmaler
  const tight = density >= 3;
  const isPhone = parseInt(viewport, 10) < 768;
  const iconSize = tight ? 32 : 38;

  useEffect(() => {
    const existing = answers[currentQuestionId];
    setMultiSelections(Array.isArray(existing) ? existing : []);
  }, [currentQuestionId]);

  useEffect(() => {
    if (isLastQuestion) navigate('/results');
  }, [isLastQuestion, navigate]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Bei Größenänderung neu einpassen
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setViewport(`${window.innerWidth}x${window.innerHeight}`));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Neue Frage oder neue Fenstergröße: wieder mit der luftigsten Stufe beginnen
  useLayoutEffect(() => {
    fitReset.current = true;
    setDensity(0);
  }, [currentQuestionId, viewport]);

  // Läuft der Inhalt über, eine Stufe kompakter (vor dem Zeichnen, daher ohne Flackern).
  // Nach einem Reset wird erst gemessen, wenn wirklich Stufe 0 gerendert ist.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (fitReset.current) {
      if (density !== 0) return;
      fitReset.current = false;
    }
    if (density >= MAX_DENSITY) return;
    if (el.scrollHeight > el.clientHeight + 1) setDensity((d) => Math.min(d + 1, MAX_DENSITY));
  }, [density, currentQuestionId, viewport]);

  const totalSteps = questionHistory.length + remainingSteps(currentQuestionId);
  const currentStep = questionHistory.length;

  /**
   * Vertikaler Wechsel in drei Phasen:
   * 1. aktuelle Frage aus dem Bild schieben
   * 2. Frage wechseln und die neue ohne Transition auf die Gegenseite setzen
   * 3. neue Frage in die Mitte fahren
   */
  const slide = (direction: 'forward' | 'backward', commit: () => void) => {
    if (animating) return;
    setAnimating(true);
    setTransition(true);
    setOffset(direction === 'forward' ? -100 : 100);

    timers.current.push(
      setTimeout(() => {
        commit();
        setTransition(false);
        setOffset(direction === 'forward' ? 100 : -100);

        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setTransition(true);
            setOffset(0);
            timers.current.push(setTimeout(() => setAnimating(false), SLIDE_MS));
          }),
        );
      }, SLIDE_MS),
    );
  };

  const selected = answers[currentQuestionId];
  const canContinue = isMultiSelect ? multiSelections.length > 0 : typeof selected === 'string' && !!selected;

  const handleSelect = (option: string) => {
    if (animating) return;
    if (isMultiSelect) {
      setMultiSelections((prev) => {
        if (prev.includes(option)) return prev.filter((v) => v !== option);
        if (prev.length >= maxSelections) return prev;
        return [...prev, option];
      });
      return;
    }
    updateAnswer(currentQuestionId, option);
  };

  const handleNext = () => {
    if (!canContinue || animating) return;
    if (isMultiSelect) {
      updateAnswer(currentQuestionId, multiSelections);
      slide('forward', () => goToNextQuestion());
    } else {
      slide('forward', () => goToNextQuestion(selected as string));
    }
  };

  const handleBack = () => {
    if (animating) return;
    if (questionHistory.length <= 1) {
      navigate('/');
      return;
    }
    slide('backward', () => goToPreviousQuestion());
  };

  if (!questionData) {
    return (
      <div style={{ textAlign: 'center', padding: 40, font: `500 16px ${FONT}`, color: '#6d6a65' }}>
        Diese Frage konnte nicht geladen werden.{' '}
        <button type="button" onClick={() => navigate('/')} style={{ color: ACCENT, background: 'none', border: 0, cursor: 'pointer' }}>
          Neu starten
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #eceae5',
        display: 'flex',
        flexDirection: 'column',
        // Handy: Seitenkopf ist ausgeblendet, die Karte nutzt fast die ganze Höhe
        height: isPhone ? 'calc(100dvh - 24px)' : 'min(740px, calc(100dvh - 130px))',
        minHeight: 420,
        overflow: 'hidden',
      }}
    >
      {showIntro && <IntroOverlay onStart={() => setShowIntro(false)} />}

      {/* Fortschritt in Segmenten */}
      <div style={{ display: 'flex', gap: 6, padding: tight ? '10px 22px 0' : '16px 22px 0', flex: 'none' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 99,
              background: i < currentStep ? ACCENT : '#e4e4e4',
              transition: 'background .3s',
            }}
          />
        ))}
      </div>

      {/* Kopfzeile: Zurück, Fragenzähler, Hilfe, Schließen */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: tight ? '8px 22px 0' : '12px 22px 0',
          flex: 'none',
        }}
      >
        <button type="button" onClick={handleBack} aria-label="Zurück" style={{ ...iconButton(iconSize), fontSize: 18 }}>
          ‹
        </button>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            font: `700 13px ${FONT}`,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: KICKER,
          }}
        >
          Frage {currentStep} von {totalSteps}
        </div>
        <InfoButton text={getQuestionInfo(currentQuestionId, questionData.question)} resetKey={currentQuestionId} size={iconSize} />
        <button type="button" onClick={() => navigate('/')} aria-label="Fragebogen verlassen" style={{ ...iconButton(iconSize), fontSize: 16 }}>
          ✕
        </button>
      </div>

      {/* Frage — vertikal wechselnd */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            transform: `translateY(${offset}%)`,
            opacity: offset === 0 ? 1 : 0,
            transition: transition
              ? `transform ${SLIDE_MS}ms cubic-bezier(.4,.85,.2,1), opacity ${SLIDE_MS}ms ease`
              : 'none',
          }}
        >
          <div
            ref={contentRef}
            className="[&::-webkit-scrollbar]:hidden"
            style={{
              height: '100%',
              boxSizing: 'border-box',
              padding: tight ? '10px 22px 4px' : density >= 2 ? '14px 22px 6px' : '18px 22px 8px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <div style={{ font: `800 ${level.title}px/1.12 ${FONT}`, color: '#111', marginBottom: level.hint ? 8 : tight ? 9 : 12 }}>
              {questionData.question}
            </div>

            {level.hint && (
              <div style={{ font: `400 14px/1.45 ${FONT}`, color: '#8b8781', marginBottom: density >= 2 ? 12 : 18 }}>
                {isMultiSelect
                  ? `Wähle bis zu ${maxSelections} Optionen.`
                  : 'Wähle die Option, die am besten passt.'}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
                gap: level.gap,
              }}
            >
              {questionData.options.map((option) => {
                const isSelected = isMultiSelect ? multiSelections.includes(option) : selected === option;
                const isDisabled = isMultiSelect && !isSelected && multiSelections.length >= maxSelections;

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => !isDisabled && handleSelect(option)}
                    disabled={isDisabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: density >= 2 ? 9 : 14,
                      padding: level.pad,
                      textAlign: 'left',
                      borderRadius: density >= 2 ? 11 : 13,
                      border: `2px solid ${isSelected ? ACCENT : '#ececec'}`,
                      background: isSelected ? '#eef4fc' : '#fff',
                      opacity: isDisabled ? 0.45 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      transition: 'border-color .18s, background .18s, opacity .18s',
                    }}
                  >
                    {level.radio > 0 && (
                    <span
                      style={{
                        width: level.radio,
                        height: level.radio,
                        flex: 'none',
                        borderRadius: isMultiSelect ? 6 : '50%',
                        border: `2px solid ${isSelected ? ACCENT : '#cfcfcf'}`,
                        background: isSelected ? ACCENT : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected &&
                        (isMultiSelect ? (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                        ))}
                    </span>
                    )}
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        font: `600 ${level.font}px/1.28 ${FONT}`,
                        color: '#111',
                        hyphens: 'auto',
                        overflowWrap: 'anywhere',
                      }}
                      lang="de"
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: tight ? '8px 22px 14px' : density >= 2 ? '10px 22px 18px' : '12px 22px 22px', flex: 'none' }}>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue || animating}
          style={{
            width: '100%',
            border: 0,
            textAlign: 'center',
            font: `700 17px ${FONT}`,
            padding: tight ? 12 : density >= 2 ? 14 : 16,
            borderRadius: 13,
            background: canContinue ? ACCENT : '#ececec',
            color: canContinue ? '#fff' : '#adadad',
            cursor: canContinue ? 'pointer' : 'default',
            transition: 'all .18s',
          }}
        >
          {isMultiSelect ? `Weiter (${multiSelections.length}/${maxSelections})` : 'Weiter'}
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireCard;
