import type { Block, ChartSpec } from "@/content/blog/posts";

type FigureBlock = Extract<Block, { type: "figure" }>;

// Eine Datenfarbe (Markenblau), Text immer in Text-Tokens, nie in der Datenfarbe.
const BAR = "bg-primary";
const TRACK = "bg-[hsl(213_60%_94%)]";
const pct = (v: number) => `${v.toLocaleString("de-DE")} %`;

const Shares = ({ chart }: { chart: Extract<ChartSpec, { kind: "shares" }> }) => (
  <div className="grid gap-4 sm:grid-cols-3">
    {chart.items.map((it) => (
      <div key={it.label} className="rounded-xl border border-border bg-white p-5" title={`${it.label}: ${pct(it.value)}`}>
        <div className="text-[44px] md:text-[52px] font-black leading-none tabular-nums text-foreground">
          {it.value}
          <span className="!text-[24px] md:!text-[28px] !font-bold ml-1" style={{ fontFamily: "inherit" }}>%</span>
        </div>
        <div className="mt-3 font-semibold !text-[16px] leading-snug">{it.label}</div>
        <div className="!text-[14px] text-muted-foreground">{it.period}</div>
        <div className={`mt-4 h-3 w-full rounded-full ${TRACK} overflow-hidden`} aria-hidden="true">
          <div className={`h-full ${BAR} rounded-r-[4px]`} style={{ width: `${it.value}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const Bars = ({ chart }: { chart: Extract<ChartSpec, { kind: "bars" }> }) => (
  <div className="space-y-5">
    {chart.items.map((it) => (
      <div key={it.label} title={`${it.label}: ${pct(it.value)}`} className="group">
        <div className="!text-[15px] font-medium mb-1.5 leading-snug">{it.label}</div>
        <div className="flex items-center gap-2.5">
          <div
            className={`h-6 ${BAR} rounded-r-[4px] group-hover:brightness-95 transition`}
            style={{ width: `calc((100% - 4rem) * ${it.value / 100})` }}
          />
          <div className="font-bold tabular-nums !text-[16px] whitespace-nowrap">{pct(it.value)}</div>
        </div>
      </div>
    ))}
  </div>
);

const Panels = ({ chart }: { chart: Extract<ChartSpec, { kind: "panels" }> }) => (
  <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
    {chart.panels.map((p) => (
      <div key={p.label}>
        <div className="font-semibold !text-[16px] mb-2.5">{p.label}</div>
        <div className="space-y-1.5">
          {chart.groups.map((g, i) => (
            <div key={g} className="flex items-center gap-2 group" title={`${p.label}, ${g}: ${pct(p.values[i])}`}>
              <div className="w-[7.5rem] shrink-0 !text-[13px] text-muted-foreground leading-tight">{g}</div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div
                  className={`h-[14px] ${BAR} rounded-r-[4px] group-hover:brightness-95 transition`}
                  style={{ width: `calc((100% - 3rem) * ${p.values[i] / chart.max})`, opacity: 1 - i * 0.18 }}
                />
                <div className="!text-[13px] font-semibold tabular-nums whitespace-nowrap">{pct(p.values[i])}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/** Datentabelle als zugängliche Alternative zur Grafik */
const DataTable = ({ chart }: { chart: ChartSpec }) => {
  const rows: string[][] =
    chart.kind === "panels"
      ? chart.panels.map((p) => [p.label, ...p.values.map(pct)])
      : chart.kind === "shares"
        ? chart.items.map((it) => [`${it.label} (${it.period})`, pct(it.value)])
        : chart.items.map((it) => [it.label, pct(it.value)]);
  const head = chart.kind === "panels" ? ["", ...chart.groups] : ["", "Anteil"];
  return (
    <details className="mt-5 group/details">
      <summary className="cursor-pointer !text-[14px] text-muted-foreground hover:text-foreground select-none">
        Daten als Tabelle
      </summary>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-[14px] border-collapse">
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={i} className={`py-1.5 px-2 border-b border-border font-semibold ${i ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i} className={`py-1.5 px-2 border-b border-border/60 ${i ? "text-right tabular-nums" : ""}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};

const BlogFigure = ({ block }: { block: FigureBlock }) => {
  const { chart } = block;
  return (
    <figure className="my-12 rounded-2xl bg-[hsl(213_71%_97%)] p-5 md:p-8">
      <figcaption className="mb-6">
        <div className="!text-[13px] uppercase tracking-wider text-muted-foreground font-medium">
          Abbildung {block.number}
        </div>
        <div className="!text-[20px] md:!text-[22px] font-bold leading-snug mt-1">{block.caption}</div>
        <div className="!text-[14px] text-muted-foreground mt-1">{chart.valueNote}</div>
      </figcaption>
      {chart.kind === "shares" && <Shares chart={chart} />}
      {chart.kind === "bars" && <Bars chart={chart} />}
      {chart.kind === "panels" && <Panels chart={chart} />}
      <DataTable chart={chart} />
      <div className="!text-[13px] text-muted-foreground mt-4 italic">Quelle: {block.source}</div>
    </figure>
  );
};

export default BlogFigure;
