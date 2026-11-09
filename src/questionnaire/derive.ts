import type { UserAnswers } from "@/context/QuestionnaireContext";
import { ageOf, chosenActivities, hasChildren, hasImpairment, picked } from "@/data/questionnaireData";
import { benefitProfile, type BenefitProfile } from "@/questionnaire/benefits";

/**
 * Ableitungen aus Antworten und Antwortkombinationen.
 *
 * Manche Angaben macht der Fragebogen nicht direkt, weil sie aus anderen
 * Antworten folgen, etwa finanzielle Belastung aus knappem Einkommen. Andere
 * ergeben sich erst aus der Kombination, etwa „alleinerziehend“ aus Kindern
 * im Haushalt ohne Partnerin oder Partner, oder Bedarf an Studienfinanzierung
 * aus Studium und knappem Geld. Die Ableitungen fließen als zusätzliche Tags
 * ins Matching ein, mit einem Gewichtsfaktor und mit den Antworten, aus denen
 * sie stammen, damit die Ergebnisseite sie dort einordnen kann.
 *
 * Grundsätze
 * 1. Wird eine Option ausgeblendet, weil sie aus einer anderen Antwort folgt
 *    (showIf in questionnaireData.ts), muss hier die passende Ableitung stehen.
 * 2. Abgeleitetes zählt weniger als selbst Angeklicktes (Faktor unter 1),
 *    außer es ersetzt eine ausgeblendete Option.
 * 3. Abgeleitetes schließt nie hart aus. Herabstufungen bei Leistungen
 *    regelt benefits.ts.
 */

export interface DerivedTag {
  tag: string;
  /** Faktor auf das Grundgewicht des Tags, 1 wie selbst angeklickt */
  factor: number;
  /** Antworten, aus denen die Ableitung folgt (Frage-id und Options-id) */
  sources: { questionId: string; optionId: string }[];
}

export interface DerivedProfile {
  derived: DerivedTag[];
  /** Verstärkung selbst angeklickter Tags, etwa bei akuter Wohnungsnot */
  boosts: Map<string, number>;
  /** Akute Wohnungslosigkeit: draußen, im Fahrzeug oder in der Notunterkunft */
  acute: boolean;
  benefits: BenefitProfile;
}

/** Leistungen, die als Sozialleistung im bisherigen Sinn gelten (ohne Rente). */
const SOCIAL_BENEFITS = [
  "Leistung_Bürgergeld", "Leistung_ALG1", "Leistung_Wohngeld", "Leistung_Kinderzuschlag",
  "Leistung_BAföG", "Leistung_Grundsicherung", "Leistung_AsylbLG",
];
const TIGHT = ["Finanzen_regelmäßig-knapp", "Finanzen_Prekär"];
const ACUTE = ["Ohne_Öffentlich", "Ohne_Fahrzeug", "Ohne_Not"];

const selected = (a: UserAnswers, questionId: string): string[] => {
  const v = a[questionId];
  return Array.isArray(v) ? v : v ? [v] : [];
};

export function deriveProfile(a: UserAnswers): DerivedProfile {
  const out: DerivedTag[] = [];
  const add = (tag: string, factor: number, sources: DerivedTag["sources"]) => {
    if (sources.length === 0) return;
    const existing = out.find((d) => d.tag === tag);
    if (existing) {
      existing.sources.push(...sources);
      existing.factor = Math.max(existing.factor, factor);
    } else out.push({ tag, factor, sources });
  };
  const src = (questionId: string, ids: string[]) =>
    selected(a, questionId).filter((id) => ids.includes(id)).map((optionId) => ({ questionId, optionId }));
  const acts = chosenActivities(a);
  const act = (id: string) => (acts.includes(id) ? [{ questionId: "taetigkeit", optionId: id }] : []);
  const lowIncome = [...src("einkommen", TIGHT), ...src("einkommen_familie", TIGHT)];
  /** Kombination: nur wenn beide Seiten vorliegen */
  const both = (x: DerivedTag["sources"], y: DerivedTag["sources"]) => (x.length && y.length ? [...x, ...y] : []);

  // Ersatz für ausgeblendete oder frühere Antworten
  // 1. Bezug einer Sozialleistung (früher eine Antwort der Finanzfrage)
  add("Finanzen_Sozialleistung", 1, [...src("leistungen", SOCIAL_BENEFITS), ...src("leistungen_familie", SOCIAL_BENEFITS)]);
  // 2. Knappes oder fehlendes Einkommen bedeutet finanzielle Belastung (Option ist dann ausgeblendet)
  add("Herausforderung_Finanzen", 0.75, lowIncome);
  // 3. Wer Angehörige pflegt, kümmert sich um Angehörige (Option ist dann ausgeblendet)
  add("Herausforderung_Pflege", 1, act("Pflege"));
  // 4. Eine Beeinträchtigung ist eine gesundheitliche Herausforderung (ab 65 ausgeblendet)
  if (hasImpairment(a)) add("Herausforderung_Gesundheit", ageOf(a) === "65plus" ? 1 : 0.5, src("gesundheit", selected(a, "gesundheit")));
  // 5. Kinder im Haushalt ohne Partnerin oder Partner
  if (hasChildren(a) && !picked(a, "haushalt", "Haushalt_Partner")) {
    add("Haushalt_Alleinerziehend", 1, src("haushalt", ["Haushalt_Kinder_U6", "Haushalt_Kinder_6_17"]));
  }

  // Kombinationen mit halbem Gewicht
  // 6. bis 8. Ausbildung, Studium oder Familie bei knappem Geld: Finanzierungshilfen dafür
  add("Studium_Finanzen", 0.5, both(act("Studium"), lowIncome));
  add("Ausbildung_Finanzen", 0.5, both(act("Ausbildung"), lowIncome));
  const family = [...act("Familie"), ...src("haushalt", ["Haushalt_Kinder_U6", "Haushalt_Kinder_6_17", "Haushalt_Schwanger"])];
  add("Familie_Finanzierung", 0.5, both(family, lowIncome));
  // 9. Rente, Erwerbsminderung oder Arbeitssuche bei knappem Geld
  add("Rente_Finanzen", 0.5, both(act("Rente"), lowIncome));
  add("Erwerbsunfähig_Finanzen", 0.5, both(act("Erwerbsunfähig"), lowIncome));
  add("Arbeitssuche_Finanzen", 0.5, both(act("Arbeitssuchend"), lowIncome));
  // 10. Pflege neben Beruf: Vereinbarkeit
  add("Pflege_Vereinbarkeit", 0.5, both(act("Pflege"), [...act("Arbeiten"), ...act("Selbstständig")]));
  // 11. Psychische Einschränkung bei Arbeitssuche: psychologische Begleitung
  add("Arbeitssuche_Psychisch", 0.5, both(act("Arbeitssuchend"), src("gesundheit", ["Beeinträchtigung_Psychisch"])));

  // Selbst angeklickte Tags nicht doppelt zählen
  const direct = new Set(Object.values(a).flatMap((v) => (Array.isArray(v) ? v : [v])));
  const derived = out.filter((d) => !direct.has(d.tag));

  // 12. Akute Wohnungslosigkeit: Notangebote haben Vorrang vor allem anderen
  //     (stärkeres Gewicht hier, fester Vorrang in rankFundings über ACUTE_BONUS)
  const acute = selected(a, "wohnen_ohne").some((x) => ACUTE.includes(x));
  const boosts = new Map<string, number>();
  if (acute) {
    boosts.set("Prekär", 3);
    selected(a, "wohnen_ohne").forEach((x) => boosts.set(x, 3));
  }

  return { derived, boosts, acute, benefits: benefitProfile(a) };
}

/** Nur die abgeleiteten Tags (Kurzform). */
export function deriveTags(a: UserAnswers): DerivedTag[] {
  return deriveProfile(a).derived;
}
