import type { UserAnswers } from "@/context/QuestionnaireContext";
import {
  ageOf,
  chosenActivities,
  getQuestionData,
  getVisibleOptions,
  hasChildren,
  hasImpairment,
  picked,
} from "@/data/questionnaireData";

/**
 * Fragenverlauf als Beschreibung statt als Verzweigungslogik.
 *
 * Der Verlauf ist eine reine Funktion der Antworten. computePath geht die
 * Schritte in FLOW der Reihe nach durch, ermittelt für jeden Schritt aus den
 * bisherigen Antworten, ob und welche Frage er stellt, und hält bei der
 * ersten unbeantworteten Frage an. Daraus folgt:
 *
 * 1. Wer eine frühe Antwort ändert, bekommt automatisch den neuen Verlauf.
 *    Antworten aus verlassenen Zweigen liegen nicht mehr auf dem Pfad und
 *    fließen nicht ins Matching ein (siehe getActiveAnswers).
 * 2. Jede Frage gehört zu einem Abschnitt. Abschnitte sind die Einheit für
 *    Fortschrittsanzeige, Messung und später für den Feed.
 *
 * Aufbau seit Phase 2 des Umbaus (November 2026): fünf Pflichtabschnitte
 * und ein freiwilliger. Geprüft mit npm run check:flow.
 */

export type SectionId = "person" | "zuhause" | "geld" | "gesundheit" | "anliegen" | "wuensche";

/** Abschnitte in Reihenfolge. Die id erscheint in der Messung als /questionnaire/<id>. */
export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "person", label: "Über dich" },
  { id: "zuhause", label: "Zuhause" },
  { id: "geld", label: "Geld" },
  { id: "gesundheit", label: "Gesundheit" },
  { id: "anliegen", label: "Was dich beschäftigt" },
  { id: "wuensche", label: "Wünsche" },
];

export interface PathStep {
  questionId: string;
  section: SectionId;
}

interface FlowStep {
  /** Frage dieses Schritts */
  questionId: string;
  section: SectionId;
  /** Bedingung, unter der die Frage gestellt wird. Ohne Angabe immer. */
  when?: (a: UserAnswers) => boolean;
}

const isU18 = (a: UserAnswers) => ageOf(a) === "U18";
const inCare = (a: UserAnswers) => picked(a, "wohnen_u18", "Betreuung");

/** Der Fragebogen in Reihenfolge. */
export const FLOW: FlowStep[] = [
  // Über dich
  { questionId: "alter", section: "person" },
  { questionId: "taetigkeit", section: "person" },
  { questionId: "taetigkeit_bedarf", section: "person" },
  // Zuhause
  { questionId: "haushalt", section: "zuhause", when: (a) => !isU18(a) },
  // Familienbedarfe nur, wenn sie nicht schon bei der Tätigkeit Familie gefragt wurden
  { questionId: "familie_bedarf", section: "zuhause", when: (a) => hasChildren(a) && !chosenActivities(a).includes("Familie") },
  { questionId: "wohnen", section: "zuhause", when: (a) => !isU18(a) },
  { questionId: "wohnen_u18", section: "zuhause", when: isU18 },
  { questionId: "wohnen_ohne", section: "zuhause", when: (a) => picked(a, "wohnen", "Prekär") || picked(a, "wohnen_u18", "Prekär") },
  // Geld, entfällt für Jugendliche in Einrichtungen
  { questionId: "einkommen", section: "geld", when: (a) => !isU18(a) },
  { questionId: "einkommen_familie", section: "geld", when: (a) => isU18(a) && !inCare(a) },
  { questionId: "leistungen", section: "geld", when: (a) => !isU18(a) },
  { questionId: "leistungen_familie", section: "geld", when: (a) => isU18(a) && !inCare(a) },
  // Gesundheit
  { questionId: "gesundheit", section: "gesundheit" },
  { questionId: "gesundheit_bedarf", section: "gesundheit", when: hasImpairment },
  // Was dich beschäftigt, für alle
  { questionId: "herausforderungen", section: "anliegen" },
  { questionId: "staatsangehoerigkeit", section: "anliegen", when: (a) => picked(a, "herausforderungen", "Herausforderung_Deutschland") },
  // Wünsche, freiwillig
  { questionId: "wuensche", section: "wuensche" },
];

/** Einzelauswahl als String, bei Mehrfachauswahl die erste Antwort. */
export const firstAnswer = (a: UserAnswers, questionId: string): string | undefined => {
  const v = a[questionId];
  return Array.isArray(v) ? v[0] : v || undefined;
};

/**
 * Gilt eine Frage als beantwortet? Freiwillige Fragen auch dann, wenn sie
 * übersprungen wurden (leere Auswahl gespeichert).
 */
export const isAnswered = (questionId: string, v: string | string[] | undefined): boolean => {
  if (getQuestionData(questionId)?.optional && v !== undefined) return true;
  return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.length > 0;
};

const ANSWERED_PLACEHOLDER = "__beantwortet__";

export interface ComputedPath {
  /** Sichtbare Fragen bis einschließlich der ersten unbeantworteten */
  steps: PathStep[];
  /** Erste unbeantwortete Frage oder null, wenn alles beantwortet ist */
  current: PathStep | null;
  complete: boolean;
}

/** Ermittelt den Fragenverlauf für die gegebenen Antworten. */
export function computePath(answers: UserAnswers): ComputedPath {
  const steps: PathStep[] = [];
  for (const s of FLOW) {
    if (s.when && !s.when(answers)) continue;
    // Eine Frage ohne sichtbare Option (etwa Bedarfe zu „Sonstiges“ in einer
    // Altersgruppe ohne passende Optionen) wird übersprungen.
    if (getVisibleOptions(s.questionId, answers).length === 0) continue;
    const step = { questionId: s.questionId, section: s.section };
    steps.push(step);
    if (!isAnswered(s.questionId, answers[s.questionId])) return { steps, current: step, complete: false };
  }
  return { steps, current: null, complete: true };
}

/**
 * Nächster Schritt nach currentId, oder null, wenn der Fragebogen damit
 * abgeschlossen ist. answerValue ist die gerade gewählte, evtl. noch nicht
 * gespeicherte Antwort.
 */
export function nextStep(currentId: string, answers: UserAnswers, answerValue?: string | string[]): PathStep | null {
  // Die aktuelle Frage gilt als beantwortet, auch wenn die Antwort noch nicht
  // im Zustand steht (die Kartenoberfläche wechselt unmittelbar nach dem
  // Speichern).
  const current = answerValue ?? answers[currentId];
  const withCurrent = { ...answers, [currentId]: isAnswered(currentId, current) ? current! : ANSWERED_PLACEHOLDER };
  const steps = computePath(withCurrent).steps;
  const i = steps.findIndex((s) => s.questionId === currentId);
  return i >= 0 && i + 1 < steps.length ? steps[i + 1] : null;
}

/**
 * Nächste Frage nach currentId oder "END". Schnittstelle der früheren
 * Verzweigungslogik, damit die Kartenoberfläche unverändert weiterläuft.
 */
export function nextQuestionId(currentId: string, answers: UserAnswers, answerValue?: string | string[]): string {
  return nextStep(currentId, answers, answerValue)?.questionId ?? "END";
}

/**
 * Bereinigt Antworten nach einer Änderung. Wer etwa das Alter ändert, hat
 * vielleicht eine Tätigkeit gespeichert, die es für die neue Altersgruppe
 * nicht gibt. Solche Antworten fallen weg, bei Mehrfachauswahl nur die
 * unpassenden Teile. Fällt eine Antwort ganz weg, endet der Pfad dort und
 * die Frage wird erneut gestellt.
 */
export function sanitizeAnswers(answers: UserAnswers): UserAnswers {
  const a: UserAnswers = { ...answers };
  for (let guard = 0; guard < 40; guard++) {
    let changed = false;
    for (const s of computePath(a).steps) {
      const v = a[s.questionId];
      if (v === undefined) continue;
      const visible = new Set(getVisibleOptions(s.questionId, a).map((o) => o.id));
      const list = Array.isArray(v) ? v : [v];
      const kept = list.filter((x) => visible.has(x));
      if (kept.length === list.length) continue;
      changed = true;
      if (Array.isArray(v) && kept.length > 0) a[s.questionId] = kept;
      else delete a[s.questionId];
      break; // der Pfad kann sich dadurch ändern, neu berechnen
    }
    if (!changed) return a;
  }
  return a;
}

/**
 * Abschnitt, der nach dem aktuellen voraussichtlich folgt, für den Hinweis
 * „Als Nächstes“ im Feed. Noch offene Antworten werden dafür als beantwortet
 * angenommen, ohne bestimmte Auswahl.
 */
export function nextSectionAfter(currentId: string, answers: UserAnswers): SectionId | null {
  const start = computePath(answers).steps.find((s) => s.questionId === currentId)?.section;
  let probe: UserAnswers = { ...answers };
  let id = currentId;
  for (let guard = 0; guard < 30; guard++) {
    const n = nextStep(id, probe);
    if (!n) return null;
    if (n.section !== start) return n.section;
    probe = { ...probe, [id]: probe[id] ?? ANSWERED_PLACEHOLDER };
    id = n.questionId;
  }
  return null;
}

/** Erste Frage des Fragebogens. */
export const FIRST_QUESTION_ID = FLOW[0].questionId;
