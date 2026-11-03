/**
 * Mehrsprachigkeit.
 *
 * Prinzip: Der deutsche Text ist zugleich der Schlüssel. `t("Jetzt starten")`
 * liefert auf Deutsch den Text selbst, in anderen Sprachen den Eintrag aus dem
 * Wörterbuch der Sprache (z. B. src/i18n/en.ts). Fehlt ein Eintrag, erscheint
 * der deutsche Text. Eine neue Sprache braucht also nur ein weiteres
 * Wörterbuch und einen Eintrag in LANGUAGES.
 *
 * Platzhalter: t("Alle {n} anzeigen", { n: 5 }).
 *
 * `tr()` ist dieselbe Funktion ohne Hook, für Hilfsfunktionen außerhalb von
 * Komponenten. Beim Sprachwechsel wird der gesamte Seiteninhalt neu
 * aufgebaut, daher sind auch diese Texte immer aktuell.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./en";

export type Lang = "de" | "en";

export const LANGUAGES: { code: Lang; label: string; short: string }[] = [
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "en", label: "English", short: "EN" },
];

const DICTIONARIES: Record<Exclude<Lang, "de">, Record<string, string>> = { en };

const STORAGE_KEY = "mehrdrin_lang";
const isLang = (v: unknown): v is Lang => LANGUAGES.some((l) => l.code === v);

/** Startsprache: ?lang=en in der URL, sonst die in dieser Sitzung gewählte (sessionStorage, siehe Datenschutzerklärung Abschnitt 6), sonst Deutsch. */
const initialLang = (): Lang => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLang(fromUrl)) {
      sessionStorage.setItem(STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* privater Modus o. Ä. */
  }
  return "de";
};

let currentLang: Lang = "de";

const fill = (text: string, vars?: Record<string, string | number>) =>
  vars ? text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text;

/** Übersetzt einen deutschen Text in die aktuelle Sprache. */
export function tr(de: string, vars?: Record<string, string | number>): string {
  if (currentLang === "de") return fill(de, vars);
  return fill(DICTIONARIES[currentLang][de] ?? de, vars);
}

export const getLang = (): Lang => currentLang;

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof tr;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: "de", setLang: () => {}, t: tr });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(initialLang);
  // Vor dem Rendern der Kinder setzen, damit auch tr() die neue Sprache kennt
  currentLang = lang;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignorieren */
    }
    // ?lang aus der Adresszeile entfernen, damit sie nicht der Auswahl widerspricht
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      window.history.replaceState(window.history.state, "", url.toString());
    }
    setLangState(next);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: tr }), [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {/* key: Sprachwechsel baut den Inhalt neu auf, alle Texte werden neu übersetzt */}
      <React.Fragment key={lang}>{children}</React.Fragment>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
