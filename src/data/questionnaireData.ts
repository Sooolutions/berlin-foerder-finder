import type { UserAnswers } from "@/context/QuestionnaireContext";
import { tr } from "@/i18n/LanguageContext";

/**
 * Der Fragebogen als ein einziges Modell (seit November 2026, Phase 2 des
 * Umbaus). Früher gab es sechs fast gleiche Fragebäume je Altersgruppe, jetzt
 * trägt jede Antwortoption selbst, für welche Altersgruppen und unter welchen
 * Bedingungen sie erscheint. Die Reihenfolge der Fragen steht in
 * src/questionnaire/flow.ts.
 *
 * id     Stabile, sprachunabhängige Kennung. Sie ist zugleich der Matching-Tag
 *        in der Datenbank und wird im Fragenverlauf gespeichert. Eine id zu
 *        ändern ändert also das Matching.
 * label  Deutscher Anzeigetext, zugleich Schlüssel für die Übersetzungen in
 *        src/i18n. Er darf umformuliert werden, dann fehlen aber die
 *        Übersetzungen, bis npm run translate gelaufen ist.
 */

export const AGE_GROUPS = ["U18", "18-24", "25-34", "35-49", "50-64", "65plus"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export interface AnswerOption {
  id: string;
  label: string;
  /** Altersgruppen, für die die Option erscheint. Ohne Angabe für alle. */
  ages?: readonly AgeGroup[];
  /** Abweichender Anzeigetext für einzelne Altersgruppen */
  labelByAge?: Partial<Record<AgeGroup, string>>;
  /** Weitere Bedingung, unter der die Option erscheint */
  showIf?: (a: UserAnswers) => boolean;
  /** Schließt alle anderen Antworten dieser Frage aus, z. B. „Nichts davon“ */
  exclusive?: boolean;
  /** Zwischenüberschrift, unter der die Option steht (Bedarfe bei zwei Tätigkeiten) */
  group?: string;
}

export interface QuestionData {
  id: string;
  /** Fragetext, sofern questionFor nichts anderes liefert */
  question: string;
  /** Fragetext abhängig von Alter oder bisherigen Antworten */
  questionFor?: (a: UserAnswers) => string;
  /** Alle Texte, die questionFor liefern kann (für die Übersetzungsprüfung) */
  questionVariants?: string[];
  options: AnswerOption[];
  multiSelect?: boolean;
  maxSelections?: number;
  /** Darf übersprungen werden */
  optional?: boolean;
}

/* ------------------------------------------------------------------ *
 * Hilfen
 * ------------------------------------------------------------------ */

const ADULT: readonly AgeGroup[] = ["18-24", "25-34", "35-49", "50-64", "65plus"];
const WORKING: readonly AgeGroup[] = ["18-24", "25-34", "35-49", "50-64"];
const YOUNG: readonly AgeGroup[] = ["U18", "18-24"];
const fromAge = (first: AgeGroup): AgeGroup[] => AGE_GROUPS.slice(AGE_GROUPS.indexOf(first)) as AgeGroup[];
const range = (first: AgeGroup, last: AgeGroup): AgeGroup[] =>
  AGE_GROUPS.slice(AGE_GROUPS.indexOf(first), AGE_GROUPS.indexOf(last) + 1) as AgeGroup[];

/** Altersgruppe aus den Antworten, null solange unbeantwortet. */
export const ageOf = (a: UserAnswers): AgeGroup | null => {
  const v = a.alter;
  const age = Array.isArray(v) ? v[0] : v;
  return age && (AGE_GROUPS as readonly string[]).includes(age) ? (age as AgeGroup) : null;
};

/** Wurde in einer Frage eine bestimmte Antwort gewählt? */
export const picked = (a: UserAnswers, questionId: string, optionId: string): boolean => {
  const v = a[questionId];
  return Array.isArray(v) ? v.includes(optionId) : v === optionId;
};
const pickedAny = (a: UserAnswers, questionId: string, ids: string[]) => ids.some((id) => picked(a, questionId, id));

export const KINDER = ["Haushalt_Kinder_U6", "Haushalt_Kinder_6_17"];
export const hasChildren = (a: UserAnswers) => pickedAny(a, "haushalt", KINDER);

/* ------------------------------------------------------------------ *
 * Tätigkeit und Bedarfe zur Tätigkeit
 * ------------------------------------------------------------------ */

/** Tätigkeiten mit Anzeigetext, Altersgruppen und Bedarfsfrage. */
interface ActivityDef {
  id: string;
  label: string;
  labelByAge?: Partial<Record<AgeGroup, string>>;
  ages: readonly AgeGroup[];
  needsQuestion: string;
  needsQuestionByAge?: Partial<Record<AgeGroup, string>>;
  needs: Omit<AnswerOption, "group">[];
}

const ACTIVITIES: ActivityDef[] = [
  {
    id: "Schule", label: "Schule", ages: YOUNG,
    needsQuestion: "Hast du Probleme in der Schule?",
    needs: [
      { id: "Schule_Lernschwierigkeit", label: "Lernschwierigkeiten" },
      { id: "Schule_Mobbing", label: "Mobbing" },
      { id: "Schule_Mittagessen", label: "Mittagessen", ages: ["U18"] },
      { id: "Schule_Material", label: "Schulmaterial", labelByAge: { "18-24": "Schulmaterial und Verpflegungskosten" } },
      { id: "Schule_Psyche", label: "Psychische Belastungen" },
    ],
  },
  {
    id: "Ausbildung", label: "Ausbildung", ages: range("U18", "25-34"),
    needsQuestion: "Was würdest du dir für deine Ausbildung wünschen?",
    needs: [
      { id: "Ausbildung_Berufsschule", label: "Mehr Unterstützung in der Berufsschule (z. B. Nachhilfe, Prüfungsvorbereitung)", labelByAge: { U18: "Mehr Unterstützung beim Lernen" } },
      { id: "Ausbildung_Miteinander", label: "Besseres Miteinander mit Ausbilder:innen/Kolleg:innen" },
      { id: "Ausbildung_Perspektive", label: "Klare Perspektiven für die Zeit nach der Ausbildung (z. B. Übernahme, Weiterbildung)", labelByAge: { U18: "Karriereperspektiven oder Mentoring" } },
      { id: "Ausbildung_Verantwortung", label: "Mehr Verantwortung und Vertrauen", ages: ["18-24", "25-34"] },
      { id: "Ausbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben", labelByAge: { U18: "Mehr Zeit für persönliche Projekte/Hobbys" } },
      { id: "Ausbildung_Finanzen", label: "Finanzielle Unterstützung" },
    ],
  },
  {
    id: "Studium", label: "Studium", ages: ["18-24", "25-34"],
    needsQuestion: "Was würdest du dir für dein Studium wünschen, um es erfolgreich abzuschließen und dich optimal auf nächste Schritte vorzubereiten?",
    needs: [
      { id: "Studium_Unterstützung", label: "Mehr Unterstützung im Studium" },
      { id: "Studium_Anbindung", label: "Bessere Anbindung an Professor:innen/Dozent:innen" },
      { id: "Studium_Austausch", label: "Mehr Austausch mit Kommiliton:innen" },
      { id: "Studium_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Studium_Psyche", label: "Psychische Beratung" },
    ],
  },
  {
    id: "FSJ", label: "FSJ oder FÖJ", ages: YOUNG,
    needsQuestion: "Was würde dir helfen dein FSJ, FÖJ, oder ähnliches besser zu gestalten?",
    needs: [
      { id: "FSJ_Weiterbildung", label: "Spezifische Weiterbildungen/Kurse" },
      { id: "FSJ_Anerkennung", label: "Mehr Anerkennung für meine Arbeit" },
      { id: "FSJ_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "FSJ_Austausch", label: "Mehr Austausch mit anderen Freiwilligen" },
    ],
  },
  {
    id: "Arbeiten", label: "Arbeiten (angestellt)", labelByAge: { "65plus": "Arbeiten (Voll- oder Teilzeit)" }, ages: ADULT,
    needsQuestion: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    needsQuestionByAge: { "65plus": "Was würde dir helfen, deine Arbeit noch besser mit deinem Alltag zu vereinbaren?" },
    needs: [
      { id: "Arbeiten_Arbeitsklima", label: "Ein besseres Arbeitsklima" },
      { id: "Arbeiten_Jobwechsel", label: "Einen anderen Job" },
      { id: "Arbeiten_Karriere", label: "Mehr Verantwortung oder Aufstiegsmöglichkeiten", ages: range("18-24", "35-49") },
      { id: "Arbeiten_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben", ages: WORKING },
      { id: "Arbeiten_Vergütung", label: "Bessere Vergütung oder finanzielle Unterstützung" },
      { id: "Arbeiten_Umschulung", label: "Optionen für Weiterbildung oder Umschulung", ages: WORKING },
      { id: "Arbeiten_Gesundheit", label: "Unterstützung bei gesundheitlichen Belastungen (Stress, Krankheit)", ages: fromAge("35-49") },
      { id: "Arbeiten_Rente", label: "Perspektiven für den Übergang in die Rente", ages: fromAge("50-64") },
    ],
  },
  {
    id: "Gründung", label: "Gründung eines Unternehmens", ages: WORKING,
    needsQuestion: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    needs: [
      { id: "Gründung_Finanzierung", label: "Finanzierung" },
      { id: "Gründung_Beratung", label: "Beratung/Coaching" },
      { id: "Gründung_Businessplan", label: "Unterstützung beim Businessplan" },
      { id: "Gründung_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Gründung_RechtSteuern", label: "Rechtliche/Steuerliche Beratung" },
      { id: "Gründung_Marketing", label: "Marketing" },
      { id: "Gründung_Familie", label: "Vereinbarkeit mit Privatleben", ages: ["35-49", "50-64"] },
      { id: "Gründung_Erfahrung", label: "Erfahrungsaustausch", ages: ["50-64"] },
    ],
  },
  {
    id: "Selbstständig", label: "Selbstständig/Unternehmer:in", labelByAge: { "65plus": "Selbstständig" }, ages: ADULT,
    needsQuestion: "Was wäre hilfreich, um dein bisheriges Unternehmen erfolgreicher zu machen?",
    needsQuestionByAge: {
      "50-64": "Was wäre hilfreich, um deine Unternehmung erfolgreich zu gestalten?",
      "65plus": "Was wäre hilfreich, um deine Unternehmung erfolgreich zu gestalten?",
    },
    needs: [
      { id: "Selbstständig_Finanzierung", label: "Finanzierung/Investitionen" },
      { id: "Selbstständig_Kunden", label: "Kundengewinnung" },
      { id: "Selbstständig_RechtSteuern", label: "Rechtliche/steuerliche Beratung" },
      { id: "Selbstständig_Weiterbildung", label: "Weiterbildung/Fachwissen" },
      { id: "Selbstständig_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Selbstständig_Vereinbarkeit", label: "Vereinbarkeit mit Familie", labelByAge: { "18-24": "Vereinbarkeit mit Alltag/Familie" } },
      { id: "Selbstständig_Marketing", label: "Marketing" },
      { id: "Selbstständig_International", label: "Internationalisierung", ages: fromAge("25-34") },
      { id: "Selbstständig_Nachfolge", label: "Nachfolge- oder Ausstiegsplanung", ages: fromAge("50-64") },
      { id: "Selbstständig_Erfahrung", label: "Erfahrungsaustausch", ages: ["65plus"] },
    ],
  },
  {
    id: "Arbeitssuchend", label: "Arbeitssuchend", ages: WORKING,
    needsQuestion: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    needs: [
      { id: "Arbeitssuche_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet", labelByAge: { "50-64": "Beratung oder Coaching mit Fokus auf berufliche Neuorientierung" } },
      { id: "Arbeitssuche_Qualifizierung", label: "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen", labelByAge: { "50-64": "Qualifizierung oder Umschulung für neue Tätigkeiten" } },
      { id: "Arbeitssuche_Finanzen", label: "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken", labelByAge: { "50-64": "Finanzielle Unterstützung während der Arbeitssuche" } },
      { id: "Arbeitssuche_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Arbeitssuche_Netzwerk", label: "Kontakte zu Arbeitgebern oder Praktika", labelByAge: { "50-64": "Kontakte zu Arbeitgebern oder Unterstützung bei der Jobsuche ab 50+" } },
      { id: "Arbeitssuche_Psychisch", label: "Psychologische Unterstützung", labelByAge: { "50-64": "Psychologische Unterstützung bei Belastungen während der Arbeitssuche" } },
    ],
  },
  {
    id: "Weiterbildung", label: "Berufliche Weiterbildung/Umschulung", ages: WORKING,
    needsQuestion: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    needs: [
      { id: "Weiterbildung_Finanzen", label: "Finanzielle Unterstützung (z. B. Kursgebühren, Material)" },
      { id: "Weiterbildung_Karriere", label: "Beratung zu Karriereoptionen oder Weiterbildungspfaden" },
      { id: "Weiterbildung_Lernen", label: "Gezielte Förderung für meine Lernziele oder beruflichen Kompetenzen" },
      { id: "Weiterbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Beruf und Familie" },
      { id: "Weiterbildung_Austausch", label: "Mehr Austausch mit anderen Teilnehmer:innen" },
    ],
  },
  {
    id: "Übergang", label: "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)", ages: WORKING,
    needsQuestion: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    needs: [
      { id: "Übergang_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Übergang_Orientierung", label: "Berufs- oder Studienorientierung", ages: ["18-24", "25-34"] },
      { id: "Übergang_Praxis", label: "Möglichkeiten, praktische Erfahrungen zu sammeln (z. B. durch Praktika)", ages: ["18-24", "25-34"] },
      { id: "Übergang_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Übergang_Finanzen", label: "Finanzielle Unterstützung", labelByAge: { "50-64": "Finanzielle Unterstützung, um die Zeit zu überbrücken" } },
      { id: "Übergang_Umschulung", label: "Möglichkeiten für Umschulung", labelByAge: { "50-64": "Umschulung oder Weiterbildung für ältere Beschäftigte" }, ages: ["35-49", "50-64"] },
      { id: "Übergang_Wiedereinstieg", label: "Beratung für den beruflichen Wiedereinstieg", ages: range("25-34", "50-64") },
      { id: "Übergang_Vereinbarkeit", label: "Vereinbarkeit mit der Familie", ages: ["25-34", "35-49"] },
      { id: "Übergang_Netzwerk", label: "Austausch/Netzwerk für ältere Arbeitssuchende", ages: ["50-64"] },
    ],
  },
  {
    id: "Pflege", label: "Pflege von Angehörigen", ages: ADULT,
    needsQuestion: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    needsQuestionByAge: { "65plus": "Was würde dir helfen, die Pflege von Angehörigen besser mit deinem Alltag zu vereinbaren?" },
    needs: [
      { id: "Pflege_Informationen", label: "Informationen über Entlastungsangebote", labelByAge: { "65plus": "Informationen über Entlastungs- und Unterstützungsangebote" } },
      { id: "Pflege_Beratung", label: "Beratung zu rechtlichen und finanziellen Fragen (z. B. Pflegegeld, Sozialleistungen)" },
      { id: "Pflege_Vereinbarkeit", label: "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann", ages: WORKING },
      { id: "Pflege_Finanzierung", label: "Finanzielle Unterstützung" },
      { id: "Pflege_Psychisch", label: "Psychologische Unterstützung" },
      { id: "Pflege_Austausch", label: "Austausch mit anderen Pflegenden", labelByAge: { "18-24": "Austausch mit anderen jungen Pflegenden", "25-34": "Austausch mit anderen jungen Pflegenden" } },
    ],
  },
  {
    id: "Familie", label: "Elternzeit oder Kinderbetreuung zu Hause", ages: WORKING,
    needsQuestion: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    needs: [
      { id: "Familie_Angebote", label: "Informationen über Entlastungsangebote", labelByAge: { "50-64": "Informationen über Betreuungsangebote" } },
      { id: "Familie_Austausch", label: "Austausch mit anderen in meiner Lage" },
      { id: "Familie_Vereinbarkeit", label: "Beratung, wie ich die Zeit mit meinem Beruf/Ausbildung vereinbaren kann", labelByAge: { "50-64": "Beratung zur Vereinbarkeit von Familie und Beruf" } },
      { id: "Familie_Psych", label: "Psychologische Unterstützung" },
      { id: "Familie_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
  },
  {
    id: "Rente", label: "Ich bin in Rente", ages: ["50-64", "65plus"],
    needsQuestion: "Was wünschst du dir für deinen Ruhestand?",
    needs: [
      { id: "Rente_Sozial", label: "Mehr soziale Kontakte und Freizeitaktivitäten" },
      { id: "Rente_Alltag", label: "Unterstützung bei Alltagsaufgaben" },
      { id: "Rente_Weiterentwicklung", label: "Persönliche Weiterentwicklung (z. B. Kurse, Hobbys)" },
      { id: "Rente_Finanzen", label: "Mehr finanzielle Sicherheit" },
      { id: "Rente_Gesundheit", label: "Gesundheitliche Förderung" },
      { id: "Rente_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
  },
  {
    id: "Erwerbsunfähig", label: "Ich kann aus gesundheitlichen Gründen nicht arbeiten (erwerbsgemindert)", ages: ADULT,
    needsQuestion: "Was würde dir helfen, deinen Alltag besser zu gestalten?",
    needs: [
      { id: "Erwerbsunfähig_Gesundheit", label: "Gesundheitliche Unterstützung" },
      { id: "Erwerbsunfähig_Alltag", label: "Alltagsunterstützung" },
      { id: "Erwerbsunfähig_Behörden", label: "Behörden- und Antragsunterstützung" },
      { id: "Erwerbsunfähig_Finanzen", label: "Finanzielle Sicherheit" },
      { id: "Erwerbsunfähig_Sozial", label: "Mehr soziale Kontakte" },
      { id: "Erwerbsunfähig_Weiterbildung", label: "Möglichkeiten zur persönlichen Weiterentwicklung" },
    ],
  },
  {
    id: "Sonstiges", label: "Sonstiges", ages: AGE_GROUPS,
    needsQuestion: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    needsQuestionByAge: { U18: "Was wünschst du dir für deine aktuelle Situation?" },
    needs: [
      { id: "Sonstiges_Orientierung", label: "Orientierung und Perspektiven für Ausbildung/Arbeit", ages: range("U18", "50-64"), labelByAge: { U18: "Schnell einen passenden Schul-/Ausbildungsplatz finden", "50-64": "Berufliche Perspektiven und Orientierung" } },
      { id: "Sonstiges_Beratung", label: "Beratungs- und Unterstützungsangebote", labelByAge: { U18: "Eine Ansprechperson, die mich berät und unterstützt", "65plus": "Unterstützung bei Alltagsbewältigung und Behördenangelegenheiten" } },
      { id: "Sonstiges_Sozial", label: "Mehr soziale Kontakte und Freizeitgestaltung", labelByAge: { U18: "Neue Freunde finden und coole Aktivitäten" } },
      { id: "Sonstiges_Finanzen", label: "Finanzielle Absicherung", labelByAge: { U18: "Finanziell unabhängiger sein" } },
      { id: "Sonstiges_Psyche", label: "Psychische Unterstützung" },
      { id: "Sonstiges_Karriere", label: "Karriere- und Weiterentwicklungsmöglichkeiten", ages: ["25-34", "35-49"] },
      { id: "Sonstiges_Vereinbarkeit", label: "Vereinbarkeit von Beruf, Familie und Freizeit", ages: range("25-34", "50-64"), labelByAge: { "50-64": "Vereinbarkeit von Beruf und Pflege/Familie" } },
      { id: "Sonstiges_Weiterentwicklung", label: "Persönliche Weiterentwicklung (Hobbys, Kurse)", ages: ["65plus"] },
    ],
  },
];

export const ACTIVITY_DEFS: Readonly<Record<string, ActivityDef>> = Object.fromEntries(ACTIVITIES.map((d) => [d.id, d]));

/** Gewählte Tätigkeiten in der gewählten Reihenfolge. */
export const chosenActivities = (a: UserAnswers): string[] => {
  const v = a.taetigkeit;
  return (Array.isArray(v) ? v : v ? [v] : []).filter((id) => id in ACTIVITY_DEFS);
};

const ageLabel = (def: { label: string; labelByAge?: Partial<Record<AgeGroup, string>> }, age: AgeGroup | null) =>
  (age && def.labelByAge?.[age]) || def.label;

const TWO_ACTIVITIES_QUESTION = "Wobei würde dir Unterstützung am meisten helfen?";
const FAMILY_NEEDS_QUESTION = "Was würde dir als Familie am meisten helfen?";

/* ------------------------------------------------------------------ *
 * Fragen
 * ------------------------------------------------------------------ */

const KEINE_ANGABE: AnswerOption = { id: "KeineAngabe", label: "Möchte ich nicht sagen", exclusive: true };
const NICHTS: AnswerOption = { id: "Nichts", label: "Nichts davon", exclusive: true };

const FINANZ_KNAPP = ["Finanzen_regelmäßig-knapp", "Finanzen_Prekär"];

export const questionsMap: Record<string, QuestionData> = {
  /* Abschnitt Über dich */
  alter: {
    id: "alter",
    question: "Wie alt bist du?",
    options: [
      { id: "U18", label: "unter 18" },
      { id: "18-24", label: "18-24" },
      { id: "25-34", label: "25-34" },
      { id: "35-49", label: "35-49" },
      { id: "50-64", label: "50-64" },
      { id: "65plus", label: "über 65" },
    ],
  },
  taetigkeit: {
    id: "taetigkeit",
    question: "Was machst du aktuell?",
    multiSelect: true,
    maxSelections: 2,
    options: ACTIVITIES.map(({ id, label, labelByAge, ages }) => ({ id, label, labelByAge, ages })),
  },
  taetigkeit_bedarf: {
    id: "taetigkeit_bedarf",
    question: TWO_ACTIVITIES_QUESTION,
    questionFor: (a) => {
      const acts = chosenActivities(a);
      if (acts.length !== 1) return TWO_ACTIVITIES_QUESTION;
      const def = ACTIVITY_DEFS[acts[0]];
      const age = ageOf(a);
      return (age && def.needsQuestionByAge?.[age]) || def.needsQuestion;
    },
    questionVariants: ACTIVITIES.flatMap((d) => [d.needsQuestion, ...Object.values(d.needsQuestionByAge ?? {})]),
    multiSelect: true,
    maxSelections: 3,
    options: ACTIVITIES.flatMap((d) =>
      d.needs.map((n) => ({
        ...n,
        group: d.label,
        showIf: (a: UserAnswers) => chosenActivities(a).includes(d.id),
      })),
    ),
  },

  /* Abschnitt Zuhause */
  haushalt: {
    id: "haushalt",
    question: "Wer lebt mit dir in deinem Haushalt?",
    multiSelect: true,
    maxSelections: 4,
    options: [
      { id: "Haushalt_Allein", label: "Ich lebe allein", exclusive: true },
      { id: "Haushalt_Partner", label: "Partnerin oder Partner" },
      { id: "Haushalt_Kinder_U6", label: "Kinder unter 6 Jahren", ages: WORKING },
      { id: "Haushalt_Kinder_6_17", label: "Kinder zwischen 6 und 17 Jahren", ages: WORKING },
      { id: "Haushalt_Erwachsene", label: "Andere Erwachsene (z. B. Eltern, Mitbewohnende)" },
      { id: "Haushalt_Schwanger", label: "Ein Kind ist unterwegs (Schwangerschaft)", ages: range("18-24", "35-49") },
    ],
  },
  familie_bedarf: {
    id: "familie_bedarf",
    question: FAMILY_NEEDS_QUESTION,
    multiSelect: true,
    maxSelections: 3,
    options: [...ACTIVITY_DEFS.Familie.needs.map((n) => ({ ...n })), NICHTS],
  },
  wohnen: {
    id: "wohnen",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: [
      { id: "Miete", label: "Ich wohne zur Miete" },
      { id: "Eigentum", label: "Wohneigentum" },
      { id: "Wohnen_Familie", label: "Bei meiner Familie" },
      { id: "WG", label: "Wohngemeinschaft (WG)", ages: WORKING },
      { id: "Wohnheim", label: "In einem Wohnheim (Studentenwohnheim, etc.)", ages: range("18-24", "35-49") },
      { id: "Heim", label: "Seniorenheim/Pflegeeinrichtung", ages: fromAge("50-64") },
      { id: "Prekär", label: "Ich habe aktuell keinen Wohnsitz" },
    ],
  },
  wohnen_u18: {
    id: "wohnen_u18",
    question: "Wohnst du bei deinen Eltern oder Verwandten?",
    options: [
      { id: "Wohnen_Familie", label: "Ja" },
      { id: "Betreuung", label: "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)" },
      { id: "Prekär", label: "Nein, ich habe gerade keinen festen Wohnort" },
    ],
  },
  wohnen_ohne: {
    id: "wohnen_ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: [
      { id: "Ohne_Bekannte", label: "Bei Freunden/Bekannten" },
      { id: "Ohne_Not", label: "In einer Notunterkunft oder einem Obdachlosenheim" },
      { id: "Ohne_Öffentlich", label: "Ich übernachte an öffentlichen Orten" },
      { id: "Ohne_Fahrzeug", label: "Ich wohne in einem Fahrzeug" },
      { id: "Ohne_Nichts", label: "Nichts davon" },
    ],
  },

  /* Abschnitt Geld */
  einkommen: {
    id: "einkommen",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht." },
      { id: "Finanzen_regelmäßig-knapp", label: "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp." },
      { id: "Finanzen_Ersparnisse", label: "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie." },
      { id: "Finanzen_Prekär", label: "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken." },
      { ...KEINE_ANGABE, exclusive: false },
    ],
  },
  einkommen_familie: {
    id: "einkommen_familie",
    question: "Hast du das Gefühl, dass es finanzielle Schwierigkeiten gibt?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Wir haben regelmäßiges Einkommen und kommen damit gut zurecht" },
      { id: "Finanzen_regelmäßig-knapp", label: "Wir haben regelmäßiges Einkommen, aber es ist oft knapp" },
      { id: "Finanzen_Ersparnisse", label: "Wir haben kein regelmäßiges Einkommen und nutzen Ersparnisse oder Unterstützung durch Verwandte" },
      { id: "Finanzen_Prekär", label: "Wir haben kein regelmäßiges Einkommen und können unsere Ausgaben nicht decken" },
      { id: "Unbekannt", label: "Weiß ich nicht" },
    ],
  },
  leistungen: {
    id: "leistungen",
    question: "Bekommst du eine dieser Leistungen?",
    multiSelect: true,
    maxSelections: 4,
    options: [
      { id: "Leistung_Bürgergeld", label: "Bürgergeld" },
      { id: "Leistung_ALG1", label: "Arbeitslosengeld (von der Agentur für Arbeit)", ages: WORKING },
      { id: "Leistung_Wohngeld", label: "Wohngeld" },
      { id: "Leistung_Kinderzuschlag", label: "Kinderzuschlag", showIf: hasChildren },
      { id: "Leistung_BAföG", label: "BAföG oder Berufsausbildungsbeihilfe (BAB)", ages: range("18-24", "35-49") },
      { id: "Leistung_Rente", label: "Rente (auch Erwerbsminderungsrente)" },
      { id: "Leistung_Grundsicherung", label: "Grundsicherung oder Sozialhilfe" },
      { id: "Leistung_AsylbLG", label: "Leistungen nach dem Asylbewerberleistungsgesetz" },
      { id: "Leistung_Keine", label: "Keine dieser Leistungen", exclusive: true },
      KEINE_ANGABE,
    ],
  },
  leistungen_familie: {
    id: "leistungen_familie",
    question: "Bekommt deine Familie eine dieser Leistungen?",
    multiSelect: true,
    maxSelections: 4,
    options: [
      { id: "Leistung_Bürgergeld", label: "Bürgergeld" },
      { id: "Leistung_Wohngeld", label: "Wohngeld" },
      { id: "Leistung_Kinderzuschlag", label: "Kinderzuschlag" },
      { id: "Leistung_Grundsicherung", label: "Grundsicherung oder Sozialhilfe" },
      { id: "Leistung_AsylbLG", label: "Leistungen nach dem Asylbewerberleistungsgesetz" },
      { id: "Leistung_BAföG", label: "Schüler-BAföG oder Berufsausbildungsbeihilfe (BAB) für mich" },
      { id: "Leistung_Keine", label: "Keine dieser Leistungen", exclusive: true },
      { id: "Unbekannt", label: "Weiß ich nicht", exclusive: true },
    ],
  },

  /* Abschnitt Gesundheit */
  gesundheit: {
    id: "gesundheit",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    multiSelect: true,
    maxSelections: 4,
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen", exclusive: true },
      { id: "Beeinträchtigung_Körperlich", label: "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)" },
      { id: "Beeinträchtigung_Psychisch", label: "Psychische Einschränkung (z. B. Depression, Angststörung)" },
      { id: "Beeinträchtigung_Chronisch", label: "Chronische Erkrankung (z. B. Diabetes, Epilepsie)" },
      { id: "Beeinträchtigung_Sinne", label: "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)" },
      KEINE_ANGABE,
    ],
  },
  gesundheit_bedarf: {
    id: "gesundheit_bedarf",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    multiSelect: true,
    maxSelections: 3,
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung im Beruf oder Ausbildung", labelByAge: { U18: "Unterstützung in der Schule/Ausbildung", "50-64": "Unterstützung im Beruf/Alltag", "65plus": "Unterstützung im Beruf/Alltag" } },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
      NICHTS,
    ],
  },

  /* Abschnitt Was dich beschäftigt */
  herausforderungen: {
    id: "herausforderungen",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    multiSelect: true,
    maxSelections: 3,
    options: [
      // Bei knappem oder fehlendem Einkommen schon bekannt (Ableitung in derive.ts)
      { id: "Herausforderung_Finanzen", label: "Finanzielle Belastungen oder Schulden", showIf: (a) => !pickedAny(a, "einkommen", FINANZ_KNAPP) && !pickedAny(a, "einkommen_familie", FINANZ_KNAPP) },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen (z. B. Stress, Ängste)" },
      { id: "Herausforderung_Einsam", label: "Einsamkeit oder wenige soziale Kontakte" },
      { id: "Herausforderung_Bürokratie", label: "Bürokratische Herausforderungen (z. B. Ämter, Anträge, Unterstützungssysteme)", ages: ADULT },
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Schule", label: "Schwierigkeiten in der Schule oder Ausbildung", ages: YOUNG },
      { id: "Herausforderung_Kinder", label: "Kinderbetreuung", showIf: (a) => hasChildren(a) || chosenActivities(a).includes("Familie") },
      { id: "Herausforderung_Vereinbarkeit", label: "Belastungen durch Vereinbarkeit von Beruf und Familie", ages: WORKING },
      // Bei der Tätigkeit Pflege schon bekannt
      { id: "Herausforderung_Pflege", label: "Ich kümmere mich um Angehörige", showIf: (a) => !chosenActivities(a).includes("Pflege") },
      { id: "Herausforderung_Sozial", label: "Schwierigkeiten im sozialen Umfeld", labelByAge: { U18: "Konflikte im sozialen Umfeld (z. B. Freundeskreis, Mobbing)" } },
      { id: "Herausforderung_Freizeit", label: "Fehlende Freizeit- und Teilhabemöglichkeiten (z. B. Sport, Jugendangebote)", ages: YOUNG },
      { id: "Herausforderung_Orientierung", label: "Unsicherheit bei beruflicher oder privater Orientierung", ages: range("18-24", "35-49") },
      // Bei angegebener Beeinträchtigung schon bekannt
      { id: "Herausforderung_Gesundheit", label: "Gesundheitliche Einschränkungen oder Pflegebedarf", ages: ["65plus"], showIf: (a) => !hasImpairment(a) },
      NICHTS,
    ],
  },
  staatsangehoerigkeit: {
    id: "staatsangehoerigkeit",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
      { ...KEINE_ANGABE, exclusive: false },
    ],
  },

  /* Abschnitt Wünsche, freiwillig */
  wuensche: {
    id: "wuensche",
    question: "Was wünschst du dir?",
    multiSelect: true,
    maxSelections: 3,
    optional: true,
    options: [
      { id: "Wunsch_Sozial", label: "Neue Leute kennenlernen und Kontakte knüpfen", labelByAge: { U18: "Neue Freunde finden" } },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Freizeit- und Kulturangebote", labelByAge: { U18: "Spaß- und Kulturangebote" } },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Gründung", label: "Einstieg in die Selbstständigkeit oder Gründung", ages: WORKING, showIf: (a) => !chosenActivities(a).some((x) => x === "Gründung" || x === "Selbstständig") },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
  },
};

/** Arten der Beeinträchtigung, die eine Folgefrage auslösen. */
export const IMPAIRMENT_IDS = ["Beeinträchtigung_Körperlich", "Beeinträchtigung_Psychisch", "Beeinträchtigung_Chronisch", "Beeinträchtigung_Sinne"];
export function hasImpairment(a: UserAnswers): boolean {
  return pickedAny(a, "gesundheit", IMPAIRMENT_IDS);
}

/* ------------------------------------------------------------------ *
 * Zugriff
 * ------------------------------------------------------------------ */

export function getQuestionData(questionId: string): QuestionData | undefined {
  return questionsMap[questionId];
}

/** Alle Fragen, z. B. für Übersetzungsdateien und Tests. */
export const getAllQuestions = (): QuestionData[] => Object.values(questionsMap);

/** Antwortoption einer Frage anhand ihrer id. */
export function getOption(questionId: string, optionId: string): AnswerOption | undefined {
  return questionsMap[questionId]?.options.find((o) => o.id === optionId);
}

/** Optionen, die bei diesen Antworten angezeigt werden (Alter und Bedingungen). */
export function getVisibleOptions(questionId: string, answers: UserAnswers): AnswerOption[] {
  const q = questionsMap[questionId];
  if (!q) return [];
  const age = ageOf(answers);
  return q.options.filter((o) => (!o.ages || !age || o.ages.includes(age)) && (!o.showIf || o.showIf(answers)));
}

/** Fragetext für diese Antworten, noch nicht übersetzt. */
export function getQuestionText(questionId: string, answers: UserAnswers = {}): string {
  const q = questionsMap[questionId];
  if (!q) return questionId;
  return q.questionFor?.(answers) ?? q.question;
}

/**
 * Anzeigetext einer Antwort, übersetzt. Mit Antworten wird die
 * altersgerechte Fassung gewählt.
 */
export function getOptionLabel(questionId: string, optionId: string, answers?: UserAnswers): string {
  const option = getOption(questionId, optionId);
  if (!option) return optionId;
  return tr(ageLabel(option, answers ? ageOf(answers) : null));
}

/** Alle deutschen Texte des Fragebogens, für die Übersetzungsprüfung. */
export function getAllQuestionnaireTexts(): string[] {
  const texts = new Set<string>();
  for (const q of getAllQuestions()) {
    texts.add(q.question);
    q.questionVariants?.forEach((t) => texts.add(t));
    q.options.forEach((o) => {
      texts.add(o.label);
      Object.values(o.labelByAge ?? {}).forEach((t) => texts.add(t));
      if (o.group) texts.add(o.group);
    });
  }
  return [...texts];
}
