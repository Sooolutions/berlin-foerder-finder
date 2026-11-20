import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { THEMEN } from "@/content/hilfe/themen";
import { SITE_URL } from "@/content/blog/posts";
import { usePageMeta } from "@/hooks/usePageMeta";
import { tr } from "@/i18n/LanguageContext";

/** Übersicht /hilfe: alle Themenseiten nach Anliegen */
const Themen = () => {
  usePageMeta({
    title: "Hilfe nach Thema: Miete, Kinder, Schulden, Rente | MehrDrin",
    description:
      "Miete zu hoch, Geld für die Klassenfahrt, Schulden oder Rente reicht nicht? Finde nach deinem Anliegen die passenden Hilfen in Berlin und die offiziellen Rechner.",
    canonical: `${SITE_URL}/hilfe`,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-12 md:py-16">
        <div className="mb-12 max-w-3xl">
          <h1 className="mb-5 !text-[40px] font-black leading-[1.05] md:!text-[56px]">{tr("Wobei brauchst du Hilfe?")}</h1>
          <p className="!text-[19px] leading-relaxed text-muted-foreground md:!text-[21px]">
            {tr("Wähl dein Anliegen und sieh, welche Hilfen es in Berlin dafür gibt, mit Link zum offiziellen Rechner oder Antrag.")}
          </p>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {THEMEN.map((t) => (
            <li key={t.slug}>
              <Link
                to={`/hilfe/${t.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="mb-2 !text-[22px] font-bold leading-snug group-hover:text-primary">{tr(t.kurz)}</span>
                <span lang="de" className="mb-4 flex-grow !text-[16px] leading-relaxed text-muted-foreground">{t.description}</span>
                <span className="inline-flex items-center gap-2 !text-[15px] font-semibold text-primary">
                  {tr("Ansehen")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default Themen;
