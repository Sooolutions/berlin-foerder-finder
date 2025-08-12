export interface QuestionData {
  id: string;
  question: string;
  options: string[];
}

// Map of all questions and their options
const questionsMap: Record<string, QuestionData> = {
  // Initial age question
  "Q1": {
    id: "Q1",
    question: "Wie alt bist du?",
    options: ["unter 18", "18-24", "25-64", "über 65"]
  },

  // 18-24 paths - New structure
  "Q2_18-24": {
    id: "Q2_18-24",
    question: "Welche Staatsangehörigkeit hast du?",
    options: ["Deutsch", "Ukrainisch", "Türkisch", "Syrisch", "EU-Ausland", "Russland", "Indien", "Andere"]
  },
  "Q3_18-24": {
    id: "Q3_18-24",
    question: "Was machst du aktuell?",
    options: ["Schule", "Ausbildung", "Studium", "Arbeiten", "Arbeitssuchend", "Weiterbildung/Umschulung", "Übergangsphase", "Pflege von Angehörigen oder Familienzeit", "Sonstiges"]
  },
  "Q4_18-24_Schule": {
    id: "Q4_18-24_Schule",
    question: "Hast du Probleme in der Schule?",
    options: ["Lernschwierigkeiten", "Mobbing", "Mittagessen", "Schulmaterial"]
  },
  "Q4_18-24_Ausbildung": {
    id: "Q4_18-24_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: ["Mehr Unterstützung in der Berufsschule (z. B. Nachhilfe, Prüfungsvorbereitung)", "Besseres Miteinander mit Ausbilder:innen/Kolleg:innen", "Mehr Verantwortung und Vertrauen", "Klare Perspektiven für die Zeit nach der Ausbildung (z. B. Übernahme, Weiterbildung)"]
  },
  "Q4_18-24_Studium": {
    id: "Q4_18-24_Studium",
    question: "Was würdest du dir für dein Studium wünschen, um es erfolgreich abzuschließen und dich optimal auf nächste Schritte vorzubereiten?",
    options: ["Mehr Unterstützung im Studium", "Bessere Anbindung an Professor:innen/Dozent:innen", "Mehr Austausch mit Kommiliton:innen", "Finanzielle Unterstützung"]
  },
  "Q4_18-24_Arbeiten": {
    id: "Q4_18-24_Arbeiten",
    question: "Was würdest du dir für deine aktuelle Situation bei der Arbeit wünschen?",
    options: ["Ein besseres Arbeitsklima oder einen anderen Job", "Mehr Verantwortung oder Aufstiegsmöglichkeiten", "Flexiblere Arbeitszeiten oder die Möglichkeit, im Homeoffice zu arbeiten", "Bessere Vergütung oder finanzielle Unterstützung"]
  },
  "Q4_18-24_Arbeitssuchend": {
    id: "Q4_18-24_Arbeitssuchend",
    question: "Was würde dir im Moment am meisten helfen, einen passenden Job zu finden?",
    options: ["Eine Ansprechperson, die mich bei der Suche berät und begleitet", "Gezielte Trainings/Kurse, die mich fit für den Arbeitsmarkt machen", "Finanzielle Unterstützung, um die Zeit der Arbeitssuche zu überbrücken", "Hilfe bei der Erstellung meiner Bewerbungsunterlagen"]
  },
  "Q4_18-24_Weiterbildung": {
    id: "Q4_18-24_Weiterbildung",
    question: "Was würde dir helfen, deine Weiterbildung erfolgreich abzuschließen?",
    options: ["Bessere Vereinbarkeit mit meinem Alltag (z. B. Arbeit, Familie)", "Gezieltere Förderung für meine spezifischen Lernziele", "Finanzielle Unterstützung (z. B. für Material, Gebühren oder Lebenshaltungskosten)", "Mehr Austausch mit anderen Teilnehmer:innen"]
  },
  "Q4_18-24_Übergangsphase": {
    id: "Q4_18-24_Übergangsphase",
    question: "Was würde dir in dieser Übergangsphase am meisten helfen, einen passenden Weg zu finden?",
    options: ["Eine Ansprechperson, die mich bei der Suche berät und begleitet", "Möglichkeiten, praktische Erfahrungen zu sammeln (z. B. durch Praktika)", "Unterstützung bei Bewerbungen und Vorstellungsgesprächen", "Finanzielle Unterstützung, um die Zeit zu überbrücken"]
  },
  "Q4_18-24_Pflege": {
    id: "Q4_18-24_Pflege",
    question: "Was würde dir helfen, die Pflege oder Familienzeit besser mit deinem Alltag zu vereinbaren?",
    options: ["Informationen über Entlastungsangebote", "Austausch mit anderen jungen Pflegenden", "Beratung, wie ich die Pflege mit meinem Beruf/Ausbildung vereinbaren kann", "Psychologische Unterstützung"]
  },
  "Q4_18-24_Sonstiges": {
    id: "Q4_18-24_Sonstiges",
    question: "Was würdest du dir für deine aktuelle Situation am meisten wünschen?",
    options: ["Einen Weg aus der momentanen Perspektivlosigkeit finden", "Mehr Möglichkeiten für soziale Kontakte und Freizeitgestaltung", "Bessere finanzielle Absicherung", "Beratungs- und Unterstützungsangebote"]
  },
  "Q5_18-24": {
    id: "Q5_18-24",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: ["Alleine (eigene Wohnung)", "Bei meiner Familie", "Wohngemeinschaft (WG)", "In einem Wohnheim (Studentenwohnheim, etc.)", "Ich habe aktuell keinen Wohnsitz"]
  },
  "Q6_18-24_Alleine": {
    id: "Q6_18-24_Alleine",
    question: "Wie hoch sind deine gesamten monatlichen Wohnkosten?",
    options: ["Unter 300€", "301-500€", "501-800€", "801-1.200€", "Über 1.200€"]
  },
  "Q6_18-24_Familie": {
    id: "Q6_18-24_Familie",
    question: "Hast du das Gefühl das es finanzielle Probleme gibt?",
    options: ["Ja", "Nein"]
  },
  "Q6_18-24_WG": {
    id: "Q6_18-24_WG",
    question: "Wie hoch sind deine gesamten monatlichen Wohnkosten?",
    options: ["Unter 300€", "301-500€", "501-800€", "801-1.200€", "Über 1.200€"]
  },
  "Q6_18-24_Wohnheim": {
    id: "Q6_18-24_Wohnheim",
    question: "Wie hoch sind deine monatlichen Wohnkosten im Wohnheim ungefähr?",
    options: ["Unter 200€", "201-400€", "401-600€", "Über 600€"]
  },
  "Q6_18-24_Ohne": {
    id: "Q6_18-24_Ohne",
    question: "Um die richtigen Hilfsangebote zu finden, brauchen wir etwas mehr Informationen. Wie wohnst du aktuell?",
    options: ["Bei Freunden/Bekannten", "In einer Notunterkunft oder einem Obdachlosenheim", "Ich übernachte an öffentlichen Orten", "Ich wohne in einem Fahrzeug", "Nichts davon"]
  },
  "Q7_18-24_Schule": {
    id: "Q7_18-24_Schule",
    question: "Benötigst du finanzielle Unterstützung für deinen Schulabschluss?",
    options: ["Ja", "Nein"]
  },
  "Q7_18-24_Ausbildung": {
    id: "Q7_18-24_Ausbildung",
    question: "Wie viel Ausbildungsvergütung (Brutto) erhältst du monatlich?",
    options: ["unter 500€", "501-800€", "801-1.200€", "Über 1.200€"]
  },
  "Q7_18-24_Studium": {
    id: "Q7_18-24_Studium",
    question: "Welche Form der finanziellen Unterstützung würdest du dir für dein Studium am meisten wünschen?",
    options: ["BAföG oder andere staatliche Hilfen", "Unterstützung bei den Studienkosten", "Nebenjob, der sich mit dem Studium vereinbaren lässt", "Ich habe Schwierigkeiten meine Lebensunterhaltungskosten zu decken", "Ich bin finanziell gut abgesichert"]
  },
  "Q7_18-24_Arbeiten": {
    id: "Q7_18-24_Arbeiten",
    question: "Wie hoch ist dein monatliches Brutto-Einkommen ungefähr?",
    options: ["Unter 1.000€", "1.001-2.000€", "2.001-3.500€", "Über 3.500€"]
  },
  "Q7_18-24_Arbeitssuchend": {
    id: "Q7_18-24_Arbeitssuchend",
    question: "Beziehst du aktuell Sozialleistungen?",
    options: ["Ich erhalte Arbeitslosengeld I", "ich erhalte Bürgergeld", "Ich erhalte keine Leistung", "Ich möchte dazu keine Angabe machen"]
  },
  "Q7_18-24_Weiterbildung": {
    id: "Q7_18-24_Weiterbildung",
    question: "Was beschreibt deine aktuelle finanzielle Situation am besten?",
    options: ["Ich ein regelmäßiges Einkommen und komme gut zurecht", "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp am Monatsende", "Ich habe kein regelmäßiges Einkommen und muss meine Ersparnisse nutzen", "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken", "Ich werde von meiner Familie oder Partner/Partnerin finanziert"]
  },
  "Q7_18-24_Übergangsphase": {
    id: "Q7_18-24_Übergangsphase",
    question: "Wie wird dein Lebensunterhalt in dieser Übergangsphase hauptsächlich finanziert?",
    options: ["Durch meine Familie", "Durch eigene Ersparnisse", "Ich erhalte eine Sozialleistung (z.B. Bürgergeld, Arbeitslosengeld)", "Durch andere Quellen", "Ich kann meine Ausgaben aktuell nicht decken"]
  },
  "Q7_18-24_Pflege": {
    id: "Q7_18-24_Pflege",
    question: "Was beschreibt deine aktuelle finanzielle Situation am besten?",
    options: ["Ich erhalte Pflegegeld oder eine andere Leistung", "Ich habe ein eigene Einkommen", "Mein Einkommen stammt hauptsächlich aus Leistungen", "Mein Einkommen reicht nicht aus, um meine Augaben zu decken"]
  },
  "Q7_18-24_Sonstiges": {
    id: "Q7_18-24_Sonstiges",
    question: "Was beschreibt deine aktuelle finanzielle Situation am besten?",
    options: ["Ich ein regelmäßiges Einkommen und komme gut zurecht", "Ich habe ein regelmäßiges Einkommen, aber es ist oft knapp am Monatsende", "Ich habe kein regelmäßiges Einkommen und muss meine Ersparnisse nutzen", "Ich habe kein regelmäßiges Einkommen und kann meine Ausgaben nicht decken", "Ich werde von meiner Familie oder Partner/Partnerin finanziert"]
  },
  "Q8_18-24": {
    id: "Q8_18-24",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: ["Ja", "Nein"]
  },
  "Q9_18-24_Ja": {
    id: "Q9_18-24_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: ["Hilfe beim Umgang mit der Erkrankung", "Bessere Anbindung an Ärzt:innen oder Therapeut:innen", "Unterstützung im Beruf oder Ausbildung", "Mehr Austausch mit anderen Betroffenen"]
  },
  "Q9_18-24_Nein": {
    id: "Q9_18-24_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Probleme in der Familie", "Schwierigkeiten im sozialen Umfeld", "Psychische Belastungen", "Schwierigkeiten mit Arbeit, Ausbildung oder Studium", "Umgang mit Schulden/Finanzen", "Ich kümmere mich um kranke oder pflegebedürftige Familienmitglieder", "Nichts davon"]
  },
  "Q9_18-24_Ausland_Nein": {
    id: "Q9_18-24_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Probleme in der Familie", "Schwierigkeiten im sozialen Umfeld", "Psychische Belastungen", "Schwierigkeiten mit Arbeit, Ausbildung oder Studium", "Umgang mit Schulden/Finanzen", "Schwierigkeiten in Deutschland anzukommen", "Ich kümmere mich um kranke oder pflegebedürftige Familienmitglieder", "Nichts davon"]
  },
  "Q10_18-24": {
    id: "Q10_18-24",
    question: "Was wünschst du dir?",
    options: ["Neue Leute kennenlernen und Kontakte knüpfen", "Beratung und Orientierung", "Freizeit- und Kulturangebote", "Lern- und Weiterbildungsmöglichkeiten", "Einstieg in die Selbstständigkeit oder Gründung", "Ehrenamtliches Engagement"]
  },
  "Q2_25_64": {
    id: "Q2_25_64",
    question: "Was machst du aktuell?",
    options: ["Studium", "Arbeiten", "Arbeitssuchend", "Weiterbildung/Umschulung", "Übergangsphase", "Pflege von Angehörigen oder Familienzeit", "Sonstiges"]
  },
  "Q2_Ü65": {
    id: "Q2_Ü65",
    question: "Was machst du aktuell?",
    options: ["Berufstätig", "Übergang in den Ruhestand", "In Rente", "Pflege oder Betreuung (selbst betroffen oder Angehörige)", "Sonstiges"]
  },

  // Under 18 paths - New structure
  "Q2_U18": {
    id: "Q2_U18",
    question: "Welche Staatsangehörigkeit hast du?",
    options: ["Deutsch", "Ukrainisch", "Türkisch", "Syrisch", "EU-Ausland", "Russland", "Indien", "Andere"]
  },
  "Q3_U18": {
    id: "Q3_U18",
    question: "Was machst du aktuell?",
    options: ["Schule", "Ausbildung", "FSJ oder FÖJ", "Sonstiges"]
  },
  "Q4_U18_Schule": {
    id: "Q4_U18_Schule",
    question: "Hast du Probleme in der Schule?",
    options: ["Lernschwierigkeiten", "Mobbing", "Mittagessen", "Schulmaterial"]
  },
  "Q4_U18_Ausbildung": {
    id: "Q4_U18_Ausbildung",
    question: "Was würdest du dir für deine Ausbildung wünschen?",
    options: ["Mehr Unterstützung beim Lernen", "Besseres Miteinander mit Ausbilder:in/Kolleg:innen", "Mehr Verantwortung/Anspruchsvollere Aufgaben", "Mehr Zeit für persönliche Projekte/Hobbys", "Finanzielle Unterstützung"]
  },
  "Q4_U18_FSJ": {
    id: "Q4_U18_FSJ",
    question: "Was würde dir helfen dein FSJ, FÖJ, oder ähnliches besser zu gestalten?",
    options: ["Spezifische Weiterbildungen/Kurse", "Mehr Anerkennung für meine Arbeit", "Finanzielle Unterstützung", "Mehr Austausch mit anderen Freiwilligen"]
  },
  "Q4_U18_Sonstiges": {
    id: "Q4_U18_Sonstiges",
    question: "Was wünschst du dir für deine aktuelle Situation?",
    options: ["Schnell einen passenden Schul-/Ausbildungsplatz finden", "Eine Ansprechperson finden, die mich berät und unterstützt", "Neue Freunde finden und spannende Aktivitäten machen", "Finanziell unabhängiger sein"]
  },
  "Q5_U18": {
    id: "Q5_U18",
    question: "Wohnst du bei deinen Eltern?",
    options: ["Ja", "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)", "Nein, ich wohne bei Verwandten/Bekannten"]
  },
  "Q6_U18_Eltern": {
    id: "Q6_U18_Eltern",
    question: "Hast du das Gefühl, dass es finanzielle Probleme gibt?",
    options: ["Ja", "Nein"]
  },
  "Q6_U18_Betreuung": {
    id: "Q6_U18_Betreuung",
    question: "Wer finanziert deinen Aufenthalt in der Einrichtung hauptsächlich?",
    options: ["Eine Behörde", "Meine Familie", "Ich selbst", "Eine Stiftung", "Sonstiges"]
  },
  "Q6_U18_Verwandte": {
    id: "Q6_U18_Verwandte",
    question: "Wer finanziert hauptsächlich deinen monatlichen Lebensunterhalt?",
    options: ["Meine Sorgeberechtigten", "Die Verwandten/Bekannten, bei denen ich wohne", "Ich selbst", "Das Jugendamt", "Ich weiß es nicht"]
  },
  "Q7_U18": {
    id: "Q7_U18",
    question: "Gibt es gesundheitliche Besonderheiten, die deinen Alltag stark beeinflussen?",
    options: ["Ja", "Nein"]
  },
  "Q8_U18_Ja": {
    id: "Q8_U18_Ja",
    question: "Welche Unterstützung wünschst du dir im Umgang mit deinen gesundheitlichen Besonderheiten?",
    options: ["Hilfe beim Umgang mit der Erkrankung", "Bessere Anbindung an Ärzt:innen oder Therapeut:innen", "Unterstützung in der Schule/Ausbildung", "Mehr Austausch mit anderen Betroffenen"]
  },
  "Q8_U18_Nein": {
    id: "Q8_U18_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Probleme in der Familie", "Schwierigkeiten im sozialen Umfeld", "Psychische Belastungen", "Ich kümmere mich um kranke oder pflegebedürftige Familienmitglieder", "Nichts davon"]
  },
  "Q8_U18_Ausland_Nein": {
    id: "Q8_U18_Ausland_Nein",
    question: "Gibt es aktuell besondere Herausforderungen, bei denen du dir Unterstützung wünschen würdest?",
    options: ["Probleme in der Familie", "Schwierigkeiten im sozialen Umfeld", "Psychische Belastungen", "Schwierigkeiten in Deutschland anzukommen", "Ich kümmere mich um kranke oder pflegebedürftige Familienmitglieder", "Nichts davon"]
  },
  "Q9_U18": {
    id: "Q9_U18",
    question: "Was wünschst du dir?",
    options: ["Neue Freunde finden", "Beratung und Orientierung", "Spaß- und Kulturangebote", "Lern- und Weiterbildungsmöglichkeiten", "Ehrenamtliches Engagement"]
  },

  // 18-24 paths
  "Q3_18_24_Schule": {
    id: "Q3_18_24_Schule",
    question: "Machst du bald deinen Abschluss?",
    options: ["Ja", "Nein"]
  },
  "Q3_18_24_Ausbildung": {
    id: "Q3_18_24_Ausbildung",
    question: "In welchem Jahr deiner Ausbildung befindest du dich?",
    options: ["1", "2", "3", "Abschlussphase"]
  },
  "Q3_18_24_Studium": {
    id: "Q3_18_24_Studium",
    question: "Was beschreibt deine aktuelle Situation am besten?",
    options: ["Studienanfänger:in", "Mittendrin", "Abschlussphase"]
  },
  "Q3_18_24_Arbeit": {
    id: "Q3_18_24_Arbeit",
    question: "Welche Themen interessieren dich am meisten?",
    options: ["Weiterbildung", "Sprachkurse", "Internationale Programme", "Persönliche Entwicklung", "Berufsberatung"]
  },
  "Q3_18_24_Übergangsphase": {
    id: "Q3_18_24_Übergangsphase",
    question: "Wobei möchtest du unterstützt werden?",
    options: [
      "Freiwilligendienste (FSJ, IJFD, etc.)",
      "Praktikum oder Berufserfahrung sammeln",
      "Orientierung für Studium/Ausbildung", 
      "Persönliche Entwicklung"
    ]
  },
  "Q3_18_24_Arbeitssuchend": {
    id: "Q3_18_24_Arbeitssuchend",
    question: "Wobei benötigst du am meisten Unterstützung?",
    options: ["Ausbildung finden", "Studium starten", "Job finden", "Persönliche Entwicklung"]
  },

  // 25-64 paths
  "Q3_25_64_Studium": {
    id: "Q3_25_64_Studium",
    question: "Was beschreibt deine aktuelle Situation am besten?",
    options: ["Studienanfänger:in", "Mittendrin", "Abschlussphase"]
  },
  "Q3_25_64_Arbeiten": {
    id: "Q3_25_64_Arbeiten",
    question: "In welchem Umfang arbeitest du?",
    options: ["Vollzeit", "Teilzeit", "Selbstständig"]
  },
  "Q3_25_64_Arbeitssuchend": {
    id: "Q3_25_64_Arbeitssuchend",
    question: "Wobei möchtest du unterstützt werden?",
    options: ["Jobsuche", "Qualifizierung", "Persönliche Unterstützung", "Orientierungshilfe"]
  },
  "Q3_25_64_Weiterbildung": {
    id: "Q3_25_64_Weiterbildung",
    question: "Wobei möchtest du unterstützt werden?",
    options: ["Finanzierung", "Karriereplanung nach der Weiterbildung", "Unterstützung beim Abschluss", "Vernetzung mit Unternehmen"]
  },
  "Q3_25_64_Übergang": {
    id: "Q3_25_64_Übergang",
    question: "Welche Ziele verfolgst du in deiner Übergangsphase?",
    options: ["Neuorientierung im Beruf", "Weiterbildung oder Qualifikation", "Persönliche Entwicklung oder Sabbatical", "Vorbereitung auf Gründung"]
  },
  "Q3_25_64_Familie": {
    id: "Q3_25_64_Familie",
    question: "Wobei möchtest du unterstützt werden?",
    options: ["Beruflicher Wiedereinstieg", "Unterstützung der Familienzeit", "Qualifizierung während der Auszeit", "Austausch mit anderen in ähnlichen Situationen"]
  },
  "Q3_25_64_Sonstiges": {
    id: "Q3_25_64_Sonstiges",
    question: "Was steht für dich aktuell im Vordergrund?",
    options: ["Persönliche Entwicklung", "Berufliche Orientierung/Weiterbildung", "Soziales Engagement", "Unterstützung in deiner Lebenslage"]
  },

  // Over 65 paths
  "Q3_Ü65_Berufstätig": {
    id: "Q3_Ü65_Berufstätig",
    question: "Welche Themen interessieren dich am meisten?",
    options: ["Weiterbildung", "Flexible Arbeitsmodelle", "Gesundheit am Arbeitsplatz", "Übergang in die Rente", "Mentoring"]
  },
  "Q3_Ü65_Übergang": {
    id: "Q3_Ü65_Übergang",
    question: "Wobei möchtest du unterstützt werden?",
    options: ["Rentenberatung", "Neue Beschäftigungsformen", "Ehrenamt", "Persönliche Entwicklung"]
  },
  "Q3_Ü65_Rente": {
    id: "Q3_Ü65_Rente",
    question: "Was interessiert dich am meisten?",
    options: ["Weiterbildung", "Ehrenamt", "Gesundheit", "Soziale Kontakte", "Kreative Projekte"]
  },
  "Q3_Ü65_Pflege": {
    id: "Q3_Ü65_Pflege",
    question: "Wobei benötigst du am meisten Unterstützung?",
    options: ["Entlastung bei der Pflege", "Beratung zu Pflegeleistungen", "Gesundheitsförderung", "Soziale Kontakte"]
  },
  "Q3_Ü65_Sonstiges": {
    id: "Q3_Ü65_Sonstiges",
    question: "Was interessiert dich besonders?",
    options: ["Bildung", "Kultur", "Gesundheit", "Soziales Engagement", "Persönliche Projekte"]
  },

  // Q4 questions for 25-64 age group
  "Q4_25_64_Studium_Anfänger:in": {
    id: "Q4_25_64_Studium_Anfänger:in",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: ["Studienorganisation", "Praktische Erfahrungen", "Vernetzung mit anderen Studierenden", "Förderangebote und Stipendien"]
  },
  "Q4_25_64_Studium_Mittendrin": {
    id: "Q4_25_64_Studium_Mittendrin",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: ["Studienorganisation", "Praktische Erfahrungen", "Vernetzung mit anderen Studierenden", "Förderangebote und Stipendien"]
  },
  "Q4_25_64_Studium_Abschluss": {
    id: "Q4_25_64_Studium_Abschluss",
    question: "Wobei möchtest du in deiner Abschlussphase unterstützt werden?",
    options: ["Unterstützung bei der Abschlussarbeit", "Vorbereitung auf den Berufseinstieg", "Orientierung für den nächsten Schritt", "Persönliche Entwicklung"]
  },
  "Q4_25_64_Arbeiten_Voll": {
    id: "Q4_25_64_Arbeiten_Voll",
    question: "In welchem Bereich suchst du nach öffentlichen Leistungen?",
    options: ["Weiterbildung im aktuellen Beruf", "Umschulung für einen neuen Bereich", "Aufstieg/Führungsposition", "Gründung oder Selbstständigkeit"]
  },
  "Q4_25_64_Arbeiten_Teil": {
    id: "Q4_25_64_Arbeiten_Teil",
    question: "Was ist dir für deine berufliche Situation derzeit am wichtigsten?",
    options: ["Arbeitszeit erhöhen", "Berufliche Weiterbildung", "Wechsel in Vollzeitbeschäftigung", "Vereinbarkeit von Arbeit und Familie verbessern"]
  },
  "Q4_25_64_Arbeiten_Selbst": {
    id: "Q4_25_64_Arbeiten_Selbst",
    question: "Was ist dir für deine berufliche Situation derzeit am wichtigsten?",
    options: ["Fachliche Weiterbildung", "Unternehmensfinanzierung", "Geschäftsausbau (Netzwerke, Wachstum)", "Vereinbarkeit mit anderen Lebensbereichen"]
  },
  "Q4_25_64_Arbeitssuchend_Suche": {
    id: "Q4_25_64_Arbeitssuchend_Suche",
    question: "Welche Art von Stelle suchst du?",
    options: ["Festanstellung", "Praktikum", "Projektarbeit", "Ehrenamt"]
  },
  "Q4_25_64_Arbeitssuchend_Qualifizierung": {
    id: "Q4_25_64_Arbeitssuchend_Qualifizierung",
    question: "In welchem Bereich möchtest du dich qualifizieren?",
    options: ["Abschluss nachholen", "Studium", "Pflege", "Verwaltung", "IT"]
  },
  "Q4_25_64_Arbeitssuchend_Persönlich": {
    id: "Q4_25_64_Arbeitssuchend_Persönlich",
    question: "Welche Art von Unterstützung wäre dir aktuell am wichtigsten?",
    options: ["Bewerbungstraining", "Coaching", "Mentoring", "Beratung", "Betreuung"]
  },
  "Q4_25_64_Arbeitssuchend_Orientierung": {
    id: "Q4_25_64_Arbeitssuchend_Orientierung",
    question: "In welche Richtung möchtest du dich orientieren?",
    options: ["Neue Branche", "Neue Rolle", "erstmal offen"]
  },
  "Q4_25_64_Weiterbildung_Finanzierung": {
    id: "Q4_25_64_Weiterbildung_Finanzierung",
    question: "Welche Finanzierungsmöglichkeiten passen am besten zu deiner Situation?",
    options: ["Stipendium", "Bildungsgutschein", "Kredit"]
  },
  "Q4_25_64_Weiterbildung_Karriereplanung": {
    id: "Q4_25_64_Weiterbildung_Karriereplanung",
    question: "Zielst du darauf intern aufzusteigen oder in ein neues Unternehmen zu wechseln?",
    options: ["Interner Aufstieg", "Unternehmenswechsel", "Selbstständigkeit"]
  },
  "Q4_25_64_Weiterbildung_Abschluss": {
    id: "Q4_25_64_Weiterbildung_Abschluss",
    question: "Benötigst du fachliche Unterstützung oder Unterstützung bei den Prüfungen?",
    options: ["Fachliche Unterstützung", "Prüfungsvorbereitung", "Abschlussarbeit-Beratung"]
  },
  "Q4_25_64_Weiterbildung_Vernetzung": {
    id: "Q4_25_64_Weiterbildung_Vernetzung",
    question: "In welchen Branchen möchtest du dich vernetzen?",
    options: ["IT", "Gesundheit", "Industrie", "Soziales", "Kreativwirtschaft", "Sonstiges"]
  },
  "Q4_25_64_Übergang_Neuorientierung": {
    id: "Q4_25_64_Übergang_Neuorientierung",
    question: "Welche Berufsfelder interessieren dich besonders?",
    options: ["Soziales", "Technik", "Verwaltung", "Kreativwirtschaft", "Bildung", "Sonstiges"]
  },
  "Q4_25_64_Übergang_Weiterbildung": {
    id: "Q4_25_64_Übergang_Weiterbildung",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: ["IT", "Pflege", "Betriebswirtschaft", "Bildung", "Handwerk", "Sonstiges"]
  },
  "Q4_25_64_Übergang_Persönlich": {
    id: "Q4_25_64_Übergang_Persönlich",
    question: "Was steht für dich aktuell im Vordergrund?",
    options: ["Gesundheit", "Reisen", "Weiterbildung", "Ehrenamt", "Persönliches Wachstum"]
  },
  "Q4_25_64_Übergang_Gründung": {
    id: "Q4_25_64_Übergang_Gründung",
    question: "Was möchtest du gründen?",
    options: ["Kleineres Unternehmen", "Start-up", "Projekt", "Noch offen"]
  },
  "Q4_25_64_Familie_Wiedereinstieg": {
    id: "Q4_25_64_Familie_Wiedereinstieg",
    question: "Möchtest du in deinen früheren Beruf zurückkehren oder etwas Neues beginnen?",
    options: ["Rückkehr in den bisherigen Beruf", "Neue Richtung"]
  },
  "Q4_25_64_Familie_Unterstützung": {
    id: "Q4_25_64_Familie_Unterstützung",
    question: "Welche Angebote interessieren dich?",
    options: ["Kinderbetreuung", "Weiterbildung", "Netzwerkangebote", "Gesundheitsförderung"]
  },
  "Q4_25_64_Familie_Qualifizierung": {
    id: "Q4_25_64_Familie_Qualifizierung",
    question: "In welchem Bereich möchtest du dich weiterbilden?",
    options: ["Digitalisierung", "Soft Skills", "Fremdsprachen", "Pädagogik", "Sonstiges"]
  },
  "Q4_25_64_Sonstiges_Persönlich": {
    id: "Q4_25_64_Sonstiges_Persönlich",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Soft Skills", "Stressbewältigung", "Leadership-Kompetenzen"]
  },
  "Q4_25_64_Sonstiges_Weiterbildung": {
    id: "Q4_25_64_Sonstiges_Weiterbildung",
    question: "Suchst du nach erster Orientierung oder hast du schon ein konkretes Berufsfeld im Blick?",
    options: ["Erste Orientierung", "Konkretes Berufsfeld"]
  },
  "Q4_25_64_Sonstiges_Soziales": {
    id: "Q4_25_64_Sonstiges_Soziales",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Umwelt", "Bildung", "Gesundheit", "Soziales", "Kultur"]
  },
  "Q4_25_64_Sonstiges_Unterstützung": {
    id: "Q4_25_64_Sonstiges_Unterstützung",
    question: "Was würde dir aktuell am meisten helfen?",
    options: ["Beratung", "Finanzielle Unterstützung", "Coaching", "Netzwerkmöglichkeiten"]
  },

  // Additional questions for all paths
  "Q4_U18_Schule_Ja": {
    id: "Q4_U18_Schule_Ja",
    question: "Suchst du Unterstützung in der Schule (Nachhilfe, Beratung, etc.)?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_Schule_Nein": {
    id: "Q4_U18_Schule_Nein",
    question: "Was beschreibt deine Wohnsituation am besten?",
    options: ["Eigene Wohnung", "Betreuungseinrichtung", "Ich wohne bei Verwandten", "Sonstiges"]
  },
  "Q4_U18_Ausbildung_1": {
    id: "Q4_U18_Ausbildung_1",
    question: "Hast du Probleme bei der Finanzierung deiner Ausbildung?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_Ausbildung_2": {
    id: "Q4_U18_Ausbildung_2",
    question: "Hast du Probleme bei der Finanzierung deiner Ausbildung?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_Ausbildung_3": {
    id: "Q4_U18_Ausbildung_3",
    question: "Hast du Probleme bei der Finanzierung deiner Ausbildung?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_Ausbildung_Abschluss": {
    id: "Q4_U18_Ausbildung_Abschluss",
    question: "Hast du Probleme bei der Finanzierung deiner Ausbildung?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_nichtsdavon_Suche": {
    id: "Q4_U18_nichtsdavon_Suche",
    question: "Wobei brauchst du am meisten Unterstützung?",
    options: ["Ausbildungsplatz finden", "Beratung", "Bewerbungstraining", "Schulplatz finden"]
  },
  "Q4_U18_nichtsdavon_Praktikum": {
    id: "Q4_U18_nichtsdavon_Praktikum",
    question: "Möchtest du dich auf die Schule, Ausbildung oder Arbeit vorbereiten?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_nichtsdavon_Warten": {
    id: "Q4_U18_nichtsdavon_Warten",
    question: "Möchtest du dich auf die Schule, Ausbildung oder Arbeit vorbereiten?",
    options: ["Ja", "Nein"]
  },
  "Q4_U18_nichtsdavon_Arbeiten": {
    id: "Q4_U18_nichtsdavon_Arbeiten",
    question: "Möchtest du dich auf die Schule, Ausbildung oder Arbeit vorbereiten?",
    options: ["Ja", "Nein"]
  },
  
  // 18-24 Q4 questions
  "Q4_18_24_Schule_Ja": {
    id: "Q4_18_24_Schule_Ja",
    question: "Suchst du Unterstützung in der Schule (Nachhilfe, Beratung, etc.)?",
    options: ["Ja", "Nein"]
  },
  "Q4_18_24_Schule_Nein": {
    id: "Q4_18_24_Schule_Nein",
    question: "Suchst du Unterstützung in der Schule (Nachhilfe, Beratung, etc.)?",
    options: ["Ja", "Nein"]
  },
  "Q4_18_24_Studium_Anfänger:in": {
    id: "Q4_18_24_Studium_Anfänger:in",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: [
      "Unterstützung beim Studienstart",
      "Praktische Erfahrungen",
      "Vernetzung mit anderen Studierenden",
      "Förderangebote und Stipendien"
    ]
  },
  "Q4_18_24_Studium_Mittendrin": {
    id: "Q4_18_24_Studium_Mittendrin",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: [
      "Unterstützung beim Studium",
      "Praktische Erfahrungen",
      "Vernetzung mit anderen Studierenden",
      "Förderangebote und Stipendien"
    ]
  },
  "Q4_18_24_Studium_Abschluss": {
    id: "Q4_18_24_Studium_Abschluss",
    question: "Wobei möchtest du in deiner Abschlussphase unterstützt werden?",
    options: [
      "Unterstützung bei der Abschlussarbeit",
      "Vorbereitung auf den Berufseinstieg",
      "Orientierung für den nächsten Schritt",
      "Persönliche Entwicklung"
    ]
  },

  // Q5 questions - last question in some paths
  "Q5_U18_Schule_Ja_Ja": {
    id: "Q5_U18_Schule_Ja_Ja",
    question: "In welchem Bereich möchtest du unterstützt werden?",
    options: ["Lernen & Nachhilfe", "Sprachförderung", "Persönliche Beratung"]
  },
  "Q5_U18_Schule_Ja_Nein": {
    id: "Q5_U18_Schule_Ja_Nein",
    question: "Was interessiert dich besonders?",
    options: ["Technik", "Kunst", "Umwelt", "Soziales", "Sport", "Internationales", "Karriereplanung"]
  },
  "Q5_U18_Schule_Nein_EigeneWohnung": {
    id: "Q5_U18_Schule_Nein_EigeneWohnung",
    question: "Wobei würdest du dir Unterstützung wünschen?",
    options: ["Miete", "Haushaltskosten", "Lernen", "Freizeitaktivitäten"]
  },
  "Q5_U18_Schule_Nein_Betreeungseinrichtung": {
    id: "Q5_U18_Schule_Nein_Betreeungseinrichtung",
    question: "Für welche Angebote außerhalb deiner Einrichtung würdest du dich interessieren?",
    options: ["Freizeit", "Berufsvorbereitung", "Lernen", "Mentoring"]
  },
  "Q5_U18_Schule_Nein_Verwandte": {
    id: "Q5_U18_Schule_Nein_Verwandte",
    question: "Was interessiert dich besonders?",
    options: ["Technik", "Kunst", "Umwelt", "Soziales", "Sport", "Internationales", "Karriereplanung"]
  },
  "Q5_U18_Schule_Nein_Sonstiges": {
    id: "Q5_U18_Schule_Nein_Sonstiges",
    question: "Wobei würdest du dir Unterstützung wünschen?",
    options: ["Miete", "Haushaltskosten", "Lernen", "Freizeitaktivitäten"]
  },
  
  "Q5_U18_Ausbildung_1_Ja": {
    id: "Q5_U18_Ausbildung_1_Ja",
    question: "Wobei benötigst du Unterstützung?",
    options: ["Fahrkosten", "Unterkunft", "Lebenshaltung", "Ausbildungsgebühren", "Sonstiges"]
  },
  "Q5_U18_Ausbildung_2_Ja": {
    id: "Q5_U18_Ausbildung_2_Ja",
    question: "Wobei benötigst du Unterstützung?",
    options: ["Fahrkosten", "Unterkunft", "Lebenshaltung", "Ausbildungsgebühren", "Sonstiges"]
  },
  "Q5_U18_Ausbildung_3_Ja": {
    id: "Q5_U18_Ausbildung_3_Ja",
    question: "Wobei benötigst du Unterstützung?",
    options: ["Fahrkosten", "Unterkunft", "Lebenshaltung", "Ausbildungsgebühren", "Sonstiges"]
  },
  "Q5_U18_Ausbildung_Abschluss_Ja": {
    id: "Q5_U18_Ausbildung_Abschluss_Ja",
    question: "Wobei benötigst du Unterstützung?",
    options: ["Fahrkosten", "Unterkunft", "Lebenshaltung", "Ausbildungsgebühren", "Sonstiges"]
  },
  "Q5_U18_Ausbildung_1_Nein": {
    id: "Q5_U18_Ausbildung_1_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Finanzen", "Community"]
  },
  "Q5_U18_Ausbildung_2_Nein": {
    id: "Q5_U18_Ausbildung_2_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Finanzen", "Community"]
  },
  "Q5_U18_Ausbildung_3_Nein": {
    id: "Q5_U18_Ausbildung_3_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Finanzen", "Community"]
  },
  "Q5_U18_Ausbildung_Abschluss_Nein": {
    id: "Q5_U18_Ausbildung_Abschluss_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Finanzen", "Community"]
  },
  "Q5_U18_nichtsdavon_Praktikum_Ja": {
    id: "Q5_U18_nichtsdavon_Praktikum_Ja",
    question: "Wobei benötigst du am meisten Unterstützung?",
    options: ["Ausbildungsplatz finden", "Schulabschluss nachholen", "Persönliche Entwicklung"]
  },
  "Q5_U18_nichtsdavon_Warten_Ja": {
    id: "Q5_U18_nichtsdavon_Warten_Ja",
    question: "Wobei benötigst du am meisten Unterstützung?",
    options: ["Ausbildungsplatz finden", "Schulabschluss nachholen", "Praktikum finden", "Persönliche Entwicklung"]
  },
  "Q5_U18_nichtsdavon_Arbeiten_Ja": {
    id: "Q5_U18_nichtsdavon_Arbeiten_Ja",
    question: "Wobei benötigst du am meisten Unterstützung?",
    options: ["Ausbildungsplatz finden", "Schulabschluss nachholen", "Praktikum finden", "Persönliche Entwicklung"]
  },
  "Q5_U18_nichtsdavon_Praktikum_Nein": {
    id: "Q5_U18_nichtsdavon_Praktikum_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Karriereplanung", "Lernen und Schulabschluss", "Persönliche Entwicklung", "Freizeit", "Unterstützung im Alltag"]
  },
  "Q5_U18_nichtsdavon_Warten_Nein": {
    id: "Q5_U18_nichtsdavon_Warten_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Karriereplanung", "Lernen und Schulabschluss", "Persönliche Entwicklung", "Freizeit", "Unterstützung im Alltag"]
  },
  "Q5_U18_nichtsdavon_Arbeiten_Nein": {
    id: "Q5_U18_nichtsdavon_Arbeiten_Nein",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Karriereplanung", "Lernen und Schulabschluss", "Persönliche Entwicklung", "Freizeit", "Unterstützung im Alltag"]
  },
  
  // 18-24 Q5 questions - FIXED: Added missing questions
  "Q5_18_24_Schule_Ja_Ja": {
    id: "Q5_18_24_Schule_Ja_Ja",
    question: "In welchem Bereich möchtest du unterstützt werden?",
    options: ["Lernen & Nachhilfe", "Sprachförderung", "Persönliche Beratung", "Studien- oder Ausbildungsberatung"]
  },
  "Q5_18_24_Schule_Nein_Ja": {
    id: "Q5_18_24_Schule_Nein_Ja",
    question: "In welchem Bereich möchtest du unterstützt werden?",
    options: ["Lernen & Nachhilfe", "Sprachförderung", "Persönliche Beratung"]
  },
  "Q5_18_24_Schule_Ja_Nein": {
    id: "Q5_18_24_Schule_Ja_Nein",
    question: "Was interessiert dich besonders?",
    options: ["Technik", "Kunst", "Umwelt", "Soziales", "Sport", "Internationales", "Karriereplanung", "Studien- oder Ausbildungsberatung"]
  },
  "Q5_18_24_Schule_Nein_Nein": {
    id: "Q5_18_24_Schule_Nein_Nein",
    question: "Was interessiert dich besonders?",
    options: ["Technik", "Kunst", "Umwelt", "Soziales", "Sport", "Internationales", "Karriereplanung"]
  },

  // Q6 questions - the final questions in certain paths
  "Q6_U18_Ausbildung_1_Ja_Egal": {
    id: "Q6_U18_Ausbildung_1_Ja_Egal",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Community"]
  },
  "Q6_U18_Ausbildung_2_Ja_Egal": {
    id: "Q6_U18_Ausbildung_2_Ja_Egal",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Community"]
  },
  "Q6_U18_Ausbildung_3_Ja_Egal": {
    id: "Q6_U18_Ausbildung_3_Ja_Egal",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Community"]
  },
  "Q6_U18_Ausbildung_Abschluss_Ja_Egal": {
    id: "Q6_U18_Ausbildung_Abschluss_Ja_Egal",
    question: "Welche Themen interessieren dich besonders?",
    options: ["Ausland", "Mentoring", "Karriere", "Lernen", "Community"]
  }
};

// Function to get question data by ID
export function getQuestionData(questionId: string): QuestionData | undefined {
  return questionsMap[questionId];
}
