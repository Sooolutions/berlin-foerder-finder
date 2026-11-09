import type { SectionId } from "@/questionnaire/flow";

/**
 * Abschnittsmessung für die Abschlussquote.
 *
 * Erreicht jemand einen neuen Abschnitt des Fragebogens, wird ein virtueller
 * Seitenaufruf /questionnaire/<abschnitt> an Vercel Web Analytics gemeldet.
 * Im Dashboard ergibt sich daraus der Trichter
 *   /questionnaire (geöffnet) → /questionnaire/start (Einführung bestätigt)
 *   → /questionnaire/person (Alter beantwortet) → /questionnaire/zuhause
 *   → /questionnaire/geld → /questionnaire/gesundheit → /questionnaire/anliegen
 *   → /questionnaire/wuensche → /results.
 * Abschnitte, die für jemanden entfallen (etwa Geld für Jugendliche in
 * Einrichtungen), fehlen in dessen Durchlauf.
 *
 * Übermittelt wird nur der Name des Abschnitts, nie eine Antwort. Es werden
 * keine Cookies gesetzt, die Verarbeitung ist durch den bestehenden Abschnitt
 * zu Vercel Analytics in der Datenschutzerklärung abgedeckt. Jeder Abschnitt
 * zählt höchstens einmal pro Durchlauf, damit Vor- und Zurückblättern die
 * Zahlen nicht aufbläht.
 *
 * window.va ist die Warteschlange, die <Analytics /> anlegt (siehe
 * @vercel/analytics, Funktion pageview). Eigene Ereignisse (track) sind im
 * Hobby-Tarif nicht verfügbar, Seitenaufrufe schon.
 */
export type TrackedSection = SectionId | "start";

const reported = new Set<TrackedSection>();

export function trackSection(section: TrackedSection | null | undefined): void {
  if (!section || reported.has(section) || typeof window === "undefined") return;
  reported.add(section);
  try {
    window.va?.("pageview", { route: "/questionnaire/[abschnitt]", path: `/questionnaire/${section}` });
  } catch {
    // Messung darf den Fragebogen nie stören
  }
}

/** Neuer Durchlauf: Abschnitte dürfen wieder gezählt werden. */
export function resetSectionTracking(): void {
  reported.clear();
}
