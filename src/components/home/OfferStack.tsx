import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { schemeOf } from "@/components/results/resultsTheme";
import { useLanguage } from "@/i18n/LanguageContext";

export interface StackOffer {
  id: string;
  title: string;
  description: string;
  organization: string;
  categories: string[] | null;
  funding_type?: "staatlich" | "privat" | "karitativ" | null;
}

/** Lage der Karten im Stapel: vorne, dahinter, ganz hinten, unsichtbar */
const POSES = [
  { x: 0, y: 0, rotate: -3, scale: 1, opacity: 1 },
  { x: 34, y: -26, rotate: 5, scale: 0.95, opacity: 1 },
  { x: -30, y: -48, rotate: -9, scale: 0.9, opacity: 0.9 },
  { x: 0, y: -60, rotate: 0, scale: 0.85, opacity: 0 },
];

/**
 * Echte Angebote aus der Datenbank als gefächerter Kartenstapel. Alle paar
 * Sekunden wandert die vordere Karte nach hinten. Bei reduzierter Bewegung
 * steht der Stapel still.
 */
const OfferStack = ({ offers }: { offers: StackOffer[] }) => {
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const [front, setFront] = useState(0);
  const n = offers.length;

  useEffect(() => {
    if (reduce || n < 2) return;
    const id = setInterval(() => setFront((f) => (f + 1) % n), 3400);
    return () => clearInterval(id);
  }, [reduce, n]);

  if (!n) {
    return <div className="md-skeleton mx-auto aspect-[4/3] w-full max-w-[420px] rounded-[28px]" />;
  }

  return (
    <div className="relative mx-auto aspect-[4/3.4] w-full max-w-[440px]" aria-hidden>
      {offers.map((offer, i) => {
        const pos = (i - front + n) % n;
        const pose = POSES[Math.min(pos, POSES.length - 1)];
        const scheme = schemeOf(offer);
        return (
          <motion.div
            key={offer.id}
            className="absolute inset-x-0 bottom-0 flex h-[86%] flex-col rounded-[28px] border p-5 shadow-[var(--md-shadow-lg)] sm:p-7"
            style={{
              zIndex: n - pos,
              background: pos === 0 ? "var(--md-surface)" : scheme.cardBg,
              borderColor: scheme.cardBorder,
            }}
            initial={false}
            animate={pose}
            transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.9 }}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white"
                style={{ background: scheme.accent }}
              >
                {offer.categories?.[0] ? t(offer.categories[0]) : t("Angebot")}
              </span>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: scheme.chipBg, color: scheme.accent }}
              >
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
            <div
              lang={lang}
              className="mt-auto line-clamp-2 text-[clamp(21px,5.5vw,26px)] leading-[1.08] tracking-[-0.02em] [hyphens:auto]"
              style={{ fontFamily: "var(--md-font-display)", fontWeight: 800, color: scheme.ink }}
            >
              {offer.title}
            </div>
            <p className="mt-2 line-clamp-2 text-[15px] leading-snug text-[var(--md-ink-3)]">{offer.description}</p>
            <div className="mt-4 truncate border-t pt-3 text-[13px] font-medium text-[var(--md-ink-4)]" style={{ borderColor: scheme.cardBorder }}>
              {offer.organization}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OfferStack;
