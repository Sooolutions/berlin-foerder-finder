/**
 * Übersetzt eine Testperson in die Antworten des aktuellen Fragebogens.
 *
 * Geht den Verlauf mit computePath durch und wählt je Frage die Antwort,
 * die diese Person geben würde, aus den dort sichtbaren Optionen. Was die
 * Person angibt, aber nicht als Option erscheint, entfällt. Mehrfachauswahl
 * ohne passende Option wird mit „Nichts davon“ oder der passenden
 * Leer-Antwort beantwortet, wie es eine Person im Fragebogen tun müsste.
 */
import type { UserAnswers } from "../../src/context/QuestionnaireContext";
import { getVisibleOptions, questionsMap } from "../../src/data/questionnaireData";
import { computePath } from "../../src/questionnaire/flow";
import type { PersonaProfil } from "./personas";

const LEISTUNG_IDS: Record<string, string> = {
  Bürgergeld: "Leistung_Bürgergeld", Arbeitslosengeld: "Leistung_ALG1", Wohngeld: "Leistung_Wohngeld",
  BAföG: "Leistung_BAföG", BAB: "Leistung_BAföG", Kinderzuschlag: "Leistung_Kinderzuschlag",
  Rente: "Leistung_Rente", Grundsicherung: "Leistung_Grundsicherung", AsylbLG: "Leistung_AsylbLG",
};

function wanted(questionId: string, p: PersonaProfil): string[] {
  switch (questionId) {
    case "alter": return [p.alter];
    case "taetigkeit": return p.taetigkeiten;
    case "taetigkeit_bedarf": return p.bedarfe;
    case "familie_bedarf": return p.bedarfe.filter((b) => b.startsWith("Familie_"));
    case "haushalt": {
      const h = p.haushalt.map((x) => `Haushalt_${x}`);
      if (h.length === 0) return [p.wohnen === "WG" || p.wohnen === "Wohnen_Familie" ? "Haushalt_Erwachsene" : "Haushalt_Allein"];
      return h;
    }
    case "wohnen": case "wohnen_u18": return [p.wohnen];
    case "wohnen_ohne": return [p.ohne ?? "Ohne_Nichts"];
    case "einkommen": case "einkommen_familie": return [p.einkommen];
    case "leistungen": case "leistungen_familie": {
      const l = p.leistungen.map((x) => LEISTUNG_IDS[x]).filter(Boolean);
      return l.length ? l : ["Leistung_Keine"];
    }
    case "gesundheit": return p.gesundheit.length ? p.gesundheit : ["Beeinträchtigung_Nein"];
    case "gesundheit_bedarf": return p.gesundheitBedarfe;
    case "herausforderungen": return p.herausforderungen;
    case "staatsangehoerigkeit": return [p.staatsangehoerigkeit];
    case "wuensche": return p.wuensche;
    default: throw new Error(`Keine Zuordnung für Frage ${questionId}`);
  }
}

export function personaAnswers(p: PersonaProfil): UserAnswers {
  const a: UserAnswers = {};
  for (let guard = 0; guard < 30; guard++) {
    const { current } = computePath(a);
    if (!current) return a;
    const q = questionsMap[current.questionId];
    const visible = getVisibleOptions(q.id, a);
    const ids = visible.map((o) => o.id);
    const want = wanted(q.id, p).filter((x) => ids.includes(x));
    if (!q.multiSelect) {
      // Einzelauswahl: passende Option, sonst die erste
      a[q.id] = want[0] ?? ids[0];
      continue;
    }
    const chosen = want.slice(0, q.maxSelections ?? 3);
    if (chosen.length) { a[q.id] = chosen; continue; }
    if (q.optional) { a[q.id] = []; continue; }
    const fallback = visible.find((o) => o.exclusive) ?? visible[0];
    a[q.id] = [fallback.id];
  }
  throw new Error("Fragebogen endet nicht");
}
