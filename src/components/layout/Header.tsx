import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import logo from "@/assets/logo.png";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

interface HeaderProps {
  backToHome?: boolean;
  /** liegt transparent über einem dunklen Hero und wird beim Scrollen hell */
  overlay?: boolean;
  /** klebt beim Scrollen oben, blendet sich beim Runterscrollen aus */
  sticky?: boolean;
  /** liegt transparent über einem hellen Hero und bekommt beim Scrollen Glas */
  floating?: boolean;
}

/** Scrollzustand: über der Kante und Richtung, mit etwas Toleranz gegen Zittern */
const useScrollState = (enabled: boolean) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - last.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 320);
        last.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return { scrolled, hidden };
};

const Header = ({ backToHome = false, overlay = false, sticky = true, floating = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { scrolled, hidden } = useScrollState(sticky);

  // Über dem Hero hell auf dunkel, sonst die normale helle Leiste
  const transparentTop = (overlay || floating) && !scrolled && !menuOpen;
  const onDark = overlay && transparentTop;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { to: "/about", label: t("über uns") },
    { to: "/blog", label: t("blog") },
  ];

  const position = sticky ? (overlay || floating ? "fixed" : "sticky") : "relative";

  return (
    <>
      <div
        className={`${position} inset-x-0 top-0 z-40 w-full px-3 pt-3 sm:px-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          hidden && !menuOpen ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <header
          className={`container mx-auto rounded-2xl border px-4 py-2.5 sm:px-5 transition-[background-color,border-color,box-shadow,color] duration-300 ${
            transparentTop
              ? `border-transparent bg-transparent ${onDark ? "text-white" : "text-foreground"}`
              : "border-border/70 bg-background/80 text-foreground shadow-[var(--md-shadow-sm)] backdrop-blur-xl backdrop-saturate-150"
          }`}
        >
          <div className="flex items-center justify-between gap-3 md:grid md:grid-cols-[1fr_auto_1fr]">
            <Link
              to="/"
              className="group flex items-center gap-2.5 text-[19px] font-bold tracking-tight md:justify-self-start"
              aria-label="MehrDrin, Startseite"
            >
              <img
                src={logo}
                alt=""
                className={`h-8 w-auto transition-[filter,transform] duration-300 group-hover:-rotate-6 group-hover:scale-105 ${onDark ? "brightness-0 invert" : ""}`}
              />
              <span>MehrDrin</span>
            </Link>

            <LanguageSwitcher tone={onDark ? "onDark" : "light"} />

            {backToHome ? (
              <Link
                to="/"
                className="whitespace-nowrap text-[15px] font-medium opacity-80 transition-opacity hover:opacity-100 md:justify-self-end"
              >
                <span className="inline-block rtl:rotate-180">←</span>{" "}
                <span className="hidden sm:inline">{t("Zurück zur")} </span>
                {t("Startseite")}
              </Link>
            ) : (
              <>
                <nav className="hidden items-center gap-1 md:flex justify-self-end">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) =>
                        `relative rounded-full px-4 py-2 text-[16px] font-medium transition-colors after:absolute after:inset-x-4 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                          isActive ? "after:scale-x-100" : ""
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={() => navigate("/questionnaire")}
                    className={`md-shine ms-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-[background-color,color,transform] duration-300 hover:-translate-y-px active:translate-y-0 ${
                      onDark ? "bg-white text-foreground" : "bg-foreground text-background"
                    }`}
                  >
                    {t("start")}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2.5} />
                  </button>
                </nav>

                <button
                  className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-label={t("Menü öffnen")}
                  aria-expanded={menuOpen}
                >
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                  <span className="block h-0.5 w-5 rounded-full bg-current" />
                </button>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Mobiles Menü */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed inset-y-0 end-0 z-50 flex w-[min(20rem,86vw)] flex-col bg-background px-7 pb-8 pt-5 shadow-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                aria-label={t("Menü schließen")}
                className="self-end rounded-full p-2 transition-colors hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>

              <nav className="mt-6 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    <Link to={l.to} className="block py-3 text-[28px] font-bold tracking-tight" style={{ fontFamily: "var(--md-font-display)" }}>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                onClick={() => navigate("/questionnaire")}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-[17px] font-semibold text-primary-foreground"
              >
                {t("Jetzt herausfinden")}
                <ArrowRight className="h-5 w-5 rtl:-scale-x-100" />
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
