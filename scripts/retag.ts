import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

// --- Config ---
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;
const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_TAGGED = process.argv.includes("--skip-tagged"); // skip entries that already have tags
const BATCH_SIZE = 2; // Sequential pairs to stay well under 30k tokens/min
const BATCH_PAUSE_MS = 5000; // 5s between batches
const MAX_RETRIES = 3;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// --- Das kanonische Tag-Vokabular ---
const TAG_VOCABULARY = `
ALTERS-TAGS: U18, 18-24, 25-34, 35-49, 50-64, 65plus
NATIONALITÄT: Deutsch, EU, Ukrainisch, Türkisch, Syrisch, Drittstaat
TÄTIGKEITS-TAGS: Schule, Ausbildung, Studium, Arbeiten, Gründung, Selbstständig, Arbeitssuchend, Weiterbildung, Übergang, Pflege, Familie, FSJ, Rente, Erwerbsunfähig, Sonstiges
WOHNEN: Miete, Eigentum, WG, Wohnheim, Heim, Betreuung, Prekär

SCHULE-DETAIL: Schule_Lernschwierigkeit, Schule_Mobbing, Schule_Mittagessen, Schule_Material, Schule_Psyche
AUSBILDUNG-DETAIL: Ausbildung_Berufsschule, Ausbildung_Miteinander, Ausbildung_Perspektive, Ausbildung_Vereinbarkeit, Ausbildung_Finanzen, Ausbildung_Verantwortung
STUDIUM-DETAIL: Studium_Finanzen, Studium_Unterstützung, Studium_Psyche, Studium_Anbindung, Studium_Austausch
ARBEITEN-DETAIL: Arbeiten_Vergütung, Arbeiten_Vereinbarkeit, Arbeiten_Karriere, Arbeiten_Arbeitsklima, Arbeiten_Umschulung, Arbeiten_Gesundheit, Arbeiten_Jobwechsel, Arbeiten_Rente
GRÜNDUNG-DETAIL: Gründung_Finanzierung, Gründung_Beratung, Gründung_Businessplan, Gründung_Netzwerk, Gründung_RechtSteuern, Gründung_Marketing, Gründung_Experience, Gründung_Familie
SELBSTSTÄNDIG-DETAIL: Selbstständig_Finanzierung, Selbstständig_Kunden, Selbstständig_RechtSteuern, Selbstständig_Weiterbildung, Selbstständig_Netzwerk, Selbstständig_Vereinbarkeit, Selbstständig_Marketing, Selbstständig_Experience, Selbstständig_Nachfolge, Selbstständig_International
ARBEITSSUCHE-DETAIL: Arbeitssuche_Beratung, Arbeitssuche_Qualifizierung, Arbeitssuche_Bewerbung, Arbeitssuche_Finanzen, Arbeitssuche_Psychisch, Arbeitssuche_Netzwerk
WEITERBILDUNG-DETAIL: Weiterbildung_Finanzen, Weiterbildung_Karriere, Weiterbildung_Lernen, Weiterbildung_Vereinbarkeit, Weiterbildung_Austausch
ÜBERGANG-DETAIL: Übergang_Orientierung, Übergang_Beratung, Übergang_Praxis, Übergang_Finanzen, Übergang_Bewerbung, Übergang_Netzwerk, Übergang_Umschulung, Übergang_Vereinbarkeit, Übergang_Wiedereinstieg
PFLEGE-DETAIL: Pflege_Informationen, Pflege_Austausch, Pflege_Vereinbarkeit, Pflege_Psychisch, Pflege_Finanzierung, Pflege_Beratung
FAMILIE-DETAIL: Familie_Vereinbarkeit, Familie_Finanzierung, Familie_Angebote, Familie_Austausch, Familie_Psych
FSJ-DETAIL: FSJ_Weiterbildung, FSJ_Anerkennung, FSJ_Finanzen, FSJ_Austausch
RENTE-DETAIL: Rente_Finanzen, Rente_Gesundheit, Rente_Sozial, Rente_Ehrenamt, Rente_Weiterentwicklung, Rente_Alltag
ERWERBSUNFÄHIG-DETAIL: Erwerbsunfähig_Finanzen, Erwerbsunfähig_Gesundheit, Erwerbsunfähig_Sozial, Erwerbsunfähig_Alltag, Erwerbsunfähig_Behörden, Erwerbsunfähig_Weiterbildung
SONSTIGES-DETAIL: Sonstiges_Orientierung, Sonstiges_Beratung, Sonstiges_Sozial, Sonstiges_Finanzen, Sonstiges_Psyche, Sonstiges_Karriere, Sonstiges_Vereinbarkeit, Sonstiges_Weiterentwicklung

FINANZEN: Finanzen_regelmäßig-knapp, Finanzen_Ersparnisse, Finanzen_Prekär, Finanzen_Sozialleistung, Finanzen_Behörde, Finanzen_Familie, Finanzen_Selbst, Finanzen_Stiftung
GESUNDHEIT-DETAIL: Gesundheit_Unterstützung, Gesundheit_Anbindung, Gesundheit_Umgang, Gesundheit_Austausch, Beeinträchtigung_Körperlich, Beeinträchtigung_Psychisch, Beeinträchtigung_Chronisch, Beeinträchtigung_Sinne
HERAUSFORDERUNG: Herausforderung_Finanzen, Herausforderung_Psyche, Herausforderung_Einsam, Herausforderung_Bürokratie, Herausforderung_Deutschland, Herausforderung_Schule, Herausforderung_Kinder, Herausforderung_Gesundheit, Herausforderung_Pflege, Herausforderung_Sozial, Herausforderung_Freizeit, Herausforderung_Vereinbarkeit, Herausforderung_Orientierung
WUNSCH: Wunsch_Sozial, Wunsch_Kultur, Wunsch_Lernen, Wunsch_Ehrenamt, Wunsch_Beratung, Wunsch_Gründung
`;

const SYSTEM_PROMPT = `Du bist ein Tagging-Assistent für eine Berliner Sozialleistungs-Plattform.

Du bekommst einen Datenbank-Eintrag (Titel, Beschreibung, Organisation) und ein Tag-Vokabular.
Weise dem Eintrag EXAKT die passenden Tags zu. Verwende NUR Tags aus dem Vokabular — erfinde keine neuen.

Regeln:
- Weise ALLE Altersgruppen zu, für die das Angebot relevant ist (z.B. BAföG → 18-24, 25-34)
- Weise den passenden Tätigkeits-Tag zu (z.B. "Studium" für BAföG)
- Weise spezifische Detail-Tags zu wenn die Beschreibung es hergibt (z.B. "Studium_Finanzen" für BAföG)
- Weise Herausforderung/Wunsch-Tags zu wenn das Angebot ein konkretes Problem löst
- Weise KEINE Negativ-Tags zu (kein "Beeinträchtigung_Nein", kein "Finanzen_regelmäßig-gut")
- Weise Nationalitäts-Tags NUR zu wenn das Angebot explizit auf eine Gruppe ausgerichtet ist (z.B. Integrationskurse → Drittstaat, Syrisch, etc.)
- Lieber zu wenige als falsche Tags

Antworte NUR mit einem JSON-Array der Tags, z.B.: ["18-24", "25-34", "Studium", "Studium_Finanzen"]
Kein anderer Text, keine Erklärung.`;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.error?.error?.type === "rate_limit_error";
      if (isRateLimit && attempt < MAX_RETRIES) {
        const waitMs = attempt * 15000; // 15s, 30s backoff
        console.log(`  ⏳ Rate limit on "${label}", waiting ${waitMs / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`);
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }
  throw new Error(`All retries exhausted for "${label}"`);
}

async function tagEntry(entry: any): Promise<string[]> {
  const userPrompt = `Titel: ${entry.title}
Organisation: ${entry.organization}
Beschreibung: ${entry.description}
Bisherige Kategorien: ${entry.categories?.join(", ") || "keine"}

TAG-VOKABULAR:
${TAG_VOCABULARY}`;

  return withRetry(async () => {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    const cleaned = text.replace(/```json|```/g, "").trim();
    const tags = JSON.parse(cleaned);
    if (!Array.isArray(tags)) throw new Error("Not an array");
    return tags.filter((t: string) => typeof t === "string" && t.length > 0);
  }, entry.title);
}

async function extractStructuredFields(entry: any): Promise<{
  min_age: number | null;
  max_age: number | null;
  employment_status: string[];
  categories: string[];
}> {
  const prompt = `Analysiere dieses Förderangebot und extrahiere strukturierte Daten.

Titel: ${entry.title}
Organisation: ${entry.organization}
Beschreibung: ${entry.description}

Antworte NUR mit JSON:
{
  "min_age": <Mindestalter als Zahl oder null>,
  "max_age": <Höchstalter als Zahl oder null>,
  "employment_status": <Array aus: "Schule", "Ausbildung", "Studium", "Arbeiten", "Selbstständig", "Arbeitssuchend", "Weiterbildung", "Rente", "Erwerbsunfähig", "Pflege" — nur was passt>,
  "categories": <Array aus: "Bildung", "Arbeit", "Wohnen", "Familie", "Gesundheit", "Integration", "Kultur", "Soziales", "Sport", "Wirtschaft" — nur was passt>
}`;

  return withRetry(async () => {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }, entry.title);
}

async function main() {
  console.log(`\n=== MehrDrin Re-Tagging Tool ===`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no DB writes)" : "LIVE (will update DB)"}`);
  console.log(`Skip already tagged: ${SKIP_TAGGED}\n`);

  const { data: entries, error } = await supabase
    .from("funding")
    .select("id, title, organization, description, categories, tags")
    .order("title");

  if (error || !entries) {
    console.error("Failed to fetch entries:", error);
    return;
  }

  const toProcess = SKIP_TAGGED
    ? entries.filter((e) => !e.tags || e.tags.length === 0)
    : entries;

  console.log(`Found ${entries.length} total entries, processing ${toProcess.length}.\n`);

  const results: any[] = [];
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches} (entries ${i + 1}-${Math.min(i + BATCH_SIZE, toProcess.length)})...`);

    for (const entry of batch) {
      try {
        const [newTags, fields] = await Promise.all([
          tagEntry(entry),
          extractStructuredFields(entry),
        ]);

        results.push({
          id: entry.id,
          title: entry.title,
          old_tags: entry.tags,
          new_tags: newTags,
          ...fields,
        });

        if (!DRY_RUN && newTags.length > 0) {
          const updateData: any = { tags: newTags };
          if (fields.categories.length > 0) updateData.categories = fields.categories;
          if (fields.employment_status.length > 0) updateData.employment_status = fields.employment_status;
          if (fields.min_age !== null) updateData.min_age = fields.min_age;
          if (fields.max_age !== null) updateData.max_age = fields.max_age;

          const { error: updateError } = await supabase
            .from("funding")
            .update(updateData)
            .eq("id", entry.id);

          if (updateError) {
            console.error(`  ✗ DB update failed "${entry.title}": ${updateError.message}`);
            failed++;
          } else {
            updated++;
          }
        }

        console.log(`  ✓ ${entry.title}: ${newTags.length} tags`);
      } catch (err: any) {
        console.error(`  ✗ "${entry.title}": ${err?.message ?? err}`);
        failed++;
      }

      // Small pause between entries within a batch
      await sleep(1000);
    }

    // Save partial results after each batch (crash recovery)
    const outputPath = `scripts/retag-results-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    if (i + BATCH_SIZE < toProcess.length) {
      console.log(`  ⏸ Pausing ${BATCH_PAUSE_MS / 1000}s...\n`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  const outputPath = `scripts/retag-results-${new Date().toISOString().slice(0, 10)}.json`;
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${results.length}`);
  console.log(`Updated:   ${updated}`);
  console.log(`Failed:    ${failed}`);
  console.log(`Results:   ${outputPath}`);
}

main().catch(console.error);
