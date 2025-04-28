
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
    question: "Was möchtest du in deiner beruflichen Tätigkeit erreichen?",
    options: [
      "Weiterarbeiten in Teilzeit",
      "Vorbereitung auf den Ruhestand",
      "Weiterbildung oder Qualifizierung",
      "Gründungsidee umsetzen",
      "Unterstützung bei der beruflichen Neuorientierung"
    ]
  },
  "Q3_Ü65_Übergang": {
    id: "Q3_Ü65_Übergang",
    question: "Wobei möchtest du in deiner Übergangsphase unterstützt werden?",
    options: [
      "Gestaltung des Ruhestands",
      "Weiterbildung oder neue Beschäftigungsmöglichkeiten",
      "Ehrenamtliches Engagement finden",
      "Gesundheit und aktives Altern fördern"
    ]
  },
  "Q3_Ü65_Rente": {
    id: "Q3_Ü65_Rente",
    question: "Was möchtest du im Ruhestand für dich gestalten?",
    options: ["Weiterbildung", "Soziales Engagement", "Persönliche Entwicklung", "Austausch mit anderen (z.B. Seniorennetzwerke)"]
  },
  "Q3_Ü65_Pflege": {
    id: "Q3_Ü65_Pflege",
    question: "Wobei benötigst du am meisten Unterstützung?",
    options: ["Informationen und Beratung zur Pflege", "Entlastung bei der Pflege Angehöriger", "Eigene Vorsorge und Pflegeorganisation", "Vernetzung mit Unterstützungsangeboten"]
  },
  "Q3_Ü65_Sonstiges": {
    id: "Q3_Ü65_Sonstiges",
    question: "Was steht für dich aktuell im Vordergrund?",
    options: ["Gesundheit", "Soziale Teilhabe und Vernetzung", "Finanzielle Beratung", "Unterstützung in deiner besonderen Lebenslage"]
  },

  // Additional questions for all paths
  "Q4_U18_Schule_Ja": {
    id: "Q4_U18_Schule_Ja",
    question: "Suchst du Unterstützung in der Schule (Nachhilfe, Beratung, etc.)",
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
    question: "Suchst du Unterstützung in der Schule (Nachhilfe, Beratung, etc.)",
    options: ["Ja", "Nein"]
  },
  "Q4_18_24_Schule_Nein": {
    id: "Q4_18_24_Schule_Nein",
    question: "Suchst du Unterstützung in der Schule (Nachhilfe, Beratung, etc.)",
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
  "Q4_25_64_Studium_Anfänger:in": {
    id: "Q4_25_64_Studium_Anfänger:in",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: [
      "Studienorganisation",
      "Praktische Erfahrungen",
      "Vernetzung mit anderen Studierenden",
      "Förderangebote und Stipendien"
    ]
  },
  "Q4_25_64_Studium_Mittendrin": {
    id: "Q4_25_64_Studium_Mittendrin",
    question: "In welchem Bereich möchtest du dich aktuell weiterentwickeln?",
    options: [
      "Studienorganisation",
      "Praktische Erfahrungen",
      "Vernetzung mit anderen Studierenden",
      "Förderangebote und Stipendien"
    ]
  },
  "Q4_25_64_Studium_Abschluss": {
    id: "Q4_25_64_Studium_Abschluss",
    question: "Wobei möchtest du in deiner Abschlussphase unterstützt werden?",
    options: [
      "Unterstützung bei der Abschlussarbeit",
      "Vorbereitung auf den Berufseinstieg",
      "Orientierung für den nächsten Schritt",
      "Persönliche Entwicklung"
    ]
  },
  "Q4_25_64_Arbeiten_Voll": {
    id: "Q4_25_64_Arbeiten_Voll",
    question: "In welchem Bereich suchst du nach öffentlichen Leistungen?",
    options: [
      "Weiterbildung im aktuellen Beruf",
      "Umschulung für einen neuen Bereich",
      "Aufstieg/Führungsposition",
      "Gründung oder Selbstständigkeit"
    ]
  },
  "Q4_25_64_Arbeiten_Teil": {
    id: "Q4_25_64_Arbeiten_Teil",
    question: "Was ist dir für deine berufliche Situation derzeit am wichtigsten?",
    options: [
      "Arbeitszeit erhöhen",
      "Berufliche Weiterbildung",
      "Wechsel in Vollzeitbeschäftigung",
      "Vereinbarkeit von Arbeit und Familie verbessern"
    ]
  },
  "Q4_25_64_Arbeiten_Selbst": {
    id: "Q4_25_64_Arbeiten_Selbst",
    question: "Was ist dir für deine berufliche Situation derzeit am wichtigsten?",
    options: [
      "Fachliche Weiterbildung",
      "Unternehmensfinanzierung",
      "Geschäftsausbau (Netzwerke, Wachstum)",
      "Vereinbarkeit mit anderen Lebensbereichen"
    ]
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
		
  "Q5_25_64_Arbeiten_Voll_Umschulung": {
    id: "Q5_25_64_Arbeiten_Voll_Umschulung",
    question: "In welchem Bereich möchtest du dich weiterentwickeln?",
    options: ["Soziales", "Technik", "IT", "Pflege"]
  },
  "Q5_25_64_Arbeiten_Teil_Wechsel": {
    id: "Q5_25_64_Arbeiten_Teil_Wechsel",
    question: "Was ist dir wichtig?",
    options: ["Neuer Job", "Weiterentwicklung im aktuellen Betrieb"]
  },
  "Q5_25_64_Arbeiten_Selbstständig_Finanzen": {
    id: "Q5_25_64_Arbeiten_Selbstständig_Finanzen",
    question: "Wie möchtest du dein Unternehmen finanziell stärken?",
    options: ["Zuschüsse", "Kredite", "Investorenkontakte"]
  },
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
