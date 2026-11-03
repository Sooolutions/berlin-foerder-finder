/**
 * Prüft den Fragebogen auf strukturelle Fehler.
 *   npx tsx scripts/check-questionnaire.ts
 *
 * 1. Jede Options-id ist innerhalb ihrer Frage eindeutig.
 * 2. Jedes Routing-Ziel existiert.
 * 3. Jede Frage ist von Q1 aus erreichbar.
 */
import { getAllQuestions, questionsMap } from "../src/data/questionnaireData";
import { getNextQuestionId } from "../src/utils/questionnaireRouting";

const errors: string[] = [];
for (const q of getAllQuestions()) {
  const ids = q.options.map((o) => o.id);
  if (new Set(ids).size !== ids.length) errors.push(`${q.id}: doppelte Options-id`);
}

// Breitensuche über alle Antworten; Nationalität wird für die Verzweigungen mitgeführt
const seen = new Set<string>();
const queue: Array<{ q: string; answers: Record<string, string> }> = [{ q: "Q1", answers: {} }];
const visited = new Set<string>();
while (queue.length) {
  const { q, answers } = queue.shift()!;
  const nat = Object.entries(answers).find(([k]) => k.startsWith("Q2_"))?.[1] ?? "";
  const key = `${q}|${nat}`;
  if (visited.has(key)) continue;
  visited.add(key);
  seen.add(q);
  const data = questionsMap[q];
  if (!data) { errors.push(`Routing-Ziel ${q} existiert nicht`); continue; }
  for (const o of data.options) {
    const next = { ...answers, [q]: o.id };
    const target = getNextQuestionId(q, next, o.id);
    if (target !== "END") queue.push({ q: target, answers: next });
  }
}
for (const q of Object.keys(questionsMap)) if (!seen.has(q)) errors.push(`${q} ist nicht erreichbar`);

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`OK: ${Object.keys(questionsMap).length} Fragen, alle erreichbar, alle Ziele gültig.`);
