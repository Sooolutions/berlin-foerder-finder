/**
 * Testpersonen für die Trefferqualität.
 *
 * Jede Person beschreibt eine Lebenslage unabhängig vom Fragebogen. Ein
 * Übersetzer (scripts/personas/answers.ts) macht daraus die
 * Antworten, die diese Person im jeweiligen Fragebogen geben würde. So lässt
 * sich messen, ob ein Umbau die Treffer verbessert.
 *
 * erwartet: Angebote, die unter den ersten zehn Treffern stehen sollten.
 * Ein Muster passt auf den Titel, bei Bezirksvarianten genügt eine davon.
 * Die Erwartung gilt fachlich, nicht für den aktuellen Fragebogen: Ein
 * Angebot kann erwartet sein, obwohl der heutige Fragebogen die nötige Angabe
 * gar nicht erfragt (etwa Schwangerschaft oder Kinder).
 * nichtErwartet: Angebote, die in den ersten zehn nichts zu suchen haben.
 *
 * ENTWURF November 2026: Die Erwartungen sind aus dem Bestand abgeleitet und
 * sollten von Fachkräften geprüft und ergänzt werden.
 */

export type Alter = "U18" | "18-24" | "25-34" | "35-49" | "50-64" | "65plus";
export type Haushalt = "Partner" | "Kinder_U6" | "Kinder_6_17" | "Schwanger";
export type Leistung =
  | "Bürgergeld" | "Arbeitslosengeld" | "Wohngeld" | "BAföG" | "BAB"
  | "Kindergeld" | "Kinderzuschlag" | "Rente" | "Grundsicherung" | "AsylbLG";

export interface PersonaProfil {
  alter: Alter;
  staatsangehoerigkeit: "Deutsch" | "EU" | "Ukrainisch" | "Türkisch" | "Syrisch" | "Drittstaat";
  /** Oberbegriffe, höchstens zwei, wichtigste zuerst */
  taetigkeiten: string[];
  /** Detail-Tags zur Tätigkeit, z. B. Studium_Finanzen */
  bedarfe: string[];
  haushalt: Haushalt[];
  /** Miete, Eigentum, WG, Wohnheim, Wohnen_Familie, Betreuung, Heim, Prekär */
  wohnen: string;
  /** Detail bei fehlendem Wohnsitz, z. B. Ohne_Öffentlich */
  ohne?: string;
  einkommen: "Finanzen_regelmäßig-gut" | "Finanzen_regelmäßig-knapp" | "Finanzen_Ersparnisse" | "Finanzen_Prekär" | "Finanzen_Behörde";
  /** Leistungen, die bereits bezogen werden */
  leistungen: Leistung[];
  /** Arten der Beeinträchtigung, leer heißt keine */
  gesundheit: string[];
  gesundheitBedarfe: string[];
  herausforderungen: string[];
  wuensche: string[];
}

export interface Erwartung {
  label: string;
  muster: RegExp;
}

export interface Persona {
  id: string;
  name: string;
  beschreibung: string;
  profil: PersonaProfil;
  erwartet: Erwartung[];
  nichtErwartet?: Erwartung[];
}

const e = (label: string, muster: RegExp): Erwartung => ({ label, muster });

const KINDERZUSCHLAG = e("Kinderzuschlag", /^Kinderzuschlag$/i);
const WOHNGELD = e("Wohngeld", /^Wohngeld$|^Wohngeldstelle/i);
const KITA = e("Kita-Gutschein", /Kita-Gutschein/i);
const BUT = e("Bildungs- und Teilhabepaket", /Bildungs- und Teilhabepaket|\(über BuT\)/i);
const INTEGRATIONSKURS = e("Integrationskurs", /Integrationskurs/i);
const PSYCH_STUDIERENDE = e("Psychologische Beratung für Studierende", /Psychologische Beratung für Studierende/i);
const GRUNDSICHERUNG_ALTER = e("Grundsicherung im Alter", /^Grundsicherung im Alter$/i);
const KAELTEHILFE = e("Kältehilfe", /Kältehilfe/i);

export const PERSONAS: Persona[] = [
  {
    id: "studentin",
    name: "Studentin, 21, WG, knapp bei Kasse",
    beschreibung: "Studiert im dritten Semester, bezieht noch kein BAföG, Prüfungsstress.",
    profil: {
      alter: "18-24", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Studium"],
      bedarfe: ["Studium_Finanzen", "Studium_Psyche"], haushalt: [], wohnen: "WG",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Finanzen", "Herausforderung_Psyche"], wuensche: ["Wunsch_Sozial"],
    },
    erwartet: [e("BAföG für Studierende", /^BAföG für Studierende$|BAföG-Amt des Studierendenwerks/i), PSYCH_STUDIERENDE],
    nichtErwartet: [GRUNDSICHERUNG_ALTER, KAELTEHILFE],
  },
  {
    id: "alleinerziehend",
    name: "Alleinerziehende Mutter, 31, Teilzeit, Kind unter 6",
    beschreibung: "Arbeitet 25 Stunden, Geld reicht kaum, bezieht nur Kindergeld.",
    profil: {
      alter: "25-34", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Arbeiten"],
      bedarfe: ["Arbeiten_Vereinbarkeit", "Arbeiten_Vergütung"], haushalt: ["Kinder_U6"], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Kindergeld"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Vereinbarkeit", "Herausforderung_Finanzen"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [KINDERZUSCHLAG, WOHNGELD, e("Unterhaltsvorschuss", /Unterhaltsvorschuss/i), KITA, e("Netzwerk Alleinerziehende", /Alleinerziehend/i)],
  },
  {
    id: "syrer-familie",
    name: "Syrer, 41, arbeitssuchend, Familie mit Schulkindern",
    beschreibung: "Seit drei Jahren in Berlin, Bürgergeld, Berufsabschluss aus Syrien nicht anerkannt.",
    profil: {
      alter: "35-49", staatsangehoerigkeit: "Syrisch", taetigkeiten: ["Arbeitssuchend"],
      bedarfe: ["Arbeitssuche_Beratung", "Arbeitssuche_Qualifizierung"], haushalt: ["Partner", "Kinder_6_17"], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Bürgergeld", "Kindergeld"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Deutschland", "Herausforderung_Bürokratie"], wuensche: ["Wunsch_Lernen"],
    },
    erwartet: [INTEGRATIONSKURS, e("Migrationsberatung", /Migrationsberatung/i), e("Anerkennung ausländischer Abschlüsse", /Anerkennung ausländischer/i), BUT],
  },
  {
    id: "rentnerin",
    name: "Rentnerin, 74, allein, kleine Rente",
    beschreibung: "Mietwohnung, Rente reicht kaum, seit dem Tod des Mannes viel allein.",
    profil: {
      alter: "65plus", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Rente"],
      bedarfe: ["Rente_Sozial", "Rente_Finanzen"], haushalt: [], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Rente"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Einsam", "Herausforderung_Finanzen"], wuensche: ["Wunsch_Sozial"],
    },
    erwartet: [GRUNDSICHERUNG_ALTER, WOHNGELD, e("Besuchsdienst", /Besuchsdienst/i), e("Grundrentenzuschlag", /Grundrentenzuschlag/i)],
  },
  {
    id: "schueler",
    name: "Schüler, 13, Lernschwierigkeiten, Familie mit wenig Geld",
    beschreibung: "Lebt bei den Eltern, Noten in Mathe und Deutsch kritisch.",
    profil: {
      alter: "U18", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Schule"],
      bedarfe: ["Schule_Lernschwierigkeit"], haushalt: [], wohnen: "Wohnen_Familie",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Kindergeld"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Schule"], wuensche: ["Wunsch_Lernen"],
    },
    erwartet: [e("Lernförderung über BuT", /Lernförderung/i), e("Kostenlose Nachhilfe", /Nachhilfe/i), BUT],
  },
  {
    id: "pflegende-tochter",
    name: "Pflegende Tochter, 56, Vollzeit, Mutter mit Pflegegrad",
    beschreibung: "Arbeitet Vollzeit und pflegt die Mutter, kommt finanziell zurecht.",
    profil: {
      alter: "50-64", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Arbeiten", "Pflege"],
      bedarfe: ["Pflege_Vereinbarkeit", "Pflege_Informationen", "Arbeiten_Gesundheit"], haushalt: [], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-gut", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Pflege", "Herausforderung_Psyche"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [e("Pflegeberatung (Stützpunkt oder Pflegetelefon)", /Pflegestützpunkt|Pflegetelefon/i), e("Pflegezeit und Familienpflegezeit", /Familienpflegezeit/i), e("Fachstelle pflegende Angehörige", /pflegende Angehörige/i)],
    nichtErwartet: [GRUNDSICHERUNG_ALTER, KAELTEHILFE],
  },
  {
    id: "wohnungslos",
    name: "Wohnungsloser Mann, 44, schläft draußen",
    beschreibung: "Seit zwei Monaten ohne Wohnung, kein Einkommen, keine Leistungen.",
    profil: {
      alter: "35-49", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Arbeitssuchend"],
      bedarfe: ["Arbeitssuche_Beratung"], haushalt: [], wohnen: "Prekär", ohne: "Ohne_Öffentlich",
      einkommen: "Finanzen_Prekär", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Finanzen", "Herausforderung_Bürokratie"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [KAELTEHILFE, e("Bahnhofsmission", /Bahnhofsmission/i), e("Notübernachtung", /Notübernachtung/i), e("Soziale Wohnhilfe", /Soziale Wohnhilfe/i), e("Bürgergeld", /^Bürgergeld$/i)],
  },
  {
    id: "student-psychisch",
    name: "Student, 27, Depression, BAföG",
    beschreibung: "Masterstudium, diagnostizierte Depression, sucht Therapieplatz, Geld knapp.",
    profil: {
      alter: "25-34", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Studium"],
      bedarfe: ["Studium_Psyche", "Studium_Finanzen"], haushalt: [], wohnen: "WG",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["BAföG"], gesundheit: ["Beeinträchtigung_Psychisch"],
      gesundheitBedarfe: ["Gesundheit_Anbindung", "Gesundheit_Unterstützung"],
      herausforderungen: ["Herausforderung_Finanzen"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [PSYCH_STUDIERENDE, e("Therapieplatzsuche", /116117|Therapieplatzsuche/i), e("Sozialpsychiatrischer Dienst", /Sozialpsychiatrischer Dienst/i), e("Berliner Krisendienst", /Krisendienst/i)],
  },
  {
    id: "ukrainerin",
    name: "Ukrainerin, 29, Kleinkind, neu in Berlin",
    beschreibung: "Seit einem Jahr in Berlin, betreut ihr Kind zu Hause, Bürgergeld, will Deutsch lernen.",
    profil: {
      alter: "25-34", staatsangehoerigkeit: "Ukrainisch", taetigkeiten: ["Familie"],
      bedarfe: ["Familie_Angebote", "Familie_Finanzierung"], haushalt: ["Kinder_U6"], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Bürgergeld", "Kindergeld"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Deutschland", "Herausforderung_Kinder"], wuensche: ["Wunsch_Lernen"],
    },
    erwartet: [e("Anlaufstelle für Ukrainer:innen", /Ukrain/i), INTEGRATIONSKURS, KITA],
  },
  {
    id: "gruenderin",
    name: "Gründerin, 30, Businessplan in Arbeit",
    beschreibung: "Lebt von Ersparnissen, will ein Unternehmen gründen und sucht Finanzierung.",
    profil: {
      alter: "25-34", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Gründung"],
      bedarfe: ["Gründung_Finanzierung", "Gründung_Beratung", "Gründung_Businessplan"], haushalt: [], wohnen: "Miete",
      einkommen: "Finanzen_Ersparnisse", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Bürokratie"], wuensche: ["Wunsch_Gründung"],
    },
    erwartet: [e("Berliner Startup Stipendium", /Startup Stipendium/i), e("Vorgründungscoaching", /Vorgründungscoaching/i), e("Existenzgründerdarlehen", /Existenzgründerdarlehen|GründungsBONUS/i)],
    nichtErwartet: [GRUNDSICHERUNG_ALTER, KAELTEHILFE],
  },
  {
    id: "azubi",
    name: "Auszubildender, 19, erste eigene Wohnung",
    beschreibung: "Ausbildung zum Elektriker, Ausbildungsvergütung reicht nicht für die Miete.",
    profil: {
      alter: "18-24", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Ausbildung"],
      bedarfe: ["Ausbildung_Finanzen"], haushalt: [], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Finanzen"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [e("Berufsausbildungsbeihilfe", /Berufsausbildungsbeihilfe/i), e("Wohngeld für Auszubildende", /Wohngeld für Auszubildende/i), e("Azubiwohnen", /Azubiwohnen/i)],
  },
  {
    id: "erwerbsgemindert",
    name: "Erwerbsgeminderter Mann, 57, chronisch krank",
    beschreibung: "Kann nach schwerer Erkrankung nicht mehr arbeiten, Antrag auf Erwerbsminderungsrente offen.",
    profil: {
      alter: "50-64", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Erwerbsunfähig"],
      bedarfe: ["Erwerbsunfähig_Finanzen", "Erwerbsunfähig_Behörden"], haushalt: ["Partner"], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: [], gesundheit: ["Beeinträchtigung_Chronisch"],
      gesundheitBedarfe: ["Gesundheit_Umgang"], herausforderungen: ["Herausforderung_Bürokratie", "Herausforderung_Finanzen"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [e("Erwerbsminderungsrente", /Erwerbsminderungsrente/i), e("Grundsicherung bei Erwerbsminderung", /Grundsicherung bei Erwerbsminderung/i), e("Teilhabeberatung EUTB", /EUTB/i)],
  },
  {
    id: "familie-drei-kinder",
    name: "Vater, 38, drei Kinder, Alleinverdiener",
    beschreibung: "Paar mit drei Kindern, ein Gehalt, Kosten steigen schneller als der Lohn.",
    profil: {
      alter: "35-49", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Arbeiten"],
      bedarfe: ["Arbeiten_Vergütung"], haushalt: ["Partner", "Kinder_U6", "Kinder_6_17"], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Kindergeld"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Finanzen", "Herausforderung_Vereinbarkeit"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [KINDERZUSCHLAG, WOHNGELD, BUT, KITA],
  },
  {
    id: "jugendliche-wohngruppe",
    name: "Jugendliche, 17, Wohngruppe, beginnt Ausbildung",
    beschreibung: "Lebt in einer Wohngruppe der Jugendhilfe und zieht bald aus.",
    profil: {
      alter: "U18", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Ausbildung"],
      bedarfe: ["Ausbildung_Finanzen", "Ausbildung_Perspektive"], haushalt: [], wohnen: "Betreuung",
      einkommen: "Finanzen_Behörde", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Psyche"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [e("Careleaver", /Careleaver/i), e("Berufsausbildungsbeihilfe", /Berufsausbildungsbeihilfe/i), e("Azubiwohnen", /Azubiwohnen/i)],
  },
  {
    id: "schwangere",
    name: "Schwangere, 20, wohnt bei den Eltern, ohne Ausbildung",
    beschreibung: "Ungeplant schwanger, kein eigenes Einkommen, weiß nicht, wie es weitergeht.",
    profil: {
      alter: "18-24", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Übergang"],
      bedarfe: ["Übergang_Finanzen", "Übergang_Beratung"], haushalt: ["Schwanger"], wohnen: "Wohnen_Familie",
      einkommen: "Finanzen_Prekär", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Finanzen", "Herausforderung_Orientierung"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [e("Bundesstiftung Mutter und Kind", /Bundesstiftung Mutter und Kind/i), e("Schwangerschaftsberatung", /Schwangerschaftsberatung/i), e("Elterngeld", /^Elterngeld$|Elterngeldstelle/i)],
  },
  {
    id: "rentner-ehrenamt",
    name: "Rentner, 68, Eigentum, sucht Aufgabe",
    beschreibung: "Finanziell abgesichert, lebt mit Partnerin im eigenen Haus, möchte sich engagieren.",
    profil: {
      alter: "65plus", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Rente"],
      bedarfe: ["Rente_Ehrenamt", "Rente_Weiterentwicklung"], haushalt: ["Partner"], wohnen: "Eigentum",
      einkommen: "Finanzen_regelmäßig-gut", leistungen: ["Rente"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: [], wuensche: ["Wunsch_Ehrenamt", "Wunsch_Lernen"],
    },
    erwartet: [e("Ehrenamtsvermittlung", /Ehrenamt finden|Bundesfreiwilligendienst/i), e("Bildungsangebote für Senior:innen", /Bildungsangebote für Senior|Volkshochschule/i)],
    nichtErwartet: [GRUNDSICHERUNG_ALTER, WOHNGELD, KAELTEHILFE, e("Schuldnerberatung", /Schuldner/i)],
  },
  {
    id: "arbeitslos-alg1",
    name: "Arbeitssuchende, 33, ALG I, will sich weiterbilden",
    beschreibung: "Nach Kündigung arbeitslos, bezieht Arbeitslosengeld, lebt mit Partner.",
    profil: {
      alter: "25-34", staatsangehoerigkeit: "Deutsch", taetigkeiten: ["Arbeitssuchend"],
      bedarfe: ["Arbeitssuche_Bewerbung", "Arbeitssuche_Qualifizierung"], haushalt: ["Partner"], wohnen: "Miete",
      einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Arbeitslosengeld"], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Bürokratie"], wuensche: ["Wunsch_Lernen"],
    },
    // Arbeitslosengeld I bezieht sie schon, es gehört deshalb nicht nach vorn (geändert in Phase 3)
    erwartet: [e("Bildungsgutschein", /Bildungsgutschein/i), e("Bewerbungstraining", /Bewerbungstraining/i), e("Weiterbildungsprämie", /Weiterbildungsprämie/i)],
    nichtErwartet: [KAELTEHILFE, GRUNDSICHERUNG_ALTER, e("Arbeitslosengeld I (bezieht sie schon)", /Arbeitslosengeld I\b/i), e("Jobcenter (zuständig für Bürgergeld)", /^Jobcenter Berlin/i)],
  },
  {
    id: "kleinstselbststaendiger",
    name: "Kleinstselbstständiger, 52, Einnahmen eingebrochen",
    beschreibung: "Betreibt einen kleinen Laden, Umsatz stark gesunken, Schulden beim Finanzamt.",
    profil: {
      alter: "50-64", staatsangehoerigkeit: "Türkisch", taetigkeiten: ["Selbstständig"],
      bedarfe: ["Selbstständig_Finanzierung", "Selbstständig_RechtSteuern"], haushalt: ["Partner"], wohnen: "Miete",
      einkommen: "Finanzen_Prekär", leistungen: [], gesundheit: [], gesundheitBedarfe: [],
      herausforderungen: ["Herausforderung_Finanzen", "Herausforderung_Bürokratie"], wuensche: ["Wunsch_Beratung"],
    },
    erwartet: [e("Beratung für Kleinstselbstständige", /Kleinstselbstständige/i), e("Beratung für Selbstständige (ver.di, COMPETENZentrum)", /für Selbstständige bei ver\.di|COMPETENZentrum für Selbständige/i)],
  },
];
