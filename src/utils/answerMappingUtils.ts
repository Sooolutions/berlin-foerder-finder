
import { UserAnswers } from "@/context/QuestionnaireContext";
import { getOptionLabel, getQuestionData, getQuestionText, picked } from "@/data/questionnaireData";
import { tr } from "@/i18n/LanguageContext";
import { benefitEffect, type BenefitEffect } from "@/questionnaire/benefits";
import { deriveProfile, deriveTags, type DerivedTag } from "@/questionnaire/derive";
import { computePath } from "@/questionnaire/flow";
import { ACTIVITY_TAGS, AGE_TAGS, EXCLUDED_FROM_SCORING, NATIONALITY_TAGS } from "@/utils/tagConstants";

/**
 * Maps an age-range answer (Options-id aus Q1) to numeric min/max for DB filtering.
 */
export const getAgeRange = (ageAnswer: string): { minAge: number; maxAge: number } | null => {
  switch (ageAnswer) {
    case "U18": return { minAge: 0, maxAge: 17 };
    case "18-24": return { minAge: 18, maxAge: 24 };
    case "25-34": return { minAge: 25, maxAge: 34 };
    case "35-49": return { minAge: 35, maxAge: 49 };
    case "50-64": return { minAge: 50, maxAge: 64 };
    case "65plus": return { minAge: 65, maxAge: 120 };
    default: return null;
  }
};

/**
 * Nur die Antworten des tatsächlich durchlaufenen Pfads.
 * Wer zurückgeht und z. B. von "Studium" auf "Arbeiten" wechselt, hat noch die
 * alte Studiums-Antwort im Speicher. Ohne diesen Filter würden solche verwaisten
 * Antworten weiter in die Ergebnisse einfließen.
 * Der Pfad wird aus den Antworten selbst berechnet (computePath), die
 * Fragenhistorie wird dafür nicht mehr gebraucht. Die Reihenfolge folgt dem
 * Fragenverlauf.
 */
export const getActiveAnswers = (answers: UserAnswers): UserAnswers => {
  const active: UserAnswers = {};
  computePath(answers).steps.forEach(({ questionId }) => {
    if (answers[questionId] !== undefined) active[questionId] = answers[questionId];
  });
  return active;
};

/** Ein einzelner angeklickter Antwortpunkt samt zugehörigem Tag. */
export interface AnswerSelection {
  questionId: string;
  question: string;
  /** Anzeigetext der Antwort */
  option: string;
  /** Options-id, zugleich der Matching-Tag */
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
    if (!questionData?.options) return;
    const selectedIds = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
    selectedIds.forEach((optionId) => {
      const option = questionData.options.find((o) => o.id === optionId);
      if (option) {
        selections.push({
          questionId,
          question: tr(getQuestionText(questionId, answers)),
          option: getOptionLabel(questionId, option.id, answers),
          tag: option.id,
        });
      }
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

/**
 * Alle Tags eines Antwortprofils für das Matching: die angeklickten und die
 * abgeleiteten (src/questionnaire/derive.ts). factors enthält den
 * Gewichtsfaktor abgeleiteter Tags.
 */
export const extractProfileTags = (answers: UserAnswers): { tags: string[]; factors: Map<string, number>; derived: DerivedTag[] } => {
  const { derived, boosts } = deriveProfile(answers);
  const direct = extractTagsFromAnswers(answers);
  return {
    tags: Array.from(new Set([...direct, ...derived.map((d) => d.tag)])),
    factors: new Map([...derived.map((d) => [d.tag, d.factor] as [string, number]), ...boosts]),
    derived,
  };
};


/* ------------------------------------------------------------------ *
 * Tag-Systematik
 * ------------------------------------------------------------------ */

const ACTIVITY_PREFIXES = ['Schule', 'Ausbildung', 'Studium', 'Arbeiten', 'Gründung', 'Selbstständig',
  'Arbeitssuche', 'Arbeitssuchend', 'Weiterbildung', 'Übergang', 'Pflege', 'Familie', 'FSJ',
  'Rente', 'Erwerbsunfähig', 'Sonstiges'];

const AGE_TAG_SET = new Set<string>(AGE_TAGS);
const NATIONALITY_SET = new Set<string>(NATIONALITY_TAGS);

/**
 * Oberbegriff einer Tätigkeit. Detail-Tags wie „Studium_Finanzen“ gehören zu
 * „Studium“, „Arbeitssuche_Beratung“ gehört zu „Arbeitssuchend“.
 */
export const activityRoot = (tag: string): string | null => {
  const [prefix] = tag.split('_');
  if (prefix === 'Arbeitssuche') return 'Arbeitssuchend';
  return ACTIVITY_PREFIXES.includes(prefix) ? prefix : null;
};

/**
 * Tätigkeiten, deren Angebote sich sinnvoll überschneiden. Wer gründet, kann
 * Angebote für Selbstständige nutzen, wer in einer Übergangsphase ist,
 * Angebote für Arbeitssuchende, und umgekehrt.
 */
const ACTIVITY_COMPAT: Record<string, string[]> = {
  Gründung: ['Selbstständig'],
  Selbstständig: ['Gründung'],
  Übergang: ['Arbeitssuchend', 'Weiterbildung'],
  Arbeitssuchend: ['Übergang', 'Weiterbildung'],
  Erwerbsunfähig: ['Rente'],
  Arbeiten: ['Weiterbildung'],
};

/**
 * Herausforderungen, die eine Lebenslage mitbringen, auch wenn die Tätigkeit
 * eine andere ist. Wer studiert und Kinder hat („Herausforderung_Kinder“),
 * soll Familienangebote sehen, wer nebenbei pflegt, Pflegeangebote.
 */
const CHALLENGE_IMPLIES_ACTIVITY: Record<string, string> = {
  Haushalt_Kinder_U6: 'Familie',
  Haushalt_Kinder_6_17: 'Familie',
  Haushalt_Schwanger: 'Familie',
  Haushalt_Alleinerziehend: 'Familie',
  Herausforderung_Kinder: 'Familie',
  Herausforderung_Vereinbarkeit: 'Familie',
  Herausforderung_Pflege: 'Pflege',
  Herausforderung_Schule: 'Schule',
};

/**
 * Themenfamilie eines Tags. Antworten derselben Familie (z. B. „Schule“ und
 * „Mobbing“) gelten nicht als unabhängige Bestätigung füreinander.
 */
export const tagFamily = (tag: string): string => {
  const [prefix] = tag.split('_');
  if (activityRoot(tag)) return 'activity';
  if (prefix === 'Beeinträchtigung' || prefix === 'Gesundheit') return 'health';
  if (['Miete', 'Eigentum', 'WG', 'Wohnheim', 'Prekär', 'Ohne', 'Heim', 'Betreuung', 'Wohnen'].includes(prefix)) return 'housing';
  if (prefix === 'Finanzen') return 'finance';
  if (NATIONALITY_SET.has(tag)) return 'origin';
  if (prefix === 'Herausforderung') return 'challenge';
  if (prefix === 'Wunsch') return 'wish';
  if (prefix === 'Haushalt') return 'household';
  if (prefix === 'Leistung') return 'benefit';
  return prefix;
};

/**
 * Antworten, die inhaltlich zusammengehören. Wer in einer WG wohnt, wohnt
 * auch zur Miete; wer Syrisch angibt, gehört zu den Drittstaatsangehörigen.
 * Wer bei der Familie wohnt, kann ein WG-Zimmer oder einen Wohnheimplatz
 * suchen. „Starke Beeinträchtigung“ (Fragepfad unter 18) umfasst alle Arten
 * von Beeinträchtigung, umgekehrt passen Angebote für starke Beeinträchtigung
 * zu jeder angegebenen Art.
 */
const IMPAIRMENT_TYPES = ['Beeinträchtigung_Körperlich', 'Beeinträchtigung_Psychisch', 'Beeinträchtigung_Chronisch', 'Beeinträchtigung_Sinne'];
const COMPATIBLE: Record<string, string[]> = {
  Miete: ['Miete', 'WG', 'Wohnheim'],
  WG: ['Miete', 'WG', 'Wohnheim'],
  Wohnheim: ['Miete', 'WG', 'Wohnheim'],
  Wohnen_Familie: ['Wohnen_Familie', 'WG', 'Wohnheim'],
  // Wer in einer Einrichtung lebt, zieht oft bald aus: Azubiwohnen, Wohnheim und WG passen
  Betreuung: ['Betreuung', 'Wohnheim', 'WG'],
  Prekär: ['Prekär', 'Ohne_Bekannte', 'Ohne_Not', 'Ohne_Öffentlich', 'Ohne_Fahrzeug', 'Ohne_Nichts'],
  Syrisch: ['Syrisch', 'Drittstaat'],
  Ukrainisch: ['Ukrainisch', 'Drittstaat'],
  Türkisch: ['Türkisch', 'Drittstaat'],
  Beeinträchtigung_Stark: ['Beeinträchtigung_Stark', ...IMPAIRMENT_TYPES],
  Beeinträchtigung_Gering: ['Beeinträchtigung_Gering', ...IMPAIRMENT_TYPES],
  ...Object.fromEntries(IMPAIRMENT_TYPES.map((t) => [t, [t, 'Beeinträchtigung_Stark']])),
};

/* ------------------------------------------------------------------ *
 * Harte Ausschlusskriterien
 * ------------------------------------------------------------------ */

/** Minimaler Ausschnitt eines Angebots, den die Matching-Logik braucht. */
export interface MatchableFunding {
  id: string;
  tags: string[] | null;
  min_age?: number | null;
  max_age?: number | null;
  district?: string[] | null;
  /** Leistung, die das Angebot selbst ist (Spalte benefit_type) */
  benefit_type?: string | null;
  /** Leistungen, von denen das Angebot eine voraussetzt (Spalte requires_benefits) */
  requires_benefits?: string[] | null;
}

/** Altersgruppe und Staatsangehörigkeit aus den Antworten. */
export const getProfileBasics = (answers: UserAnswers): { age: string | null; nationality: string | null } => {
  const tags = extractTagsFromAnswers(answers);
  // Die Staatsangehörigkeit wird nur erfragt, wer „Ankommen in Deutschland“
  // als Herausforderung nennt. Ohne diese Angabe gelten migrationsspezifische
  // Angebote als nicht passend, wie bisher bei „Deutsch“. „Möchte ich nicht
  // sagen“ lässt alle zu.
  const migration = picked(answers, 'herausforderungen', 'Herausforderung_Deutschland');
  const nationality = tags.find((t) => NATIONALITY_SET.has(t)) ?? (migration ? null : 'Deutsch');
  return {
    age: tags.find((t) => AGE_TAG_SET.has(t)) ?? null,
    nationality,
  };
};

/**
 * Altersprüfung. Maßgeblich sind die Alters-Tags des Angebots: Trägt es
 * einige, aber nicht alle Altersgruppen, gilt es nur für diese. Zusätzlich
 * werden die Felder min_age und max_age geprüft, sofern gepflegt.
 */
export const isAgeEligible = (funding: MatchableFunding, ageTag: string | null): boolean => {
  if (!ageTag) return true;
  const offerAges = (funding.tags ?? []).filter((t) => AGE_TAG_SET.has(t));
  if (offerAges.length > 0 && !offerAges.includes(ageTag)) return false;
  const range = getAgeRange(ageTag);
  if (range) {
    if (funding.min_age != null && funding.min_age > range.maxAge) return false;
    if (funding.max_age != null && funding.max_age < range.minAge) return false;
  }
  return true;
};

/**
 * Herkunftsprüfung. Staatsangehörigkeits-Tags werden in der Datenbank oft
 * nur ergänzend vergeben (Angebot auch mehrsprachig oder auch für
 * Zugewanderte offen). Ausgeschlossen wird deshalb nur, wenn ein Angebot
 * erkennbar migrationsspezifisch ist, also zusätzlich den Tag
 * „Herausforderung_Deutschland“ trägt, und keine der genannten
 * Staatsangehörigkeiten zur eigenen passt.
 */
export const isOriginEligible = (funding: MatchableFunding, nationality: string | null): boolean => {
  if (!nationality) return true;
  const tags = funding.tags ?? [];
  const offerNat = tags.filter((t) => NATIONALITY_SET.has(t));
  if (offerNat.length === 0 || !tags.includes('Herausforderung_Deutschland')) return true;
  const own = COMPATIBLE[nationality] ?? [nationality];
  return offerNat.some((t) => own.includes(t));
};

/** Alle harten Kriterien zusammen. */
export const makeEligibilityCheck = (answers: UserAnswers) => {
  const { age, nationality } = getProfileBasics(answers);
  return (funding: MatchableFunding): boolean =>
    isAgeEligible(funding, age) && isOriginEligible(funding, nationality);
};

/* ------------------------------------------------------------------ *
 * Punktzahl
 * ------------------------------------------------------------------ */

/** Trägt ein Tag Information für das Matching (siehe EXCLUDED_FROM_SCORING)? */
export const isMeaningfulTag = (tag: string): boolean => !EXCLUDED_FROM_SCORING.has(tag);

const NATIONALITY_WEIGHTS: Record<string, number> = {
  EU: 1, Ukrainisch: 1.5, Türkisch: 1.5, Syrisch: 1.5, Drittstaat: 1.5,
};

/**
 * Grundgewicht eines Antwort-Tags. Tätigkeit und konkrete Wünsche zur
 * Tätigkeit zählen am meisten, danach Bedarfe zu Gesundheit, Finanzen und
 * Wohnen, dann Herkunft, zuletzt allgemeine Wünsche.
 */
function getTagWeight(tag: string): number {
  if (NATIONALITY_WEIGHTS[tag]) return NATIONALITY_WEIGHTS[tag];
  const prefix = tag.split('_')[0];
  if (activityRoot(tag)) return 3;
  // Eine Schwangerschaft verändert die Lebenslage so stark wie eine Tätigkeit
  if (tag === 'Haushalt_Schwanger') return 3;
  if (['Herausforderung', 'Gesundheit', 'Haushalt'].includes(prefix)) return 2;
  // Wohnform als bloßer Status zählt weniger als eine Notlage
  if (['Miete', 'Eigentum', 'WG', 'Wohnheim'].includes(prefix)) return 1;
  if (['Finanzen', 'Prekär', 'Ohne', 'Heim', 'Betreuung'].includes(prefix)) return 2;
  if (prefix === 'Beeinträchtigung') return 2;
  if (prefix === 'Wunsch') return 1.5;
  return 1;
}

/**
 * Verwandte Tags, die in der Punktzahl als Teiltreffer zählen. Angebote für
 * Drittstaatsangehörige passen auch bei syrischer, türkischer oder
 * ukrainischer Staatsangehörigkeit, Angebote für starke Beeinträchtigung zu
 * jeder angegebenen Art.
 */
const SCORING_COMPAT: Record<string, string[]> = {
  Syrisch: ['Drittstaat'],
  Ukrainisch: ['Drittstaat'],
  Türkisch: ['Drittstaat'],
  ...Object.fromEntries(IMPAIRMENT_TYPES.map((t) => [t, ['Beeinträchtigung_Stark']])),
};

/** Wie häufig jeder Tag im aktuellen Datenbestand vorkommt. */
export type TagFrequencies = { total: number; counts: Map<string, number> };

export const computeTagFrequencies = (fundings: Array<{ tags: string[] | null }>): TagFrequencies => {
  const counts = new Map<string, number>();
  fundings.forEach((f) => new Set(f.tags ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return { total: fundings.length, counts };
};

/**
 * Seltenheitsfaktor zwischen 0,4 und 1. Ein Tag, den ein Viertel aller
 * Angebote trägt (etwa „Wunsch_Beratung“), sagt wenig darüber aus, ob ein
 * Angebot wirklich passt, ein seltener Tag wie „Studium_Psyche“ dagegen viel.
 */
const rarity = (tag: string, freq?: TagFrequencies): number => {
  if (!freq || freq.total < 2) return 1;
  const df = freq.counts.get(tag) ?? 0;
  const idf = Math.log((freq.total + 1) / (df + 1)) / Math.log(freq.total + 1);
  return 0.4 + 0.6 * Math.min(1, Math.max(0, idf));
};

/**
 * Relevanz eines Angebots für die Antworten, 0 bis 100.
 *
 * Die Punktzahl verbindet zwei Blickrichtungen. Abdeckung (75 Prozent): Wie
 * viel des gewichteten Antwortprofils trifft das Angebot? Gewichtet wird mit
 * dem Grundgewicht des Tags mal seinem Seltenheitsfaktor. Genauigkeit
 * (25 Prozent): Welcher Anteil der Tags, die das Angebot in den beantworteten
 * Themenbereichen trägt, passt tatsächlich? Ein Angebot, das mit zwanzig Tags
 * fast alles abdeckt, wird so nicht automatisch vor ein zielgenaues Angebot
 * gereiht. Alters- und neutrale Tags zählen nicht mit, sonst „passt“ fast
 * jedes Angebot, nur weil es für die Altersgruppe offen ist. 0 bedeutet kein
 * aussagekräftiger Treffer.
 */
export const computeRelevanceScore = (
  fundingTags: string[],
  userTags: string[],
  freq?: TagFrequencies,
  /** Gewichtsfaktoren abgeleiteter Tags (extractProfileTags) */
  factors?: Map<string, number>,
): number => {
  const meaningful = Array.from(new Set(userTags.filter(isMeaningfulTag)));
  if (!fundingTags || fundingTags.length === 0 || meaningful.length === 0) return 0;
  const offer = new Set(fundingTags);

  let matchedWeight = 0;
  let totalWeight = 0;
  let matchCount = 0;
  const weightOf = (tag: string) => getTagWeight(tag) * rarity(tag, freq) * (factors?.get(tag) ?? 1);

  // Mehrere Tätigkeiten sind Alternativen: Das Gewicht der Tätigkeit zählt
  // einmal und gilt als erfüllt, wenn das Angebot zu einer davon passt.
  const roots = meaningful.filter((t) => (ACTIVITY_TAGS as readonly string[]).includes(t));
  const others = meaningful.filter((t) => !roots.includes(t));
  if (roots.length > 0) {
    totalWeight += Math.max(...roots.map(weightOf));
    const hit = roots.filter((t) => offer.has(t));
    if (hit.length > 0) {
      matchedWeight += Math.max(...hit.map(weightOf));
      matchCount++;
    }
  }
  others.forEach((tag) => {
    const w = weightOf(tag);
    totalWeight += w;
    if (offer.has(tag)) {
      matchedWeight += w;
      matchCount++;
    } else if ((SCORING_COMPAT[tag] ?? []).some((t) => offer.has(t))) {
      // Verwandter Tag, etwa „Drittstaat“ bei syrischer Staatsangehörigkeit
      matchedWeight += w * 0.6;
      matchCount++;
    }
  });
  if (matchCount === 0 || totalWeight === 0) return 0;

  const answeredFamilies = new Set(meaningful.map(tagFamily));
  const relevantOfferTags = fundingTags.filter(
    (t) => !AGE_TAG_SET.has(t) && isMeaningfulTag(t) && answeredFamilies.has(tagFamily(t)),
  );
  const precision = matchCount / Math.max(matchCount, relevantOfferTags.length);
  const coverage = matchedWeight / totalWeight;

  return Math.max(1, Math.round((0.75 * coverage + 0.25 * precision) * 100));
};

/* ------------------------------------------------------------------ *
 * Passung zur Lebenslage
 * ------------------------------------------------------------------ */

/** Themenbereiche, in denen ein Angebot für eine andere Lebenslage gedacht sein kann. */
const EXCLUSIVE_FAMILIES = new Set(['activity', 'health', 'origin', 'housing', 'finance']);
/** Bedarfe, die eine abweichende Tätigkeit aufwiegen (z. B. Sozialleistung, Wohnungsnot). */
const NEED_FAMILIES = new Set(['health', 'finance', 'housing']);

export interface FitInfo {
  /** Themenbereiche, in denen das Angebot eine aussagekräftige Antwort trifft */
  matchedFamilies: Set<string>;
  /** Themenbereiche, in denen das Angebot erkennbar auf eine andere Lebenslage zielt */
  contradictions: number;
  /** Widerspruch bei der Wohnsituation (z. B. Angebot nur für Eigentum) */
  housingConflict: boolean;
  /** Angebot nur für andere Tätigkeiten gedacht (z. B. Rente bei Studium) */
  activityConflict: boolean;
}

/**
 * Prüft ein Angebot gegen ALLE Antworten, auch die neutralen.
 * Ein Widerspruch liegt vor, wenn das Angebot in einem Themenbereich, zu dem
 * die Person geantwortet hat, nur Tags trägt, die nicht zu ihrer Antwort
 * passen. Beispiel: „keine Beeinträchtigung“ angegeben, Angebot nur für
 * körperliche Beeinträchtigung; „zur Miete“, Angebot nur für Eigentum.
 * Tätigkeiten werden über ihren Oberbegriff verglichen: Ein Angebot mit
 * „Studium_Austausch“ widerspricht nicht der Antwort „Studium_Finanzen“.
 * Bei den Finanzen zählt nur „kommt gut zurecht“ als Gegensatz zu Angeboten
 * für finanzielle Notlagen.
 */
export const makeFitAnalyzer = (answers: UserAnswers) => {
  const derived = deriveTags(answers).map((d) => ({ tag: d.tag }));
  const all = [...extractSelections(answers), ...derived].filter((s) => !AGE_TAG_SET.has(s.tag));
  const userByFamily = new Map<string, Set<string>>();
  all.forEach((s) => {
    const fam = tagFamily(s.tag);
    if (!userByFamily.has(fam)) userByFamily.set(fam, new Set());
    (COMPATIBLE[s.tag] ?? [s.tag]).forEach((t) => userByFamily.get(fam)!.add(t));
  });

  // Tätigkeiten als Oberbegriffe, ergänzt um verwandte Tätigkeiten und solche,
  // die aus Herausforderungen folgen
  const userActivities = new Set<string>();
  all.forEach((s) => {
    const root = activityRoot(s.tag);
    if (root) {
      userActivities.add(root);
      (ACTIVITY_COMPAT[root] ?? []).forEach((a) => userActivities.add(a));
    }
    const implied = CHALLENGE_IMPLIES_ACTIVITY[s.tag];
    if (implied) userActivities.add(implied);
  });
  // „Sonstiges“ ist keine abgrenzbare Lebenslage
  const activityOpen = userActivities.size === 0 || userActivities.has('Sonstiges');

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
    let activityConflict = false;

    // Tätigkeit
    if (!activityOpen) {
      const offerActivities = new Set(tags.map(activityRoot).filter((a): a is string => a !== null));
      if (offerActivities.size > 0 && !offerActivities.has('Sonstiges')
        && ![...offerActivities].some((a) => userActivities.has(a))) {
        contradictions++;
        activityConflict = true;
      }
    }

    // Übrige Themenbereiche
    userByFamily.forEach((userTags, fam) => {
      if (fam === 'activity' || !EXCLUSIVE_FAMILIES.has(fam)) return;
      if (fam === 'finance' && !financeOk) return;
      const offerTags = tags.filter((t) => !AGE_TAG_SET.has(t) && tagFamily(t) === fam);
      if (offerTags.length > 0 && !offerTags.some((t) => userTags.has(t))) {
        contradictions++;
        if (fam === 'housing') housingConflict = true;
      }
    });
    return { matchedFamilies, contradictions, housingConflict, activityConflict };
  };
};

/**
 * Passt ein Angebot insgesamt eher zu einer anderen Lebenslage als zur eigenen?
 * Ein Angebot für eine andere Tätigkeit bleibt nur, wenn es einen konkreten
 * Bedarf bei Gesundheit, Finanzen oder Wohnen trifft. Allgemeine Wünsche
 * oder Herausforderungen allein reichen dafür nicht.
 */
export const contradictsSituation = (fit: FitInfo): boolean => {
  if (fit.housingConflict) return true;
  if (fit.activityConflict && ![...fit.matchedFamilies].some((f) => NEED_FAMILIES.has(f))) return true;
  return fit.contradictions > fit.matchedFamilies.size;
};

/* ------------------------------------------------------------------ *
 * Vielfalt
 * ------------------------------------------------------------------ */

const DISTRICT_WORDS = /\b(mitte|friedrichshain|kreuzberg|pankow|charlottenburg|wilmersdorf|spandau|steglitz|zehlendorf|tempelhof|schöneberg|neukölln|treptow|köpenick|marzahn|hellersdorf|lichtenberg|reinickendorf)\b/g;

/**
 * Schlüssel für nahezu gleiche Angebote, die sich nur im Bezirk
 * unterscheiden (z. B. „Amt für Soziales Mitte“ und „Amt für Soziales
 * Pankow“). Klammerzusätze und Bezirksnamen werden entfernt.
 */
export const nearDuplicateKey = (title: string): string =>
  title
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(DISTRICT_WORDS, ' ')
    .replace(/[^a-zäöüß0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join(' ');

/**
 * Sortiert so um, dass nahezu gleiche Angebote nicht direkt hintereinander
 * stehen. Das jeweils erste Exemplar behält seinen Platz, weitere rücken
 * ans Ende, die Reihenfolge bleibt sonst erhalten.
 */
export function diversify<T extends { title?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const first: T[] = [];
  const later: T[] = [];
  items.forEach((item) => {
    const key = item.title ? nearDuplicateKey(item.title) : '';
    if (key && seen.has(key)) later.push(item);
    else {
      if (key) seen.add(key);
      first.push(item);
    }
  });
  return [...first, ...later];
}

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
  /** Eigene Überschrift statt „Weil du … angeklickt hast“ (deutscher Text, wird übersetzt) */
  title?: string;
  /** Erläuterung unter der Überschrift (deutscher Text, wird übersetzt) */
  note?: string;
}

/** Leistungsbezogene Begründung, die rankFundings an ein Angebot hängt. */
export type BenefitReason = BenefitEffect['reason'];

/** Angebote, die wegen der Leistungsangaben trotz anderer Tätigkeit passen. */
const benefitRelevant = (f: { benefitReason?: BenefitReason }) =>
  f.benefitReason === 'zusaetzlich' || f.benefitReason === 'voraussetzung';

/** Überschrift und Hinweis der Zeile für vermutlich zusätzliche Leistungen. */
export const HINT_TITLE = 'Das steht dir vielleicht zusätzlich zu';
export const HINT_NOTE = 'Nach deinen Angaben bekommst du diese Leistungen noch nicht. Ob ein Anspruch besteht, prüft die zuständige Stelle.';

/**
 * Reihenfolge der Gruppen: akute Notlagen zuerst, dann die konkreten
 * Wünsche aus der Tätigkeitsfrage, Gesundheit und Herausforderungen,
 * Finanzen und Herkunft, danach die Tätigkeit selbst als breitere Zeile,
 * zuletzt Wohnen und Freizeitwünsche.
 */
const groupPriority = (tag: string): number => {
  const [prefix, sub] = tag.split('_');
  if (tag === 'Prekär' || prefix === 'Ohne') return 0;
  if (sub && activityRoot(tag)) return 1;
  if (['Gesundheit', 'Herausforderung', 'Beeinträchtigung', 'Haushalt'].includes(prefix)) return 2;
  if (prefix === 'Finanzen' || prefix === 'Leistung' || NATIONALITY_SET.has(tag)) return 3;
  if ((ACTIVITY_TAGS as readonly string[]).includes(tag)) return 4;
  if (prefix === 'Wunsch') return 5;
  return 6;
};

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
 * 4. Nahezu gleiche Angebote aus verschiedenen Bezirken rücken innerhalb der
 *    Zeile nach hinten, damit die ersten Karten unterschiedliche Hilfen zeigen.
 *
 * Jedes Angebot erscheint nur einmal, und zwar in der spezifischsten passenden
 * Zeile. Zeilen ohne Treffer entfallen.
 */
export function buildReasonGroups<T extends { id: string; title?: string; tags: string[] | null; relevanceScore?: number; district?: string[] | null; benefit_type?: string | null; requires_benefits?: string[] | null; benefitReason?: BenefitReason }>(
  fundings: T[],
  answers: UserAnswers,
  options: { exclude?: Set<string> } = {}
): ReasonGroup<T>[] {
  const used = new Set<string>(options.exclude ?? []);
  const fitOf = makeFitAnalyzer(answers);

  // Abgeleitete Tags gehören zur Antwort, aus der sie folgen. So zeigt die
  // Zeile „Weil du … oft knapp angeklickt hast“ auch Angebote für finanzielle
  // Belastung.
  const derived = deriveTags(answers);
  const tagsOf = (questionId: string, tag: string) => [
    tag,
    ...derived.filter((d) => d.sources.some((src) => src.questionId === questionId && src.optionId === tag)).map((d) => d.tag),
  ];
  const seenTags = new Set<string>();
  const selections = extractSelections(answers)
    .filter((s) => isMeaningfulTag(s.tag) || tagsOf(s.questionId, s.tag).length > 1)
    .filter((s) => (seenTags.has(s.tag) ? false : (seenTags.add(s.tag), true)))
    .map((s, order) => ({ ...s, order, family: tagFamily(s.tag) }))
    .sort((a, b) => groupPriority(a.tag) - groupPriority(b.tag) || a.order - b.order);

  const scored = fundings
    .map((f) => ({ f, fit: fitOf(f.tags) }))
    .filter(({ f, fit }) => benefitRelevant(f) || !contradictsSituation(fit))
    .sort((a, b) => (b.f.relevanceScore ?? 0) - (a.f.relevanceScore ?? 0));

  const groups: ReasonGroup<T>[] = [];

  // Zuerst: Leistungen, die nach den Angaben vermutlich zusätzlich in Frage
  // kommen. Je Leistung genügt das berlinweite Angebot, die Bezirksstellen
  // (etwa zwölf Wohngeldstellen) erscheinen dann nicht zusätzlich. Gibt es
  // kein berlinweites, bleibt die am besten passende Bezirksstelle.
  const hintPool = scored.filter(({ f }) => f.benefitReason === 'zusaetzlich' && !used.has(f.id)).map(({ f }) => f);
  const hints: T[] = [];
  const byType = new Map<string, T[]>();
  hintPool.forEach((f) => {
    const k = f.benefit_type ?? f.id;
    byType.set(k, [...(byType.get(k) ?? []), f]);
  });
  byType.forEach((list) => {
    const citywide = list.filter((f) => !f.district?.length);
    hints.push(...(citywide.length ? citywide : list.slice(0, 1)));
    list.forEach((f) => used.add(f.id));
  });
  hints.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
  if (hints.length > 0) {
    groups.push({ key: 'hint:zusaetzlich', option: '', question: '', tag: '', fundings: hints, title: HINT_TITLE, note: HINT_NOTE });
  }

  selections.forEach((s) => {
    const rowTags = tagsOf(s.questionId, s.tag).filter(isMeaningfulTag);
    // Bei einer bezogenen Leistung gehören auch Angebote dazu, die sie voraussetzen
    const requiresThis = (f: T) => s.tag.startsWith('Leistung_') && (f.requires_benefits ?? []).includes(s.tag);
    const candidates = scored.filter(({ f }) => !used.has(f.id) && (requiresThis(f) || rowTags.some((t) => (f.tags ?? []).includes(t))));
    const confirmedEntries = candidates.filter(({ f, fit }) => requiresThis(f) || [...fit.matchedFamilies].some((fam) => fam !== s.family));
    const neutral = candidates
      .filter((c) => !confirmedEntries.includes(c))
      .sort((a, b) => a.fit.contradictions - b.fit.contradictions || (b.f.relevanceScore ?? 0) - (a.f.relevanceScore ?? 0));
    const items = diversify(
      [...confirmedEntries, ...neutral.slice(0, Math.max(0, FILL_PER_ROW - confirmedEntries.length))].map((c) => c.f),
    );
    if (items.length === 0) return;
    items.forEach((f) => used.add(f.id));
    groups.push({ key: `${s.questionId}:${s.tag}`, option: s.option, question: s.question, tag: s.tag, fundings: items });
  });
  return groups;
}

/* ------------------------------------------------------------------ *
 * Gesamtablauf
 * ------------------------------------------------------------------ */

/**
 * Vorrang bei akuter Wohnungslosigkeit (Punkte auf die Relevanz). Angebote
 * für genau die angegebene Lage, etwa draußen schlafen, stehen vor allgemeinen
 * Angeboten bei Wohnungslosigkeit, beide vor allem anderen.
 */
const ACUTE_BONUS = 40;
const ACUTE_BONUS_GENERAL = 15;

/** Mindestzahl an Ergebnissen, darunter wird mit allgemeinen Anlaufstellen ergänzt. */
export const MIN_RESULTS = 5;

/** Tags allgemeiner Anlaufstellen, die fast jeder Lebenslage weiterhelfen. */
const GENERAL_HELP_TAGS = ['Wunsch_Beratung', 'Sonstiges_Beratung', 'Herausforderung_Bürokratie', 'Sonstiges_Orientierung'];

/**
 * Filtert, bewertet und sortiert alle Angebote für die Antworten.
 *
 * 1. Harte Kriterien: Alter (Alters-Tags und min_age/max_age) sowie bei
 *    migrationsspezifischen Angeboten die Staatsangehörigkeit.
 * 2. Angebote, die erkennbar für eine andere Lebenslage gedacht sind, fallen weg.
 * 3. Punktzahl nach Abdeckung und Genauigkeit, gewichtet nach Seltenheit der Tags
 *    im gesamten Bestand.
 * 4. Gibt es weniger als MIN_RESULTS Treffer, wird mit allgemeinen, berlinweiten
 *    Anlaufstellen ergänzt, die die harten Kriterien ebenfalls erfüllen. Sie
 *    erhalten relevanceScore 0.
 */
export function rankFundings<T extends MatchableFunding & { title?: string; relevanceScore?: number; benefitReason?: BenefitReason }>(
  fundings: T[],
  answers: UserAnswers,
): T[] {
  const { tags: userTags, factors } = extractProfileTags(answers);
  const { benefits, acute } = deriveProfile(answers);
  const acuteTags = new Set(userTags.filter((t) => t.startsWith('Ohne_') && t !== 'Ohne_Nichts'));
  const freq = computeTagFrequencies(fundings);
  const eligible = makeEligibilityCheck(answers);
  const fitOf = makeFitAnalyzer(answers);

  // Leistungsangaben (benefits.ts): Ein vermutlich zusätzlicher Anspruch oder
  // eine erfüllte Voraussetzung macht ein Angebot passend, auch wenn es für
  // eine andere Tätigkeit verschlagwortet ist. Bereits bezogene oder
  // ausgeschlossene Leistungen rücken nach hinten.
  const candidates = fundings
    .filter((f) => eligible(f))
    .map((f) => ({ f, effect: benefitEffect(f, benefits) }))
    .filter(({ f, effect }) => {
      const fit = fitOf(f.tags);
      // Eine andere Wohnform schließt weiterhin aus (z. B. Lastenzuschuss nur für Eigentum)
      if (benefitRelevant({ benefitReason: effect.reason })) return !fit.housingConflict;
      return !contradictsSituation(fit);
    });
  const scored = candidates.map(({ f, effect }) => {
    const base = computeRelevanceScore(f.tags ?? [], userTags, freq, factors);
    // Bei akuter Wohnungslosigkeit stehen Notangebote vor allem anderen, und
    // unter ihnen die für genau diese Lage (etwa draußen schlafen)
    const offerTags = f.tags ?? [];
    const acuteBonus = !acute ? 0
      : offerTags.some((t) => acuteTags.has(t)) ? ACUTE_BONUS
      : offerTags.includes('Prekär') ? ACUTE_BONUS_GENERAL : 0;
    const bonus = effect.bonus + acuteBonus;
    const score = base > 0 || bonus > 0 ? Math.max(1, Math.round(base * effect.factor + bonus)) : 0;
    return { ...f, relevanceScore: score, benefitReason: effect.reason };
  });

  const byTitle = (a: T, b: T) => (a.title ?? '').localeCompare(b.title ?? '', 'de');
  let results = scored
    .filter((f) => f.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore || byTitle(a, b));

  if (results.length < MIN_RESULTS) {
    const taken = new Set(results.map((r) => r.id));
    const generality = (f: T) => (f.tags ?? []).filter((t) => GENERAL_HELP_TAGS.includes(t)).length;
    const fallbacks = scored
      .filter((f) => !taken.has(f.id) && f.relevanceScore === 0 && generality(f) > 0)
      .sort((a, b) =>
        Number(!!a.district?.length) - Number(!!b.district?.length) || generality(b) - generality(a) || byTitle(a, b))
      .slice(0, MIN_RESULTS - results.length);
    results = [...results, ...fallbacks];
  }
  return results;
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
