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
    <section className="bg-[var(--md-ink)] py-10 md:py-12">
      <div>
        <p className="mb-6 px-4 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
          {t("Angebote nach Themen")}
        </p>
        {/* Ein Band, das langsam von links nach rechts läuft und beim Darüberfahren anhält */}
        <div className="md-carousel group relative">
          <ul
            className="md-marquee-track md-marquee-rev flex w-max gap-3 py-1 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: "165s" }}
          >
            {/* Jede Hälfte enthält die Themen dreimal, so ist das Band auch auf sehr breiten Bildschirmen voll */}
            {(topics.length ? Array.from({ length: 6 }, () => topics).flat() : Array.from({ length: 16 }, () => null)).map((topic, i) => {
              if (!topic) {
                return <li key={i} className="h-[52px] w-40 flex-none animate-pulse rounded-full bg-white/10" />;
              }
              const Icon = ICONS[topic.name] ?? Sparkle;
              const copy = i >= topics.length;
              return (
                <li key={`${topic.name}-${i}`} className="flex-none" aria-hidden={copy || undefined}>
                  <Link
                    to="/questionnaire"
                    tabIndex={copy ? -1 : undefined}
                    className="group/t flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pe-5 ps-2 text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--md-sun)]/60 hover:bg-white/[0.08]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[var(--md-sun)] transition-colors duration-300 group-hover/t:bg-[var(--md-sun)] group-hover/t:text-[var(--md-ink)]">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    </span>
                    <span className="whitespace-nowrap text-[16px] font-semibold">{t(topic.name)}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-bold tabular-nums text-white/70">{topic.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div aria-hidden className="md-fade pointer-events-none absolute inset-y-0 start-0 w-[12vw] min-w-12 bg-gradient-to-r from-[var(--md-ink)] to-transparent rtl:bg-gradient-to-l" />
          <div aria-hidden className="md-fade pointer-events-none absolute inset-y-0 end-0 w-[12vw] min-w-12 bg-gradient-to-l from-[var(--md-ink)] to-transparent rtl:bg-gradient-to-r" />
        </div>
      </div>
    </section>
  );
};

export default TopicBar;
