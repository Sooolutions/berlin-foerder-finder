/**
 * Supabase liefert pro Abfrage höchstens 1.000 Zeilen. Diese Hilfsfunktion
 * holt die erste Seite samt Gesamtzahl und danach alle weiteren Seiten
 * parallel. `build` muss für jeden Aufruf eine frische, gleich sortierte
 * Abfrage liefern.
 */
const PAGE = 1000;

type PageResult<T> = PromiseLike<{ data: T[] | null; error: unknown; count?: number | null }>;

export async function fetchAllRows<T>(
  build: (from: number, to: number, withCount: boolean) => PageResult<T>,
): Promise<{ rows: T[]; count: number }> {
  const first = await build(0, PAGE - 1, true);
  if (first.error) throw first.error;
  const rows = [...(first.data ?? [])];
  const total = first.count ?? rows.length;
  if (rows.length < PAGE || total <= PAGE) return { rows, count: total };

  const starts: number[] = [];
  for (let from = PAGE; from < total; from += PAGE) starts.push(from);
  const pages = await Promise.all(starts.map((from) => build(from, from + PAGE - 1, false)));
  for (const p of pages) {
    if (p.error) throw p.error;
    rows.push(...(p.data ?? []));
  }
  return { rows, count: total };
}
