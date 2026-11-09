import type { UserAnswers } from "@/context/QuestionnaireContext";
import { ageOf, chosenActivities, hasChildren, picked } from "@/data/questionnaireData";

/**
 * Leistungslogik: Was bekommt jemand schon, was schließt sich aus, und was
 * steht ihm vermutlich zusätzlich zu („Da ist noch mehr drin“).
 *
 * Grundlage sind die Fragen leistungen bzw. leistungen_familie und die
 * Felder benefit_type (das Angebot ist selbst diese Leistung) und
 * requires_benefits (das Angebot setzt eine dieser Leistungen voraus) in der
 * Tabelle funding.
 *
 * Die Kandidatenregeln sind bewusst grob und vorsichtig. Sie sagen nicht,
 * dass ein Anspruch besteht, sondern dass sich eine Prüfung lohnt. Die
 * Ergebnisseite formuliert entsprechend („vielleicht“) und verweist auf die
 * zuständige Stelle. Rechtsgrundlagen in Kurzform stehen an jeder Regel.
 */

export type Benefit =
  | "Leistung_Bürgergeld" | "Leistung_ALG1" | "Leistung_Wohngeld" | "Leistung_Kinderzuschlag"
  | "Leistung_BAföG" | "Leistung_Rente" | "Leistung_Grundsicherung" | "Leistung_AsylbLG";

export interface BenefitProfile {
  /** Hat die Person angegeben, welche Leistungen sie bezieht (auch „keine“)? */
  known: boolean;
  receiving: Set<string>;
  /** Leistungen, die vermutlich zusätzlich in Frage kommen, mit Begründung (Antwort-ids) */
  candidates: Map<string, string[]>;
}

/**
 * Leistungen, die in der Regel nicht nebeneinander bezogen werden. Wer die
 * linke bezieht, für den kommt keine der rechten in Frage.
 * Bürgergeld deckt Unterkunft und Kinderbedarf ab (Vorrang Wohngeld und
 * Kinderzuschlag nur, wenn sie Bürgergeld vermeiden). Grundsicherung und
 * Leistungen nach AsylbLG schließen Wohngeld und Kinderzuschlag aus.
 */
export const EXCLUDES: Record<string, string[]> = {
  Leistung_Bürgergeld: ["Leistung_Wohngeld", "Leistung_Kinderzuschlag", "Leistung_Grundsicherung", "Leistung_AsylbLG"],
  Leistung_Grundsicherung: ["Leistung_Wohngeld", "Leistung_Kinderzuschlag", "Leistung_Bürgergeld", "Leistung_AsylbLG"],
  Leistung_AsylbLG: ["Leistung_Wohngeld", "Leistung_Kinderzuschlag", "Leistung_Bürgergeld", "Leistung_Grundsicherung"],
};

const NO_INFO = new Set(["KeineAngabe", "Unbekannt"]);

export function benefitProfile(a: UserAnswers): BenefitProfile {
  const raw = a.leistungen ?? a.leistungen_familie;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const known = list.length > 0 && !list.some((x) => NO_INFO.has(x));
  const receiving = new Set(list.filter((x) => x.startsWith("Leistung_") && x !== "Leistung_Keine"));
  const candidates = new Map<string, string[]>();
  if (!known) return { known, receiving, candidates };

  const age = ageOf(a);
  const acts = chosenActivities(a);
  const income = (Array.isArray(a.einkommen) ? a.einkommen[0] : a.einkommen) ?? (Array.isArray(a.einkommen_familie) ? a.einkommen_familie[0] : a.einkommen_familie);
  const tight = income === "Finanzen_regelmäßig-knapp";
  const none = income === "Finanzen_Prekär";
  const low = tight || none;
  const incomeSrc = a.einkommen !== undefined ? "einkommen" : "einkommen_familie";
  const working = age !== null && age !== "U18" && age !== "65plus";
  const children = hasChildren(a) || age === "U18";
  const gets = (...b: string[]) => b.some((x) => receiving.has(x));
  const excluded = (b: string) => [...receiving].some((r) => EXCLUDES[r]?.includes(b));
  const add = (b: Benefit, ...why: string[]) => {
    if (!receiving.has(b) && !excluded(b)) candidates.set(b, why);
  };

  // Kinderzuschlag (§ 6a BKGG): Kinder, eigenes regelmäßiges, aber knappes Einkommen
  if (children && tight) add("Leistung_Kinderzuschlag", "haushalt", incomeSrc);

  // Wohngeld (WoGG): eigenes, aber knappes Einkommen, Miete oder Eigentum, nicht im Studium
  const housing = picked(a, "wohnen", "Miete") || picked(a, "wohnen", "Eigentum") || picked(a, "wohnen", "WG")
    || picked(a, "wohnen", "Heim") || age === "U18";
  if (tight && housing && !acts.includes("Studium")) add("Leistung_Wohngeld", incomeSrc, "wohnen");

  // Bürgergeld (SGB II): erwerbsfähig, kein Einkommen oder knapp bei Arbeitssuche, nicht im Studium
  if (working && !acts.includes("Studium") && !acts.includes("Erwerbsunfähig")
    && (none || (tight && !gets("Leistung_ALG1") && acts.some((x) => x === "Arbeitssuchend" || x === "Übergang")))) {
    add("Leistung_Bürgergeld", incomeSrc, "taetigkeit");
  }

  // BAföG oder Berufsausbildungsbeihilfe: Studium oder Ausbildung bei knappem Geld
  if ((acts.includes("Studium") || acts.includes("Ausbildung")) && (low || income === "Finanzen_Ersparnisse")) {
    add("Leistung_BAföG", "taetigkeit", incomeSrc);
  }

  // Grundsicherung im Alter oder bei Erwerbsminderung (SGB XII): ab 65 oder erwerbsgemindert, wenig Geld
  if ((age === "65plus" || acts.includes("Erwerbsunfähig")) && low) add("Leistung_Grundsicherung", "taetigkeit", incomeSrc);

  // Erwerbsminderungsrente: erwerbsgemindert, noch keine Rente
  if (acts.includes("Erwerbsunfähig") && age !== "65plus") add("Leistung_Rente", "taetigkeit");

  // Arbeitslosengeld: arbeitssuchend ohne Arbeitslosengeld oder Bürgergeld
  if (working && acts.includes("Arbeitssuchend") && !gets("Leistung_Bürgergeld")) add("Leistung_ALG1", "taetigkeit");

  return { known, receiving, candidates };
}

export interface BenefitEffect {
  factor: number;
  bonus: number;
  /** Warum das Angebot hoch- oder herabgestuft wurde */
  reason?: "bekommst" | "ausgeschlossen" | "zusaetzlich" | "voraussetzung" | "voraussetzung_fehlt";
}

/** Punkte, die ein vermutlich zusätzlicher Anspruch oder eine erfüllte Voraussetzung bringt. */
export const CANDIDATE_BONUS = 20;
export const REQUIREMENT_BONUS = 15;

/**
 * Wirkung der Leistungsangaben auf ein Angebot. Wird auf die Punktzahl aus
 * dem Tagabgleich angewandt: Punktzahl × factor + bonus.
 */
export function benefitEffect(
  offer: { benefit_type?: string | null; requires_benefits?: string[] | null },
  p: BenefitProfile,
): BenefitEffect {
  const type = offer.benefit_type;
  if (type) {
    if (p.receiving.has(type)) return { factor: 0.3, bonus: 0, reason: "bekommst" };
    if ([...p.receiving].some((r) => EXCLUDES[r]?.includes(type))) return { factor: 0.4, bonus: 0, reason: "ausgeschlossen" };
    if (p.candidates.has(type)) return { factor: 1, bonus: CANDIDATE_BONUS, reason: "zusaetzlich" };
  }
  const req = offer.requires_benefits ?? [];
  if (req.length > 0) {
    if (req.some((b) => p.receiving.has(b))) return { factor: 1, bonus: REQUIREMENT_BONUS, reason: "voraussetzung" };
    if (req.some((b) => p.candidates.has(b))) return { factor: 1, bonus: REQUIREMENT_BONUS / 2 };
    if (p.known) return { factor: 0.5, bonus: 0, reason: "voraussetzung_fehlt" };
  }
  return { factor: 1, bonus: 0 };
}
