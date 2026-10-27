
import { UserAnswers } from "@/context/QuestionnaireContext";
import { getQuestionData } from "@/data/questionnaireData";
import { ACTIVITY_TAGS, EXCLUDED_FROM_SCORING, NATIONALITY_TAGS } from "@/utils/tagConstants";

/**
 * Maps an age-range answer to numeric min/max for DB filtering.
 */
export const getAgeRange = (ageAnswer: string): { minAge: number; maxAge: number } | null => {
  switch (ageAnswer) {
    case "unter 18": return { minAge: 0, maxAge: 17 };
    case "18-24": return { minAge: 18, maxAge: 24 };
    case "25-34": return { minAge: 25, maxAge: 34 };
    case "35-49": return { minAge: 35, maxAge: 49 };
    case "50-64": return { minAge: 50, maxAge: 64 };
    case "über 65": return { minAge: 65, maxAge: 120 };
    default: return null;
  }
};

/**
 * Nur die Antworten des tatsächlich durchlaufenen Pfads.
 * Wer zurückgeht und z. B. von "Studium" auf "Arbeiten" wechselt, hat noch die
 * alte Studiums-Antwort im Speicher. Ohne diesen Filter würden solche verwaisten
 * Antworten weiter in die Ergebnisse einfließen.
 * Die Reihenfolge folgt dem Fragenverlauf.
 */
export const getActiveAnswers = (answers: UserAnswers, history?: string[]): UserAnswers => {
  if (!history || history.length === 0) return answers;
  const active: UserAnswers = {};
  history.forEach((questionId) => {
    if (answers[questionId] !== undefined) active[questionId] = answers[questionId];
  });
  return active;
};

/** Ein einzelner angeklickter Antwortpunkt samt zugehörigem Tag. */
export interface AnswerSelection {
  questionId: string;
  question: string;
  option: string;
  tag: string;
}

/**
 * Löst alle Antworten (Einfach- und Mehrfachauswahl) in einzelne
 * Antwort-Tag-Paare auf, in der Reihenfolge des Fragenverlaufs.
 */
export const extractSelections = (answers: UserAnswers): AnswerSelection[] => {
  const selections: AnswerSelection[] = [];
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    const questionData = getQuestionData(questionId);
    if (!questionData?.tags || !questionData?.options) return;
    const selectedValues = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
    selectedValues.forEach((option) => {
      const index = questionData.options.indexOf(option);
      const tag = index !== -1 ? questionData.tags![index] : undefined;
      if (tag) selections.push({ questionId, question: questionData.question, option, tag });
    });
  });
  return selections;
};

/**
 * Extracts all relevant tags from user answers.
 * Handles both single-select (string) and multi-select (string[]) answers.
 */
export const extractTagsFromAnswers = (answers: UserAnswers): string[] =>
  Array.from(new Set(extractSelections(answers).map((s) => s.tag)));

/** Trägt ein Tag Information für das Matching (siehe EXCLUDED_FROM_SCORING)? */
export const isMeaningfulTag = (tag: string): boolean => !EXCLUDED_FROM_SCORING.has(tag);

/**
 * Tag priority weights — tags from different question types have different
 * importance for matching. Activity and specific-need tags are most important.
 */
const TAG_WEIGHTS: Record<string, number> = {
  // Nationality tags (medium weight)
  "EU": 1, "Ukrainisch": 1.5, "Türkisch": 1.5, "Syrisch": 1.5, "Drittstaat": 1.5,
};

const ACTIVITY_PREFIXES = ['Schule', 'Ausbildung', 'Studium', 'Arbeiten', 'Gründung', 'Selbstständig',
  'Arbeitssuche', 'Weiterbildung', 'Übergang', 'Pflege', 'Familie', 'FSJ',
  'Rente', 'Erwerbsunfähig', 'Sonstiges'];

function getTagWeight(tag: string): number {
  if (TAG_WEIGHTS[tag]) return TAG_WEIGHTS[tag];

  // Activity-specific tags (Q3/Q4) get highest weight
  const prefix = tag.split('_')[0];
  if (ACTIVITY_PREFIXES.includes(prefix)) return 3;

  // Need-specific tags (challenges, health, wishes)
  if (['Herausforderung', 'Gesundheit', 'Wunsch'].includes(prefix)) return 2;

  // Financial/housing tags
  if (['Finanzen', 'Miete', 'Eigentum', 'Prekär', 'Ohne', 'WG', 'Wohnheim', 'Heim', 'Betreuung'].includes(prefix)) return 2;

  // Health status tags
  if (prefix === 'Beeinträchtigung') return 1.5;

  return 1;
}

/**
 * Compute a relevance score for a funding item against user tags.
 * Returns a number 0-120. Higher = more relevant. 0 = kein aussagekräftiger Treffer.
 * Alters- und neutrale Tags zählen nicht mit: Sonst "passt" fast jedes Angebot,
 * nur weil es für die Altersgruppe offen ist.
 */
export const computeRelevanceScore = (
  fundingTags: string[],
  userTags: string[]
): number => {
  const meaningful = userTags.filter(isMeaningfulTag);
  if (!fundingTags || fundingTags.length === 0 || meaningful.length === 0) return 0;

  let matchedWeight = 0;
  let totalWeight = 0;
  let matchCount = 0;

  meaningful.forEach(userTag => {
    const weight = getTagWeight(userTag);
    totalWeight += weight;
    if (fundingTags.includes(userTag)) {
      matchedWeight += weight;
      matchCount++;
    }
  });

  if (totalWeight === 0 || matchCount === 0) return 0;

  // Weighted match ratio (0-1)
  const weightedRatio = matchedWeight / totalWeight;

  // Bonus for absolute number of matches (rewards breadth)
  const matchBonus = Math.min(matchCount / 3, 1) * 0.2;

  return Math.round((weightedRatio + matchBonus) * 100);
};

/* ------------------------------------------------------------------ *
 * Ergebnis-Gruppen: "Weil du … angeklickt hast"
 * ------------------------------------------------------------------ */

export interface ReasonGroup<T> {
  key: string;
  /** Angeklickte Antwort, wie sie im Fragebogen stand */
  option: string;
  question: string;
  tag: string;
  fundings: T[];
}

/**
 * Reihenfolge der Gruppen: akute Notlagen zuerst, dann die konkreten
 * Wünsche aus der Tätigkeitsfrage, Gesundheit und Herausforderungen,
 * Finanzen und Herkunft, danach die Tätigkeit selbst als breitere Zeile,
 * zuletzt Wohnen und Freizeitwünsche.
 */
const groupPriority = (tag: string): number => {
  const [prefix, sub] = tag.split('_');
  if (tag === 'Prekär' || prefix === 'Ohne') return 0;
  if (sub && ACTIVITY_PREFIXES.includes(prefix)) return 1;
  if (['Gesundheit', 'Herausforderung', 'Beeinträchtigung'].includes(prefix)) return 2;
  if (prefix === 'Finanzen' || (NATIONALITY_TAGS as readonly string[]).includes(tag)) return 3;
  if ((ACTIVITY_TAGS as readonly string[]).includes(tag)) return 4;
  if (prefix === 'Wunsch') return 5;
  return 6;
};

/**
 * Themenfamilie eines Tags. Antworten derselben Familie (z. B. „Schule“ und
 * „Mobbing“) gelten nicht als unabhängige Bestätigung füreinander.
 */
export const tagFamily = (tag: string): string => {
  const [prefix] = tag.split('_');
  if ((ACTIVITY_TAGS as readonly string[]).includes(prefix) || ACTIVITY_PREFIXES.includes(prefix)) return 'activity';
  if (prefix === 'Beeinträchtigung' || prefix === 'Gesundheit') return 'health';
  if (['Miete', 'Eigentum', 'WG', 'Wohnheim', 'Prekär', 'Ohne', 'Heim', 'Betreuung', 'Wohnen'].includes(prefix)) return 'housing';
  if (prefix === 'Finanzen') return 'finance';
  if ((NATIONALITY_TAGS as readonly string[]).includes(tag)) return 'origin';
  if (prefix === 'Herausforderung') return 'challenge';
  if (prefix === 'Wunsch') return 'wish';
  return prefix;
};

/** Themenbereiche, in denen ein Angebot für eine andere Lebenslage gedacht sein kann. */
const EXCLUSIVE_FAMILIES = new Set(['activity', 'health', 'origin', 'housing', 'finance']);
const AGE_TAG_SET = new Set(['U18', '18-24', '25-34', '35-49', '50-64', '65plus']);

/**
 * Antworten, die inhaltlich zusammengehören. Wer in einer WG wohnt, wohnt
 * auch zur Miete; wer Syrisch angibt, gehört zu den Drittstaatsangehörigen.
 */
const COMPATIBLE: Record<string, string[]> = {
  Miete: ['Miete', 'WG', 'Wohnheim'],
  WG: ['Miete', 'WG', 'Wohnheim'],
  Wohnheim: ['Miete', 'WG', 'Wohnheim'],
  Prekär: ['Prekär', 'Ohne_Bekannte', 'Ohne_Not', 'Ohne_Öffentlich', 'Ohne_Fahrzeug', 'Ohne_Nichts'],
  Syrisch: ['Syrisch', 'Drittstaat'],
  Ukrainisch: ['Ukrainisch', 'Drittstaat'],
  Türkisch: ['Türkisch', 'Drittstaat'],
};

export interface FitInfo {
  /** Themenbereiche, in denen das Angebot eine aussagekräftige Antwort trifft */
  matchedFamilies: Set<string>;
  /** Themenbereiche, in denen das Angebot erkennbar auf eine andere Lebenslage zielt */
  contradictions: number;
  /** Widerspruch bei der Wohnsituation (z. B. Angebot nur für Eigentum) */
  housingConflict: boolean;
}

/**
 * Prüft ein Angebot gegen ALLE Antworten, auch die neutralen.
 * Ein Widerspruch liegt vor, wenn das Angebot in einem Themenbereich, zu dem
 * die Person geantwortet hat, nur Tags trägt, die nicht zu ihrer Antwort
 * passen. Beispiel: „keine Beeinträchtigung“ angegeben, Angebot nur für
 * körperliche Beeinträchtigung; „zur Miete“, Angebot nur für Eigentum.
 * Bei den Finanzen zählt nur „kommt gut zurecht“ als Gegensatz zu Angeboten
 * für finanzielle Notlagen.
 */
export const makeFitAnalyzer = (answers: UserAnswers) => {
  const all = extractSelections(answers).filter((s) => !AGE_TAG_SET.has(s.tag));
  const userByFamily = new Map<string, Set<string>>();
  all.forEach((s) => {
    const fam = tagFamily(s.tag);
    if (!userByFamily.has(fam)) userByFamily.set(fam, new Set());
    (COMPATIBLE[s.tag] ?? [s.tag]).forEach((t) => userByFamily.get(fam)!.add(t));
  });
  const financeOk = userByFamily.get('finance')?.has('Finanzen_regelmäßig-gut') ?? false;
  const meaningful = new Set(all.filter((s) => isMeaningfulTag(s.tag)).map((s) => s.tag));

  return (fundingTags: string[] | null): FitInfo => {
    const tags = fundingTags ?? [];
    const matchedFamilies = new Set<string>();
    tags.forEach((t) => {
      if (meaningful.has(t)) matchedFamilies.add(tagFamily(t));
    });
    let contradictions = 0;
    let housingConflict = false;
    userByFamily.forEach((userTags, fam) => {
      if (!EXCLUSIVE_FAMILIES.has(fam)) return;
      if (fam === 'finance' && !financeOk) return;
      const offerTags = tags.filter((t) => !AGE_TAG_SET.has(t) && tagFamily(t) === fam);
      if (offerTags.length > 0 && !offerTags.some((t) => userTags.has(t))) {
        contradictions++;
        if (fam === 'housing') housingConflict = true;
      }
    });
    return { matchedFamilies, contradictions, housingConflict };
  };
};

/** Passt ein Angebot insgesamt eher zu einer anderen Lebenslage als zur eigenen? */
export const contradictsSituation = (fit: FitInfo): boolean =>
  fit.housingConflict || fit.contradictions > fit.matchedFamilies.size;

/** Zeilen werden bis zu dieser Größe mit neutralen Treffern aufgefüllt. */
const FILL_PER_ROW = 6;

/**
 * Verteilt die Treffer auf Zeilen je angeklickter Antwort.
 *
 * Eine Zeile zeigt Angebote, die zur angeklickten Antwort passen und
 * gleichzeitig zum Rest der Situation stimmen:
 * 1. Angebote, die erkennbar für eine andere Lebenslage gedacht sind, fallen weg.
 * 2. Vorrang haben Angebote, die zusätzlich eine Angabe aus einem anderen
 *    Themenbereich treffen (z. B. Schule UND knappe Finanzen).
 * 3. Gibt es davon weniger als sechs, wird mit den besten übrigen passenden
 *    Angeboten auf sechs aufgefüllt, damit keine Antwort leer ausgeht.
 *
 * Jedes Angebot erscheint nur einmal, und zwar in der spezifischsten passenden
 * Zeile. Zeilen ohne Treffer entfallen.
 */
export function buildReasonGroups<T extends { id: string; tags: string[] | null; relevanceScore?: number }>(
  fundings: T[],
  answers: UserAnswers,
  options: { exclude?: Set<string> } = {}
): ReasonGroup<T>[] {
  const used = new Set<string>(options.exclude ?? []);
  const fitOf = makeFitAnalyzer(answers);

  const seenTags = new Set<string>();
  const selections = extractSelections(answers)
    .filter((s) => isMeaningfulTag(s.tag))
    .filter((s) => (seenTags.has(s.tag) ? false : (seenTags.add(s.tag), true)))
    .map((s, order) => ({ ...s, order, family: tagFamily(s.tag) }))
    .sort((a, b) => groupPriority(a.tag) - groupPriority(b.tag) || a.order - b.order);

  const scored = fundings
    .map((f) => ({ f, fit: fitOf(f.tags) }))
    .filter(({ fit }) => !contradictsSituation(fit))
    .sort((a, b) => (b.f.relevanceScore ?? 0) - (a.f.relevanceScore ?? 0));

  const groups: ReasonGroup<T>[] = [];
  selections.forEach((s) => {
    const candidates = scored.filter(({ f }) => !used.has(f.id) && (f.tags ?? []).includes(s.tag));
    const confirmedEntries = candidates.filter(({ fit }) => [...fit.matchedFamilies].some((fam) => fam !== s.family));
    const neutral = candidates
      .filter((c) => !confirmedEntries.includes(c))
      .sort((a, b) => a.fit.contradictions - b.fit.contradictions || (b.f.relevanceScore ?? 0) - (a.f.relevanceScore ?? 0));
    const items = [...confirmedEntries, ...neutral.slice(0, Math.max(0, FILL_PER_ROW - confirmedEntries.length))].map(
      (c) => c.f,
    );
    if (items.length === 0) return;
    items.forEach((f) => used.add(f.id));
    groups.push({ key: `${s.questionId}:${s.tag}`, option: s.option, question: s.question, tag: s.tag, fundings: items });
  });
  return groups;
}

/**
 * Groups tags by category for debugging/display.
 */
export const groupTagsByCategory = (tags: string[]): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};
  tags.forEach(tag => {
    const category = tag.split('_')[0] || 'general';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(tag);
  });
  return grouped;
};
