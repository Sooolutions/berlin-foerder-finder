/**
 * Übersetzt die Texte der Tabelle `funding` in eine Zielsprache und schreibt
 * sie nach `funding_translations` (eine Zeile je Eintrag und Sprache).
 *
 * Übersetzt werden nur title, description, amount und application_process.
 * Tags, Alter, Bezirke usw. bleiben einmalig in `funding`.
 *
 * Aufruf:
 *   npm run translate -- --lang en              fehlende und veraltete Einträge
 *   npm run translate -- --lang en --dry-run    nur anzeigen, nichts schreiben
 *   npm run translate -- --lang en --limit 5    nur die ersten 5 (zum Testen)
 *   npm run translate -- --lang en --force      alles neu, auch aktuelle
 *
 * Ein Eintrag gilt als veraltet, wenn sich der deutsche Text seit der
 * Übersetzung geändert hat (source_hash). Geprüfte Übersetzungen
 * (status = 'reviewed') werden nur mit --force überschrieben.
 */
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const LANG = arg("lang") ?? "en";
const LIMIT = arg("limit") ? Number(arg("limit")) : Infinity;
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
const PAUSE_MS = 1500;
const MAX_RETRIES = 3;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  tr: "Turkish",
  uk: "Ukrainian",
  ar: "Arabic (Modern Standard Arabic)",
  ru: "Russian",
  pl: "Polish",
  bg: "Bulgarian",
  ro: "Romanian",
};

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
  console.error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY und ANTHROPIC_API_KEY müssen in .env stehen.");
  process.exit(1);
}
if (!LANGUAGE_NAMES[LANG]) {
  console.error(`Unbekannte Sprache "${LANG}". Möglich: ${Object.keys(LANGUAGE_NAMES).join(", ")}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

interface FundingText {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount: string | null;
  application_process: string | null;
}

/** Muss exakt public.funding_source_hash() in der Datenbank entsprechen. */
const sourceHash = (f: FundingText) =>
  createHash("md5")
    .update([f.title ?? "", f.description ?? "", f.amount ?? "", f.application_process ?? ""].join("\u001f"), "utf8")
    .digest("hex");

const systemPrompt = (language: string) => `You translate entries of a Berlin database of social services and funding programmes from German into ${language}.
The readers are people living in Berlin, often in difficult situations, and the social workers advising them.

Rules
1. Translate faithfully and plainly. Do not add, omit or embellish information. Keep amounts, dates, ages, phone numbers and URLs exactly as they are.
2. Keep official German terms that people will meet on forms and letters (e.g. Bürgergeld, Wohngeld, Kinderzuschlag, BAföG, Jobcenter, Bezirksamt, Berechtigungsschein, Berlinpass, Elterngeld, Grundsicherung). On first mention write the German term followed by a short ${language} explanation in parentheses.
3. Do not translate the names of organisations, programmes or places.
4. Use a respectful, direct tone and address the reader informally where the German does ("du").
5. If a field is empty or null, return null for it.

Answer with JSON only, no prose, exactly this shape:
{"title": string, "description": string, "amount": string | null, "application_process": string | null}`;

async function translate(f: FundingText) {
  const input = {
    title: f.title,
    description: f.description,
    amount: f.amount,
    application_process: f.application_process,
    organization_for_context_only: f.organization,
  };
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt(LANGUAGE_NAMES[LANG]),
        messages: [{ role: "user", content: JSON.stringify(input) }],
      });
      const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
      const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
      if (typeof json.title !== "string" || typeof json.description !== "string") throw new Error("Unvollständige Antwort");
      return {
        title: json.title.trim(),
        description: json.description.trim(),
        amount: f.amount ? (json.amount ?? null) : null,
        application_process: f.application_process ? (json.application_process ?? null) : null,
      };
    } catch (e) {
      console.warn(`   Versuch ${attempt} fehlgeschlagen: ${(e as Error).message}`);
      if (attempt === MAX_RETRIES) throw e;
      await new Promise((r) => setTimeout(r, 5000 * attempt));
    }
  }
  throw new Error("unreachable");
}

async function main() {
  const { data: fundings, error } = await supabase
    .from("funding")
    .select("id,title,description,organization,amount,application_process")
    .order("title")
    .range(0, 9999);
  if (error) throw error;

  const { data: existing, error: e2 } = await supabase
    .from("funding_translations")
    .select("funding_id,source_hash,status")
    .eq("lang", LANG)
    .range(0, 9999);
  if (e2) throw e2;
  const known = new Map(existing!.map((t) => [t.funding_id, t]));

  const todo = (fundings as FundingText[]).filter((f) => {
    const t = known.get(f.id);
    if (FORCE) return true;
    if (!t) return true;
    if (t.status === "reviewed") return false;
    return t.source_hash !== sourceHash(f);
  });

  console.log(`Sprache ${LANG}: ${fundings!.length} Einträge, davon ${todo.length} fehlend oder veraltet.`);
  const batch = todo.slice(0, LIMIT);
  let ok = 0, failed = 0;

  for (const [i, f] of batch.entries()) {
    console.log(`[${i + 1}/${batch.length}] ${f.title}`);
    try {
      const t = await translate(f);
      if (DRY_RUN) {
        console.log(`   → ${t.title}`);
      } else {
        const { error: upErr } = await supabase.from("funding_translations").upsert({
          funding_id: f.id,
          lang: LANG,
          ...t,
          source_hash: sourceHash(f),
          status: "machine",
          updated_at: new Date().toISOString(),
        });
        if (upErr) throw upErr;
      }
      ok++;
    } catch (e) {
      failed++;
      console.error(`   Fehler: ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, PAUSE_MS));
  }
  console.log(`Fertig: ${ok} übersetzt, ${failed} fehlgeschlagen${DRY_RUN ? " (Probelauf, nichts gespeichert)" : ""}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
