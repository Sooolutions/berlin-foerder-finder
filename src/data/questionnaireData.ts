/**
 * Eine Antwortoption.
 *
 * id     Stabile, sprachunabhängige Kennung. Sie ist zugleich der Matching-Tag
 *        in der Datenbank und wird im Fragenverlauf gespeichert. Routing,
 *        Matching und Altersfilter arbeiten ausschließlich mit der id.
 *        Eine id zu ändern ändert also das Matching.
 * label  Deutscher Anzeigetext. Er dient als Ausgangstext für Übersetzungen
 *        und darf frei umformuliert werden, ohne dass sich Logik ändert.
 */
export interface AnswerOption {
  id: string;
  label: string;
}

export interface QuestionData {
  id: string;
  question: string;
  options: AnswerOption[];
  multiSelect?: boolean;
  maxSelections?: number;
}

// Map of all questions and their options
export const questionsMap: Record<string, QuestionData> = {
  // Initial age question
  "Q1": {
    id: "Q1",
    question: "Wie alt bist du?",
    options: [
      { id: "U18", label: "unter 18" },
      { id: "18-24", label: "18-24" },
      { id: "25-34", label: "25-34" },
      { id: "35-49", label: "35-49" },
      { id: "50-64", label: "50-64" },
      { id: "65plus", label: "über 65" },
    ]
  },

  // Under 18 path
  "Q2_U18": {
    id: "Q2_U18",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
    ]
  },
  "Q3_U18": {
    id: "Q3_U18",
    question: "Was machst du aktuell?",
    options: [
      { id: "Schule", label: "Schule" },
      { id: "Ausbildung", label: "Ausbildung" },
      { id: "FSJ", label: "FSJ oder FÖJ" },
      { id: "Sonstiges", label: "Sonstiges" },
    ]
  },
  "Q4_U18_Schule": {
    id: "Q4_U18_Schule",
    question: "Hast du Probleme in der Schule?",
    options: [
      { id: "Schule_Lernschwierigkeit", label: "Lernschwierigkeiten" },
      { id: "Schule_Mobbing", label: "Mobbing" },
      { id: "Schule_Mittagessen", label: "Mittagessen" },
      { id: "Schule_Material", label: "Schulmaterial" },
      { id: "Schule_Psyche", label: "Psychische Belastungen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_U18_Ausbildung": {
    id: "Q4_U18_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: [
      { id: "Ausbildung_Berufsschule", label: "Mehr Unterstützung beim Lernen" },
      { id: "Ausbildung_Miteinander", label: "Besseres Miteinander mit Ausbilder:in/Kolleg:innen" },
      { id: "Ausbildung_Perspektive", label: "Karriereperspektiven oder Mentoring" },
      { id: "Ausbildung_Vereinbarkeit", label: "Mehr Zeit für persönliche Projekte/Hobbys" },
      { id: "Ausbildung_Finanzen", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_U18_FSJ": {
    id: "Q4_U18_FSJ",
    question: "Was würde dir helfen dein FSJ, FÖJ, oder ähnliches besser zu gestalten?",
    options: [
      { id: "FSJ_Weiterbildung", label: "Spezifische Weiterbildungen/Kurse" },
      { id: "FSJ_Anerkennung", label: "Mehr Anerkennung für meine Arbeit" },
      { id: "FSJ_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "FSJ_Austausch", label: "Mehr Austausch mit anderen Freiwilligen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_U18_Sonstiges": {
    id: "Q4_U18_Sonstiges",
    question: "Was wünschst du dir für deine aktuelle Situation?",
    options: [
      { id: "Sonstiges_Orientierung", label: "Schnell einen passenden Schul-/Ausbildungsplatz finden" },
      { id: "Sonstiges_Beratung", label: "Eine Ansprechperson, die mich berät und unterstützt" },
      { id: "Sonstiges_Sozial", label: "Neue Freunde finden und coole Aktivitäten" },
      { id: "Sonstiges_Finanzen", label: "Finanziell unabhängiger sein" },
      { id: "Sonstiges_Psyche", label: "Psychische Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q5_U18": {
    id: "Q5_U18",
    question: "Wohnst du bei deinen Eltern oder Verwandten?",
    options: [
      { id: "Wohnen_Familie", label: "Ja" },
      { id: "Betreuung", label: "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)" },
    ]
  },
  "Q6_U18_Eltern": {
    id: "Q6_U18_Eltern",
    question: "Hast du das Gefühl, dass es finanzielle Schwierigkeiten gibt?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Wir haben regelmäßiges Einkommen und kommen damit gut zurecht" },
      { id: "Finanzen_regelmäßig-knapp", label: "Wir haben regelmäßiges Einkommen, aber es ist oft knapp" },
      { id: "Finanzen_Ersparnisse", label: "Wir haben kein regelmäßiges Einkommen und nutzen Ersparnisse oder Unterstützung durch Verwandte" },
      { id: "Finanzen_Prekär", label: "Wir haben kein regelmäßiges Einkommen und können unsere Ausgaben nicht decken" },
      { id: "Finanzen_Sozialleistung", label: "Wir erhalten eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)." },
    ]
  },
  "Q6_U18_Betreuung": {
    id: "Q6_U18_Betreuung",
    question: "Wer finanziert deinen Aufenthalt in der Einrichtung hauptsächlich?",
    options: [
      { id: "Finanzen_Behörde", label: "Eine Behörde" },
      { id: "Finanzen_Familie", label: "Meine Familie" },
      { id: "Finanzen_Selbst", label: "Ich selbst" },
      { id: "Finanzen_Stiftung", label: "Eine Stiftung" },
    ]
  },
  "Q7_U18": {
    id: "Q7_U18",
    question: "Gibt es gesundheitliche Besonderheiten (körperlich, psychisch oder chronisch), die deinen Alltag stark beeinflussen?",
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen" },
      { id: "Beeinträchtigung_Gering", label: "Geringe Beeinträchtigungen" },
      { id: "Beeinträchtigung_Stark", label: "Starke Beeinträchtigungen" },
    ]
  },
  "Q8_U18_Ja": {
    id: "Q8_U18_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung in der Schule/Ausbildung" },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q8_U18_Nein": {
    id: "Q8_U18_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Schule", label: "Schwierigkeiten in der Schule oder Ausbildung" },
      { id: "Herausforderung_Sozial", label: "Konflikte im sozialen Umfeld (z. B. Freundeskreis, Mobbing)" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen (z. B. Stress, Ängste)" },
      { id: "Herausforderung_Freizeit", label: "Fehlende Freizeit- und Teilhabemöglichkeiten (z. B. Sport, Jugendangebote)" },
      { id: "Herausforderung_Pflege", label: "Ich kümmere mich um Angehörige" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q8_U18_Ausland_Nein": {
    id: "Q8_U18_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen" },
      { id: "Herausforderung_Finanzen", label: "Umgang mit Schulden/Finanzen" },
      { id: "Herausforderung_Kinder", label: "Kinderbetreuung" },
      { id: "Herausforderung_Pflege", label: "Pflege von Angehörigen" },
      { id: "Herausforderung_Sozial", label: "Schwierigkeiten im sozialen Umfeld" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_U18": {
    id: "Q9_U18",
    question: "Was wünschst du dir?",
    options: [
      { id: "Wunsch_Sozial", label: "Neue Freunde finden" },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Spaß- und Kulturangebote" },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  // 18-24 age group path
  "Q2_18-24": {
    id: "Q2_18-24",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
    ]
  },
  "Q3_18-24": {
    id: "Q3_18-24",
    question: "Was machst du aktuell?",
    options: [
      { id: "Schule", label: "Schule" },
      { id: "Ausbildung", label: "Ausbildung" },
      { id: "Studium", label: "Studium" },
      { id: "FSJ", label: "FSJ oder FÖJ" },
      { id: "Arbeiten", label: "Arbeiten (angestellt)" },
      { id: "Gründung", label: "Gründung eines Unternehmens" },
      { id: "Selbstständig", label: "Selbstständig/Unternehmer:in" },
      { id: "Arbeitssuchend", label: "Arbeitssuchend" },
      { id: "Weiterbildung", label: "Berufliche Weiterbildung/Umschulung" },
      { id: "Übergang", label: "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)" },
      { id: "Pflege", label: "Pflege von Angehörigen" },
      { id: "Familie", label: "Familienzeit oder Kinderbetreuung" },
      { id: "Sonstiges", label: "Sonstiges" },
    ]
  },
  "Q4_18-24_Schule": {
    id: "Q4_18-24_Schule",
    question: "Hast du Probleme in der Schule?",
    options: [
      { id: "Schule_Lernschwierigkeit", label: "Lernschwierigkeiten" },
      { id: "Schule_Mobbing", label: "Mobbing" },
      { id: "Schule_Material", label: "Schulmaterial und Verpflegungskosten" },
      { id: "Schule_Psyche", label: "Psychische Belastungen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Ausbildung": {
    id: "Q4_18-24_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: [
      { id: "Ausbildung_Berufsschule", label: "Mehr Unterstützung in der Berufsschule (z. B. Nachhilfe, Prüfungsvorbereitung)" },
      { id: "Ausbildung_Miteinander", label: "Besseres Miteinander mit Ausbilder:innen/Kolleg:innen" },
      { id: "Ausbildung_Verantwortung", label: "Mehr Verantwortung und Vertrauen" },
      { id: "Ausbildung_Perspektive", label: "Klare Perspektiven für die Zeit nach der Ausbildung (z. B. Übernahme, Weiterbildung)" },
      { id: "Ausbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben" },
      { id: "Ausbildung_Finanzen", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Studium": {
    id: "Q4_18-24_Studium",
    question: "Was würdest du dir für dein Studium wünschen, um es erfolgreich abzuschließen und dich optimal auf nächste Schritte vorzubereiten?",
    options: [
      { id: "Studium_Unterstützung", label: "Mehr Unterstützung im Studium" },
      { id: "Studium_Anbindung", label: "Bessere Anbindung an Professor:innen/Dozent:innen" },
      { id: "Studium_Austausch", label: "Mehr Austausch mit Kommiliton:innen" },
      { id: "Studium_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Studium_Psyche", label: "Psychische Beratung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Arbeiten": {
    id: "Q4_18-24_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: [
      { id: "Arbeiten_Arbeitsklima", label: "Ein besseres Arbeitsklima" },
      { id: "Arbeiten_Jobwechsel", label: "Einen anderen Job" },
      { id: "Arbeiten_Karriere", label: "Mehr Verantwortung oder Aufstiegsmöglichkeiten" },
      { id: "Arbeiten_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben" },
      { id: "Arbeiten_Vergütung", label: "Bessere Vergütung oder finanzielle Unterstützung" },
      { id: "Arbeiten_Umschulung", label: "Optionen für Weiterbildung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Gründung": {
    id: "Q4_18-24_Gründung",
    question: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    options: [
      { id: "Gründung_Beratung", label: "Beratung/Coaching" },
      { id: "Gründung_Finanzierung", label: "Finanzierung" },
      { id: "Gründung_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Gründung_Businessplan", label: "Unterstützung beim Businessplan" },
      { id: "Gründung_RechtSteuern", label: "Rechtliche/Steuerliche Beratung" },
      { id: "Gründung_Marketing", label: "Marketing" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Selbstständig": {
    id: "Q4_18-24_Selbstständig",
    question: "Was wäre hilfreich, um dein bisheriges Unternehmen erfolgreicher zu machen?",
    options: [
      { id: "Selbstständig_Weiterbildung", label: "Weiterbildung/Fachwissen" },
      { id: "Selbstständig_Marketing", label: "Marketing" },
      { id: "Selbstständig_Kunden", label: "Kundengewinnung" },
      { id: "Selbstständig_RechtSteuern", label: "Rechtliche/steuerliche Beratung" },
      { id: "Selbstständig_Finanzierung", label: "Finanzierung/Investitionen" },
      { id: "Selbstständig_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Selbstständig_Vereinbarkeit", label: "Vereinbarkeit mit Alltag/Familie" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Arbeitssuchend": {
    id: "Q4_18-24_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: [
      { id: "Arbeitssuche_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Arbeitssuche_Qualifizierung", label: "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen" },
      { id: "Arbeitssuche_Finanzen", label: "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken" },
      { id: "Arbeitssuche_Bewerbung", label: "Hilfe bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Arbeitssuche_Netzwerk", label: "Kontakte zu Arbeitgebern oder Prakitka" },
      { id: "Arbeitssuche_Psychisch", label: "Psychologische Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Weiterbildung": {
    id: "Q4_18-24_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: [
      { id: "Weiterbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit meinem Alltag" },
      { id: "Weiterbildung_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Weiterbildung_Austausch", label: "Mehr Austausch mit anderen in einer ähnlichen Situation" },
      { id: "Weiterbildung_Lernen", label: "Gezielte Unterstützung für meine Lernziele oder Prüfungen" },
      { id: "Weiterbildung_Karriere", label: "Beratung oder Mentoring zur Orientierung und Planung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Übergangsphase": {
    id: "Q4_18-24_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: [
      { id: "Übergang_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Übergang_Praxis", label: "Möglichkeiten, praktische Erfahrungen zu sammeln (z. B. durch Praktika)" },
      { id: "Übergang_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Übergang_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Übergang_Orientierung", label: "Berufs- oder Studienorientierung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Pflege": {
    id: "Q4_18-24_Pflege",
    question: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Pflege_Informationen", label: "Informationen über Entlastungsangebote" },
      { id: "Pflege_Austausch", label: "Austausch mit anderen jungen Pflegenden" },
      { id: "Pflege_Vereinbarkeit", label: "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann" },
      { id: "Pflege_Psychisch", label: "Psychologische Unterstützung" },
      { id: "Pflege_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Familie": {
    id: "Q4_18-24_Familie",
    question: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Familie_Angebote", label: "Informationen über Entlastungsangebote" },
      { id: "Familie_Austausch", label: "Austausch mit anderen in meiner Lage" },
      { id: "Familie_Vereinbarkeit", label: "Beratung, wie ich die Zeit mit meinem Beruf/Ausbildung vereinbaren kann" },
      { id: "Familie_Psych", label: "Psychologische Unterstützung" },
      { id: "Familie_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_Sonstiges": {
    id: "Q4_18-24_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: [
      { id: "Sonstiges_Orientierung", label: "Orientierung und Perspektiven für Ausbildung/Arbeit" },
      { id: "Sonstiges_Sozial", label: "Mehr soziale Kontakte und Freizeitgestaltung" },
      { id: "Sonstiges_Finanzen", label: "Finanzielle Absicherung" },
      { id: "Sonstiges_Beratung", label: "Beratungs- und Unterstützungsangebote" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_18-24_FSJ": {
    id: "Q4_18-24_FSJ",
    question: "Was würde dir helfen dein FSJ, FÖJ, oder ähnliches besser zu gestalten?",
    options: [
      { id: "FSJ_Weiterbildung", label: "Spezifische Weiterbildungen/Kurse" },
      { id: "FSJ_Anerkennung", label: "Mehr Anerkennung für meine Arbeit" },
      { id: "FSJ_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "FSJ_Austausch", label: "Mehr Austausch mit anderen Freiwilligen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q5_18-24": {
    id: "Q5_18-24",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: [
      { id: "Miete", label: "Alleine (zu Miete)" },
      { id: "Eigentum", label: "Alleine (Eigentum)" },
      { id: "Wohnen_Familie", label: "Bei meiner Familie" },
      { id: "WG", label: "Wohngemeinschaft (WG)" },
      { id: "Wohnheim", label: "In einem Wohnheim (Studentenwohnheim, etc.)" },
      { id: "Prekär", label: "Ich habe aktuell keinen Wohnsitz" },
    ]
  },
  "Q5A_18-24_Ohne": {
    id: "Q5A_18-24_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: [
      { id: "Ohne_Bekannte", label: "Bei Freunden/Bekannten" },
      { id: "Ohne_Not", label: "In einer Notunterkunft oder einem Obdachlosenheim" },
      { id: "Ohne_Öffentlich", label: "Ich übernachte an öffentlichen Orten" },
      { id: "Ohne_Fahrzeug", label: "Ich wohne in einem Fahrzeug" },
      { id: "Ohne_Nichts", label: "Nichts davon" },
    ]
  },
  "Q6_18-24": {
    id: "Q6_18-24",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht." },
      { id: "Finanzen_regelmäßig-knapp", label: "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp." },
      { id: "Finanzen_Ersparnisse", label: "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie." },
      { id: "Finanzen_Prekär", label: "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken." },
      { id: "Finanzen_Sozialleistung", label: "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)." },
    ]
  },
  "Q8_18-24": {
    id: "Q8_18-24",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen" },
      { id: "Beeinträchtigung_Körperlich", label: "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)" },
      { id: "Beeinträchtigung_Psychisch", label: "Psychische Einschränkung (z. B. Depression, Angststörung)" },
      { id: "Beeinträchtigung_Chronisch", label: "Chronische Erkrankung (z. B. Diabetes, Epilepsie)" },
      { id: "Beeinträchtigung_Sinne", label: "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)" },
    ]
  },
  "Q9_18-24_Ja": {
    id: "Q9_18-24_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung im Beruf oder Ausbildung" },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_18-24_Nein": {
    id: "Q9_18-24_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Orientierung", label: "Unsicherheit bei beruflicher oder privater Orientierung" },
      { id: "Herausforderung_Finanzen", label: "Finanzielle Belastungen (z. B. hohe Lebenshaltungskosten)" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen (z. B. Stress, Einsamkeit)" },
      { id: "Herausforderung_Bürokratie", label: "Hürden beim Zugang zu Unterstützungsangeboten (z. B. lange Wartezeiten, fehlende Infos)" },
      { id: "Herausforderung_Pflege", label: "Ich kümmere mich um Angehörige" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_18-24_Ausland_Nein": {
    id: "Q9_18-24_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen" },
      { id: "Herausforderung_Finanzen", label: "Umgang mit Schulden/Finanzen" },
      { id: "Herausforderung_Kinder", label: "Kinderbetreuung" },
      { id: "Herausforderung_Pflege", label: "Pflege von Angehörigen" },
      { id: "Herausforderung_Sozial", label: "Schwierigkeiten im sozialen Umfeld" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q10_18-24": {
    id: "Q10_18-24",
    question: "Was wünschst du dir?",
    options: [
      { id: "Wunsch_Sozial", label: "Neue Leute kennenlernen und Kontakte knüpfen" },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Freizeit- und Kulturangebote" },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Gründung", label: "Einstieg in die Selbstständigkeit oder Gründung" },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  // 25-34 age group path
  "Q2_25-34": {
    id: "Q2_25-34",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
    ]
  },
  "Q3_25-34": {
    id: "Q3_25-34",
    question: "Was machst du aktuell?",
    options: [
      { id: "Ausbildung", label: "Ausbildung" },
      { id: "Studium", label: "Studium" },
      { id: "Arbeiten", label: "Arbeiten (angestellt)" },
      { id: "Gründung", label: "Gründung eines Unternehmens" },
      { id: "Selbstständig", label: "Selbstständig/Unternehmer:in" },
      { id: "Arbeitssuchend", label: "Arbeitssuchend" },
      { id: "Weiterbildung", label: "Berufliche Weiterbildung/Umschulung" },
      { id: "Übergang", label: "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)" },
      { id: "Pflege", label: "Pflege von Angehörigen" },
      { id: "Familie", label: "Familienzeit oder Kinderbetreuung" },
      { id: "Sonstiges", label: "Sonstiges" },
    ]
  },
  "Q4_25-34_Ausbildung": {
    id: "Q4_25-34_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: [
      { id: "Ausbildung_Berufsschule", label: "Mehr Unterstützung in der Berufsschule (z. B. Nachhilfe, Prüfungsvorbereitung)" },
      { id: "Ausbildung_Miteinander", label: "Besseres Miteinander mit Ausbilder:innen/Kolleg:innen" },
      { id: "Ausbildung_Verantwortung", label: "Mehr Verantwortung und Vertrauen" },
      { id: "Ausbildung_Perspektive", label: "Klare Perspektiven für die Zeit nach der Ausbildung (z. B. Übernahme, Weiterbildung)" },
      { id: "Ausbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben" },
      { id: "Ausbildung_Finanzen", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Studium": {
    id: "Q4_25-34_Studium",
    question: "Was würdest du dir für dein Studium wünschen, um es erfolgreich abzuschließen und dich optimal auf nächste Schritte vorzubereiten?",
    options: [
      { id: "Studium_Unterstützung", label: "Mehr Unterstützung im Studium" },
      { id: "Studium_Anbindung", label: "Bessere Anbindung an Professor:innen/Dozent:innen" },
      { id: "Studium_Austausch", label: "Mehr Austausch mit Kommiliton:innen" },
      { id: "Studium_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Studium_Psyche", label: "Psychische Beratung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Arbeiten": {
    id: "Q4_25-34_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: [
      { id: "Arbeiten_Arbeitsklima", label: "Ein besseres Arbeitsklima" },
      { id: "Arbeiten_Jobwechsel", label: "Einen anderen Job" },
      { id: "Arbeiten_Karriere", label: "Mehr Verantwortung oder Aufstiegsmöglichkeiten" },
      { id: "Arbeiten_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben" },
      { id: "Arbeiten_Vergütung", label: "Bessere Vergütung oder finanzielle Unterstützung" },
      { id: "Arbeiten_Umschulung", label: "Optionen für Weiterbildung oder Umschulung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Gründung": {
    id: "Q4_25-34_Gründung",
    question: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    options: [
      { id: "Gründung_Beratung", label: "Beratung/Coaching" },
      { id: "Gründung_Finanzierung", label: "Finanzierung" },
      { id: "Gründung_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Gründung_Businessplan", label: "Unterstützung beim Businessplan" },
      { id: "Gründung_RechtSteuern", label: "Rechtliche/Steuerliche Beratung" },
      { id: "Gründung_Marketing", label: "Marketing" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Selbstständigkeit": {
    id: "Q4_25-34_Selbstständigkeit",
    question: "Was wäre hilfreich, um dein bisheriges Unternehmen erfolgreicher zu machen?",
    options: [
      { id: "Selbstständig_Weiterbildung", label: "Weiterbildung/Fachwissen" },
      { id: "Selbstständig_Marketing", label: "Marketing" },
      { id: "Selbstständig_Kunden", label: "Kundengewinnung" },
      { id: "Selbstständig_RechtSteuern", label: "Rechtliche/steuerliche Beratung" },
      { id: "Selbstständig_Finanzierung", label: "Finanzierung/Investitionen" },
      { id: "Selbstständig_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Selbstständig_Vereinbarkeit", label: "Vereinbarkeit mit Familie" },
      { id: "Selbstständig_International", label: "Internationalisierung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Arbeitssuchend": {
    id: "Q4_25-34_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: [
      { id: "Arbeitssuche_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Arbeitssuche_Qualifizierung", label: "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen" },
      { id: "Arbeitssuche_Finanzen", label: "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken" },
      { id: "Arbeitssuche_Bewerbung", label: "Hilfe bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Arbeitssuche_Netzwerk", label: "Kontakte zu Arbeitgebern oder Prakitka" },
      { id: "Arbeitssuche_Psychisch", label: "Psychologische Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Weiterbildung": {
    id: "Q4_25-34_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: [
      { id: "Weiterbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Beruf und Familie" },
      { id: "Weiterbildung_Finanzen", label: "Finanzielle Unterstützung (z. B. Kursgebühren, Material)" },
      { id: "Weiterbildung_Austausch", label: "Mehr Austausch mit anderen Teilnehmer:innen" },
      { id: "Weiterbildung_Lernen", label: "Gezielte Förderung für meine Lernziele oder beruflichen Kompetenzen" },
      { id: "Weiterbildung_Karriere", label: "Mentoring oder Beratung zur beruflichen Orientierung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Übergangsphase": {
    id: "Q4_25-34_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: [
      { id: "Übergang_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Übergang_Praxis", label: "Möglichkeiten, praktische Erfahrungen zu sammeln (z. B. durch Praktika)" },
      { id: "Übergang_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Übergang_Finanzen", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Pflege": {
    id: "Q4_25-34_Pflege",
    question: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Pflege_Informationen", label: "Informationen über Entlastungsangebote" },
      { id: "Pflege_Austausch", label: "Austausch mit anderen jungen Pflegenden" },
      { id: "Pflege_Vereinbarkeit", label: "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann" },
      { id: "Pflege_Psychisch", label: "Psychologische Unterstützung" },
      { id: "Pflege_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Familie": {
    id: "Q4_25-34_Familie",
    question: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Familie_Angebote", label: "Informationen über Entlastungsangebote" },
      { id: "Familie_Austausch", label: "Austausch mit anderen in meiner Lage" },
      { id: "Familie_Vereinbarkeit", label: "Beratung, wie ich die Zeit mit meinem Beruf/Ausbildung vereinbaren kann" },
      { id: "Familie_Psych", label: "Psychologische Unterstützung" },
      { id: "Familie_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_25-34_Sonstiges": {
    id: "Q4_25-34_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: [
      { id: "Sonstiges_Karriere", label: "Karriere- und Weiterentwicklungsmöglichkeiten" },
      { id: "Sonstiges_Vereinbarkeit", label: "Vereinbarkeit von Beruf, Familie und Freizeit" },
      { id: "Sonstiges_Sozial", label: "Mehr soziale Kontakte und Freizeitgestaltung" },
      { id: "Sonstiges_Finanzen", label: "Finanzielle Absicherung" },
      { id: "Sonstiges_Beratung", label: "Beratungs- und Unterstützungsangebote" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q5_25-34": {
    id: "Q5_25-34",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: [
      { id: "Miete", label: "Alleine (zu Miete)" },
      { id: "Eigentum", label: "Alleine (Eigentum)" },
      { id: "Wohnen_Familie", label: "Bei meiner Familie" },
      { id: "WG", label: "Wohngemeinschaft (WG)" },
      { id: "Wohnheim", label: "In einem Wohnheim (Studentenwohnheim, etc.)" },
      { id: "Prekär", label: "Ich habe aktuell keinen Wohnsitz" },
    ]
  },
  "Q5A_25-34_Ohne": {
    id: "Q5A_25-34_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: [
      { id: "Ohne_Bekannte", label: "Bei Freunden/Bekannten" },
      { id: "Ohne_Not", label: "In einer Notunterkunft oder einem Obdachlosenheim" },
      { id: "Ohne_Öffentlich", label: "Ich übernachte an öffentlichen Orten" },
      { id: "Ohne_Fahrzeug", label: "Ich wohne in einem Fahrzeug" },
      { id: "Ohne_Nichts", label: "Nichts davon" },
    ]
  },
  "Q6_25-34": {
    id: "Q6_25-34",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht." },
      { id: "Finanzen_regelmäßig-knapp", label: "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp." },
      { id: "Finanzen_Ersparnisse", label: "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie." },
      { id: "Finanzen_Prekär", label: "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken." },
      { id: "Finanzen_Sozialleistung", label: "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)." },
    ]
  },
  "Q8_25-34": {
    id: "Q8_25-34",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen" },
      { id: "Beeinträchtigung_Körperlich", label: "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)" },
      { id: "Beeinträchtigung_Psychisch", label: "Psychische Einschränkung (z. B. Depression, Angststörung)" },
      { id: "Beeinträchtigung_Chronisch", label: "Chronische Erkrankung (z. B. Diabetes, Epilepsie)" },
      { id: "Beeinträchtigung_Sinne", label: "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)" },
    ]
  },
  "Q9_25-34_Ja": {
    id: "Q9_25-34_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung im Beruf oder Ausbildung" },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_25-34_Nein": {
    id: "Q9_25-34_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Vereinbarkeit", label: "Belastungen durch Vereinbarkeit von Beruf und Familie" },
      { id: "Herausforderung_Finanzen", label: "Finanzielle Belastungen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen (z. B. Stress, Burnout-Gefühl)" },
      { id: "Herausforderung_Bürokratie", label: "Bürokratische Herausforderungen (z. B. Ämter, Anträge, Unterstützungssysteme)" },
      { id: "Herausforderung_Pflege", label: "Ich kümmere mich um Angehörige" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_25-34_Ausland_Nein": {
    id: "Q9_25-34_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen" },
      { id: "Herausforderung_Finanzen", label: "Umgang mit Schulden/Finanzen" },
      { id: "Herausforderung_Kinder", label: "Kinderbetreuung" },
      { id: "Herausforderung_Pflege", label: "Pflege von Angehörigen" },
      { id: "Herausforderung_Sozial", label: "Schwierigkeiten im sozialen Umfeld" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q10_25-34": {
    id: "Q10_25-34",
    question: "Was wünschst du dir?",
    options: [
      { id: "Wunsch_Sozial", label: "Neue Leute kennenlernen und Kontakte knüpfen" },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Freizeit- und Kulturangebote" },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Gründung", label: "Einstieg in die Selbstständigkeit oder Gründung" },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  // 35-49 age group path
  "Q2_35-49": {
    id: "Q2_35-49",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
    ]
  },
  "Q3_35-49": {
    id: "Q3_35-49",
    question: "Was machst du aktuell?",
    options: [
      { id: "Arbeiten", label: "Arbeiten (angestellt)" },
      { id: "Gründung", label: "Gründung eines Unternehmens" },
      { id: "Selbstständig", label: "Selbstständig/Unternehmer:in" },
      { id: "Arbeitssuchend", label: "Arbeitssuchend" },
      { id: "Weiterbildung", label: "Berufliche Weiterbildung/Umschulung" },
      { id: "Übergang", label: "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)" },
      { id: "Pflege", label: "Pflege von Angehörigen" },
      { id: "Familie", label: "Familienzeit oder Kinderbetreuung" },
      { id: "Sonstiges", label: "Sonstiges" },
    ]
  },
  "Q4_35-49_Arbeiten": {
    id: "Q4_35-49_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: [
      { id: "Arbeiten_Arbeitsklima", label: "Ein besseres Arbeitsklima" },
      { id: "Arbeiten_Jobwechsel", label: "Einen anderen Job" },
      { id: "Arbeiten_Karriere", label: "Mehr Verantwortung oder Aufstiegsmöglichkeiten" },
      { id: "Arbeiten_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Privatleben" },
      { id: "Arbeiten_Vergütung", label: "Bessere Vergütung oder finanzielle Unterstützung" },
      { id: "Arbeiten_Umschulung", label: "Optionen für Weiterbildung oder Umschulung" },
      { id: "Arbeiten_Gesundheit", label: "Unterstützung bei gesundheitlichen Belastungen (Stress, Krankheit)" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Gründung": {
    id: "Q4_35-49_Gründung",
    question: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    options: [
      { id: "Gründung_Beratung", label: "Beratung/Coaching" },
      { id: "Gründung_Finanzierung", label: "Finanzierung" },
      { id: "Gründung_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Gründung_Businessplan", label: "Unterstützung beim Businessplan" },
      { id: "Gründung_RechtSteuern", label: "Rechtliche/Steuerliche Beratung" },
      { id: "Gründung_Marketing", label: "Marketing" },
      { id: "Gründung_Familie", label: "Vereinbarkeit mit Privatleben" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Selbstständigkeit": {
    id: "Q4_35-49_Selbstständigkeit",
    question: "Was wäre hilfreich, um dein bisheriges Unternehmen erfolgreicher zu machen?",
    options: [
      { id: "Selbstständig_Weiterbildung", label: "Weiterbildung/Fachwissen" },
      { id: "Selbstständig_Marketing", label: "Marketing" },
      { id: "Selbstständig_Kunden", label: "Kundengewinnung" },
      { id: "Selbstständig_RechtSteuern", label: "Rechtliche/steuerliche Beratung" },
      { id: "Selbstständig_Finanzierung", label: "Finanzierung/Investitionen" },
      { id: "Selbstständig_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Selbstständig_Vereinbarkeit", label: "Vereinbarkeit mit Familie" },
      { id: "Selbstständig_International", label: "Internationalisierung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Arbeitssuchend": {
    id: "Q4_35-49_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: [
      { id: "Arbeitssuche_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Arbeitssuche_Qualifizierung", label: "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen" },
      { id: "Arbeitssuche_Finanzen", label: "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken" },
      { id: "Arbeitssuche_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Arbeitssuche_Netzwerk", label: "Kontakte zu Arbeitgebern oder Prakitka" },
      { id: "Arbeitssuche_Psychisch", label: "Psychologische Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Weiterbildung": {
    id: "Q4_35-49_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: [
      { id: "Weiterbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Beruf und Familie" },
      { id: "Weiterbildung_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Weiterbildung_Austausch", label: "Mehr Austausch mit anderen Teilnehmer:innen" },
      { id: "Weiterbildung_Karriere", label: "Beratung zu Karriereoptionen oder Weiterbildungspfaden" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Übergangsphase": {
    id: "Q4_35-49_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: [
      { id: "Übergang_Beratung", label: "Eine Ansprechperson, die mich bei der Suche berät und begleitet" },
      { id: "Übergang_Umschulung", label: "Möglichkeiten für Umschulung" },
      { id: "Übergang_Vereinbarkeit", label: "Vereinbarkeit mit der Familie" },
      { id: "Übergang_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Übergang_Finanzen", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Pflege": {
    id: "Q4_35-49_Pflege",
    question: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Pflege_Informationen", label: "Informationen über Entlastungsangebote" },
      { id: "Pflege_Austausch", label: "Austausch mit anderen jungen Pflegenden" },
      { id: "Pflege_Vereinbarkeit", label: "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann" },
      { id: "Pflege_Psychisch", label: "Psychologische Unterstützung" },
      { id: "Pflege_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Familie": {
    id: "Q4_35-49_Familie",
    question: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Familie_Angebote", label: "Informationen über Entlastungsangebote" },
      { id: "Familie_Austausch", label: "Austausch mit anderen in meiner Lage" },
      { id: "Familie_Vereinbarkeit", label: "Beratung, wie ich die Zeit mit meinem Beruf/Ausbildung vereinbaren kann" },
      { id: "Familie_Psych", label: "Psychologische Unterstützung" },
      { id: "Familie_Finanzierung", label: "Finanzielle Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q4_35-49_Sonstiges": {
    id: "Q4_35-49_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: [
      { id: "Sonstiges_Karriere", label: "Karriere- und Weiterentwicklungsmöglichkeiten" },
      { id: "Sonstiges_Vereinbarkeit", label: "Vereinbarkeit von Beruf, Familie und Freizeit" },
      { id: "Sonstiges_Sozial", label: "Mehr soziale Kontakte und Freizeitgestaltung" },
      { id: "Sonstiges_Finanzen", label: "Finanzielle Absicherung" },
      { id: "Sonstiges_Beratung", label: "Beratungs- und Unterstützungsangebote" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q5_35-49": {
    id: "Q5_35-49",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: [
      { id: "Miete", label: "Alleine (zu Miete)" },
      { id: "Eigentum", label: "Alleine (Eigentum)" },
      { id: "Wohnen_Familie", label: "Bei meiner Familie" },
      { id: "WG", label: "Wohngemeinschaft (WG)" },
      { id: "Wohnheim", label: "In einem Wohnheim (Studentenwohnheim, etc.)" },
      { id: "Prekär", label: "Ich habe aktuell keinen Wohnsitz" },
    ]
  },
  "Q5A_35-49_Ohne": {
    id: "Q5A_35-49_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: [
      { id: "Ohne_Bekannte", label: "Bei Freunden/Bekannten" },
      { id: "Ohne_Not", label: "In einer Notunterkunft oder einem Obdachlosenheim" },
      { id: "Ohne_Öffentlich", label: "Ich übernachte an öffentlichen Orten" },
      { id: "Ohne_Fahrzeug", label: "Ich wohne in einem Fahrzeug" },
      { id: "Ohne_Nichts", label: "Nichts davon" },
    ]
  },
  "Q6_35-49": {
    id: "Q6_35-49",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht." },
      { id: "Finanzen_regelmäßig-knapp", label: "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp." },
      { id: "Finanzen_Ersparnisse", label: "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie." },
      { id: "Finanzen_Prekär", label: "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken." },
      { id: "Finanzen_Sozialleistung", label: "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)." },
    ]
  },
  "Q8_35-49": {
    id: "Q8_35-49",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen" },
      { id: "Beeinträchtigung_Körperlich", label: "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)" },
      { id: "Beeinträchtigung_Psychisch", label: "Psychische Einschränkung (z. B. Depression, Angststörung)" },
      { id: "Beeinträchtigung_Chronisch", label: "Chronische Erkrankung (z. B. Diabetes, Epilepsie)" },
      { id: "Beeinträchtigung_Sinne", label: "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)" },
    ]
  },
  "Q9_35-49_Ja": {
    id: "Q9_35-49_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung im Beruf oder Ausbildung" },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_35-49_Nein": {
    id: "Q9_35-49_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Vereinbarkeit", label: "Belastungen durch Vereinbarkeit von Beruf und Familie" },
      { id: "Herausforderung_Finanzen", label: "Finanzielle Belastungen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen (z. B. Stress, Burnout-Gefühl)" },
      { id: "Herausforderung_Bürokratie", label: "Bürokratische Herausforderungen (z. B. Ämter, Anträge, Unterstützungssysteme)" },
      { id: "Herausforderung_Pflege", label: "Ich kümmere mich um Angehörige" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q9_35-49_Ausland_Nein": {
    id: "Q9_35-49_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen" },
      { id: "Herausforderung_Finanzen", label: "Umgang mit Schulden/Finanzen" },
      { id: "Herausforderung_Pflege", label: "Pflege von Angehörigen" },
      { id: "Herausforderung_Sozial", label: "Schwierigkeiten im sozialen Umfeld" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  "Q10_35-49": {
    id: "Q10_35-49",
    question: "Was wünschst du dir?",
    options: [
      { id: "Wunsch_Sozial", label: "Neue Leute kennenlernen und Kontakte knüpfen" },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Freizeit- und Kulturangebote" },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Gründung", label: "Einstieg in die Selbstständigkeit oder Gründung" },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  },
  // 50-64 age group path
  "Q2_50-64": {
    id: "Q2_50-64",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
    ]
  },

  "Q3_50-64": {
    id: "Q3_50-64",
    question: "Was machst du aktuell?",
    options: [
      { id: "Arbeiten", label: "Arbeiten (angestellt)" },
      { id: "Gründung", label: "Gründung eines Unternehmens" },
      { id: "Selbstständig", label: "Selbstständig/Unternehmer:in" },
      { id: "Arbeitssuchend", label: "Arbeitssuchend" },
      { id: "Weiterbildung", label: "Berufliche Weiterbildung/Umschulung" },
      { id: "Übergang", label: "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)" },
      { id: "Pflege", label: "Pflege von Angehörigen" },
      { id: "Familie", label: "Familienzeit oder Kinderbetreuung" },
      { id: "Sonstiges", label: "Sonstiges" },
    ]
  },

  "Q4_50-64_Arbeiten": {
    id: "Q4_50-64_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: [
      { id: "Arbeiten_Arbeitsklima", label: "Ein besseres Arbeitsklima" },
      { id: "Arbeiten_Jobwechsel", label: "Einen anderen Job" },
      { id: "Arbeiten_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Gesundheit (körperliche Belastungen, Stress)" },
      { id: "Arbeiten_Vergütung", label: "Bessere Vergütung oder finanzielle Unterstützung" },
      { id: "Arbeiten_Umschulung", label: "Möglichkeiten zur Weiterbildung" },
      { id: "Arbeiten_Gesundheit", label: "Unterstützung bei gesundheitlichen Belastungen (Stress, Krankheit)" },
      { id: "Arbeiten_Rente", label: "Perspektiven für den Übergang in die Rente" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Gründung": {
    id: "Q4_50-64_Gründung",
    question: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    options: [
      { id: "Gründung_Beratung", label: "Beratung/Coaching" },
      { id: "Gründung_Finanzierung", label: "Finanzierung" },
      { id: "Gründung_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Gründung_Businessplan", label: "Unterstützung beim Businessplan" },
      { id: "Gründung_RechtSteuern", label: "Rechtliche/Steuerliche Beratung" },
      { id: "Gründung_Marketing", label: "Marketing" },
      { id: "Gründung_Familie", label: "Vereinbarkeit mit Privatleben" },
      { id: "Gründung_Erfahrung", label: "Erfahrungsaustausch" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Selbstständig": {
    id: "Q4_50-64_Selbstständig",
    question: "Was wäre hilfreich, um deine Unternehmung erfolgreich zu gestalten?",
    options: [
      { id: "Selbstständig_Weiterbildung", label: "Weiterbildung/Fachwissen" },
      { id: "Selbstständig_Marketing", label: "Marketing" },
      { id: "Selbstständig_Kunden", label: "Kundengewinnung" },
      { id: "Selbstständig_RechtSteuern", label: "Rechtliche/steuerliche Beratung" },
      { id: "Selbstständig_Finanzierung", label: "Finanzierung/Investitionen" },
      { id: "Selbstständig_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Selbstständig_Vereinbarkeit", label: "Vereinbarkeit mit Familie" },
      { id: "Selbstständig_International", label: "Internationalisierung" },
      { id: "Selbstständig_Nachfolge", label: "Nachfolge- oder Ausstiegsplanung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Arbeitssuchend": {
    id: "Q4_50-64_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: [
      { id: "Arbeitssuche_Beratung", label: "Beratung oder Coaching mit Fokus auf berufliche Neuorientierung" },
      { id: "Arbeitssuche_Qualifizierung", label: "Qualifizierung oder Umschulung für neue Tätigkeiten" },
      { id: "Arbeitssuche_Finanzen", label: "Finanzielle Unterstützung während der Arbeitssuche" },
      { id: "Arbeitssuche_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Arbeitssuche_Netzwerk", label: "Kontakte zu Arbeitgebern oder Unterstützung bei der Jobsuche ab 50+" },
      { id: "Arbeitssuche_Psychisch", label: "Psychologische Unterstützung bei Belastungen während der Arbeitssuche" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Weiterbildung": {
    id: "Q4_50-64_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: [
      { id: "Weiterbildung_Vereinbarkeit", label: "Bessere Vereinbarkeit mit Beruf und Familie" },
      { id: "Weiterbildung_Finanzen", label: "Finanzielle Unterstützung" },
      { id: "Weiterbildung_Austausch", label: "Mehr Austausch mit anderen in einer ähnlichen Situation" },
      { id: "Weiterbildung_Karriere", label: "Gezielte Unterstützung für berufliche oder persönliche Weiterentwicklung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Übergangsphase": {
    id: "Q4_50-64_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: [
      { id: "Übergang_Wiedereinstieg", label: "Beratung für den beruflichen Wiedereinstieg" },
      { id: "Übergang_Umschulung", label: "Umschulung oder Weiterbildung für ältere Beschäftigte" },
      { id: "Übergang_Bewerbung", label: "Unterstützung bei Bewerbungen und Vorstellungsgesprächen" },
      { id: "Übergang_Netzwerk", label: "Austausch/Netzwerk für ältere Arbeitssuchende" },
      { id: "Übergang_Finanzen", label: "Finanzielle Unterstützung, um die Zeit zu überbrücken" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Pflege": {
    id: "Q4_50-64_Pflege",
    question: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Pflege_Informationen", label: "Informationen über Entlastungsangebote" },
      { id: "Pflege_Austausch", label: "Austausch mit anderen Pflegenden" },
      { id: "Pflege_Vereinbarkeit", label: "Beratung, wie ich die die aktuelle Situtation mit meinem Beruf vereinbaren kann" },
      { id: "Pflege_Psychisch", label: "Psychologische Unterstützung" },
      { id: "Pflege_Finanzierung", label: "Beratung zu finanziellen und rechtlichen Fragen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Familie": {
    id: "Q4_50-64_Familie",
    question: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Familie_Angebote", label: "Informationen über Betreuungsangebote" },
      { id: "Familie_Vereinbarkeit", label: "Beratung zur Vereinbarkeit von Familie und Beruf" },
      { id: "Familie_Psych", label: "Psychologische Unterstützung" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_50-64_Sonstiges": {
    id: "Q4_50-64_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: [
      { id: "Sonstiges_Orientierung", label: "Berufliche Perspektiven und Orientierung" },
      { id: "Sonstiges_Vereinbarkeit", label: "Vereinbarkeit von Beruf und Pflege/Familie" },
      { id: "Sonstiges_Sozial", label: "Mehr soziale Kontakte und Freizeitgestaltung" },
      { id: "Sonstiges_Finanzen", label: "Finanzielle Absicherung" },
      { id: "Sonstiges_Beratung", label: "Beratungs- und Unterstützungsangebote" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q5_50-64": {
    id: "Q5_50-64",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: [
      { id: "Miete", label: "Ich wohne zur Miete" },
      { id: "Eigentum", label: "Wohneigentum" },
      { id: "Wohnen_Familie", label: "Bei meiner Familie" },
      { id: "WG", label: "Wohngemeinschaft" },
      { id: "Wohnheim", label: "Wohnheim" },
      { id: "Prekär", label: "Ich habe aktuell keinen Wohnsitz" },
    ]
  },

  "Q5A_50-64_Ohne": {
    id: "Q5A_50-64_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: [
      { id: "Ohne_Bekannte", label: "Bei Freunden/Bekannten" },
      { id: "Ohne_Not", label: "In einer Notunterkunft oder einem Obdachlosenheim" },
      { id: "Ohne_Öffentlich", label: "Ich übernachte an öffentlichen Orten" },
      { id: "Ohne_Fahrzeug", label: "Ich wohne in einem Fahrzeug" },
      { id: "Ohne_Nichts", label: "Nichts davon" },
    ]
  },

  "Q6_50-64": {
    id: "Q6_50-64",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht." },
      { id: "Finanzen_regelmäßig-knapp", label: "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp." },
      { id: "Finanzen_Ersparnisse", label: "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie." },
      { id: "Finanzen_Prekär", label: "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken." },
      { id: "Finanzen_Sozialleistung", label: "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)." },
    ]
  },

  "Q7_50-64": {
    id: "Q7_50-64",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen" },
      { id: "Beeinträchtigung_Körperlich", label: "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)" },
      { id: "Beeinträchtigung_Psychisch", label: "Psychische Einschränkung (z. B. Depression, Angststörung)" },
      { id: "Beeinträchtigung_Chronisch", label: "Chronische Erkrankung (z. B. Diabetes, Epilepsie)" },
      { id: "Beeinträchtigung_Sinne", label: "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)" },
    ]
  },

  "Q8_50-64_Ja": {
    id: "Q8_50-64_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung im Beruf/Alltag" },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q8_50-64_Nein": {
    id: "Q8_50-64_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Vereinbarkeit", label: "Belastungen durch Vereinbarkeit von Beruf und Familie" },
      { id: "Herausforderung_Finanzen", label: "Finanzielle Belastungen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen (z. B. Stress, Burnout-Gefühl)" },
      { id: "Herausforderung_Bürokratie", label: "Bürokratische Herausforderungen (z. B. Ämter, Anträge, Unterstützungssysteme)" },
      { id: "Herausforderung_Pflege", label: "Ich kümmere mich um Angehörige" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q9_50-64_Ausland_Nein": {
    id: "Q9_50-64_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Psyche", label: "Psychische Belastungen" },
      { id: "Herausforderung_Finanzen", label: "Umgang mit Schulden/Finanzen" },
      { id: "Herausforderung_Pflege", label: "Pflege von Angehörigen" },
      { id: "Herausforderung_Sozial", label: "Schwierigkeiten im sozialen Umfeld" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q10_50-64": {
    id: "Q10_50-64",
    question: "Was wünschst du dir?",
    options: [
      { id: "Wunsch_Sozial", label: "Neue Leute kennenlernen und Kontakte knüpfen" },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Freizeit- und Kulturangebote" },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Gründung", label: "Einstieg in die Selbstständigkeit oder Gründung" },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q2_65plus": {
    id: "Q2_65plus",
    question: "Welche Staatsangehörigkeit hast du?",
    options: [
      { id: "Deutsch", label: "Deutsch" },
      { id: "Ukrainisch", label: "Ukrainisch" },
      { id: "Türkisch", label: "Türkisch" },
      { id: "Syrisch", label: "Syrisch" },
      { id: "EU", label: "EU-Ausland" },
      { id: "Drittstaat", label: "Drittstaat" },
    ]
  },

  "Q3_65plus": {
    id: "Q3_65plus",
    question: "Was machst du aktuell?",
    options: [
      { id: "Rente", label: "Ich bin in Rente" },
      { id: "Arbeiten", label: "Arbeiten (Voll- oder Teilzeit)" },
      { id: "Selbstständig", label: "Selbstständig" },
      { id: "Pflege", label: "Pflege von Angehörigen" },
      { id: "Erwerbsunfähig", label: "Ich bin erwerbsunfähig" },
      { id: "Sonstiges", label: "Sonstiges" },
    ]
  },

  "Q4_65plus_Rente": {
    id: "Q4_65plus_Rente",
    question: "Was wünscht du dir für deinen Ruhestand?",
    options: [
      { id: "Rente_Sozial", label: "Mehr soziale Kontakte und Freizeitaktivitäten" },
      { id: "Rente_Alltag", label: "Unterstützung bei Alltagsaufgaben" },
      { id: "Rente_Weiterentwicklung", label: "Persönliche Weiterentwicklung (z. B. Kurse, Hobbys)" },
      { id: "Rente_Finanzen", label: "Mehr finanzielle Sicherheit" },
      { id: "Rente_Gesundheit", label: "Gesundheitliche Förderung" },
      { id: "Rente_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_65plus_Arbeit": {
    id: "Q4_65plus_Arbeit",
    question: "Was würde dir helfen, deine Arbeit noch besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Arbeiten_Arbeitsklima", label: "Ein besseres Arbeitsklima" },
      { id: "Arbeiten_Jobwechsel", label: "Einen anderen Job" },
      { id: "Arbeiten_Gesundheit", label: "Bessere Vereinbarkeit mit Gesundheit (körperliche Belastungen, Stress)" },
      { id: "Arbeiten_Vergütung", label: "Bessere Vergütung oder finanzielle Unterstützung" },
      { id: "Arbeiten_Rente", label: "Perspektiven für den Übergang in die Rente" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_65plus_Selbstständig": {
    id: "Q4_65plus_Selbstständig",
    question: "Was wäre hilfreich, um deine Unternehmung erfolgreich zu gestalten?",
    options: [
      { id: "Selbstständig_Weiterbildung", label: "Weiterbildung/Fachwissen" },
      { id: "Selbstständig_Marketing", label: "Marketing" },
      { id: "Selbstständig_Kunden", label: "Kundengewinnung" },
      { id: "Selbstständig_RechtSteuern", label: "Rechtliche/steuerliche Beratung" },
      { id: "Selbstständig_Finanzierung", label: "Finanzierung/Investitionen" },
      { id: "Selbstständig_Netzwerk", label: "Mentoring/Netzwerk" },
      { id: "Selbstständig_Vereinbarkeit", label: "Vereinbarkeit mit Familie" },
      { id: "Selbstständig_International", label: "Internationalisierung" },
      { id: "Selbstständig_Nachfolge", label: "Nachfolge- oder Ausstiegsplanung" },
      { id: "Selbstständig_Erfahrung", label: "Erfahrungsaustausch" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_65plus_Pflege": {
    id: "Q4_65plus_Pflege",
    question: "Was würde dir helfen, die Pflege von Angehörigen besser mit deinem Alltag zu vereinbaren?",
    options: [
      { id: "Pflege_Informationen", label: "Informationen über Entlastungs- und Unterstützungsangebote" },
      { id: "Pflege_Beratung", label: "Beratung zu rechtlichen und finanziellen Fragen (z. B. Pflegegeld, Sozialleistungen)" },
      { id: "Pflege_Psychisch", label: "Psychologische Unterstützung" },
      { id: "Pflege_Austausch", label: "Austausch mit anderen Pflegenden" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_65plus_Erwerbsunfähig": {
    id: "Q4_65plus_Erwerbsunfähig",
    question: "Was würde dir helfen, deinen Alltag besser zu gestalten?",
    options: [
      { id: "Erwerbsunfähig_Gesundheit", label: "Gesundheitliche Unterstützung" },
      { id: "Erwerbsunfähig_Alltag", label: "Alltagsunterstützung" },
      { id: "Erwerbsunfähig_Behörden", label: "Behörden- und Antragsunterstützung" },
      { id: "Erwerbsunfähig_Sozial", label: "Mehr soziale Kontakte" },
      { id: "Erwerbsunfähig_Weiterbildung", label: "Möglichkeiten zur persönlichen Weiterentwicklung" },
      { id: "Erwerbsunfähig_Finanzen", label: "Finanzielle Sicherheit" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q4_65plus_Sonstiges": {
    id: "Q4_65plus_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: [
      { id: "Sonstiges_Sozial", label: "Mehr soziale Kontakte und Freizeitgestaltung" },
      { id: "Sonstiges_Beratung", label: "Unterstützung bei Alltagsbewältigung und Behördenangelegenheiten" },
      { id: "Sonstiges_Finanzen", label: "Finanzielle Absicherung" },
      { id: "Sonstiges_Weiterentwicklung", label: "Persönliche Weiterentwicklung (Hobbys, Kurse)" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q5_65plus": {
    id: "Q5_65plus",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: [
      { id: "Eigentum", label: "Wohneigentum" },
      { id: "Miete", label: "Miete" },
      { id: "Heim", label: "Seniorenheim/Pflegeeinrichtung" },
      { id: "Prekär", label: "Ich habe aktuell keinen Wohnsitz" },
    ]
  },

  "Q5A_65plus_Ohne": {
    id: "Q5A_65plus_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: [
      { id: "Ohne_Bekannte", label: "Bei Freunden/Bekannten" },
      { id: "Ohne_Not", label: "In einer Notunterkunft oder einem Obdachlosenheim" },
      { id: "Ohne_Öffentlich", label: "Ich übernachte an öffentlichen Orten" },
      { id: "Ohne_Fahrzeug", label: "Ich wohne in einem Fahrzeug" },
      { id: "Ohne_Nichts", label: "Nichts davon" },
    ]
  },

  "Q6_65plus": {
    id: "Q6_65plus",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: [
      { id: "Finanzen_regelmäßig-gut", label: "Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht." },
      { id: "Finanzen_regelmäßig-knapp", label: "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp." },
      { id: "Finanzen_Ersparnisse", label: "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie." },
      { id: "Finanzen_Prekär", label: "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken." },
      { id: "Finanzen_Sozialleistung", label: "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)." },
    ]
  },

  "Q8_65plus": {
    id: "Q8_65plus",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: [
      { id: "Beeinträchtigung_Nein", label: "Keine Beeinträchtigungen" },
      { id: "Beeinträchtigung_Körperlich", label: "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)" },
      { id: "Beeinträchtigung_Psychisch", label: "Psychische Einschränkung (z. B. Depression, Angststörung)" },
      { id: "Beeinträchtigung_Chronisch", label: "Chronische Erkrankung (z. B. Diabetes, Epilepsie)" },
      { id: "Beeinträchtigung_Sinne", label: "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)" },
    ]
  },

  "Q9_65plus_Ja": {
    id: "Q9_65plus_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: [
      { id: "Gesundheit_Umgang", label: "Hilfe beim Umgang mit der Erkrankung" },
      { id: "Gesundheit_Anbindung", label: "Bessere Anbindung an Ärzt:innen oder Therapeut:innen" },
      { id: "Gesundheit_Unterstützung", label: "Unterstützung im Beruf/Alltag" },
      { id: "Gesundheit_Austausch", label: "Mehr Austausch mit anderen Betroffenen" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q9_65plus_Nein": {
    id: "Q9_65plus_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Gesundheit", label: "Gesundheitliche Einschränkungen oder Pflegebedarf" },
      { id: "Herausforderung_Finanzen", label: "Finanzielle Belastungen (z. B. steigende Kosten im Alltag)" },
      { id: "Herausforderung_Einsam", label: "Einsamkeit oder wenige soziale Kontakte" },
      { id: "Herausforderung_Bürokratie", label: "Orientierung im Hilfesystem (z. B. welche Angebote es für Senior:innen gibt)" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q9_65plus_Ausland_Nein": {
    id: "Q9_65plus_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: [
      { id: "Herausforderung_Gesundheit", label: "Gesundheitliche Einschränkungen oder Pflegebedarf" },
      { id: "Herausforderung_Finanzen", label: "Umgang mit Schulden/Finanzen" },
      { id: "Herausforderung_Deutschland", label: "Schwierigkeiten in Deutschland anzukommen" },
      { id: "Herausforderung_Einsam", label: "Einsamkeit oder wenige soziale Kontakte" },
      { id: "Herausforderung_Bürokratie", label: "Orientierung im Hilfesystem (z. B. welche Angebote es für Senior:innen gibt)" },
    ],
    multiSelect: true,
    maxSelections: 3
  },

  "Q10_65plus": {
    id: "Q10_65plus",
    question: "Was wünschst du dir?",
    options: [
      { id: "Wunsch_Sozial", label: "Neue Leute kennenlernen und Kontakte knüpfen" },
      { id: "Wunsch_Beratung", label: "Beratung und Orientierung" },
      { id: "Wunsch_Kultur", label: "Freizeit- und Kulturangebote" },
      { id: "Wunsch_Lernen", label: "Lern- und Weiterbildungsmöglichkeiten" },
      { id: "Wunsch_Gründung", label: "Einstieg in die Selbstständigkeit oder Gründung" },
      { id: "Wunsch_Ehrenamt", label: "Ehrenamtliches Engagement" },
    ],
    multiSelect: true,
    maxSelections: 3
  }
};

export function getQuestionData(questionId: string): QuestionData | undefined {
  return questionsMap[questionId];
}

/** Alle Fragen, z. B. für Übersetzungsdateien und Tests. */
export const getAllQuestions = (): QuestionData[] => Object.values(questionsMap);

/** Antwortoption einer Frage anhand ihrer id. */
export function getOption(questionId: string, optionId: string): AnswerOption | undefined {
  return questionsMap[questionId]?.options.find((o) => o.id === optionId);
}

/**
 * Anzeigetext einer Antwort. Einziger Zugriffspunkt für Labels, damit hier
 * später die Übersetzung eingehängt werden kann.
 */
export function getOptionLabel(questionId: string, optionId: string): string {
  return getOption(questionId, optionId)?.label ?? optionId;
}
