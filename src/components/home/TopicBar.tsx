import { Link } from "react-router-dom";
import {
  Baby,
  Briefcase,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  Languages,
  Palette,
  Sparkle,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/** Icon je Kategorie aus der Datenbank, unbekannte bekommen einen Funken */
const ICONS: Record<string, LucideIcon> = {
  Wohnen: Home,
  Familie: Baby,
  Bildung: GraduationCap,
  Arbeit: Briefcase,
  Gesundheit: HeartPulse,
  "Finanzielle Unterstützung": Wallet,
  Integration: Languages,
  Soziales: HandHeart,
  Kultur: Palette,
};

export interface TopicCount {
  name: string;
  count: number;
}

/**
 * Ruhige Themenleiste unter dem Hero. Zeigt die Bereiche, in denen es
 * Angebote gibt, jeweils mit der echten Anzahl aus der Datenbank. Jede
 * Kachel führt in den Fragebogen.
 */
const TopicBar = ({ topics }: { topics: TopicCount[] }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-[var(--md-ink)] px-4 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
          {t("Angebote nach Themen")}
        </p>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
          {(topics.length ? topics : Array.from({ length: 8 }, () => null)).map((topic, i) => {
            if (!topic) {
              return <li key={i} className="h-[52px] w-40 flex-none animate-pulse rounded-full bg-white/10" />;
            }
            const Icon = ICONS[topic.name] ?? Sparkle;
            return (
              <li key={topic.name} className="flex-none snap-start">
                <Link
                  to="/questionnaire"
                  className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pe-5 ps-2 text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--md-sun)]/60 hover:bg-white/[0.08]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[var(--md-sun)] transition-colors duration-300 group-hover:bg-[var(--md-sun)] group-hover:text-[var(--md-ink)]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                  </span>
                  <span className="whitespace-nowrap text-[16px] font-semibold">{t(topic.name)}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-bold tabular-nums text-white/70">{topic.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default TopicBar;
