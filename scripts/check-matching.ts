/**
 * Prüft die Filter- und Ranking-Logik der Ergebnisseite an festen Beispielen.
 *   npx tsx scripts/check-matching.ts
 *
 * Jeder Fall beschreibt eine Antwortkombination und erwartete Ein- oder
 * Ausschlüsse. Die Beispielangebote sind künstlich, bilden aber typische
 * Tag-Muster aus der Tabelle funding nach.
 */
import { buildReasonGroups, diversify, rankFundings } from "../src/utils/answerMappingUtils";

type F = { id: string; title: string; tags: string[]; min_age?: number | null; max_age?: number | null; district?: string[] | null; benefit_type?: string | null; requires_benefits?: string[] | null };
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

offers.push(
  { id: "schwangerschaft", title: "Schwangerschaftsberatung", tags: [...ADULT, "Familie", "Familie_Angebote", "Haushalt_Schwanger"] },
  { id: "alleinerziehend-netz", title: "Netzwerk Alleinerziehende", tags: [...ADULT, "Familie", "Haushalt_Alleinerziehend"] },
  { id: "schulden", title: "Schuldnerberatung", tags: [...ADULT, "Herausforderung_Finanzen"] },
);

// Leistungen (Phase 3): Angebote, die selbst eine Leistung sind oder eine voraussetzen
offers.push(
  { id: "kiz", title: "Kinderzuschlag", tags: [...ADULT, "Arbeiten", "Familie", "Finanzen_Sozialleistung"], benefit_type: "Leistung_Kinderzuschlag" },
  { id: "wohngeld", title: "Wohngeld", tags: [...ADULT, "Arbeiten", "Rente", "Finanzen_Sozialleistung", "Herausforderung_Finanzen"], benefit_type: "Leistung_Wohngeld" },
  { id: "lastenzuschuss", title: "Wohngeld als Lastenzuschuss", tags: [...ADULT, "Eigentum", "Finanzen_Sozialleistung"], benefit_type: "Leistung_Wohngeld" },
  { id: "but", title: "Bildungs- und Teilhabepaket", tags: [...ALL_AGES, "Schule", "Schule_Material"], requires_benefits: ["Leistung_Bürgergeld", "Leistung_Wohngeld", "Leistung_Kinderzuschlag"] },
  { id: "kaeltehilfe", title: "Kältehilfe", tags: [...ADULT, "Prekär", "Ohne_Öffentlich", "Ohne_Not"] },
  { id: "wohnhilfe", title: "Ambulante Wohnhilfe", tags: [...ADULT, "Prekär", "Arbeitssuchend", "Arbeitssuche_Beratung", "Herausforderung_Bürokratie"] },
  { id: "nur-pflege", title: "Pflegekurs", tags: [...ADULT, "Pflege", "Pflege_Informationen"] },
  { id: "nur-arbeit", title: "Arbeitsrechtsberatung", tags: [...ADULT, "Arbeiten", "Arbeiten_Arbeitsklima"] },
);

// Häufige Tags im Bestand nachbilden, damit Seltenheit greift
for (let i = 0; i < 40; i++) offers.push({ id: `fueller-${i}`, title: `Füller ${i}`, tags: ["Wunsch_Sozial", "Finanzen_Sozialleistung", "Familie"] });

// Antworten im Fragebogen seit Phase 2 des Umbaus (Frage-ids aus questionnaireData.ts)
const student = {
  alter: "18-24", taetigkeit: ["Studium"], taetigkeit_bedarf: ["Studium_Finanzen", "Studium_Psyche"],
  haushalt: ["Haushalt_Erwachsene"], wohnen: "Wohnen_Familie", einkommen: "Finanzen_regelmäßig-knapp",
  leistungen: ["Leistung_BAföG"], gesundheit: ["Beeinträchtigung_Nein"],
  herausforderungen: ["Herausforderung_Psyche"], wuensche: ["Wunsch_Sozial"],
};
const syrer = {
  alter: "25-34", taetigkeit: ["Arbeitssuchend"], taetigkeit_bedarf: ["Arbeitssuche_Beratung"],
  haushalt: ["Haushalt_Partner", "Haushalt_Kinder_6_17"], wohnen: "Miete", einkommen: "KeineAngabe",
  leistungen: ["Leistung_Bürgergeld"], gesundheit: ["Beeinträchtigung_Nein"],
  herausforderungen: ["Herausforderung_Deutschland", "Herausforderung_Kinder"], staatsangehoerigkeit: "Syrisch", wuensche: ["Wunsch_Lernen"],
};
const schuelerStark = {
  alter: "U18", taetigkeit: ["Schule"], taetigkeit_bedarf: ["Schule_Lernschwierigkeit"],
  wohnen_u18: "Wohnen_Familie", einkommen_familie: "Finanzen_regelmäßig-knapp", leistungen_familie: ["Leistung_Keine"],
  gesundheit: ["Beeinträchtigung_Körperlich"], gesundheit_bedarf: ["Gesundheit_Unterstützung"],
  herausforderungen: ["Nichts"], wuensche: ["Wunsch_Lernen"],
};
const rentnerin = {
  alter: "65plus", taetigkeit: ["Rente"], taetigkeit_bedarf: ["Rente_Sozial"], haushalt: ["Haushalt_Allein"],
  wohnen: "Miete", einkommen: "Finanzen_regelmäßig-gut", leistungen: ["Leistung_Rente"], gesundheit: ["Beeinträchtigung_Nein"],
  herausforderungen: ["Herausforderung_Einsam"], wuensche: ["Wunsch_Sozial"],
};
const leer = { alter: "18-24", taetigkeit: ["Sonstiges"], gesundheit: ["Beeinträchtigung_Nein"] };
const schwangere = {
  alter: "18-24", taetigkeit: ["Übergang"], taetigkeit_bedarf: ["Übergang_Beratung"], haushalt: ["Haushalt_Schwanger"],
  wohnen: "Wohnen_Familie", einkommen: "Finanzen_Prekär", leistungen: ["Leistung_Keine"], gesundheit: ["Beeinträchtigung_Nein"],
  herausforderungen: ["Nichts"], wuensche: [],
};
const alleinerziehend = {
  alter: "25-34", taetigkeit: ["Arbeiten"], taetigkeit_bedarf: ["Arbeiten_Vereinbarkeit"], haushalt: ["Haushalt_Kinder_U6"],
  familie_bedarf: ["Familie_Finanzierung"], wohnen: "Miete", einkommen: "Finanzen_regelmäßig-knapp", leistungen: ["Leistung_Keine"],
  gesundheit: ["Beeinträchtigung_Nein"], herausforderungen: ["Herausforderung_Kinder"], wuensche: [],
};
const paarMitKind = { ...alleinerziehend, haushalt: ["Haushalt_Partner", "Haushalt_Kinder_U6"] };

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

// Schüler mit körperlicher Beeinträchtigung
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

// Ableitungen aus Antwortkombinationen (src/questionnaire/derive.ts)
expectIn("Studentin", s, "schulden");               // knappes Einkommen bedeutet finanzielle Belastung
const sw = ids(schwangere);
expectIn("Schwangere", sw, "schwangerschaft");      // Schwangerschaft öffnet Familienangebote trotz anderer Tätigkeit
const ae = ids(alleinerziehend);
expectIn("Alleinerziehend", ae, "alleinerziehend-netz"); // Kinder ohne Partner ergeben „alleinerziehend“
expectOut("Paar mit Kind", ids(paarMitKind), "alleinerziehend-netz");

// Herkunft: ohne „Ankommen in Deutschland“ keine migrationsspezifischen Angebote
expectOut("Rentnerin", r, "integration");

// Leistungslogik (src/questionnaire/benefits.ts)
const reasonOf = (answers: Record<string, string | string[]>, id: string) =>
  (rankFundings(offers, answers).find((f) => f.id === id) as { benefitReason?: string } | undefined)?.benefitReason;
if (reasonOf(alleinerziehend, "kiz") !== "zusaetzlich") errors.push("Alleinerziehend: Kinderzuschlag sollte als zusätzliche Leistung gelten");
if (reasonOf(alleinerziehend, "wohngeld") !== "zusaetzlich") errors.push("Alleinerziehend: Wohngeld sollte als zusätzliche Leistung gelten");
expectOut("Alleinerziehend", ae, "lastenzuschuss");   // Lastenzuschuss nur für Eigentum, sie wohnt zur Miete
const aeGroups = buildReasonGroups(rankFundings(offers, alleinerziehend), alleinerziehend);
if (aeGroups[0]?.key !== "hint:zusaetzlich" || !aeGroups[0].fundings.some((f) => f.id === "kiz")) errors.push("Alleinerziehend: Zeile „vielleicht zusätzlich“ fehlt oder steht nicht vorn");
const buerger = { ...alleinerziehend, leistungen: ["Leistung_Bürgergeld"] };
if (reasonOf(buerger, "kiz") !== "ausgeschlossen") errors.push("Bürgergeld: Kinderzuschlag sollte als ausgeschlossen gelten");
const wohngeldBezug = { ...alleinerziehend, leistungen: ["Leistung_Wohngeld"] };
if (reasonOf(wohngeldBezug, "wohngeld") !== "bekommst") errors.push("Wohngeld im Bezug sollte herabgestuft werden");
const syrerMitSchulkind = { ...syrer, taetigkeit: ["Arbeitssuchend"] };
if (reasonOf(syrerMitSchulkind, "but") !== "voraussetzung") errors.push("Syrer: Bildungs- und Teilhabepaket sollte über Bürgergeld passen");
expectIn("Syrer", ids(syrerMitSchulkind), "but");     // trotz anderer Tätigkeit (Schule)

// Akute Wohnungslosigkeit: Notangebote vorn, das passendste zuerst
const obdachlos = {
  alter: "35-49", taetigkeit: ["Arbeitssuchend"], taetigkeit_bedarf: ["Arbeitssuche_Beratung"], haushalt: ["Haushalt_Allein"],
  wohnen: "Prekär", wohnen_ohne: "Ohne_Öffentlich", einkommen: "Finanzen_Prekär", leistungen: ["Leistung_Keine"],
  gesundheit: ["Beeinträchtigung_Nein"], herausforderungen: ["Herausforderung_Bürokratie"], wuensche: [],
};
const o = ids(obdachlos);
if (o[0] !== "kaeltehilfe") errors.push(`Obdachlos: Kältehilfe sollte zuerst stehen, Reihenfolge ${o.slice(0, 4).join(", ")}`);
expectBefore("Obdachlos", o, "wohnhilfe", "jobcenter");

// Zwei Tätigkeiten sind Alternativen: Ein Angebot für nur eine davon verliert nichts
const zwei = { ...student, alter: "35-49", taetigkeit: ["Arbeiten", "Pflege"], taetigkeit_bedarf: ["Pflege_Informationen", "Arbeiten_Arbeitsklima"] };
const scores = new Map(rankFundings(offers, zwei).map((f) => [f.id, f.relevanceScore ?? 0]));
const sp = scores.get("nur-pflege") ?? 0, sa = scores.get("nur-arbeit") ?? 0;
if (!sp || !sa || Math.abs(sp - sa) > 5) errors.push(`Zwei Tätigkeiten: Pflege ${sp} und Arbeit ${sa} sollten ähnlich zählen`);

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
