export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
}

// Map of all questions and their options
const questionsMap: Record<string, QuestionData> = {
  // Initial age question
  "Q1": {
    id: "Q1",
    question: "Wie alt bist du?",
    options: ["unter 18", "18-24", "25-34", "35-49", "50-64", "über 65"],
    tags: ["U18", "18-24", "25-34", "35-49", "50-64", "65plus"]
  },

  // Under 18 path
  "Q2_U18": {
    id: "Q2_U18",
    question: "Welche Staatsangehörigkeit hast du?",
    options: ["Deutsch", "Ukrainisch", "Türkisch", "Syrisch", "EU-Ausland", "Drittstaat"],
    tags: ["Deutsch", "EU", "Ukrainisch", "Türkisch", "Syrisch", "Drittstaat"]
  },
  "Q3_U18": {
    id: "Q3_U18",
    question: "Was machst du aktuell?",
    options: ["Schule", "Ausbildung", "FSJ oder FÖJ", "Sonstiges"],
    tags: ["Schule", "Ausbildung", "FSJ", "Sonstiges"]
  },
  "Q4_U18_Schule": {
    id: "Q4_U18_Schule",
    question: "Hast du Probleme in der Schule?",
    options: ["Lernschwierigkeiten", "Mobbing", "Mittagessen", "Schulmaterial", "Psychische Belastungen"],
    tags: ["Schule_Lernschwierigkeit", "Schule_Mobbing", "Schule_Mittagessen", "Schule_Material", "Schule_Psyche"]
  },
  "Q4_U18_Ausbildung": {
    id: "Q4_U18_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: ["Mehr Unterstützung beim Lernen", "Besseres Miteinander mit Ausbilder:in/Kolleg:innen", "Karriereperspektiven oder Mentoring", "Mehr Zeit für persönliche Projekte/Hobbys", "Finanzielle Unterstützung"],
    tags: ["Ausbildung_Berufsschule", "Ausbildung_Miteinander", "Ausbildung_Perspektive", "Ausbildung_Vereinbarkeit", "Ausbildung_Finanzen"]
  },
  "Q4_U18_FSJ": {
    id: "Q4_U18_FSJ",
    question: "Was würde dir helfen dein FSJ, FÖJ, oder ähnliches besser zu gestalten?",
    options: ["Spezifische Weiterbildungen/Kurse", "Mehr Anerkennung für meine Arbeit", "Finanzielle Unterstützung", "Mehr Austausch mit anderen Freiwilligen"],
    tags: ["FSJ_Weiterbildung", "FSJ_Anerkennung", "FSJ_Finanzen", "FSJ_Austausch"]
  },
  "Q4_U18_Sonstiges": {
    id: "Q4_U18_Sonstiges",
    question: "Was wünschst du dir für deine aktuelle Situation?",
    options: ["Schnell einen passenden Schul-/Ausbildungsplatz finden", "Eine Ansprechperson, die mich berät und unterstützt", "Neue Freunde finden und coole Aktivitäten", "Finanziell unabhängiger sein", "Psychische Unterstützung"],
    tags: ["Sonstiges_Orientierung", "Sonstiges_Beratung", "Sonstiges_Sozial", "Sonstiges_Finanzen", "Sonstiges_Psyche"]
  },
  "Q5_U18": {
    id: "Q5_U18",
    question: "Wohnst du bei deinen Eltern oder Verwandten?",
    options: ["Ja", "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)"],
    tags: ["Familie", "Betreuung"]
  },
  "Q6_U18_Eltern": {
    id: "Q6_U18_Eltern",
    question: "Hast du das Gefühl, dass es finanzielle Schwierigkeiten gibt?",
    options: ["Wir haben regelmäßiges Einkommen und kommen damit gut zurecht", "Wir haben regelmäßiges Einkommen, aber es ist oft knapp", "Wir haben kein regelmäßiges Einkommen und nutzen Ersparnisse oder Unterstützung durch Verwandte", "Wir haben kein regelmäßiges Einkommen und können unsere Ausgaben nicht decken", "Wir erhalten eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)."],
    tags: ["Finanzen_regelmäßig-gut", "Finanzen_regelmäßig-knapp", "Finanzen_Ersparnisse", "Finanzen_Prekär", "Finanzen_Sozialleistung"]
  },
  "Q6_U18_Betreuung": {
    id: "Q6_U18_Betreuung",
    question: "Wer finanziert deinen Aufenthalt in der Einrichtung hauptsächlich?",
    options: ["Eine Behörde", "Meine Familie", "Ich selbst", "Eine Stiftung"],
    tags: ["Finanzen_Behörde", "Finanzen_Familie", "Finanzen_Selbst", "Finanzen_Stiftung"]
  },
  "Q7_U18": {
    id: "Q7_U18",
    question: "Gibt es gesundheitliche Besonderheiten (körperlich, psychisch oder chronisch), die deinen Alltag stark beeinflussen?",
    options: ["Keine Beeinträchtigungen", "Geringe Beeinträchtigungen", "Starke Beeinträchtigungen"],
    tags: ["Beeinträchtigung_Nein", "Beeinträchtigung_Gering", "Beeinträchtigung_Stark"]
  },
  "Q8_U18_Ja": {
    id: "Q8_U18_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: ["Hilfe beim Umgang mit der Erkrankung", "Bessere Anbindung an Ärzt:innen oder Therapeut:innen", "Unterstützung in der Schule/Ausbildung", "Mehr Austausch mit anderen Betroffenen"],
    tags: ["Gesundheit_Umgang", "Gesundheit_Anbindung", "Gesundheit_Unterstützung", "Gesundheit_Austausch"]
  },
  "Q8_U18_Nein": {
    id: "Q8_U18_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Schwierigkeiten in der Schule oder Ausbildung", "Konflikte im sozialen Umfeld (z. B. Freundeskreis, Mobbing)", "Psychische Belastungen (z. B. Stress, Ängste)", "Fehlende Freizeit- und Teilhabemöglichkeiten (z. B. Sport, Jugendangebote)", "Ich kümmere mich um Angehörige"],
    tags: ["Herausforderung_Schule", "Herausforderung_Sozial", "Herausforderung_Psyche", "Herausforderung_Freizeit", "Herausforderung_Pflege"]
  },
  "Q8_U18_Ausland_Nein": {
    id: "Q8_U18_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Schwierigkeiten in Deutschland anzukommen", "Psychische Belastungen", "Umgang mit Schulden/Finanzen", "Kinderbetreuung", "Pflege von Angehörigen", "Schwierigkeiten im sozialen Umfeld"],
    tags: ["Herausforderung_Deutschland", "Herausforderung_Psyche", "Herausforderung_Finanzen", "Herausforderung_Kinder", "Herausforderung_Pflege", "Herausforderung_Sozial"]
  },
  "Q9_U18": {
    id: "Q9_U18",
    question: "Was wünschst du dir?",
    options: ["Neue Freunde finden", "Beratung und Orientierung", "Spaß- und Kulturangebote", "Lern- und Weiterbildungsmöglichkeiten", "Ehrenamtliches Engagement"],
    tags: ["Wunsch_Sozial", "Wunsch_Beratung", "Wunsch_Kultur", "Wunsch_Lernen", "Wunsch_Ehrenamt"]
  },

  // Placeholder for other age groups - will be implemented later
  "Q2_18-24": {
    id: "Q2_18-24",
    question: "Placeholder für 18-24 Jahre - wird später implementiert",
    options: ["Weiter"],
    tags: ["Placeholder"]
  },
  "Q2_25-34": {
    id: "Q2_25-34",
    question: "Placeholder für 25-34 Jahre - wird später implementiert",
    options: ["Weiter"],
    tags: ["Placeholder"]
  },
  "Q2_35-49": {
    id: "Q2_35-49",
    question: "Placeholder für 35-49 Jahre - wird später implementiert",
    options: ["Weiter"],
    tags: ["Placeholder"]
  },
  "Q2_50-64": {
    id: "Q2_50-64",
    question: "Placeholder für 50-64 Jahre - wird später implementiert",
    options: ["Weiter"],
    tags: ["Placeholder"]
  },
  "Q2_65plus": {
    id: "Q2_65plus",
    question: "Placeholder für über 65 Jahre - wird später implementiert",
    options: ["Weiter"],
    tags: ["Placeholder"]
  }
};

export function getQuestionData(questionId: string): QuestionData | undefined {
  return questionsMap[questionId];
}