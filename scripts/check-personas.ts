/**
 * Trefferqualität an Testpersonen messen.
 *   npm run check:personas                          Live-Daten aus Supabase
 *   npm run check:personas -- --snapshot <datei>    Daten aus einer JSON-Datei
 *   npm run check:personas -- --save-snapshot       Live-Daten zusätzlich speichern
 *   npm run check:personas -- --json <datei>        Ergebnis speichern
 *   npm run check:personas -- --vergleich <datei>   mit gespeichertem Ergebnis vergleichen
 *
 * Für jede Person (scripts/personas/personas.ts) werden ihre Antworten im
 * aktuellen Fragebogen erzeugt (scripts/personas/answers.ts) und genauso
 * gerankt wie auf der Ergebnisseite. Mit --verbose zusätzlich die Antworten
 * und die ersten zehn Treffer.
 * Gemessen wird je erwartetem Angebot:
 *   Top 10     steht unter den ersten zehn der Relevanzliste
 *   sichtbar   erscheint ohne Aufklappen (vier Top-Treffer plus je Zeile sechs)
 *   Rang       Position in der Relevanzliste, „–“ wenn gar nicht gefunden
 * Bezirksvarianten desselben Angebots (Soziale Wohnhilfe Mitte, Pankow, …)
 * zählen für den Rang als ein Angebot, sonst füllen zwölf Varianten die
 * ersten zehn Plätze.
 * Angebote aus nichtErwartet dürfen nicht unter den ersten zehn stehen.
 *
 * Das Skript bricht nicht ab, wenn Erwartungen verfehlt werden. Es ist ein
 * Messinstrument, kein Test. Abbruch nur bei Datenfehlern oder Mustern, die im
 * Bestand gar nicht vorkommen.
 */
import * as fs from "fs";
import type { UserAnswers } from "../src/context/QuestionnaireContext";
import { buildReasonGroups, diversify, getAgeRange, nearDuplicateKey, rankFundings } from "../src/utils/answerMappingUtils";
import { personaAnswers } from "./personas/answers";
import { PERSONAS, type Erwartung } from "./personas/personas";

type Offer = {
  id: string; title: string; organization?: string | null; tags: string[] | null;
  min_age?: number | null; max_age?: number | null; district?: string[] | null; relevanceScore?: number;
};

const args = process.argv.slice(2);
const argValue = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const SNAPSHOT_PATH = "scripts/data/funding-snapshot.json";

async function loadOffers(): Promise<Offer[]> {
  const snapshot = argValue("--snapshot");
  if (snapshot) return JSON.parse(fs.readFileSync(snapshot, "utf8"));
  const { supabase } = await import("../src/integrations/supabase/client");
  const { data, error } = await supabase
    .from("funding")
    .select("id, title, organization, tags, min_age, max_age, district, funding_type, benefit_type, requires_benefits")
    .order("title");
  if (error || !data) throw new Error(`Supabase: ${error?.message ?? "keine Daten"}`);
  if (args.includes("--save-snapshot")) {
    fs.mkdirSync("scripts/data", { recursive: true });
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data));
    console.log(`Snapshot gespeichert: ${SNAPSHOT_PATH}`);
  }
  return data as unknown as Offer[];
}

/** Wie der Server in useFundingResults: grober Altersfilter über min_age und max_age. */
const serverAgeFilter = (offers: Offer[], age: string) => {
  const r = getAgeRange(age);
  if (!r) return offers;
  return offers.filter((o) => (o.min_age == null || o.min_age <= r.maxAge) && (o.max_age == null || o.max_age >= r.minAge));
};

/** Was die Ergebnisseite ohne Aufklappen zeigt (siehe ResultsScreen.tsx). */
const visibleOnResultsPage = (ranked: Offer[], answers: UserAnswers): Set<string> => {
  const top = diversify(ranked.filter((f) => (f.relevanceScore ?? 0) > 0)).slice(0, 4);
  const groups = buildReasonGroups(ranked, answers, { exclude: new Set(top.map((f) => f.id)) });
  return new Set([...top, ...groups.flatMap((g) => g.fundings.slice(0, 6))].map((f) => f.id));
};

interface ErwartungsErgebnis { label: string; rang: number | null; top10: boolean; sichtbar: boolean }
interface PersonaErgebnis {
  id: string; name: string; treffer: number; ergebnisse: ErwartungsErgebnis[];
  verstoesse: string[]; top10: string[];
}

async function main() {
  const offers = await loadOffers();
  const errors: string[] = [];
  const checkPattern = (p: Erwartung, personaId: string) => {
    if (!offers.some((o) => p.muster.test(o.title))) errors.push(`${personaId}: Muster „${p.label}“ findet kein Angebot im Bestand`);
  };

  const results: PersonaErgebnis[] = PERSONAS.map((persona) => {
    persona.erwartet.forEach((p) => checkPattern(p, persona.id));
    persona.nichtErwartet?.forEach((p) => checkPattern(p, persona.id));
    const answers = personaAnswers(persona.profil);
    const ranked = rankFundings(serverAgeFilter(offers, persona.profil.alter), answers) as Offer[];
    const visible = visibleOnResultsPage(ranked, answers);
    const seenKeys = new Set<string>();
    const distinct = ranked.filter((o) => { const k = nearDuplicateKey(o.title); if (seenKeys.has(k)) return false; seenKeys.add(k); return true; });
    const rankOf = (p: Erwartung) => { const i = distinct.findIndex((o) => p.muster.test(o.title)); return i < 0 ? null : i + 1; };
    const ergebnisse = persona.erwartet.map((p) => {
      const rang = rankOf(p);
      return { label: p.label, rang, top10: rang !== null && rang <= 10, sichtbar: ranked.some((o) => visible.has(o.id) && p.muster.test(o.title)) };
    });
    const verstoesse = (persona.nichtErwartet ?? []).filter((p) => { const r = rankOf(p); return r !== null && r <= 10; }).map((p) => p.label);
    return {
      id: persona.id, name: persona.name, treffer: ranked.filter((o) => (o.relevanceScore ?? 0) > 0).length,
      ergebnisse, verstoesse, top10: distinct.slice(0, 10).map((o) => o.title),
    };
  });

  if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

  const pct = (n: number, d: number) => (d === 0 ? "–" : `${Math.round((100 * n) / d)} %`);
  let allExp = 0, allTop = 0, allVis = 0, allViol = 0;
  for (const r of results) {
    const top = r.ergebnisse.filter((e) => e.top10).length;
    const vis = r.ergebnisse.filter((e) => e.sichtbar).length;
    allExp += r.ergebnisse.length; allTop += top; allVis += vis; allViol += r.verstoesse.length;
    console.log(`\n${r.name}  [${r.id}]  ${r.treffer} Treffer, Top 10 ${top}/${r.ergebnisse.length}, sichtbar ${vis}/${r.ergebnisse.length}`);
    r.ergebnisse.forEach((e) => console.log(`   ${e.top10 ? "✓" : e.sichtbar ? "~" : "✗"} ${e.label.padEnd(42)} Rang ${e.rang ?? "–"}${e.sichtbar ? ", sichtbar" : ""}`));
    r.verstoesse.forEach((v) => console.log(`   ! ${v} steht unter den ersten zehn`));
    if (args.includes("--verbose")) {
      console.log(`      Antworten: ${JSON.stringify(personaAnswers(PERSONAS.find((p) => p.id === r.id)!.profil))}`);
      r.top10.forEach((t, i) => console.log(`      ${String(i + 1).padStart(2)}. ${t}`));
    }
  }
  console.log(`\nGesamt: ${PERSONAS.length} Personen, ${allExp} erwartete Angebote`);
  console.log(`  in den Top 10:      ${allTop} (${pct(allTop, allExp)})`);
  console.log(`  ohne Aufklappen:    ${allVis} (${pct(allVis, allExp)})`);
  console.log(`  Fehltreffer Top 10: ${allViol}`);

  const vergleich = argValue("--vergleich");
  if (vergleich) {
    const alt: PersonaErgebnis[] = JSON.parse(fs.readFileSync(vergleich, "utf8")).personen;
    console.log(`\nVergleich mit ${vergleich}:`);
    for (const r of results) {
      const a = alt.find((x) => x.id === r.id);
      if (!a) continue;
      const t = (x: PersonaErgebnis) => x.ergebnisse.filter((e) => e.top10).length;
      const d = t(r) - t(a);
      if (d !== 0) console.log(`  ${r.id.padEnd(26)} Top 10 ${t(a)} → ${t(r)} (${d > 0 ? "+" : ""}${d})`);
    }
  }
  const out = argValue("--json");
  if (out) {
    fs.writeFileSync(out, JSON.stringify({ erstellt: new Date().toISOString(), angebote: offers.length, personen: results }, null, 2));
    console.log(`\nErgebnis gespeichert: ${out}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
