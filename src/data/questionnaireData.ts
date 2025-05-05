
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

  // What are you currently doing - by age group
  "Q2_U18": {
    id: "Q2_U18",
    question: "Was machst du aktuell?",
    options: ["Schule", "Ausbildung", "nichts davon"]
  },
  "Q2_18_24": {
    id: "Q2_18_24",
    question: "Was machst du aktuell?",
    options: ["Schule", "Ausbildung", "Studium", "Arbeit", "Übergangsphase", "Arbeitssuchend"]
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

  // Under 18 paths
  "Q3_U18_Schule": {
    id: "Q3_U18_Schule",
    question: "Wohnst du bei deinen Eltern?",
    options: ["Ja", "Nein"]
  },
  "Q3_U18_Ausbildung": {
    id: "Q3_U18_Ausbildung",
    question: "In welchem Jahr deiner Ausbildung befindest du dich?",
    options: ["1", "2", "3", "Abschlussphase"]
  },
  "Q3_U18_nichtsdavon": {
    id: "Q3_U18_nichtsdavon", 
    question: "Was machst du aktuell?",
    options: ["Suche nach Ausbildung/Schule", "Praktikum", "Warten", "Arbeiten"]
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
