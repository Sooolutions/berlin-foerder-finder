/**
 * Prüft, ob alle Oberflächentexte in allen Sprachen übersetzt sind und ob
 * die Platzhalter wie {n} oder {district} in jeder Übersetzung erhalten sind.
 *   npm run check:translations
 *   npm run check:translations -- --json   fehlende Schlüssel (en) als JSON
 *
 * Gesammelt werden:
 *  1. alle Texte in t("…") und tr("…") im Quellcode
 *  2. alle Fragen, Fragevarianten, Antwortlabels und Zwischenüberschriften aus questionnaireData.ts
 *  3. alle Erklärtexte aus questionInfo.ts und die Namen der Abschnitte (flow.ts)
 *  4. Kategorien und Fördertypen aus der Datenbank (CATEGORY_KEYS unten)
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { getAllQuestionnaireTexts } from "../src/data/questionnaireData";
import { ALL_QUESTION_INFO } from "../src/data/questionInfo";
import { SECTIONS } from "../src/questionnaire/flow";
import { HINT_NOTE, HINT_TITLE } from "../src/utils/answerMappingUtils";
import en from "../src/i18n/en";
import tr from "../src/i18n/tr";
import ar from "../src/i18n/ar";
import uk from "../src/i18n/uk";

const DICTS: Record<string, Record<string, string>> = { en, tr, ar, uk };

const CATEGORY_KEYS = [
  "Familie", "Gesundheit", "Soziales", "Bildung", "Arbeit", "Integration", "Wohnen", "Wirtschaft",
  "Kultur", "Sport", "Sonstiges_Orientierung", "Sonstiges_Beratung", "Finanzen_Sozialleistung",
  "staatlich", "karitativ", "privat", "Angebot",
];
const EXTRA_KEYS = [
  "Wusstest du, dass ca. 50% der staatlichen Hilfeleistungen nicht in Anspruch genommen werden?",
  "Jährlich bleiben über 10 Milliarden Euro an Fördergeldern ungenutzt – weil Menschen nicht wissen, dass sie Anspruch haben.",
  "Besonders Familien, Studierende und Geringverdiener verpassen häufig wichtige Unterstützungsangebote.",
];

const files: string[] = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(name)) files.push(p);
  }
};
walk(join(process.cwd(), "src"));

const keys = new Set<string>();
const re = /\b(?:t|tr)\(\s*(["'])((?:\\.|(?!\1).)*)\1/g;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(re)) keys.add(m[2].replace(/\\(["'\\])/g, "$1"));
}
getAllQuestionnaireTexts().forEach((k) => keys.add(k));
SECTIONS.forEach((sec) => keys.add(sec.label));
[HINT_TITLE, HINT_NOTE].forEach((k) => keys.add(k));
ALL_QUESTION_INFO.forEach((k) => keys.add(k));
CATEGORY_KEYS.forEach((k) => keys.add(k));
EXTRA_KEYS.forEach((k) => keys.add(k));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify([...keys].filter((k) => !(k in en)).sort(), null, 1));
  process.exit(0);
}

const placeholders = (t: string) => (t.match(/\{\w+\}/g) ?? []).sort().join(",");
let problems = 0;
for (const [lang, dict] of Object.entries(DICTS)) {
  const missing = [...keys].filter((k) => !(k in dict)).sort();
  const unused = Object.keys(dict).filter((k) => !keys.has(k));
  const broken = Object.entries(dict).filter(([k, v]) => placeholders(k) !== placeholders(v)).map(([k]) => k);
  const empty = Object.entries(dict).filter(([, v]) => !v.trim()).map(([k]) => k);
  console.log(`${lang}: ${keys.size} Texte, ${missing.length} fehlen, ${unused.length} ungenutzt, ${broken.length} mit falschen Platzhaltern, ${empty.length} leer.`);
  missing.forEach((k) => console.log("  fehlt:", k));
  unused.forEach((k) => console.log("  ungenutzt:", k));
  broken.forEach((k) => console.log("  Platzhalter:", k));
  empty.forEach((k) => console.log("  leer:", k));
  problems += missing.length + broken.length + empty.length;
}
process.exit(problems ? 1 : 0);
