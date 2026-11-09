/**
 * Prüft den Fragenverlauf (src/questionnaire/flow.ts) an allen
 * verlaufsrelevanten Antwortkombinationen.
 *   npm run check:flow
 *
 * Zwei Durchläufe je Altersgruppe, damit die Zahl der Kombinationen
 * handhabbar bleibt. Durchlauf A probiert jede Tätigkeit und jede
 * Zweierkombination bei sonst festen Antworten. Durchlauf B hält die
 * Tätigkeit fest und kombiniert Haushalt, Wohnen, Einkommen, Leistungen,
 * Gesundheit und Herausforderungen in typischen Varianten. Für jeden Pfad
 * muss gelten:
 *   1. Der Pfad endet regulär, und das in höchstens 20 Schritten.
 *   2. Jede Frage auf dem Pfad zeigt mindestens eine Option.
 *   3. Auf einer gestellten Frage ist jede gespeicherte Antwort auch sichtbar.
 *   4. nextQuestionId führt Schritt für Schritt genau durch diesen Pfad,
 *      auch wenn die Antwort einer Mehrfachauswahl erst mitgegeben wird.
 *   5. getActiveAnswers liefert genau die Antworten des Pfads.
 * Für eine Stichprobe vollständiger Pfade wird zusätzlich das Alter geändert
 * (wie beim Bearbeiten im Feed). Nach sanitizeAnswers müssen alle Antworten
 * auf dem neuen Pfad sichtbar sein.
 * Außerdem muss jede Frage und jede Option in mindestens einem Pfad vorkommen.
 */
import type { UserAnswers } from "../src/context/QuestionnaireContext";
import { AGE_GROUPS, getAllQuestions, getVisibleOptions, questionsMap } from "../src/data/questionnaireData";
import { computePath, nextQuestionId, nextSectionAfter, sanitizeAnswers, SECTIONS } from "../src/questionnaire/flow";
import { getActiveAnswers } from "../src/utils/answerMappingUtils";

const errors: string[] = [];
const seenQuestions = new Set<string>();
const seenOptions = new Set<string>();
const sectionIds = new Set(SECTIONS.map((s) => s.id));
let paths = 0;
const samples: UserAnswers[] = [];

/** Antwortvarianten je Frage: was der Durchlauf an dieser Stelle ausprobiert. */
type Pass = "A" | "B";

function variants(questionId: string, a: UserAnswers, pass: Pass): Array<string | string[]> {
  const all = variantsFull(questionId, a);
  if (pass === "A") return questionId === "taetigkeit" || questionId === "alter" ? all : all.slice(0, 1);
  return questionId === "taetigkeit" ? all.slice(0, 1) : all;
}

function variantsFull(questionId: string, a: UserAnswers): Array<string | string[]> {
  const opts = getVisibleOptions(questionId, a);
  opts.forEach((o) => seenOptions.add(`${questionId}:${o.id}`));
  const ids = opts.map((o) => o.id);
  const q = questionsMap[questionId];
  if (!q.multiSelect) {
    // Verlaufsrelevante Einzelauswahl vollständig, sonst zwei Varianten
    if (["wohnen", "wohnen_u18"].includes(questionId)) return ids;
    if (["einkommen", "einkommen_familie"].includes(questionId)) return ids.filter((x) => ["Finanzen_regelmäßig-gut", "Finanzen_regelmäßig-knapp", "KeineAngabe", "Unbekannt"].includes(x));
    return ids.slice(0, 2);
  }
  const nonExclusive = opts.filter((o) => !o.exclusive).map((o) => o.id);
  const exclusive = opts.filter((o) => o.exclusive).map((o) => o.id);
  switch (questionId) {
    case "taetigkeit": {
      // jede Tätigkeit einzeln und jede Zweierkombination
      const out: string[][] = ids.map((x) => [x]);
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) out.push([ids[i], ids[j]]);
      return out;
    }
    case "haushalt":
      return [["Haushalt_Allein"], ["Haushalt_Partner", "Haushalt_Kinder_U6"], ["Haushalt_Kinder_6_17"], ["Haushalt_Erwachsene"]].filter((v) => v.every((x) => ids.includes(x)));
    case "gesundheit":
      return [["Beeinträchtigung_Nein"], ["Beeinträchtigung_Psychisch", "Beeinträchtigung_Chronisch"], ["KeineAngabe"]];
    case "herausforderungen":
      return [["Nichts"], ["Herausforderung_Deutschland"], nonExclusive.slice(0, 3)];
    case "wuensche":
      return [[], nonExclusive.slice(0, 2)];
    default:
      return [nonExclusive.length ? [nonExclusive[0]] : [exclusive[0]], ...(exclusive.length ? [[exclusive[0]]] : [])];
  }
}

function walk(a: UserAnswers, depth: number, pass: Pass) {
  if (errors.length > 20) return;
  const p = computePath(a);
  if (depth > 20 || p.steps.length > 20) { errors.push(`Pfad zu lang: ${JSON.stringify(a)}`); return; }
  p.steps.forEach((s) => {
    seenQuestions.add(s.questionId);
    if (!sectionIds.has(s.section)) errors.push(`${s.questionId} ohne gültigen Abschnitt`);
    const visible = new Set(getVisibleOptions(s.questionId, a).map((o) => o.id));
    if (visible.size === 0) errors.push(`${s.questionId} ohne sichtbare Option bei ${JSON.stringify(a)}`);
    const v = a[s.questionId];
    (Array.isArray(v) ? v : v ? [v] : []).forEach((x) => { if (!visible.has(x)) errors.push(`${s.questionId}: Antwort ${x} nicht sichtbar bei ${JSON.stringify(a)}`); });
  });
  if (p.complete) {
    paths++;
    if (paths % 250 === 0) samples.push(a);
    // nextQuestionId führt durch denselben Pfad, Antworten der Mehrfachauswahl
    // werden wie in der Kartenoberfläche erst beim Wechsel mitgegeben
    const ids = p.steps.map((s) => s.questionId);
    let partial: UserAnswers = {};
    for (let i = 0; i < ids.length; i++) {
      const next = nextQuestionId(ids[i], partial, a[ids[i]]);
      const expected = ids[i + 1] ?? "END";
      if (next !== expected) { errors.push(`nextQuestionId nach ${ids[i]}: ${next} statt ${expected} bei ${JSON.stringify(a)}`); break; }
      partial = { ...partial, [ids[i]]: a[ids[i]] };
    }
    const active = Object.keys(getActiveAnswers({ ...a, verwaist: "x" }));
    if (active.join("|") !== ids.join("|")) errors.push(`getActiveAnswers weicht ab bei ${JSON.stringify(a)}`);
    return;
  }
  const q = p.current!.questionId;
  for (const v of variants(q, a, pass)) walk({ ...a, [q]: v }, depth + 1, pass);
}

for (const age of AGE_GROUPS) {
  seenOptions.add(`alter:${age}`);
  walk({ alter: age }, 0, "A");
  walk({ alter: age }, 0, "B");
}

for (const q of getAllQuestions()) {
  if (!seenQuestions.has(q.id)) errors.push(`Frage ${q.id} kommt in keinem Pfad vor`);
}

// Nachträglich geändertes Alter: abhängige Antworten werden bereinigt
let sanitized = 0;
for (const a of samples) {
  for (const age of AGE_GROUPS) {
    const b = sanitizeAnswers({ ...a, alter: age });
    sanitized++;
    for (const s of computePath(b).steps) {
      const visible = new Set(getVisibleOptions(s.questionId, b).map((o) => o.id));
      const v = b[s.questionId];
      (Array.isArray(v) ? v : v ? [v] : []).forEach((x) => { if (!visible.has(x)) errors.push(`sanitizeAnswers: ${s.questionId}=${x} bleibt sichtbar ungültig (${age})`); });
    }
    const cur = computePath(b).current;
    if (cur) nextSectionAfter(cur.questionId, b);
  }
}
// Jede Option muss für irgendeine Altersgruppe und Antwortlage sichtbar sein
const unseen = getAllQuestions().flatMap((q) => q.options.filter((o) => !seenOptions.has(`${q.id}:${o.id}`)).map((o) => `${q.id}:${o.id}`));
unseen.forEach((x) => errors.push(`Option ${x} wird nie angezeigt`));

if (errors.length) { console.error(errors.slice(0, 25).join("\n")); process.exit(1); }
console.log(`OK: ${paths} vollständige Pfade geprüft, alle ${seenQuestions.size} Fragen und ${seenOptions.size} Optionen erreichbar, ${sanitized} Altersänderungen sauber bereinigt.`);
