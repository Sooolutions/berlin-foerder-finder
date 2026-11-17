import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire, type UserAnswers } from '@/context/QuestionnaireContext';
import { getOptionLabel, getQuestionData, getQuestionText, getVisibleOptions } from '@/data/questionnaireData';
import { getQuestionInfo } from '@/data/questionInfo';
import { computePath, nextSectionAfter, sanitizeAnswers, SECTIONS } from '@/questionnaire/flow';
import { trackSection } from '@/questionnaire/tracking';
import { getLang, tr } from '@/i18n/LanguageContext';
import { ACCENT, DFONT, FONT, iconButton, InfoButton, IntroOverlay, KICKER } from './QuestionnaireParts';

/**
 * Fragebogen als durchgehender Feed (Phase 4 des Umbaus, November 2026).
 *
 * Alle bisher beantworteten Fragen stehen als kompakte Antwortzeilen unter
 * ihrem Abschnitt und lassen sich durch Antippen an Ort und Stelle ändern.
 * Die aktuelle Frage steht darunter, Folgefragen erscheinen direkt unter
 * ihr. Was noch kommt, wird nicht angezeigt, nur der nächste Abschnitt als
 * kurzer Hinweis. Einzelauswahl geht nach dem Antippen sofort weiter,
 * Mehrfachauswahl mit „Weiter“.
 *
 * Der Verlauf ist eine reine Funktion der Antworten (computePath). Ändert
 * jemand eine frühere Antwort, bereinigt sanitizeAnswers abhängige Antworten,
 * die nicht mehr passen, und der Feed baut sich neu auf.
 */

const asList = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Platz für die klebende Fortschrittsleiste beim Hinscrollen */
const SCROLL_MARGIN = 84;

/* ------------------------------------------------------------------ *
 * Antwortoption
 * ------------------------------------------------------------------ */
const OptionButton = ({
  label, selected, multi, disabled, onClick,
}: { label: string; selected: boolean; multi: boolean; disabled: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className="md-option"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      textAlign: 'start',
      borderRadius: 14,
      border: `2px solid ${selected ? ACCENT : 'var(--md-line)'}`,
      background: selected ? 'var(--md-brand-tint)' : 'var(--md-surface)',
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: '100%',
    }}
  >
    <span
      aria-hidden
      className="md-option-mark"
      style={{
        width: 20,
        height: 20,
        flex: 'none',
        borderRadius: multi ? 6 : '50%',
        border: `2px solid ${selected ? ACCENT : 'var(--md-line-strong)'}`,
        background: selected ? ACCENT : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected && (multi ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
      ))}
    </span>
    <span
      lang={getLang()}
      style={{ flex: 1, minWidth: 0, font: `600 15.5px/1.3 ${FONT}`, color: 'var(--md-ink)', hyphens: 'auto', overflowWrap: 'anywhere' }}
    >
      {label}
    </span>
  </button>
);

/* ------------------------------------------------------------------ *
 * Eine Frage, offen zum Beantworten oder Ändern
 * ------------------------------------------------------------------ */
const QuestionBlock = ({
  questionId, answers, editing, onCommit, onCancel,
}: {
  questionId: string;
  answers: UserAnswers;
  editing: boolean;
  onCommit: (value: string | string[]) => void;
  onCancel: () => void;
}) => {
  const q = getQuestionData(questionId)!;
  const multi = q.multiSelect === true;
  const max = q.maxSelections ?? 3;
  const visible = getVisibleOptions(questionId, answers);
  const visibleIds = new Set(visible.map((o) => o.id));
  const [draft, setDraft] = useState<string[]>(() => asList(answers[questionId]).filter((id) => visibleIds.has(id)));
  const showGroups = new Set(visible.map((o) => o.group).filter(Boolean)).size > 1;
  const exclusive = (id: string) => q.options.find((o) => o.id === id)?.exclusive === true;

  const toggle = (id: string) =>
    setDraft((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      // „Nichts davon“ und Ähnliches schließen andere Antworten aus und umgekehrt
      if (exclusive(id)) return [id];
      const rest = prev.filter((v) => !exclusive(v));
      return rest.length >= max ? rest : [...rest, id];
    });

  const single = !multi ? (answers[questionId] as string | undefined) : undefined;

  return (
    <motion.div
      id={`frage-${questionId}`}
      role="group"
      aria-labelledby={`titel-${questionId}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        scrollMarginTop: SCROLL_MARGIN,
        background: 'var(--md-surface)',
        border: `1px solid ${editing ? ACCENT : 'var(--md-line)'}`,
        borderRadius: 20,
        padding: 'clamp(18px, 3vw, 26px)',
        marginTop: 12,
        boxShadow: 'var(--md-shadow-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <h2
          id={`titel-${questionId}`}
          data-frage-titel
          tabIndex={-1}
          style={{ flex: 1, font: `var(--md-display-weight) clamp(21px, 2.4vw, 26px)/1.18 ${DFONT}`, letterSpacing: '-0.01em', color: 'var(--md-ink)', margin: 0, outline: 'none' }}
        >
          {tr(getQuestionText(questionId, answers))}
        </h2>
        <InfoButton text={tr(getQuestionInfo(questionId))} resetKey={questionId} size={34} />
      </div>
      <div style={{ font: `400 14px/1.45 ${FONT}`, color: 'var(--md-ink-4)', margin: '6px 0 14px' }}>
        {multi ? tr('Wähle bis zu {n} Optionen.', { n: max }) : tr('Wähle die Option, die am besten passt.')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 8 }}>
        {visible.map((o, i) => {
          const header = showGroups && o.group && o.group !== visible[i - 1]?.group ? (
            <div key={`g-${o.group}`} style={{ gridColumn: '1 / -1', font: `700 12px ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--md-ink-4)', marginTop: i > 0 ? 8 : 0 }}>
              {tr(o.group)}
            </div>
          ) : null;
          const selected = multi ? draft.includes(o.id) : single === o.id;
          const disabled = multi && !selected && !exclusive(o.id) && draft.filter((v) => !exclusive(v)).length >= max;
          return [
            header,
            <OptionButton
              key={o.id}
              label={getOptionLabel(questionId, o.id, answers)}
              selected={selected}
              multi={multi}
              disabled={disabled}
              onClick={() => (multi ? toggle(o.id) : onCommit(o.id))}
            />,
          ];
        })}
      </div>

      {(multi || editing || q.optional) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 14 }}>
          {multi && (
            <button
              type="button"
              className="md-press"
              disabled={draft.length === 0}
              onClick={() => onCommit(draft)}
              style={{
                flex: '1 1 200px',
                border: 0,
                font: `700 16px ${FONT}`,
                padding: 14,
                borderRadius: 13,
                background: draft.length ? ACCENT : 'var(--md-line)',
                color: draft.length ? '#fff' : 'var(--md-ink-5)',
                cursor: draft.length ? 'pointer' : 'default',
              }}
            >
              {editing ? tr('Übernehmen') : `${tr('Weiter')} (${draft.length}/${max})`}
            </button>
          )}
          {editing && (
            <button type="button" onClick={onCancel} style={{ border: 0, background: 'none', font: `600 15px ${FONT}`, color: 'var(--md-ink-3)', cursor: 'pointer', padding: 8 }}>
              {tr('Abbrechen')}
            </button>
          )}
          {q.optional && !editing && (
            <button type="button" onClick={() => onCommit([])} style={{ flex: '1 1 200px', border: 0, background: 'none', font: `600 15px ${FONT}`, color: ACCENT, cursor: 'pointer', padding: 8 }}>
              {tr('Überspringen und Ergebnisse ansehen')}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ *
 * Beantwortete Frage als kompakte Zeile
 * ------------------------------------------------------------------ */
const AnsweredRow = ({ questionId, answers, onEdit }: { questionId: string; answers: UserAnswers; onEdit: () => void }) => {
  const ids = asList(answers[questionId]);
  const text = ids.length ? ids.map((id) => getOptionLabel(questionId, id, answers)).join(', ') : tr('Übersprungen');
  return (
    <motion.button
      type="button"
      className="md-lift"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onEdit}
      aria-label={`${tr(getQuestionText(questionId, answers))} ${text}. ${tr('Ändern')}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        textAlign: 'start',
        background: 'var(--md-surface)',
        border: '1px solid var(--md-line)',
        borderRadius: 14,
        padding: '11px 16px',
        marginTop: 8,
        cursor: 'pointer',
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', font: `500 12.5px/1.35 ${FONT}`, color: 'var(--md-ink-4)' }}>{tr(getQuestionText(questionId, answers))}</span>
        <span lang={getLang()} style={{ display: 'block', font: `700 14.5px/1.35 ${FONT}`, color: 'var(--md-ink)', marginTop: 2, overflowWrap: 'anywhere' }}>{text}</span>
      </span>
      <span style={{ flex: 'none', font: `600 13px ${FONT}`, color: ACCENT }}>{tr('Ändern')}</span>
    </motion.button>
  );
};

/* ------------------------------------------------------------------ *
 * Feed
 * ------------------------------------------------------------------ */
const QuestionnaireFeed = () => {
  const navigate = useNavigate();
  const { answers, replaceAnswers } = useQuestionnaire();
  const [started, setStarted] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const path = useMemo(() => computePath(answers), [answers]);
  const current = path.current;
  const sectionIndex = path.complete ? SECTIONS.length - 1 : Math.max(0, SECTIONS.findIndex((s) => s.id === current?.section));
  const upcoming = current ? nextSectionAfter(current.questionId, answers) : null;

  // Messung: neuer Abschnitt erreicht (erst nach der ersten Antwort)
  useEffect(() => {
    if (answers.alter && current) trackSection(current.section);
  }, [current, answers.alter]);

  // Neue aktuelle Frage: sanft hinscrollen und den Fokus auf die Frage setzen
  useEffect(() => {
    if (!started || !current) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`frage-${current.questionId}`);
      if (!el) return;
      el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      el.querySelector<HTMLElement>('[data-frage-titel]')?.focus({ preventScroll: true });
    }, 120);
    return () => clearTimeout(t);
  }, [current?.questionId, started]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = (questionId: string, value: string | string[]) => {
    const wasCurrent = current?.questionId === questionId;
    const next = sanitizeAnswers({ ...answers, [questionId]: value });
    replaceAnswers(next);
    setEditing(null);
    // Letzte offene Frage beantwortet: weiter zu den Ergebnissen
    if (wasCurrent && computePath(next).complete) {
      setTimeout(() => navigate('/results'), reducedMotion() ? 0 : 350);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Fortschritt nach Abschnitten, klebt oben */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'color-mix(in srgb, var(--md-paper) 92%, transparent)',
          backdropFilter: 'blur(10px)',
          padding: '12px 0 10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', gap: 5 }} aria-hidden>
            {SECTIONS.map((s, i) => (
              <div key={s.id} style={{ flex: 1, height: 5, borderRadius: 99, background: 'var(--md-line-strong)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 99,
                    background: ACCENT,
                    transformOrigin: 'var(--md-origin, left)',
                    transform: `scaleX(${started && (i < sectionIndex || path.complete) ? 1 : started && i === sectionIndex ? 0.5 : 0})`,
                    transition: 'transform .6s cubic-bezier(.22,1,.36,1)',
                  }}
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => navigate('/')} aria-label={tr('Fragebogen verlassen')} style={{ ...iconButton(34), fontSize: 15 }}>
            ✕
          </button>
        </div>
        {started && (
          <div style={{ font: `700 12.5px ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: KICKER, marginTop: 8 }}>
            {tr(SECTIONS[sectionIndex].label)} · {tr('{n} von {total}', { n: sectionIndex + 1, total: SECTIONS.length })}
          </div>
        )}
      </div>

      {!started ? (
        <div style={{ marginTop: 8 }}>
          <IntroOverlay inline onStart={() => { trackSection('start'); setStarted(true); }} />
        </div>
      ) : (
        <>
          {SECTIONS.map((sec) => {
            const steps = path.steps.filter((s) => s.section === sec.id);
            if (steps.length === 0) return null;
            return (
              <section key={sec.id} aria-labelledby={`abschnitt-${sec.id}`} style={{ marginTop: 18 }}>
                <div id={`abschnitt-${sec.id}`} style={{ display: 'flex', alignItems: 'center', gap: 8, font: `700 12px ${FONT}`, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--md-ink-4)' }}>
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: 99, background: sec.id === current?.section ? ACCENT : 'var(--md-ink-5)' }} />
                  {tr(sec.label)}
                </div>
                {steps.map((s) => {
                  const isCurrent = s.questionId === current?.questionId;
                  const isEditing = s.questionId === editing;
                  if (isCurrent || isEditing) {
                    return (
                      <QuestionBlock
                        key={`${s.questionId}:${isEditing ? 'aendern' : 'neu'}`}
                        questionId={s.questionId}
                        answers={answers}
                        editing={isEditing && !isCurrent}
                        onCommit={(v) => commit(s.questionId, v)}
                        onCancel={() => setEditing(null)}
                      />
                    );
                  }
                  return <AnsweredRow key={s.questionId} questionId={s.questionId} answers={answers} onEdit={() => setEditing(s.questionId)} />;
                })}
              </section>
            );
          })}

          {upcoming && (
            <div style={{ marginTop: 22, font: `600 13px ${FONT}`, color: 'var(--md-ink-5)' }}>
              {tr('Als Nächstes')} · {tr(SECTIONS.find((s) => s.id === upcoming)?.label ?? '')}
            </div>
          )}

          {path.complete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: 22, background: 'var(--md-surface)', border: '1px solid var(--md-line)', borderRadius: 20, padding: 24, textAlign: 'center', boxShadow: 'var(--md-shadow-md)' }}
            >
              <motion.div
                aria-hidden
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.1 }}
                style={{ width: 52, height: 52, margin: '0 auto 12px', borderRadius: 99, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div style={{ font: `var(--md-display-weight) 22px ${DFONT}`, color: 'var(--md-ink)', marginBottom: 14 }}>{tr('Alles beantwortet')}</div>
              <button
                type="button"
                className="md-press md-shine"
                onClick={() => navigate('/results')}
                style={{ width: '100%', border: 0, font: `700 16px ${FONT}`, padding: 14, borderRadius: 13, background: ACCENT, color: '#fff', cursor: 'pointer' }}
              >
                {tr('Ergebnisse ansehen')}
              </button>
            </motion.div>
          )}

          {/* Platz, damit auch die letzte Frage ganz nach oben scrollen kann */}
          <div aria-hidden style={{ height: '55vh' }} />
        </>
      )}

      <div aria-live="polite" className="sr-only">
        {started && current ? tr(getQuestionText(current.questionId, answers)) : ''}
      </div>
    </div>
  );
};

export default QuestionnaireFeed;
