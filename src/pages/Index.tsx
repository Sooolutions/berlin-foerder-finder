import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowDown, ArrowRight, Check, ClipboardList, Compass, Plus, Send, User } from "lucide-react";
import teamTechnik from "@/assets/team/technik.jpg";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { schemeOf } from "@/components/results/resultsTheme";
import ScrollReveal from "@/components/home/ScrollReveal";
import Counter from "@/components/home/Counter";
import OfferStack from "@/components/home/OfferStack";
import TopicBar, { type TopicCount } from "@/components/home/TopicBar";
import { useLanguage, tr } from "@/i18n/LanguageContext";
import { useFundingTranslations } from "@/hooks/useFundingTranslations";

interface FundingTeaser {
  id: string;
  title: string;
  description: string;
  organization: string;
  url: string;
  categories: string[] | null;
  funding_type?: "staatlich" | "privat" | "karitativ" | null;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = () => [
  {
    Icon: ClipboardList,
    title: tr("Fragen beantworten"),
    desc: tr("Ein paar kurze Fragen zu deiner Lebenssituation."),
    detail: tr("Viele Hilfen gibt es nur für bestimmte Gruppen. Darum fragen wir nach Alter, Tätigkeit, Haushalt, Wohnen, Finanzen, Gesundheit und dem, was dich gerade beschäftigt. Deine Antworten bleiben in deinem Browser."),
  },
  {
    Icon: Compass,
    title: tr("Angebote entdecken"),
    desc: tr("Wir zeigen dir passende Förderungen und Unterstützung."),
    detail: tr("Wir gleichen deine Antworten mit über tausend Angeboten aus ganz Berlin ab. Was nicht zu dir passt, fällt heraus, was besonders gut passt, steht oben. Die Farbe zeigt dir das Thema, filtern kannst du nach Bezirk."),
  },
  {
    Icon: Send,
    title: tr("Förderung beantragen"),
    desc: tr("Direkt zur richtigen Anlaufstelle — ohne Umwege."),
    detail: tr("Jedes Angebot hat einen Link, der dich direkt zur zuständigen Stelle bringt, also zur Antragsseite, zum Formular oder zur Beratung. Bei komplizierten Anträgen findest du unter deinen Treffern oft auch Hilfe beim Ausfüllen."),
  },
];

const faqs = () => [
  [
    tr("Was ist MehrDrin?"),
    tr("MehrDrin ist ein digitaler Wegweiser durch die Berliner Hilfelandschaft. Statt dich durch Dutzende Behördenseiten und Trägerangebote zu klicken, beantwortest du ein paar Fragen zu deiner Lebenssituation. Wir zeigen dir dann gebündelt, welche Förderungen, Leistungen, Beratungsstellen und Angebote zu dir passen, von Wohngeld über Familienhilfen bis zu Bildung, Gesundheit und Arbeit."),
  ],
  [
    tr("Für wen ist MehrDrin gedacht?"),
    tr("Für alle, die in Berlin leben und wissen wollen, welche Unterstützung ihnen offensteht. Besonders hilfreich ist MehrDrin auch für Fachkräfte in Sozialarbeit und Beratung, die gemeinsam mit Ratsuchenden schnell einen Überblick über passende Angebote brauchen."),
  ],
  [
    tr("Ist die Nutzung kostenlos?"),
    tr("Ja. MehrDrin ist komplett kostenlos, ohne Anmeldung und ohne Werbung. Auch die Angebote, die wir dir zeigen, sind sehr oft kostenlos. Wo etwas Geld kostet, steht es direkt am Angebot."),
  ],
  [
    tr("Welche Daten werden erhoben?"),
    tr("Du brauchst kein Konto, und wir fragen nie nach deinem Namen, deiner Adresse oder deinen Kontaktdaten. Deine Antworten werden nur in deinem Browser gespeichert und dort mit unserer Angebotsliste abgeglichen. Sie werden nicht an uns übertragen. Für unsere Statistik zählen wir lediglich anonym, wie viele Menschen welchen Abschnitt des Fragebogens erreichen, ohne Cookies und ohne deine Antworten."),
  ],
  [
    tr("Was passiert mit meinen Angaben nach der Nutzung?"),
    tr("Nichts. Deine Antworten bleiben nur so lange erhalten, wie dein Browserfenster geöffnet ist, damit du zurückblättern und Angaben ändern kannst. Sobald du das Fenster schließt, sind sie gelöscht. Wir geben keine Daten an Dritte weiter, weil wir deine Antworten gar nicht erst bekommen."),
  ],
  [
    tr("Wie aktuell sind die Informationen?"),
    tr("Unsere Angebote stammen aus offiziellen Quellen wie den Seiten des Landes Berlin und der Bezirke sowie direkt von den Trägern. Jede Nacht prüfen wir automatisch einen Teil der Datenbank auf funktionierende Links und aktuelle Angaben und korrigieren, was nicht mehr stimmt. Trotzdem können sich Bedingungen ändern. Wenn dir ein Fehler auffällt, schreib uns gern an info@mehrdrin-berlin.de."),
  ],
  [
    tr("Ersetzt MehrDrin eine Beratung?"),
    tr("Nein. MehrDrin zeigt dir, welche Angebote für dich infrage kommen, und bringt dich zur richtigen Stelle. Ob du einen Anspruch hast und in welcher Höhe, entscheidet am Ende immer die zuständige Behörde oder der Träger. Bei schwierigen Fragen findest du unter deinen Ergebnissen oft auch Beratungsstellen, die dich kostenlos begleiten."),
  ],
  [
    tr("Wer steckt hinter MehrDrin?"),
    tr("MehrDrin wird von einem kleinen, unabhängigen Team aus Berlin gebaut. Wir kümmern uns um Technik und Plattform, um Kommunikation und Vernetzung sowie um Inhalte und den Fragenpfad. Unser Ziel ist, MehrDrin als gemeinnütziges Projekt aufzustellen, damit der Zugang zu Unterstützung in Berlin für alle einfacher wird."),
  ],
];

/** Überschrift, deren Wörter nacheinander aus einer Maske nach oben gleiten */
const RevealTitle = ({ text, className }: { text: string; className?: string }) => (
  <h1 className={className} aria-label={text}>
    {text.split(" ").map((word, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
        <motion.span
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.08 }}
        >
          {word}
          {i < text.split(" ").length - 1 ? " " : ""}
        </motion.span>
      </span>
    ))}
  </h1>
);

const TeaserSkeleton = () => (
  <div className="h-full rounded-2xl border border-border p-6">
    <div className="md-skeleton mb-5 h-6 w-20 rounded-full" />
    <div className="md-skeleton mb-2 h-5 w-full rounded" />
    <div className="md-skeleton mb-5 h-5 w-2/3 rounded" />
    <div className="md-skeleton mb-2 h-3.5 w-full rounded" />
    <div className="md-skeleton h-3.5 w-4/5 rounded" />
  </div>
);

/**
 * Legt mehrere Texte in dieselbe Rasterzelle und zeigt nur einen davon.
 * Die Zelle ist so hoch wie der längste Text, so sind alle Kacheln gleich hoch.
 */
const Stacked = ({ texts, active, className }: { texts: string[]; active: number; className?: string }) => (
  <div className="grid">
    {texts.map((text, j) => (
      <p
        key={j}
        className={`[grid-area:1/1] ${className ?? ""}`}
        style={{ visibility: j === active ? "visible" : "hidden" }}
        aria-hidden={j !== active || undefined}
      >
        {text}
      </p>
    ))}
  </div>
);

/** Schritt-Kachel, die beim Anklicken einen erklärenden Text aufklappt */
const StepTile = ({
  index,
  Icon,
  title,
  desc,
  detail,
  allDescs,
  allDetails,
}: {
  index: number;
  Icon: typeof ClipboardList;
  title: string;
  desc: string;
  detail: string;
  /** Alle Kurz- und Erklärtexte, unsichtbar übereinander gelegt, damit jede Kachel gleich hoch wird */
  allDescs: string[];
  allDetails: string[];
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const id = `schritt-${index}`;
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-controls={id}
      className={`group relative block w-full overflow-hidden rounded-[28px] bg-[var(--md-paper)] p-9 text-center shadow-[var(--md-shadow-sm)] ring-1 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--md-shadow-md)] md:p-10 ${
        open ? "ring-[var(--md-brand)]/40 shadow-[var(--md-shadow-md)]" : "ring-border/70"
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute end-7 top-5 select-none text-[72px] font-extrabold leading-none transition-colors duration-500 group-hover:text-[var(--md-sun)] ${
          open ? "text-[var(--md-sun)]" : "text-[var(--md-chip)]"
        }`}
        style={{ fontFamily: "var(--md-font-display)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative z-10 mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--md-ink)] text-[var(--md-sun)] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
        <Icon className="h-7 w-7" strokeWidth={2.2} />
      </div>
      <h3 className="mb-2 !text-[clamp(1.3rem,1.1rem+0.6vw,1.6rem)]">{title}</h3>
      <Stacked texts={allDescs} active={index} className="text-[16px] text-muted-foreground" />

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-5 border-t border-[var(--md-line)] pt-5">
              <Stacked texts={allDetails} active={index} className="text-start text-[15.5px] leading-relaxed text-[var(--md-ink-2)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--md-brand)]">
        {open ? t("Weniger anzeigen") : t("Mehr erfahren")}
        <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-[var(--md-brand-tint)] transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
        </span>
      </span>
    </button>
  );
};

/** Pfeil zwischen zwei Schritten, nebeneinander nach rechts, untereinander nach unten */
const StepArrow = ({ delay }: { delay: number }) => (
  <motion.div
    aria-hidden
    className="flex justify-center md:mt-[3.4rem] md:self-start"
    initial={{ opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: EASE, delay }}
  >
    <motion.span
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--md-sun)] text-[var(--md-ink)] shadow-[var(--md-shadow-sm)]"
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <ArrowRight className="hidden h-5 w-5 md:block rtl:-scale-x-100" strokeWidth={2.6} />
      <ArrowDown className="h-5 w-5 md:hidden" strokeWidth={2.6} />
    </motion.span>
  </motion.div>
);

/** Angebotskarte im Karussell */
const OfferCard = ({
  funding,
  lang,
  t,
  hidden,
}: {
  funding: FundingTeaser;
  lang: string;
  t: (key: string) => string;
  hidden: boolean;
}) => {
  const colors = schemeOf(funding);
  return (
    <a
      href={funding.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className="group/card relative flex min-h-[290px] w-[300px] flex-none flex-col rounded-3xl border p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[var(--md-shadow-md)] sm:w-[340px]"
      style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
    >
      <span className="mb-6 inline-block self-start rounded-full px-3 py-1 text-[13px] font-semibold text-white" style={{ backgroundColor: colors.accent }}>
        {funding.categories?.[0] ? t(funding.categories[0]) : funding.organization}
      </span>
      <h3 lang={lang} className="mb-3 line-clamp-2 !text-[21px] !leading-tight text-foreground [hyphens:auto]">
        {funding.title}
      </h3>
      <p className="line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{funding.description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="truncate text-[13px] font-medium text-[var(--md-ink-4)]">{funding.organization}</span>
        <span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full transition-transform duration-300 group-hover/card:rotate-[-45deg] rtl:group-hover/card:rotate-[45deg]"
          style={{ backgroundColor: colors.accent, color: "#fff" }}
          aria-hidden
        >
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
        </span>
      </div>
    </a>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [rawTeasers, setFundingTeasers] = useState<FundingTeaser[]>([]);
  const fundingTeasers = useFundingTranslations(rawTeasers);
  const [offerCount, setOfferCount] = useState<number | null>(null);
  const [topics, setTopics] = useState<TopicCount[]>([]);


  useEffect(() => {
    const fetchRandomFunding = async () => {
      const { data, error, count } = await supabase
        .from("funding")
        .select("id, title, description, organization, url, categories, funding_type", { count: "exact" });
      if (data && !error) {
        setOfferCount(count ?? data.length);
        const shuffled = [...(data as unknown as FundingTeaser[])].sort(() => 0.5 - Math.random());
        setFundingTeasers(shuffled.slice(0, 14));
        // Angebote je Thema zählen, ein Angebot kann in mehreren Themen stehen
        const counts = new Map<string, number>();
        for (const row of data as unknown as FundingTeaser[]) {
          for (const c of row.categories ?? []) counts.set(c, (counts.get(c) ?? 0) + 1);
        }
        setTopics(
          [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        );
      }
    };
    fetchRandomFunding();
  }, []);

  const startQuestionnaire = () => navigate("/questionnaire");
  const trust = [t("Kostenlos"), t("Ohne Anmeldung"), t("In 5 Sprachen")];

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header floating />

      <main className="flex-grow">
        {/* Hero: helles Papier, große Schrift, rechts echte Angebote als Kartenstapel */}
        <section className="relative overflow-hidden bg-[var(--md-paper)] pb-20 pt-32 md:pb-28 md:pt-40">
          {/* Weiche Farbflächen im Hintergrund */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -end-40 -top-40 h-[38rem] w-[38rem] rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--md-brand-tint), transparent)" }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-48 -start-32 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--md-sun), transparent)" }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--md-line-strong)] bg-[var(--md-surface)] py-1.5 pe-4 ps-1.5 text-[14px] font-semibold text-[var(--md-ink-2)] shadow-[var(--md-shadow-sm)]"
              >
                <span className="rounded-full bg-[var(--md-ink)] px-2.5 py-0.5 text-[12px] font-bold text-[var(--md-sun)]">
                  {offerCount ? Math.floor(offerCount / 10) * 10 + "+" : "…"}
                </span>
                {t("Angebote in Berlin")}
              </motion.div>

              <div className="relative inline-block">
                <RevealTitle
                  text={t("Da ist noch mehr drin!")}
                  className="!text-[clamp(3rem,1.6rem+6vw,6.25rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-[var(--md-ink)]"
                />
                {/* Handgezeichneter Strich unter der Überschrift */}
                <svg aria-hidden viewBox="0 0 420 24" preserveAspectRatio="none" className="absolute -bottom-4 start-0 h-5 w-[70%] lg:w-[60%] rtl:-scale-x-100">
                  <motion.path
                    d="M4 16 C 80 4, 160 6, 230 12 S 360 20, 416 8"
                    fill="none"
                    stroke="var(--md-sun)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: "easeInOut", delay: 0.75 }}
                  />
                </svg>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                className="mx-auto mb-10 mt-10 max-w-lg text-[19px] leading-relaxed text-[var(--md-ink-3)] md:text-[21px] lg:mx-0"
              >
                {t("Ein paar kurze Fragen zu deiner Lebenssituation und du siehst, welche Hilfen und Förderungen in Berlin zu dir passen.")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
                className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center"
              >
                <button
                  type="button"
                  onClick={startQuestionnaire}
                  className="md-shine group inline-flex items-center gap-3 rounded-full bg-[var(--md-ink)] py-2 pe-2 ps-7 text-[17px] font-semibold text-white shadow-[var(--md-shadow-md)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {t("Jetzt herausfinden")}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--md-sun)] text-[var(--md-ink)] transition-transform duration-500 group-hover:rotate-[-45deg] rtl:group-hover:rotate-[45deg]">
                    <ArrowRight className="h-5 w-5 rtl:-scale-x-100" strokeWidth={2.5} />
                  </span>
                </button>
                <a
                  href="#so-gehts"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[16px] font-semibold text-[var(--md-ink-2)] underline decoration-[var(--md-line-strong)] decoration-2 underline-offset-[6px] transition-colors hover:decoration-[var(--md-brand)]"
                >
                  {t("So funktioniert's")}
                </a>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] font-medium text-[var(--md-ink-3)] lg:justify-start"
              >
                {trust.map((label) => (
                  <li key={label} className="inline-flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--md-brand)] text-white">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    {label}
                  </li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
              className="relative px-9 pt-10 sm:px-4"
            >
              <OfferStack offers={fundingTeasers.slice(0, 4)} />
              {/* Aufkleber */}
              <motion.div
                aria-hidden
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.2 }}
                className="absolute start-0 top-2 z-50 flex h-20 w-20 sm:h-24 sm:w-24 flex-col items-center justify-center rounded-full bg-[var(--md-sun)] text-center text-[13px] font-extrabold leading-tight text-[var(--md-ink)] shadow-[var(--md-shadow-md)] md:-start-6"
                style={{ fontFamily: "var(--md-font-display)" }}
              >
                <Check className="mb-0.5 h-5 w-5" strokeWidth={3} />
                {t("Kostenlos")}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <TopicBar topics={topics} />

        {/* Erkennungsmomente als Sprechblasen */}
        <section className="relative overflow-hidden px-4 py-28 md:py-36">
          <div className="container relative mx-auto max-w-4xl">
            <div className="mb-16 flex flex-col gap-5">
              {[
                { text: t("„Schon wieder knapp vor dem Monatsende?“"), cls: "self-start bg-[var(--md-surface)] text-[var(--md-ink-2)] rounded-bl-md rtl:rounded-bl-[1.75rem] rtl:rounded-br-md", rot: -2 },
                { text: t("„Irgendwo gibt's bestimmt was für mich — aber wann soll ich das rausfinden?“"), cls: "self-end bg-[var(--md-brand-tint)] text-[var(--md-brand-ink)] rounded-br-md rtl:rounded-br-[1.75rem] rtl:rounded-bl-md", rot: 1.5 },
                { text: t("„Wer blickt bei den ganzen Ämtern und Anträgen eigentlich noch durch?“"), cls: "self-start bg-[var(--md-ink)] text-white rounded-bl-md rtl:rounded-bl-[1.75rem] rtl:rounded-br-md md:ms-16", rot: -1 },
              ].map((q, i) => (
                <ScrollReveal key={i} delay={i * 0.14} className={`max-w-[34rem] ${q.cls.includes("self-end") ? "self-end" : "self-start"}`}>
                  <motion.p
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    style={{ rotate: q.rot, fontFamily: "var(--md-font-display)" }}
                    className={`rounded-[1.75rem] border border-[var(--md-line)] px-7 py-5 text-[22px] font-bold leading-snug tracking-[-0.015em] shadow-[var(--md-shadow-sm)] md:text-[28px] ${q.cls}`}
                  >
                    {q.text}
                  </motion.p>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.4} className="text-center">
              <p className="inline-block -rotate-1 rounded-full bg-[var(--md-sun)] px-6 py-3 text-[20px] font-extrabold text-[var(--md-ink)] md:text-[24px]" style={{ fontFamily: "var(--md-font-display)" }}>
                {t("Genau dafür ist MehrDrin da.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* So geht's: drei Kacheln, jede klappt beim Anklicken eine Erklärung auf */}
        <section id="so-gehts" className="scroll-mt-24 bg-[var(--md-surface)] px-4 py-24 md:py-28">
          <div className="container mx-auto max-w-6xl">
            <ScrollReveal>
              <p className="md-kicker mb-16 text-center !text-primary">
                {t("Kein Amt. Keine Warteschlange. Nur deine Möglichkeiten.")}
              </p>
            </ScrollReveal>
            <div className="relative grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
              {steps().map((step, i, all) => (
                <Fragment key={step.title}>
                  <ScrollReveal delay={0.1 + i * 0.15}>
                    <StepTile index={i} {...step} allDescs={all.map((x) => x.desc)} allDetails={all.map((x) => x.detail)} />
                  </ScrollReveal>
                  {i < all.length - 1 && <StepArrow delay={0.35 + i * 0.15} />}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Angebote */}
        <section className="overflow-hidden bg-[var(--md-paper)] py-24 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-14 flex flex-col items-center text-center">
              <ScrollReveal>
                <h2 className="mb-4 text-foreground">{t("Das wartet auf dich.")}</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="mx-auto max-w-xl text-muted-foreground">
                  {offerCount
                    ? t("Ein Ausschnitt aus über {n} Angeboten für Bildung, Wohnen, Familie und Gesundheit.", { n: Math.floor(offerCount / 10) * 10 })
                    : t("Ein Ausschnitt aus vielen Angeboten für Bildung, Wohnen, Familie und Gesundheit.")}
                </p>
              </ScrollReveal>
            </div>

          </div>

          {/* Karussell: läuft langsam von rechts nach links, hält beim Darüberfahren an */}
          <div className="md-carousel group relative">
            {fundingTeasers.length ? (
              <div
                className="md-marquee-track flex w-max gap-5 py-3 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
                style={{ animationDuration: "80s" }}
              >
                {[...fundingTeasers.slice(4, 14), ...fundingTeasers.slice(4, 14)].map((funding, i) => (
                  <OfferCard key={`${funding.id}-${i}`} funding={funding} lang={lang} t={t} hidden={i >= Math.min(10, fundingTeasers.length - 4)} />
                ))}
              </div>
            ) : (
              <div className="flex gap-5 overflow-hidden px-4 py-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="w-[300px] flex-none sm:w-[340px]">
                    <TeaserSkeleton />
                  </div>
                ))}
              </div>
            )}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-r from-[var(--md-paper)] to-transparent md:w-40 rtl:bg-gradient-to-l" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-l from-[var(--md-paper)] to-transparent md:w-40 rtl:bg-gradient-to-r" />
          </div>

          <div className="container mx-auto max-w-6xl">
            <ScrollReveal delay={0.2} className="mt-10 text-center">
              <button
                type="button"
                onClick={startQuestionnaire}
                className="group inline-flex items-center gap-2 text-[16px] font-semibold text-primary"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                  {t("Alle passenden Angebote finden")}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
              </button>
            </ScrollReveal>
          </div>
        </section>

        {/* Zahlen */}
        <section className="relative overflow-hidden bg-[#0b0b0d] px-4 py-24 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="container relative mx-auto grid max-w-5xl grid-cols-1 gap-14 text-center md:grid-cols-3 md:gap-8">
            <ScrollReveal>
              <Counter to={offerCount ?? 0} className="mb-3 block text-6xl font-extrabold tracking-[-0.04em] text-[var(--md-sun)] md:text-8xl" />
              <p className="text-white/65">{t("Angebote, staatlich und nicht-staatlich")}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <Counter to={10} className="mb-3 block text-6xl font-extrabold tracking-[-0.04em] text-[var(--md-sun)] md:text-8xl" />
              <p className="text-white/65">{t("kurze Fragen bis zu deiner Übersicht")}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <span className="mb-3 block text-6xl font-extrabold tracking-[-0.04em] text-[var(--md-sun)] md:text-8xl">
                1-2<span className="ms-1 align-top text-2xl">min</span>
              </span>
              <p className="text-white/65">{t("bis du weißt, was für dich drin ist")}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Wer dahinter steht, ehrlich und ohne Platzhalterbild */}
        <section className="px-4 py-24 md:py-28">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <ScrollReveal>
                <p className="md-kicker mb-4">{t("Wer dahinter steht")}</p>
                <h2 className="mb-5 text-foreground">{t("Wir bauen das für Berlin.")}</h2>
                <p className="text-lg text-muted-foreground">
                  {t("MehrDrin entsteht gerade — von Menschen, die selbst durch Berliner Bürokratie navigieren mussten. Noch gibt es keine große Geschichte zu erzählen, nur den Anspruch, das für dich einfacher zu machen.")}
                </p>
              </ScrollReveal>
              {/* Rollenkarten, mit Foto und LinkedIn, sofern vorhanden */}
              <div className="grid gap-3">
                {[
                  { label: t("Technik und Plattform"), color: "var(--md-brand)", photo: teamTechnik, href: "https://www.linkedin.com/in/jonas-helm-ba66aa2a9" },
                  // TODO: Foto für Kommunikation und Netzwerk ergänzen (src/assets/team/kommunikation.jpg)
                  { label: t("Kommunikation und Netzwerk"), color: "var(--md-sun)", photo: null, href: "https://www.linkedin.com/in/max-reschke/" },
                  { label: t("Inhalte und Fragenpfad"), color: "var(--md-kicker)", photo: null, href: null },
                ].map((role, i) => {
                  const inner = (
                    <>
                      <span
                        className="relative flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-full ring-[3px] ring-offset-2 ring-offset-[var(--md-surface)]"
                        style={{ background: role.color, ["--tw-ring-color" as string]: role.color }}
                        aria-hidden
                      >
                        {role.photo ? (
                          <img src={role.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <User className="h-6 w-6 text-white" strokeWidth={2.4} />
                        )}
                      </span>
                      <span className="flex-1 text-[17px] font-semibold">{role.label}</span>
                    </>
                  );
                  const cls =
                    "group flex items-center gap-4 rounded-2xl border border-border bg-[var(--md-surface)] p-4 pe-5 shadow-[var(--md-shadow-sm)] transition-[transform,box-shadow] duration-500";
                  return (
                    <ScrollReveal key={role.label} delay={0.1 + i * 0.1} y={18}>
                      {role.href ? (
                        <a
                          href={role.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${role.label}, LinkedIn`}
                          className={`${cls} hover:-translate-y-0.5 hover:shadow-[var(--md-shadow-md)]`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={cls}>{inner}</div>
                      )}
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[var(--md-surface)] px-4 py-24">
          <div className="container mx-auto">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-[2fr_3fr]">
              <ScrollReveal className="lg:sticky lg:top-28">
                <h2 className="text-foreground">{t("Antworten auf die häufig gestellten Fragen.")}</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs().map(([q, a], i) => (
                    <AccordionItem
                      key={q}
                      value={`item-${i}`}
                      className="rounded-2xl border border-border bg-background px-6 transition-shadow duration-300 hover:shadow-[var(--md-shadow-sm)] data-[state=open]:shadow-[var(--md-shadow-md)]"
                    >
                      <AccordionTrigger className="py-5 text-start text-[17px] font-semibold hover:no-underline [&>svg]:hidden [&[data-state=open]_.md-plus]:rotate-45 [&[data-state=open]_.md-plus]:bg-primary [&[data-state=open]_.md-plus]:text-primary-foreground">
                        {q}
                        <span className="md-plus ms-4 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-muted transition-[transform,background-color,color] duration-300">
                          <Plus className="h-4 w-4" />
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-[16px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Abschluss */}
        <section className="relative overflow-hidden bg-[var(--md-sun)] px-4 py-32">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -start-24 -top-24 h-96 w-96 rounded-full bg-white/50 blur-3xl"
            animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -end-16 h-[28rem] w-[28rem] rounded-full bg-[#ff9d2e]/40 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <ScrollReveal>
            <div className="container relative mx-auto max-w-3xl text-center">
              <h2 className="mb-5 !text-[clamp(2.25rem,1.4rem+3.5vw,4.25rem)] !leading-[1] text-[var(--md-ink)]">{t("Finde jetzt heraus, was dir zusteht.")}</h2>
              <p className="mb-10 text-lg text-[var(--md-ink-2)]">{t("In nur wenigen Minuten zu deinen passenden Förderungen.")}</p>
              <button
                type="button"
                onClick={startQuestionnaire}
                className="md-shine group inline-flex items-center gap-2.5 rounded-full bg-[var(--md-ink)] px-10 py-4 text-[18px] font-bold text-white shadow-xl transition-transform duration-300 hover:-translate-y-0.5"
              >
                {t("Jetzt starten")}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
              </button>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
