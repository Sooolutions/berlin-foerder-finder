/**
 * Prüft die Filter- und Ranking-Logik der Ergebnisseite an festen Beispielen.
 *   npx tsx scripts/check-matching.ts
 *
 * Jeder Fall beschreibt eine Antwortkombination und erwartete Ein- oder
 * Ausschlüsse. Die Beispielangebote sind künstlich, bilden aber typische
 * Tag-Muster aus der Tabelle funding nach.
 */
import { buildReasonGroups, diversify, rankFundings } from "../src/utils/answerMappingUtils";

type F = { id: string; title: string; tags: string[]; min_age?: number | null; max_age?: number | null; district?: string[] | null };
const ALL_AGES = ["U18", "18-24", "25-34", "35-49", "50-64", "65plus"];
const ADULT = ["18-24", "25-34", "35-49", "50-64", "65plus"];

const offers: F[] = [
  { id: "bafoeg", title: "BAföG-Beratung", tags: ["18-24", "25-34", "35-49", "Studium", "Studium_Finanzen", "Finanzen_Sozialleistung"] },
  { id: "stud-austausch", title: "Buddyprogramm Hochschule", tags: ["18-24", "25-34", "Studium", "Studium_Austausch", "Wunsch_Sozial"] },
  { id: "stud-psyche", title: "Psychologische Beratung Studierendenwerk", tags: ["18-24", "25-34", "Studium", "Studium_Psyche", "Herausforderung_Psyche"] },
  { id: "senioren-einsam", title: "Besuchsdienst Senioren", tags: ["65plus", "Rente", "Rente_Sozial", "Herausforderung_Einsam", "Wunsch_Sozial"] },
  { id: "rente-alle", title: "Seniorentreff offen für alle", tags: [...ALL_AGES, "Rente", "Rente_Sozial", "Herausforderung_Einsam", "Wunsch_Sozial"] },
  { id: "jobcenter", title: "Jobcenter Leistungen", tags: [...ADULT, "Arbeitssuchend", "Arbeitssuche_Beratung", "Finanzen_Sozialleistung"] },
  { id: "integration", title: "Integrationskurs", tags: [...ADULT, "Drittstaat", "Syrisch", "Ukrainisch", "Herausforderung_Deutschland", "Wunsch_Lernen"] },
  { id: "mehrsprachig", title: "Mieterberatung mehrsprachig", tags: [...ADULT, "Drittstaat", "Miete", "WG", "Wunsch_Beratung"] },
  { id: "wohnheim", title: "Studentenwohnheim", tags: ["18-24", "25-34", "Studium", "Wohnheim", "WG"] },
  { id: "eigentum", title: "Eigenheimförderung", tags: ["25-34", "35-49", "Eigentum", "Familie_Finanzierung"] },
  { id: "eltern", title: "Familienzentrum", tags: [...ADULT, "Familie", "Familie_Angebote", "Herausforderung_Kinder"] },
  { id: "inklusion-koerper", title: "Mobilitätshilfe", tags: [...ALL_AGES, "Beeinträchtigung_Körperlich", "Gesundheit_Unterstützung"] },
  { id: "schule-nachhilfe", title: "Kostenlose Nachhilfe", tags: ["U18", "Schule", "Schule_Lernschwierigkeit", "Herausforderung_Schule"] },
  { id: "allg-beratung", title: "Allgemeine Sozialberatung", tags: [...ALL_AGES, "Wunsch_Beratung", "Herausforderung_Bürokratie"] },
  { id: "senioren-beratung", title: "Seniorenberatung", tags: ["65plus", "Wunsch_Beratung"] },
  { id: "amt-mitte", title: "Amt für Soziales Mitte", tags: [...ADULT, "Finanzen_Sozialleistung", "Studium"], district: ["Mitte"] },
  { id: "amt-pankow", title: "Amt für Soziales Pankow", tags: [...ADULT, "Finanzen_Sozialleistung", "Studium"], district: ["Pankow"] },
  { id: "minmax", title: "Jugendprogramm bis 25", tags: ["Studium", "Studium_Finanzen"], min_age: 14, max_age: 25 },
];

// Häufige Tags im Bestand nachbilden, damit Seltenheit greift
for (let i = 0; i < 40; i++) offers.push({ id: `fueller-${i}`, title: `Füller ${i}`, tags: ["Wunsch_Sozial", "Finanzen_Sozialleistung", "Familie"] });

const student = {
  Q1: "18-24", "Q2_18-24": "Deutsch", "Q3_18-24": "Studium",
  "Q4_18-24_Studium": ["Studium_Finanzen", "Studium_Psyche"],
  "Q5_18-24": "Wohnen_Familie", "Q6_18-24": "Finanzen_Sozialleistung", "Q8_18-24": "Beeinträchtigung_Nein",
  "Q9_18-24_Nein": ["Herausforderung_Psyche"], "Q10_18-24": ["Wunsch_Sozial"],
};
const syrer = {
  Q1: "25-34", "Q2_18-24": "Syrisch", "Q3_18-24": "Arbeitssuchend", "Q4_18-24_Arbeitssuchend": ["Arbeitssuche_Beratung"],
  "Q5_18-24": "Miete", "Q6_18-24": "Finanzen_Sozialleistung", "Q8_18-24": "Beeinträchtigung_Nein",
  "Q9_18-24_Ausland_Nein": ["Herausforderung_Deutschland", "Herausforderung_Kinder"], "Q10_18-24": ["Wunsch_Lernen"],
};
const schuelerStark = {
  Q1: "U18", Q2_U18: "Deutsch", Q3_U18: "Schule", Q4_U18_Schule: ["Schule_Lernschwierigkeit"],
  Q5_U18: "Wohnen_Familie", Q6_U18_Eltern: "Finanzen_regelmäßig-knapp", Q7_U18: "Beeinträchtigung_Stark",
  Q8_U18_Ja: ["Gesundheit_Unterstützung"], Q9_U18: ["Wunsch_Lernen"],
};
const rentnerin = {
  Q1: "65plus", Q2_65plus: "Deutsch", Q3_65plus: "Rente", Q4_65plus_Rente: ["Rente_Sozial"],
  Q5_65plus: "Miete", Q6_65plus: "Finanzen_regelmäßig-gut", Q8_65plus: "Beeinträchtigung_Nein",
  Q9_65plus_Nein: ["Herausforderung_Einsam"], Q10_65plus: ["Wunsch_Sozial"],
};
const leer = { Q1: "18-24", "Q2_18-24": "Deutsch", "Q3_18-24": "Sonstiges", "Q8_18-24": "Beeinträchtigung_Nein" };

const errors: string[] = [];
const ids = (answers: Record<string, string | string[]>) => rankFundings(offers, answers).map((f) => f.id);
const expectIn = (name: string, list: string[], id: string) => { if (!list.includes(id)) errors.push(`${name}: ${id} fehlt`); };
const expectOut = (name: string, list: string[], id: string) => { if (list.includes(id)) errors.push(`${name}: ${id} darf nicht erscheinen`); };
const expectBefore = (name: string, list: string[], a: string, b: string) => {
  if (list.indexOf(a) < 0 || list.indexOf(b) < 0 || list.indexOf(a) > list.indexOf(b)) errors.push(`${name}: ${a} sollte vor ${b} stehen`);
};

// Studentin, wohnt bei den Eltern, bezieht BAföG
const s = ids(student);
expectIn("Studentin", s, "bafoeg");
expectIn("Studentin", s, "stud-austausch");      // anderes Studiums-Detail ist kein Widerspruch
expectIn("Studentin", s, "wohnheim");            // bei den Eltern wohnend, Wohnheim bleibt sichtbar
expectIn("Studentin", s, "jobcenter");           // andere Tätigkeit, aber Sozialleistung trifft
expectIn("Studentin", s, "minmax");
expectOut("Studentin", s, "senioren-einsam");    // Alters-Tag nur 65plus
expectOut("Studentin", s, "rente-alle");         // Rente ohne konkreten Bedarf
expectOut("Studentin", s, "integration");        // migrationsspezifisch
expectOut("Studentin", s, "eigentum");
expectOut("Studentin", s, "inklusion-koerper");  // keine Beeinträchtigung angegeben
expectBefore("Studentin", s, "stud-psyche", "fueller-0"); // seltener Tag vor häufigem

// Syrer, arbeitssuchend, mit Kindern
const y = ids(syrer);
expectIn("Syrer", y, "integration");
expectIn("Syrer", y, "jobcenter");
expectIn("Syrer", y, "eltern");                  // Kinder als Herausforderung öffnen Familienangebote
expectIn("Syrer", y, "mehrsprachig");

// Schüler mit starker Beeinträchtigung (Fragepfad unter 18 fragt nur die Stärke)
const k = ids(schuelerStark);
expectIn("Schüler", k, "schule-nachhilfe");
expectIn("Schüler", k, "inklusion-koerper");
expectOut("Schüler", k, "bafoeg");
expectOut("Schüler", k, "minmax");               // min_age 14, aber Studium widerspricht Schule

// Rentnerin
const r = ids(rentnerin);
expectIn("Rentnerin", r, "senioren-einsam");
expectIn("Rentnerin", r, "rente-alle");
expectOut("Rentnerin", r, "stud-austausch");
expectOut("Rentnerin", r, "schule-nachhilfe");

// Auffüllung: nur altersgerechte, allgemeine Anlaufstellen
const l = ids(leer);
expectIn("Auffüllung", l, "allg-beratung");
expectOut("Auffüllung", l, "senioren-beratung");

// Vielfalt: zwei Bezirksvarianten stehen nicht direkt hintereinander
const d = diversify([{ title: "Amt für Soziales Mitte" }, { title: "Amt für Soziales Pankow" }, { title: "BAföG-Beratung" }]);
if (d[1].title !== "BAföG-Beratung") errors.push("Vielfalt: Bezirksvariante wurde nicht nach hinten gestellt");

// Zeilen: kein Angebot doppelt
const ranked = rankFundings(offers, student);
const groups = buildReasonGroups(ranked, student);
const placed = groups.flatMap((g) => g.fundings.map((f) => f.id));
if (new Set(placed).size !== placed.length) errors.push("Zeilen: Angebot mehrfach einsortiert");

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("OK: Matching-Beispiele bestanden.");
