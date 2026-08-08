import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { getQuestionData } from '@/data/questionnaireData';

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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const questionData = getQuestionData(currentQuestionId);
  const isMultiSelect = questionData?.multiSelect === true;
  const maxSelections = questionData?.maxSelections ?? 3;

  useEffect(() => {
    const existing = answers[currentQuestionId];
    setMultiSelections(Array.isArray(existing) ? existing : []);
  }, [currentQuestionId]);

  useEffect(() => {
    if (isLastQuestion) navigate('/results');
  }, [isLastQuestion, navigate]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

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
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #eceae5',
        display: 'flex',
        flexDirection: 'column',
        height: 'min(720px, calc(100vh - 160px))',
        overflow: 'hidden',
      }}
    >
      {/* Fortschritt in Segmenten */}
      <div style={{ display: 'flex', gap: 6, padding: '16px 22px 0', flex: 'none' }}>
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 22px 0',
          flex: 'none',
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          aria-label="Zurück"
          style={{
            width: 38,
            height: 38,
            border: 0,
            borderRadius: 11,
            background: '#f1f1f1',
            fontSize: 18,
            color: '#111',
            cursor: 'pointer',
          }}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Fragebogen verlassen"
          style={{
            width: 38,
            height: 38,
            border: 0,
            borderRadius: 11,
            background: '#f1f1f1',
            fontSize: 16,
            color: '#111',
            cursor: 'pointer',
          }}
        >
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
            className="[&::-webkit-scrollbar]:hidden"
            style={{
              height: '100%',
              boxSizing: 'border-box',
              padding: '20px 22px 8px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <div
              style={{
                font: `700 13px ${FONT}`,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: KICKER,
                marginBottom: 9,
              }}
            >
              Frage {currentStep} von {totalSteps}
            </div>

            <div style={{ font: `800 29px/1.1 ${FONT}`, color: '#111', marginBottom: 10 }}>
              {questionData.question}
            </div>

            <div style={{ font: `400 14px/1.5 ${FONT}`, color: '#8b8781', marginBottom: 22 }}>
              {isMultiSelect
                ? `Wähle bis zu ${maxSelections} Optionen.`
                : 'Wähle die Option, die am besten passt.'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
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
                      gap: 14,
                      padding: '17px 18px',
                      textAlign: 'left',
                      borderRadius: 13,
                      border: `2px solid ${isSelected ? ACCENT : '#ececec'}`,
                      background: isSelected ? '#eef4fc' : '#fff',
                      opacity: isDisabled ? 0.45 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      transition: 'all .18s',
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        flex: 'none',
                        borderRadius: isMultiSelect ? 7 : '50%',
                        border: `2px solid ${isSelected ? ACCENT : '#cfcfcf'}`,
                        background: isSelected ? ACCENT : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected &&
                        (isMultiSelect ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }} />
                        ))}
                    </span>
                    <span style={{ flex: 1, font: `600 16px ${FONT}`, color: '#111' }}>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 22px', flex: 'none' }}>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue || animating}
          style={{
            width: '100%',
            border: 0,
            textAlign: 'center',
            font: `700 17px ${FONT}`,
            padding: 16,
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
