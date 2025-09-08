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

  // 18-24 age group path
  "Q2_18-24": {
    id: "Q2_18-24",
    question: "Welche Staatsangehörigkeit hast du?",
    options: ["Deutsch", "Ukrainisch", "Türkisch", "Syrisch", "EU-Ausland", "Drittstaat"],
    tags: ["Deutsch", "EU", "Ukrainisch", "Türkisch", "Syrisch", "Drittstaat"]
  },
  "Q3_18-24": {
    id: "Q3_18-24",
    question: "Was machst du aktuell?",
    options: ["Schule", "Ausbildung", "Studium", "FSJ oder FÖJ", "Arbeiten (angestellt)", "Gründung eines Unternehmens", "Selbstständig/Unternehmer:in", "Arbeitssuchend", "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)", "Pflege von Angehörigen", "Familienzeit oder Kinderbetreuung", "Sonstiges"],
    tags: ["Schule", "Ausbildung", "Studium", "FSJ", "Arbeiten", "Gründung", "Selbstständig", "Arbeitssuchend", "Übergang", "Pflege", "Familie", "Sonstiges"]
  },
  "Q4_18-24_Schule": {
    id: "Q4_18-24_Schule",
    question: "Hast du Probleme in der Schule?",
    options: ["Lernschwierigkeiten", "Mobbing", "Schulmaterial und Verpflegungskosten", "Psychische Belastungen"],
    tags: ["Schule_Lernschwierigkeit", "Schule_Mobbing", "Schule_Material", "Schule_Psyche"]
  },
  "Q4_18-24_Ausbildung": {
    id: "Q4_18-24_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: ["Mehr Unterstützung in der Berufsschule (z. B. Nachhilfe, Prüfungsvorbereitung)", "Besseres Miteinander mit Ausbilder:innen/Kolleg:innen", "Mehr Verantwortung und Vertrauen", "Klare Perspektiven für die Zeit nach der Ausbildung (z. B. Übernahme, Weiterbildung)", "Bessere Vereinbarkeit mit Privatleben", "Finanzielle Unterstützung"],
    tags: ["Ausbildung_Berufsschule", "Ausbildung_Miteinander", "Ausbildung_Verantwortung", "Ausbildung_Perspektive", "Ausbildung_Vereinbarkeit", "Ausbildung_Finanzen"]
  },
  "Q4_18-24_Studium": {
    id: "Q4_18-24_Studium",
    question: "Was würdest du dir für dein Studium wünschen, um es erfolgreich abzuschließen und dich optimal auf nächste Schritte vorzubereiten?",
    options: ["Mehr Unterstützung im Studium", "Bessere Anbindung an Professor:innen/Dozent:innen", "Mehr Austausch mit Kommiliton:innen", "Finanzielle Unterstützung", "Psychische Beratung"],
    tags: ["Studium_Unterstützung", "Studium_Anbindung", "Studium_Austausch", "Studium_Finanzen", "Studium_Psyche"]
  },
  "Q4_18-24_Arbeiten": {
    id: "Q4_18-24_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: ["Ein besseres Arbeitsklima", "Einen anderen Job", "Mehr Verantwortung oder Aufstiegsmöglichkeiten", "Bessere Vereinbarkeit mit Privatleben", "Bessere Vergütung oder finanzielle Unterstützung", "Optionen für Weiterbildung"],
    tags: ["Arbeiten_Arbeitsklima", "Arbeiten_Jobwechsel", "Arbeiten_Karriere", "Arbeiten_Vereinbarkeit", "Arbeiten_Vergütung", "Arbeiten_Umschulung"]
  },
  "Q4_18-24_Gründung": {
    id: "Q4_18-24_Gründung",
    question: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    options: ["Beratung/Coaching", "Finanzierung", "Mentoring/Netzwerk", "Unterstützung beim Businessplan", "Rechtliche/Steuerliche Beratung", "Marketing"],
    tags: ["Gründung_Beratung", "Gründung_Finanzierung", "Gründung_Netzwerk", "Gründung_Businessplan", "Gründung_RechtSteuern", "Gründung_Marketing"]
  },
  "Q4_18-24_Selbstständig": {
    id: "Q4_18-24_Selbstständig",
    question: "Was wäre hilfreich, um dein bisheriges Unternehmen erfolgreicher zu machen?",
    options: ["Weiterbildung/Fachwissen", "Marketing", "Kundengewinnung", "Rechtliche/steuerliche Beratung", "Finanzierung/Investitionen", "Mentoring/Netzwerk", "Vereinbarkeit mit Alltag/Familie"],
    tags: ["Selbstständig_Weiterbildung", "Selbstständig_Marketing", "Selbstständig_Kunden", "Selbstständig_RechtSteuern", "Selbstständig_Finanzierung", "Selbstständig_Netzwerk", "Selbstständig_Vereinbarkeit"]
  },
  "Q4_18-24_Arbeitssuchend": {
    id: "Q4_18-24_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: ["Eine Ansprechperson, die mich bei der Suche berät und begleitet", "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen", "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken", "Hilfe bei Bewerbungen und Vorstellungsgesprächen", "Kontakte zu Arbeitgebern oder Prakitka", "Psychologische Unterstützung"],
    tags: ["Arbeitssuche_Beratung", "Arbeitssuche_Qualifizierung", "Arbeitssuche_Finanzen", "Arbeitssuche_Bewerbung", "Arbeitssuche_Netzwerk", "Arbeitssuche_Psychisch"]
  },
  "Q4_18-24_Weiterbildung": {
    id: "Q4_18-24_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: ["Bessere Vereinbarkeit mit meinem Alltag", "Finanzielle Unterstützung", "Mehr Austausch mit anderen in einer ähnlichen Situation", "Gezielte Unterstützung für meine Lernziele oder Prüfungen", "Beratung oder Mentoring zur Orientierung und Planung"],
    tags: ["Weiterbildung_Vereinbarkeit", "Weiterbildung_Finanzen", "Weiterbildung_Austausch", "Weiterbildung_Lernen", "Weiterbildung_Karriere"]
  },
  "Q4_18-24_Übergangsphase": {
    id: "Q4_18-24_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: ["Eine Ansprechperson, die mich bei der Suche berät und begleitet", "Möglichkeiten, praktische Erfahrungen zu sammeln (z. B. durch Praktika)", "Unterstützung bei Bewerbungen und Vorstellungsgesprächen", "Finanzielle Unterstützung", "Berufs- oder Studienorientierung"],
    tags: ["Übergang_Beratung", "Übergang_Praxis", "Übergang_Bewerbung", "Übergang_Finanzen", "Übergang_Orientierung"]
  },
  "Q4_18-24_Pflege": {
    id: "Q4_18-24_Pflege",
    question: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    options: ["Informationen über Entlastungsangebote", "Austausch mit anderen jungen Pflegenden", "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann", "Psychologische Unterstützung", "Finanzielle Unterstützung"],
    tags: ["Pflege_Informationen", "Pflege_Austausch", "Pflege_Vereinbarkeit", "Pflege_Psychisch", "Pflege_Finanzierung"]
  },
  "Q4_18-24_Familie": {
    id: "Q4_18-24_Familie",
    question: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: ["Informationen über Entlastungsangebote", "Austausch mit anderen in meiner Lage", "Beratung, wie ich die Zeit mit meinem Beruf/Ausbildung vereinbaren kann", "Psychologische Unterstützung", "Finanzielle Unterstützung"],
    tags: ["Familie_Angebote", "Familie_Austausch", "Familie_Vereinbarkeit", "Familie_Psych", "Familie_Finanzierung"]
  },
  "Q4_18-24_Sonstiges": {
    id: "Q4_18-24_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: ["Orientierung und Perspektiven für Ausbildung/Arbeit", "Mehr soziale Kontakte und Freizeitgestaltung", "Finanzielle Absicherung", "Beratungs- und Unterstützungsangebote"],
    tags: ["Sonstiges_Orientierung", "Sonstiges_Sozial", "Sonstiges_Finanzen", "Sonstiges_Beratung"]
  },
  "Q4_18-24_FSJ": {
    id: "Q4_18-24_FSJ",
    question: "Was würde dir helfen dein FSJ, FÖJ, oder ähnliches besser zu gestalten?",
    options: ["Spezifische Weiterbildungen/Kurse", "Mehr Anerkennung für meine Arbeit", "Finanzielle Unterstützung", "Mehr Austausch mit anderen Freiwilligen"],
    tags: ["FSJ_Weiterbildung", "FSJ_Anerkennung", "FSJ_Finanzen", "FSJ_Austausch"]
  },
  "Q5_18-24": {
    id: "Q5_18-24",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: ["Alleine (zu Miete)", "Alleine (Eigentum)", "Bei meiner Familie", "Wohngemeinschaft (WG)", "In einem Wohnheim (Studentenwohnheim, etc.)", "Ich habe aktuell keinen Wohnsitz"],
    tags: ["Miete", "Eigentum", "Familie", "WG", "Wohnheim", "Prekär"]
  },
  "Q5A_18-24_Ohne": {
    id: "Q5A_18-24_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: ["Bei Freunden/Bekannten", "In einer Notunterkunft oder einem Obdachlosenheim", "Ich übernachte an öffentlichen Orten", "Ich wohne in einem Fahrzeug", "Nichts davon"],
    tags: ["Ohne_Bekannte", "Ohne_Not", "Ohne_Öffentlich", "Ohne_Fahrzeug", "Ohne_Nichts"]
  },
  "Q6_18-24": {
    id: "Q6_18-24",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: ["Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht.", "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp.", "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie.", "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken.", "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)."],
    tags: ["Finanzen_regelmäßig-gut", "Finanzen_regelmäßig-knapp", "Finanzen_Ersparnisse", "Finanzen_Prekär", "Finanzen_Sozialleistung"]
  },
  "Q8_18-24": {
    id: "Q8_18-24",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: ["Keine Beeinträchtigungen", "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)", "Psychische Einschränkung (z. B. Depression, Angststörung)", "Chronische Erkrankung (z. B. Diabetes, Epilepsie)", "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)"],
    tags: ["Beeinträchtigung_Nein", "Beeinträchtigung_Körperlich", "Beeinträchtigung_Psychisch", "Beeinträchtigung_Chronisch", "Beeinträchtigung_Sinne"]
  },
  "Q9_18-24_Ja": {
    id: "Q9_18-24_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: ["Hilfe beim Umgang mit der Erkrankung", "Bessere Anbindung an Ärzt:innen oder Therapeut:innen", "Unterstützung im Beruf oder Ausbildung", "Mehr Austausch mit anderen Betroffenen"],
    tags: ["Gesundheit_Umgang", "Gesundheit_Anbindung", "Gesundheit_Unterstützung", "Gesundheit_Austausch"]
  },
  "Q9_18-24_Nein": {
    id: "Q9_18-24_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Unsicherheit bei beruflicher oder privater Orientierung", "Finanzielle Belastungen (z. B. hohe Lebenshaltungskosten)", "Psychische Belastungen (z. B. Stress, Einsamkeit)", "Hürden beim Zugang zu Unterstützungsangeboten (z. B. lange Wartezeiten, fehlende Infos)", "Ich kümmere mich um Angehörige"],
    tags: ["Herausforderung_Orientierung", "Herausforderung_Finanzen", "Herausforderung_Psyche", "Herausforderung_Bürokratie", "Herausforderung_Pflege"]
  },
  "Q9_18-24_Ausland_Nein": {
    id: "Q9_18-24_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Schwierigkeiten in Deutschland anzukommen", "Psychische Belastungen", "Umgang mit Schulden/Finanzen", "Kinderbetreuung", "Pflege von Angehörigen", "Schwierigkeiten im sozialen Umfeld"],
    tags: ["Herausforderung_Deutschland", "Herausforderung_Psyche", "Herausforderung_Finanzen", "Herausforderung_Kinder", "Herausforderung_Pflege", "Herausforderung_Sozial"]
  },
  "Q10_18-24": {
    id: "Q10_18-24",
    question: "Was wünschst du dir?",
    options: ["Neue Leute kennenlernen und Kontakte knüpfen", "Beratung und Orientierung", "Freizeit- und Kulturangebote", "Lern- und Weiterbildungsmöglichkeiten", "Einstieg in die Selbstständigkeit oder Gründung", "Ehrenamtliches Engagement"],
    tags: ["Wunsch_Sozial", "Wunsch_Beratung", "Wunsch_Kultur", "Wunsch_Lernen", "Wunsch_Gründung", "Wunsch_Ehrenamt"]
  },
  // 25-34 age group path
  "Q2_25-34": {
    id: "Q2_25-34",
    question: "Welche Staatsangehörigkeit hast du?",
    options: ["Deutsch", "Ukrainisch", "Türkisch", "Syrisch", "EU-Ausland", "Drittstaat"],
    tags: ["Deutsch", "EU", "Ukrainisch", "Türkisch", "Syrisch", "Drittstaat"]
  },
  "Q3_25-34": {
    id: "Q3_25-34",
    question: "Was machst du aktuell?",
    options: ["Ausbildung", "Studium", "Arbeiten (angestellt)", "Gründung eines Unternehmens", "Selbstständig/Unternehmer:in", "Arbeitssuchend", "Berufliche Weiterbildung/Umschulung", "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)", "Pflege von Angehörigen", "Familienzeit oder Kinderbetreuung", "Sonstiges"],
    tags: ["Ausbildung", "Studium", "Arbeiten", "Gründung", "Selbstständig", "Arbeitssuchend", "Weiterbildung", "Übergang", "Pflege", "Familie", "Sonstiges"]
  },
  "Q4_25-34_Ausbildung": {
    id: "Q4_25-34_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: ["Mehr Unterstützung in der Berufsschule (z. B. Nachhilfe, Prüfungsvorbereitung)", "Besseres Miteinander mit Ausbilder:innen/Kolleg:innen", "Mehr Verantwortung und Vertrauen", "Klare Perspektiven für die Zeit nach der Ausbildung (z. B. Übernahme, Weiterbildung)", "Bessere Vereinbarkeit mit Privatleben", "Finanzielle Unterstützung"],
    tags: ["Ausbildung_Berufsschule", "Ausbildung_Miteinander", "Ausbildung_Verantwortung", "Ausbildung_Perspektive", "Ausbildung_Vereinbarkeit", "Ausbildung_Finanzen"]
  },
  "Q4_25-34_Studium": {
    id: "Q4_25-34_Studium",
    question: "Was würdest du dir für dein Studium wünschen, um es erfolgreich abzuschließen und dich optimal auf nächste Schritte vorzubereiten?",
    options: ["Mehr Unterstützung im Studium", "Bessere Anbindung an Professor:innen/Dozent:innen", "Mehr Austausch mit Kommiliton:innen", "Finanzielle Unterstützung", "Psychische Beratung"],
    tags: ["Studium_Unterstützung", "Studium_Anbindung", "Studium_Austausch", "Studium_Finanzen", "Studium_Psyche"]
  },
  "Q4_25-34_Arbeiten": {
    id: "Q4_25-34_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: ["Ein besseres Arbeitsklima", "Einen anderen Job", "Mehr Verantwortung oder Aufstiegsmöglichkeiten", "Bessere Vereinbarkeit mit Privatleben", "Bessere Vergütung oder finanzielle Unterstützung", "Optionen für Weiterbildung oder Umschulung"],
    tags: ["Arbeiten_Arbeitsklima", "Arbeiten_Jobwechsel", "Arbeiten_Karriere", "Arbeiten_Vereinbarkeit", "Arbeiten_Vergütung", "Arbeiten_Umschulung"]
  },
  "Q4_25-34_Gründung": {
    id: "Q4_25-34_Gründung",
    question: "Was benötigst du aktuell, um dein Vorhaben zu starten?",
    options: ["Beratung/Coaching", "Finanzierung", "Mentoring/Netzwerk", "Unterstützung beim Businessplan", "Rechtliche/Steuerliche Beratung", "Marketing"],
    tags: ["Gründung_Beratung", "Gründung_Finanzierung", "Gründung_Netzwerk", "Gründung_Businessplan", "Gründung_RechtSteuern", "Gründung_Marketing"]
  },
  "Q4_25-34_Selbstständigkeit": {
    id: "Q4_25-34_Selbstständigkeit",
    question: "Was wäre hilfreich, um dein bisheriges Unternehmen erfolgreicher zu machen?",
    options: ["Weiterbildung/Fachwissen", "Marketing", "Kundengewinnung", "Rechtliche/steuerliche Beratung", "Finanzierung/Investitionen", "Mentoring/Netzwerk", "Vereinbarkeit mit Familie", "Internationalisierung"],
    tags: ["Selbstständig_Weiterbildung", "Selbstständig_Marketing", "Selbstständig_Kunden", "Selbstständig_RechtSteuern", "Selbstständig_Finanzierung", "Selbstständig_Netzwerk", "Selbstständig_Vereinbarkeit", "Selbstständig_International"]
  },
  "Q4_25-34_Arbeitssuchend": {
    id: "Q4_25-34_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: ["Eine Ansprechperson, die mich bei der Suche berät und begleitet", "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen", "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken", "Hilfe bei Bewerbungen und Vorstellungsgesprächen", "Kontakte zu Arbeitgebern oder Prakitka", "Psychologische Unterstützung"],
    tags: ["Arbeitssuche_Beratung", "Arbeitssuche_Qualifizierung", "Arbeitssuche_Finanzen", "Arbeitssuche_Bewerbung", "Arbeitssuche_Netzwerk", "Arbeitssuche_Psychisch"]
  },
  "Q4_25-34_Weiterbildung": {
    id: "Q4_25-34_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: ["Bessere Vereinbarkeit mit Beruf und Familie", "Finanzielle Unterstützung (z. B. Kursgebühren, Material)", "Mehr Austausch mit anderen Teilnehmer:innen", "Gezielte Förderung für meine Lernziele oder beruflichen Kompetenzen", "Mentoring oder Beratung zur beruflichen Orientierung"],
    tags: ["Weiterbildung_Vereinbarkeit", "Weiterbildung_Finanzen", "Weiterbildung_Austausch", "Weiterbildung_Lernen", "Weiterbildung_Karriere"]
  },
  "Q4_25-34_Übergangsphase": {
    id: "Q4_25-34_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: ["Eine Ansprechperson, die mich bei der Suche berät und begleitet", "Möglichkeiten, praktische Erfahrungen zu sammeln (z. B. durch Praktika)", "Unterstützung bei Bewerbungen und Vorstellungsgesprächen", "Finanzielle Unterstützung"],
    tags: ["Übergang_Beratung", "Übergang_Praxis", "Übergang_Bewerbung", "Übergang_Finanzen"]
  },
  "Q4_25-34_Pflege": {
    id: "Q4_25-34_Pflege",
    question: "Was würde dir helfen, die Pflege besser mit deinem Alltag zu vereinbaren?",
    options: ["Informationen über Entlastungsangebote", "Austausch mit anderen jungen Pflegenden", "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann", "Psychologische Unterstützung", "Finanzielle Unterstützung"],
    tags: ["Pflege_Informationen", "Pflege_Austausch", "Pflege_Vereinbarkeit", "Pflege_Psychisch", "Pflege_Finanzierung"]
  },
  "Q4_25-34_Familie": {
    id: "Q4_25-34_Familie",
    question: "Was würde dir helfen, die Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: ["Informationen über Entlastungsangebote", "Austausch mit anderen in meiner Lage", "Beratung, wie ich die Zeit mit meinem Beruf/Ausbildung vereinbaren kann", "Psychologische Unterstützung", "Finanzielle Unterstützung"],
    tags: ["Familie_Angebote", "Familie_Austausch", "Familie_Vereinbarkeit", "Familie_Psych", "Familie_Finanzierung"]
  },
  "Q4_25-34_Sonstiges": {
    id: "Q4_25-34_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: ["Karriere- und Weiterentwicklungsmöglichkeiten", "Vereinbarkeit von Beruf, Familie und Freizeit", "Mehr soziale Kontakte und Freizeitgestaltung", "Finanzielle Absicherung", "Beratungs- und Unterstützungsangebote"],
    tags: ["Sonstiges_Karriere", "Sonstiges_Vereinbarkeit", "Sonstiges_Sozial", "Sonstiges_Finanzen", "Sonstiges_Beratung"]
  },
  "Q5_25-34": {
    id: "Q5_25-34",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: ["Alleine (zu Miete)", "Alleine (Eigentum)", "Bei meiner Familie", "Wohngemeinschaft (WG)", "In einem Wohnheim (Studentenwohnheim, etc.)", "Ich habe aktuell keinen Wohnsitz"],
    tags: ["Miete", "Eigentum", "Familie", "WG", "Wohnheim", "Prekär"]
  },
  "Q5A_25-34_Ohne": {
    id: "Q5A_25-34_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: ["Bei Freunden/Bekannten", "In einer Notunterkunft oder einem Obdachlosenheim", "Ich übernachte an öffentlichen Orten", "Ich wohne in einem Fahrzeug", "Nichts davon"],
    tags: ["Ohne_Bekannte", "Ohne_Not", "Ohne_Öffentlich", "Ohne_Fahrzeug", "Ohne_Nichts"]
  },
  "Q6_25-34": {
    id: "Q6_25-34",
    question: "Was beschreibt deine finanzielle Situation am besten?",
    options: ["Ich habe ein regelmäßiges Einkommen und komme damit gut zurecht.", "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp.", "Ich habe kein regelmäßiges Einkommen und nutze Ersparnisse oder Unterstützung durch Familie.", "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken.", "Ich erhalte eine Sozialleistung (BAföG, Bürgergeld, ALG, Pflegegeld etc.)."],
    tags: ["Finanzen_regelmäßig-gut", "Finanzen_regelmäßig-knapp", "Finanzen_Ersparnisse", "Finanzen_Prekär", "Finanzen_Sozialleistung"]
  },
  "Q8_25-34": {
    id: "Q8_25-34",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: ["Keine Beeinträchtigungen", "Körperliche Einschränkung (z. B. Mobilität, chronische Schmerzen)", "Psychische Einschränkung (z. B. Depression, Angststörung)", "Chronische Erkrankung (z. B. Diabetes, Epilepsie)", "Sinnesbeeinträchtigung (z. B. Seh- oder Hörbehinderung)"],
    tags: ["Beeinträchtigung_Nein", "Beeinträchtigung_Körperlich", "Beeinträchtigung_Psychisch", "Beeinträchtigung_Chronisch", "Beeinträchtigung_Sinne"]
  },
  "Q9_25-34_Ja": {
    id: "Q9_25-34_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: ["Hilfe beim Umgang mit der Erkrankung", "Bessere Anbindung an Ärzt:innen oder Therapeut:innen", "Unterstützung im Beruf oder Ausbildung", "Mehr Austausch mit anderen Betroffenen"],
    tags: ["Gesundheit_Umgang", "Gesundheit_Anbindung", "Gesundheit_Unterstützung", "Gesundheit_Austausch"]
  },
  "Q9_25-34_Nein": {
    id: "Q9_25-34_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Belastungen durch Vereinbarkeit von Beruf und Familie", "Finanzielle Belastungen", "Psychische Belastungen (z. B. Stress, Burnout-Gefühl)", "Bürokratische Herausforderungen (z. B. Ämter, Anträge, Unterstützungssysteme)", "Ich kümmere mich um Angehörige"],
    tags: ["Herausforderung_Vereinbarkeit", "Herausforderung_Finanzen", "Herausforderung_Psyche", "Herausforderung_Bürokratie", "Herausforderung_Pflege"]
  },
  "Q9_25-34_Ausland_Nein": {
    id: "Q9_25-34_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Schwierigkeiten in Deutschland anzukommen", "Psychische Belastungen", "Umgang mit Schulden/Finanzen", "Kinderbetreuung", "Pflege von Angehörigen", "Schwierigkeiten im sozialen Umfeld"],
    tags: ["Herausforderung_Deutschland", "Herausforderung_Psyche", "Herausforderung_Finanzen", "Herausforderung_Kinder", "Herausforderung_Pflege", "Herausforderung_Sozial"]
  },
  "Q10_25-34": {
    id: "Q10_25-34",
    question: "Was wünschst du dir?",
    options: ["Neue Leute kennenlernen und Kontakte knüpfen", "Beratung und Orientierung", "Freizeit- und Kulturangebote", "Lern- und Weiterbildungsmöglichkeiten", "Einstieg in die Selbstständigkeit oder Gründung", "Ehrenamtliches Engagement"],
    tags: ["Wunsch_Sozial", "Wunsch_Beratung", "Wunsch_Kultur", "Wunsch_Lernen", "Wunsch_Gründung", "Wunsch_Ehrenamt"]
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