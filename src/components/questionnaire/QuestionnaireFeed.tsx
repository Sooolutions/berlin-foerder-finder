import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useQuestionnaire, type UserAnswers } from '@/context/QuestionnaireContext';
import { getOptionLabel, getQuestionData, getQuestionText, getVisibleOptions } from '@/data/questionnaireData';
import { getQuestionInfo } from '@/data/questionInfo';
import { computePath, nextSectionAfter, sanitizeAnswers, SECTIONS, type SectionId } from '@/questionnaire/flow';
import { trackSection } from '@/questionnaire/tracking';
import { getLang, tr } from '@/i18n/LanguageContext';
import { DFONT, FONT, iconButton, InfoButton, IntroOverlay, QA, QTINT, sectionColor } from './QuestionnaireParts';

/**
 * Fragebogen als Karussell (November 2026).
 *
 * Alle Fragen liegen nebeneinander auf einem langen Band, als stünde schon
 * alles auf einem Blatt. Die Frage, auf der man gerade ist, steht in der
 * Mitte. Links liegen die beantworteten Fragen angeschnitten, rechts deutet
 * sich an, was noch kommt. Vor und zurück schiebt das Band sanft weiter,
 * per Knopf, Pfeiltaste oder Wischen. Eine frühere Frage lässt sich direkt
 * auf ihrer Karte ändern.
 *
 * Jeder Abschnitt hat eine eigene Farbe (SECTION_COLORS), die auf der Karte,
 * in der Auswahl und im Fortschritt erscheint.
 *
 * Der Verlauf ist eine reine Funktion der Antworten (computePath). Ändert
 * jemand eine frühere Antwort, bereinigt sanitizeAnswers abhängige Antworten,
 * die nicht mehr passen, und das Band baut sich neu auf.
 *
 * Ab dem dritten Abschnitt kann man jederzeit zu den Ergebnissen springen.
 */

const asList = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);
const isRtl = () => typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

/** Ab diesem Abschnitt (0 = erster) gibt es den Weg direkt zu den Ergebnissen */
const EARLY_OUT_FROM = 2;
const GAP = 24;

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
      border: `2px solid ${selected ? QA : 'var(--md-line)'}`,
      background: selected ? QTINT : 'var(--md-surface)',
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
        border: `2px solid ${selected ? QA : 'var(--md-line-strong)'}`,
        background: selected ? QA : '#fff',
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
 * Eine Frage als Karte auf dem Band
 * ------------------------------------------------------------------ */
const QuestionBlock = ({
  questionId, section, answers, answered, onCommit,
}: {
  questionId: string;
  section: SectionId;
  answers: UserAnswers;
  answered: boolean;
  onCommit: (value: string | string[]) => void;
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
  const label = SECTIONS.find((x) => x.id === section)?.label ?? '';

  return (
    <div
      id={`frage-${questionId}`}
      role="group"
      aria-labelledby={`titel-${questionId}`}
      style={{
        position: 'relative',
        background: 'var(--md-surface)',
        border: '1px solid var(--md-line)',
        borderRadius: 26,
        padding: 'clamp(20px, 3vw, 30px)',
        paddingTop: 'clamp(24px, 3.4vw, 34px)',
        boxShadow: 'var(--md-shadow-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Farbband des Abschnitts */}
      <span aria-hidden style={{ position: 'absolute', insetInline: 0, top: 0, height: 6, background: QA }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: `700 12px ${FONT}`, letterSpacing: '.08em', textTransform: 'uppercase', color: QA, background: QTINT, padding: '5px 11px', borderRadius: 99, marginBottom: 12 }}>
        <span aria-hidden style={{ width: 7, height: 7, borderRadius: 99, background: QA }} />
        {tr(label)}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <h2
          id={`titel-${questionId}`}
          data-frage-titel
          tabIndex={-1}
          style={{ flex: 1, font: `var(--md-display-weight) clamp(22px, 2.6vw, 28px)/1.15 ${DFONT}`, letterSpacing: '-0.015em', color: 'var(--md-ink)', margin: 0, outline: 'none' }}
        >
          {tr(getQuestionText(questionId, answers))}
        </h2>
        <InfoButton text={tr(getQuestionInfo(questionId))} resetKey={questionId} size={34} />
      </div>
      <div style={{ font: `400 14px/1.45 ${FONT}`, color: 'var(--md-ink-4)', margin: '6px 0 16px' }}>
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

      {(multi || q.optional) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 16 }}>
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
                padding: 15,
                borderRadius: 14,
                background: draft.length ? QA : 'var(--md-line)',
                color: draft.length ? '#fff' : 'var(--md-ink-5)',
                cursor: draft.length ? 'pointer' : 'default',
              }}
            >
              {answered ? tr('Übernehmen') : `${tr('Weiter')} (${draft.length}/${max})`}
            </button>
          )}
          {q.optional && !answered && (
            <button type="button" onClick={() => onCommit([])} style={{ flex: '1 1 200px', border: 0, background: 'none', font: `600 15px ${FONT}`, color: QA, cursor: 'pointer', padding: 8 }}>
              {tr('Überspringen und Ergebnisse ansehen')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/** Angedeutete nächste Seite, als stünde sie schon auf dem Blatt */
const GhostPage = ({ section }: { section: SectionId | null }) => (
  <div
    aria-hidden
    style={{
      position: 'relative',
      background: 'var(--md-surface)',
      border: '1px solid var(--md-line)',
      borderRadius: 26,
      padding: 30,
      minHeight: 360,
      overflow: 'hidden',
    }}
  >
    <span style={{ position: 'absolute', insetInline: 0, top: 0, height: 6, background: QA }} />
    <div style={{ display: 'inline-block', font: `700 12px ${FONT}`, letterSpacing: '.08em', textTransform: 'uppercase', color: QA, background: QTINT, padding: '5px 11px', borderRadius: 99, marginBottom: 18 }}>
      {tr('Als Nächstes')}
      {section ? ` · ${tr(SECTIONS.find((x) => x.id === section)?.label ?? '')}` : ''}
    </div>
    <div style={{ height: 22, width: '70%', borderRadius: 8, background: 'var(--md-chip)', marginBottom: 10 }} />
    <div style={{ height: 22, width: '45%', borderRadius: 8, background: 'var(--md-chip)', marginBottom: 26 }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ height: 50, borderRadius: 14, border: '2px solid var(--md-line)', marginBottom: 8 }} />
    ))}
  </div>
);

/** Abschluss, wenn alles beantwortet ist */
const DonePage = ({ onResults }: { onResults: () => void }) => (
  <div
    style={{ background: 'var(--md-surface)', border: '1px solid var(--md-line)', borderRadius: 26, padding: 32, textAlign: 'center', boxShadow: 'var(--md-shadow-lg)' }}
  >
    <motion.div
      aria-hidden
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 16, delay: 0.2 }}
      style={{ width: 60, height: 60, margin: '0 auto 14px', borderRadius: 99, background: 'var(--md-sun)', color: 'var(--md-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </motion.div>
    <div style={{ font: `var(--md-display-weight) 26px ${DFONT}`, color: 'var(--md-ink)', marginBottom: 18 }}>{tr('Alles beantwortet')}</div>
    <button
      type="button"
      className="md-press md-shine"
      onClick={onResults}
      style={{ width: '100%', border: 0, font: `700 17px ${FONT}`, padding: 16, borderRadius: 14, background: 'var(--md-ink)', color: '#fff', cursor: 'pointer' }}
    >
      {tr('Ergebnisse ansehen')}
    </button>
  </div>
);

/* ------------------------------------------------------------------ *
 * Band mit allen Fragen
 * ------------------------------------------------------------------ */
type Page =
  | { kind: 'question'; questionId: string; section: SectionId }
  | { kind: 'ghost'; section: SectionId | null; color: SectionId }
  | { kind: 'done' };

const QuestionnaireFeed = () => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { answers, replaceAnswers } = useQuestionnaire();
  const [started, setStarted] = useState(false);

  const path = useMemo(() => computePath(answers), [answers]);
  const current = path.current;
  const currentIndex = path.complete ? path.steps.length : path.steps.length - 1;
  const [view, setView] = useState(currentIndex);
  const upcoming = current ? nextSectionAfter(current.questionId, answers) : null;

  const pages: Page[] = useMemo(() => {
    const list: Page[] = path.steps.map((s) => ({ kind: 'question', questionId: s.questionId, section: s.section }));
    if (path.complete) list.push({ kind: 'done' });
    else list.push({ kind: 'ghost', section: upcoming, color: upcoming ?? current!.section });
    return list;
  }, [path, upcoming, current]);

  const viewPage = pages[Math.min(view, pages.length - 1)];
  const viewSection: SectionId =
    viewPage.kind === 'question' ? viewPage.section : viewPage.kind === 'ghost' ? viewPage.color : 'wuensche';
  const sectionIndex = path.complete ? SECTIONS.length - 1 : Math.max(0, SECTIONS.findIndex((x) => x.id === current?.section));
  const viewSectionIndex = SECTIONS.findIndex((x) => x.id === viewSection);

  // Breite messen: die Seite in der Mitte, links und rechts schauen Nachbarn hervor
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameW, setFrameW] = useState(0);
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFrameW(el.clientWidth));
    ro.observe(el);
    setFrameW(el.clientWidth);
    return () => ro.disconnect();
  }, [started]);
  const peek = frameW >= 1000 ? 150 : frameW >= 700 ? 70 : 20;
  const pageW = Math.max(260, Math.min(720, frameW - 2 * peek));
  const step = pageW + GAP;
  const sign = isRtl() ? -1 : 1;
  const x = sign * ((frameW - pageW) / 2 - view * step);

  // Höhe folgt der Seite in der Mitte
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [frameH, setFrameH] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    const el = pageRefs.current[view];
    if (!el) return;
    const ro = new ResizeObserver(() => setFrameH(el.offsetHeight));
    ro.observe(el);
    setFrameH(el.offsetHeight);
    return () => ro.disconnect();
  }, [view, pages.length, started]);

  // Messung: neuer Abschnitt erreicht (erst nach der ersten Antwort)
  useEffect(() => {
    if (answers.alter && current) trackSection(current.section);
  }, [current, answers.alter]);

  // Nach dem Verschieben: Fokus auf die Frage und, falls nötig, nach oben
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      const el = pageRefs.current[view];
      el?.querySelector<HTMLElement>('[data-frage-titel]')?.focus({ preventScroll: true });
      const top = frameRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) window.scrollBy({ top: top - 90, behavior: reduce ? 'auto' : 'smooth' });
    }, 380);
    return () => clearTimeout(t);
  }, [view, started]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback(
    (to: number) => setView(Math.max(0, Math.min(to, currentIndex))),
    [currentIndex],
  );

  const commit = (questionId: string, value: string | string[]) => {
    const idx = path.steps.findIndex((x) => x.questionId === questionId);
    const wasCurrent = current?.questionId === questionId;
    const next = sanitizeAnswers({ ...answers, [questionId]: value });
    const nextPath = computePath(next);
    replaceAnswers(next);
    const nextCurrent = nextPath.complete ? nextPath.steps.length : nextPath.steps.length - 1;
    // Weiter zur nächsten Karte, beim Ändern einer früheren Antwort genauso
    setView(wasCurrent ? nextCurrent : Math.min(idx + 1, nextCurrent));
    if (wasCurrent && nextPath.complete) {
      setTimeout(() => navigate('/results'), reduce ? 0 : 900);
    }
  };

  // Pfeiltasten schieben das Band, solange man nicht in einem Eingabefeld ist
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const back = isRtl() ? 'ArrowRight' : 'ArrowLeft';
      const fwd = isRtl() ? 'ArrowLeft' : 'ArrowRight';
      if (e.key === back) go(view - 1);
      if (e.key === fwd) go(view + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, view, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dx = info.offset.x * sign;
    const v = info.velocity.x * sign;
    if (dx < -70 || v < -500) go(view + 1);
    else if (dx > 70 || v > 500) go(view - 1);
  };

  const canEarlyOut = started && !path.complete && sectionIndex >= EARLY_OUT_FROM;

  return (
    <div style={{ position: 'relative', isolation: 'isolate', ['--q-accent' as string]: sectionColor(viewSection) }}>
      {/* Weicher Farbschein in der Farbe des Abschnitts */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          zIndex: -1,
          top: -160,
          left: '50%',
          width: 'min(1100px, 140vw)',
          height: 620,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(closest-side, color-mix(in srgb, var(--q-accent) 16%, transparent), transparent)',
          pointerEvents: 'none',
        }}
      />
      {/* Fortschritt nach Abschnitten, jeder Abschnitt in seiner Farbe */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', gap: 5 }} aria-hidden>
            {SECTIONS.map((sec, i) => (
              <div key={sec.id} style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--md-line-strong)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 99,
                    background: sectionColor(sec.id),
                    transformOrigin: 'var(--md-origin, left)',
                    transform: `scaleX(${started && (i < sectionIndex || path.complete) ? 1 : started && i === sectionIndex ? 0.5 : 0})`,
                    transition: 'transform .7s cubic-bezier(.22,1,.36,1)',
                    opacity: started && i === viewSectionIndex ? 1 : 0.75,
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 10, minHeight: 28 }}>
            <div style={{ font: `700 12.5px ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: QA, transition: 'color .4s' }}>
              {tr(SECTIONS[viewSectionIndex]?.label ?? '')} · {tr('{n} von {total}', { n: viewSectionIndex + 1, total: SECTIONS.length })}
            </div>
            {canEarlyOut && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/results')}
                className="md-press"
                style={{ border: '1px solid var(--md-line-strong)', background: 'var(--md-surface)', font: `700 13px ${FONT}`, color: 'var(--md-ink)', padding: '7px 13px', borderRadius: 99, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                {tr('Schon jetzt Ergebnisse ansehen')}
                <ArrowRight size={14} className="rtl:-scale-x-100" />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {!started ? (
        <div style={{ padding: '8px 16px 0' }}>
          <IntroOverlay
            inline
            onStart={() => {
              trackSection('start');
              setView(currentIndex);
              setStarted(true);
            }}
          />
        </div>
      ) : (
        <>
          <div
            ref={frameRef}
            style={{
              position: 'relative',
              overflow: 'hidden',
              paddingBlock: 18,
              height: frameH ? frameH + 36 : undefined,
              transition: reduce ? undefined : 'height .5s cubic-bezier(.22,1,.36,1)',
            }}
          >
            {frameW > 0 && (
              <motion.div
                style={{ display: 'flex', gap: GAP, width: 'max-content', alignItems: 'flex-start', touchAction: 'pan-y', cursor: 'grab' }}
                initial={false}
                animate={{ x }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 20, mass: 1 }}
                drag="x"
                dragDirectionLock
                dragElastic={0.12}
                dragConstraints={{ left: x, right: x }}
                dragMomentum={false}
                onDragEnd={onDragEnd}
                whileDrag={{ cursor: 'grabbing' }}
              >
                {pages.map((page, i) => {
                  const active = i === view;
                  const color = sectionColor(page.kind === 'question' ? page.section : page.kind === 'ghost' ? page.color : 'wuensche');
                  return (
                    <motion.div
                      key={page.kind === 'question' ? page.questionId : page.kind}
                      ref={(el) => {
                        pageRefs.current[i] = el;
                        if (el) (el as HTMLElement & { inert: boolean }).inert = !active;
                      }}
                      style={{ width: pageW, flex: 'none', position: 'relative', ['--q-accent' as string]: color }}
                      animate={{ opacity: active ? 1 : 0.42, scale: active ? 1 : 0.94 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden={!active}
                    >
                      {page.kind === 'question' && (
                        <QuestionBlock
                          key={`${page.questionId}:${JSON.stringify(answers[page.questionId] ?? null)}`}
                          questionId={page.questionId}
                          section={page.section}
                          answers={answers}
                          answered={i < path.steps.length - (path.complete ? 0 : 1)}
                          onCommit={(v) => commit(page.questionId, v)}
                        />
                      )}
                      {page.kind === 'ghost' && <GhostPage section={page.section} />}
                      {page.kind === 'done' && <DonePage onResults={() => navigate('/results')} />}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
            {/* Angeschnittene Nachbarn lassen sich antippen, um dorthin zu schieben */}
            {view > 0 && (
              <button
                type="button"
                aria-label={tr('Zurück')}
                onClick={() => go(view - 1)}
                style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: Math.max(20, (frameW - pageW) / 2 - 8), border: 0, background: 'transparent', cursor: 'pointer' }}
              />
            )}
            {view < currentIndex && (
              <button
                type="button"
                aria-label={tr('Weiter')}
                onClick={() => go(view + 1)}
                style={{ position: 'absolute', insetBlock: 0, insetInlineEnd: 0, width: Math.max(20, (frameW - pageW) / 2 - 8), border: 0, background: 'transparent', cursor: 'pointer' }}
              />
            )}
          </div>

          {/* Vor und zurück */}
          <div style={{ maxWidth: pageW, margin: '0 auto', padding: '0 0 72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <button
              type="button"
              onClick={() => go(view - 1)}
              disabled={view === 0}
              className="md-press"
              style={{ ...navBtn, opacity: view === 0 ? 0.35 : 1 }}
            >
              <ArrowLeft size={17} className="rtl:-scale-x-100" />
              {tr('Zurück')}
            </button>
            <div aria-hidden style={{ display: 'flex', gap: 6 }}>
              {pages.map((p, i) => (
                <span
                  key={i}
                  style={{
                    width: i === view ? 18 : 6,
                    height: 6,
                    borderRadius: 99,
                    background: i === view ? QA : 'var(--md-line-strong)',
                    transition: 'width .4s cubic-bezier(.22,1,.36,1), background .4s',
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(view + 1)}
              disabled={view >= currentIndex}
              className="md-press"
              style={{ ...navBtn, opacity: view >= currentIndex ? 0.35 : 1 }}
            >
              {tr('Weiter')}
              <ArrowRight size={17} className="rtl:-scale-x-100" />
            </button>
          </div>
        </>
      )}

      <div aria-live="polite" className="sr-only">
        {started && viewPage.kind === 'question' ? tr(getQuestionText(viewPage.questionId, answers)) : ''}
      </div>
    </div>
  );
};

const navBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  border: '1px solid var(--md-line-strong)',
  background: 'var(--md-surface)',
  font: `700 14.5px ${FONT}`,
  color: 'var(--md-ink)',
  padding: '10px 16px',
  borderRadius: 99,
  cursor: 'pointer',
};

export default QuestionnaireFeed;
