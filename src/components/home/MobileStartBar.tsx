import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Feste Startleiste am unteren Rand, nur auf dem Handy. Sie erscheint, sobald
 * der Startknopf im Hero aus dem Bild gescrollt ist, und verschwindet wieder,
 * wenn der Abschlussbereich mit seinem eigenen Startknopf in Sicht kommt.
 * So liegt der Weg in den Fragebogen immer im Daumenbereich, ohne doppelt.
 */
const MobileStartBar = ({
  heroRef,
  endRef,
  onStart,
}: {
  heroRef: RefObject<HTMLElement>;
  endRef: RefObject<HTMLElement>;
  onStart: () => void;
}) => {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current?.getBoundingClientRect();
      const end = endRef.current?.getBoundingClientRect();
      if (!hero || !end) return;
      // Hero-Knopf ist weg, wenn der Hero zu drei Vierteln nach oben gescrollt ist
      const pastHero = hero.bottom < window.innerHeight * 0.25;
      const beforeEnd = end.top > window.innerHeight - 40;
      setShow(pastHero && beforeEnd);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [heroRef, endRef]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="startleiste"
          className="fixed inset-x-0 bottom-0 z-40 px-3 pt-3 md:hidden"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
        >
          <button
            type="button"
            onClick={onStart}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-[var(--md-ink)] py-2 pe-2 ps-6 text-[17px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,22,43,0.55)] active:scale-[0.98]"
          >
            <span>{t("Jetzt herausfinden")}</span>
            <span className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-white/60">{t("Kostenlos")}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--md-sun)] text-[var(--md-ink)]">
                <ArrowRight className="h-5 w-5 rtl:-scale-x-100" strokeWidth={2.5} />
              </span>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStartBar;
