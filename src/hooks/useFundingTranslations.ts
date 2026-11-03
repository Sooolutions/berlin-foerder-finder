import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

/** Übersetzbare Textfelder eines Angebots (siehe Tabelle funding_translations). */
const TEXT_FIELDS = ["title", "description", "amount", "application_process"] as const;

interface Translation {
  funding_id: string;
  title: string;
  description: string;
  amount: string | null;
  application_process: string | null;
}

/**
 * Ersetzt die deutschen Texte der übergebenen Angebote durch die Übersetzung
 * in der aktuellen Sprache. Fehlt eine Übersetzung, bleibt der deutsche Text
 * stehen. Tags, Alter, Links usw. bleiben unverändert.
 */
export function useFundingTranslations<T extends { id: string; title: string; description: string }>(items: T[]): T[] {
  const { lang } = useLanguage();
  const ids = items.map((i) => i.id).sort();

  const { data } = useQuery({
    queryKey: ["funding_translations", lang, ids.join(",")],
    enabled: lang !== "de" && ids.length > 0,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const map = new Map<string, Translation>();
      // In Paketen abfragen, damit die URL nicht zu lang wird
      for (let i = 0; i < ids.length; i += 150) {
        const { data, error } = await supabase
          .from("funding_translations")
          .select("funding_id,title,description,amount,application_process")
          .eq("lang", lang)
          .in("funding_id", ids.slice(i, i + 150));
        if (error) throw error;
        (data as Translation[]).forEach((t) => map.set(t.funding_id, t));
      }
      return map;
    },
  });

  return useMemo(() => {
    if (lang === "de" || !data) return items;
    return items.map((item) => {
      const t = data.get(item.id);
      if (!t) return item;
      const merged: Record<string, unknown> = { ...item };
      for (const f of TEXT_FIELDS) {
        // Nur Felder übernehmen, die im Original belegt sind und übersetzt vorliegen
        if (f in item && (item as Record<string, unknown>)[f] && t[f]) merged[f] = t[f];
      }
      return merged as T;
    });
  }, [items, data, lang]);
}
