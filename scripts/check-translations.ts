/**
 * Prüft, ob alle Oberflächentexte übersetzt sind.
 *   npm run check:translations            Sprache en
 *   npm run check:translations -- --json  fehlende Schlüssel als JSON ausgeben
 *
 * Gesammelt werden:
 *  1. alle Texte in t("…") und tr("…") im Quellcode
 *  2. alle Fragen und Antwortlabels aus questionnaireData.ts
 *  3. alle Erklärtexte aus questionInfo.ts
 *  4. Kategorien und Fördertypen aus der Datenbank (CATEGORY_KEYS unten)
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { getAllQuestions } from "../src/data/questionnaireData";
import { ALL_QUESTION_INFO } from "../src/data/questionInfo";
import en from "../src/i18n/en";

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
for (const q of getAllQuestions()) {
  keys.add(q.question);
  q.options.forEach((o) => keys.add(o.label));
}
ALL_QUESTION_INFO.forEach((k) => keys.add(k));
CATEGORY_KEYS.forEach((k) => keys.add(k));
EXTRA_KEYS.forEach((k) => keys.add(k));

const missing = [...keys].filter((k) => !(k in en)).sort();
const unused = Object.keys(en).filter((k) => !keys.has(k));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(missing, null, 1));
} else {
  console.log(`${keys.size} Texte, ${missing.length} ohne englische Übersetzung, ${unused.length} ungenutzte Einträge.`);
  missing.forEach((k) => console.log("  fehlt:", k));
  unused.forEach((k) => console.log("  ungenutzt:", k));
}
process.exit(missing.length ? 1 : 0);
