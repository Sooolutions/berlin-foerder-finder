/**
 * Prüft den Fragebogen auf strukturelle Fehler.
 *   npm run check:questionnaire
 *
 * 1. Jede Frage hat Optionen, jede Options-id ist innerhalb ihrer Frage eindeutig.
 * 2. Jede Options-id ist ein gültiger Tag (tagConstants.ts) oder eine Altersgruppe.
 * 3. Jede Frage in FLOW existiert, jede Frage kommt in FLOW vor.
 * 4. Mehrfachauswahl hat ein sinnvolles Maximum, Einzelauswahl keine exklusiven Optionen.
 * 5. Jede Option ist für mindestens eine Altersgruppe sichtbar.
 */
import { AGE_GROUPS, getAllQuestions, questionsMap } from "../src/data/questionnaireData";
import { FLOW } from "../src/questionnaire/flow";
import { ALL_VALID_TAGS } from "../src/utils/tagConstants";

const errors: string[] = [];
const flowIds = new Set(FLOW.map((s) => s.questionId));

for (const q of getAllQuestions()) {
  if (q.options.length === 0) errors.push(`${q.id}: keine Optionen`);
  const ids = q.options.map((o) => o.id);
  if (new Set(ids).size !== ids.length) errors.push(`${q.id}: doppelte Options-id`);
  for (const o of q.options) {
    if (!ALL_VALID_TAGS.has(o.id)) errors.push(`${q.id}: ${o.id} ist kein gültiger Tag`);
    if (!o.label.trim()) errors.push(`${q.id}: ${o.id} ohne Text`);
    if (o.ages && o.ages.length === 0) errors.push(`${q.id}: ${o.id} für keine Altersgruppe sichtbar`);
    if (o.exclusive && !q.multiSelect) errors.push(`${q.id}: exklusive Option ${o.id} in Einzelauswahl`);
    for (const age of Object.keys(o.labelByAge ?? {})) {
      if (o.ages && !o.ages.includes(age as (typeof AGE_GROUPS)[number])) errors.push(`${q.id}: ${o.id} hat Text für ${age}, ist dort aber nicht sichtbar`);
    }
  }
  if (q.multiSelect && (!q.maxSelections || q.maxSelections < 1)) errors.push(`${q.id}: Mehrfachauswahl ohne Maximum`);
  if (!flowIds.has(q.id)) errors.push(`${q.id} kommt im Verlauf (FLOW) nicht vor`);
}
for (const id of flowIds) if (!questionsMap[id]) errors.push(`FLOW enthält unbekannte Frage ${id}`);

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`OK: ${getAllQuestions().length} Fragen, alle Options-ids gültig, alle Fragen im Verlauf.`);
