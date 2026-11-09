import type { UserAnswers } from "@/context/QuestionnaireContext";
import { nextQuestionId } from "@/questionnaire/flow";

/**
 * Fragenverlauf. Bestimmt aus der aktuellen Frage und den gespeicherten
 * Antworten die nächste Frage. Die eigentliche Logik steht seit Phase 1 des
 * Umbaus deklarativ in src/questionnaire/flow.ts. Diese Funktion bleibt als
 * Schnittstelle für die Kartenoberfläche bestehen.
 *
 * Gibt "END" zurück, wenn der Fragebogen abgeschlossen ist.
 */
export function getNextQuestionId(currentQuestionId: string, answers: UserAnswers, answerValue?: string | string[]): string {
  return nextQuestionId(currentQuestionId, answers, answerValue);
}
