import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calculator, ExternalLink, FileText, Info } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { formatGeprueft, getThema, LINK_ART_LABEL, THEMEN, type ThemaLink } from "@/content/hilfe/themen";
import { SITE_URL } from "@/content/blog/posts";
import { usePageMeta } from "@/hooks/usePageMeta";
import { tr, getLang } from "@/i18n/LanguageContext";
import NotFound from "./NotFound";

const ART_ICON: Record<ThemaLink["art"], typeof Calculator> = { rechner: Calculator, antrag: FileText, info: Info };

/**
 * Themenseite /hilfe/<slug>. Inhalt kommt aus src/content/hilfe/themen.ts und
 * wird beim Build zusätzlich als statisches HTML vorgerendert (scripts/prerender.ts).
 */
const Thema = () => {
  const { slug } = useParams();
  const thema = getThema(slug);

  usePageMeta({
    title: thema ? thema.title : "Seite nicht gefunden | MehrDrin",
    description: thema?.description,
    canonical: thema ? `${SITE_URL}/hilfe/${thema.slug}` : undefined,
  });

  if (!thema) return <NotFound />;
  const verwandt = thema.verwandt.map((s) => THEMEN.find((t) => t.slug === s)).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-grow px-4">
        <article lang="de" className="mx-auto max-w-[760px] pb-20 pt-10 md:pt-16">
          <Link to="/hilfe" className="mb-8 inline-flex items-center gap-1.5 !text-[15px] text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" /> {tr("Alle Themen")}
          </Link>
          {getLang() !== "de" && (
            <p className="mb-8 rounded-lg bg-secondary px-4 py-3 !text-[15px] text-foreground/80">
              {tr("Diese Seite gibt es bisher nur auf Deutsch. Der Fragebogen ist in deiner Sprache verfügbar.")}
            </p>
          )}

          <header className="mb-10">
            <h1 className="mb-6 !text-[34px] font-black leading-[1.08] tracking-tight md:!text-[50px]">{thema.h1}</h1>
            <p className="!text-[19px] leading-relaxed text-muted-foreground md:!text-[21px]">{thema.intro}</p>
          </header>

          {/* Früh ein Einstieg in den Fragebogen, nicht erst am Ende */}
          <aside className="mb-12 flex flex-col gap-4 rounded-2xl bg-[var(--md-paper)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="!text-[17px] font-semibold text-foreground">
              {tr("Nicht sicher, was zu dir passt? Prüf in etwa 3 Minuten alle Hilfen auf einmal.")}
            </p>
            <Button asChild className="shrink-0 rounded-full px-6 !text-[16px]">
              <Link to="/questionnaire">
                {tr("Jetzt prüfen")} <ArrowRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </Button>
          </aside>

          <h2 className="mb-6 !text-[26px] font-bold md:!text-[30px]">Diese Hilfen kommen infrage</h2>
          <div className="space-y-6">
            {thema.hilfen.map((h) => (
              <section key={h.name} className="rounded-2xl border border-border p-6 md:p-7">
                <h3 className="mb-3 !text-[22px] font-bold leading-snug">{h.name}</h3>
                <p className="!text-[17px] leading-relaxed text-foreground/90">{h.text}</p>
                {h.punkte && (
                  <ul className="mt-4 list-disc space-y-1.5 ps-6 marker:text-primary">
                    {h.punkte.map((p) => (
                      <li key={p} className="!text-[17px] leading-relaxed">{p}</li>
                    ))}
                  </ul>
                )}
                {(h.wer || h.wo) && (
                  <dl className="mt-5 grid gap-3">
                    {h.wer && (
                      <div>
                        <dt className="!text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Für wen</dt>
                        <dd className="!text-[16px] leading-relaxed">{h.wer}</dd>
                      </div>
                    )}
                    {h.wo && (
                      <div>
                        <dt className="!text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Wo und wie</dt>
                        <dd className="!text-[16px] leading-relaxed">{h.wo}</dd>
                      </div>
                    )}
                  </dl>
                )}
                {(h.links?.length || h.siehe) && (
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {h.links?.map((l) => {
                      const Icon = ART_ICON[l.art];
                      return (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 !text-[15px] font-semibold transition-colors ${
                            l.art === "rechner"
                              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                              : "border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-none" />
                          <span className="sr-only">{LINK_ART_LABEL[l.art]}: </span>
                          {l.label}
                          <ExternalLink className="h-3.5 w-3.5 flex-none opacity-60" />
                        </a>
                      );
                    })}
                    {h.siehe && (
                      <Link
                        to={`/hilfe/${h.siehe}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 !text-[15px] font-semibold transition-colors hover:border-primary hover:text-primary"
                      >
                        Mehr dazu <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                      </Link>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>

          <h2 className="mb-6 mt-14 !text-[26px] font-bold md:!text-[30px]">Häufige Fragen</h2>
          <div className="space-y-6">
            {thema.faq.map(([q, a]) => (
              <div key={q}>
                <h3 className="mb-2 !text-[19px] font-bold">{q}</h3>
                <p className="!text-[17px] leading-relaxed text-foreground/90">{a}</p>
              </div>
            ))}
          </div>

          <aside className="mt-14 rounded-2xl bg-secondary p-6 md:p-8">
            <div className="mb-2 !text-[22px] font-bold leading-snug md:!text-[26px]">{tr("Was steht dir noch zu?")}</div>
            <p className="mb-5 !text-[17px] text-foreground/80">
              {tr("Oft passen mehrere Hilfen zusammen. Beantworte ein paar kurze Fragen und sieh alles auf einen Blick. Anonym, ohne Anmeldung, nichts geht ans Amt.")}
            </p>
            <Button asChild size="lg" className="rounded-full px-7 py-6 !text-[17px]">
              <Link to="/questionnaire">
                {tr("Jetzt herausfinden")} <ArrowRight className="ms-2 h-5 w-5 rtl:-scale-x-100" />
              </Link>
            </Button>
          </aside>

          {verwandt.length > 0 && (
            <nav className="mt-12" aria-label="Verwandte Themen">
              <h2 className="mb-4 !text-[20px] font-bold">Verwandte Themen</h2>
              <ul className="flex flex-wrap gap-2.5">
                {verwandt.map((v) => (
                  <li key={v!.slug}>
                    <Link to={`/hilfe/${v!.slug}`} className="inline-block rounded-full bg-[var(--md-paper)] px-4 py-2 !text-[15px] font-semibold hover:text-primary">
                      {v!.kurz}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <p className="mt-12 border-t border-border pt-6 !text-[14px] leading-relaxed text-muted-foreground">
            Zuletzt geprüft im {formatGeprueft(thema.geprueft)}. Ob und in welcher Höhe du eine Leistung bekommst, entscheidet immer die
            zuständige Stelle. MehrDrin rechnet keine Beträge aus, sondern verlinkt die offiziellen Rechner. Fehler gefunden? Schreib uns an{" "}
            <a href="mailto:info@mehrdrin-berlin.de" className="text-primary hover:underline">info@mehrdrin-berlin.de</a>.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Thema;
