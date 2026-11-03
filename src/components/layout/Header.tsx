
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

interface HeaderProps {
  backToHome?: boolean;
}

const Header = ({ backToHome = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="w-full pt-4 px-4 bg-transparent">
      <header className="container mx-auto bg-secondary rounded-[12px] py-4 px-6">
        {/* Mobil: Logo, Sprache, Menü nebeneinander. Ab md drei Spalten, die Sprache steht exakt in der Mitte. */}
        <div className="flex justify-between items-center gap-3 md:grid md:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex items-center gap-2 text-[20px] font-semibold text-foreground md:justify-self-start">
            <img src={logo} alt="MehrDrin Logo" className="h-8 w-auto" />
            MehrDrin
          </Link>

          <LanguageSwitcher />

          {backToHome ? (
            <Link to="/" className="whitespace-nowrap text-[15px] sm:text-[18px] text-foreground hover:text-primary transition-colors md:justify-self-end">
              <span className="inline-block rtl:rotate-180">←</span> <span className="hidden sm:inline">{t("Zurück zur")} </span>{t("Startseite")}
            </Link>
          ) : (
            <>
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-12 justify-self-end">
                <Link to="/about" className="text-[20px] text-foreground hover:text-primary transition-colors">
                  {t("über uns")}
                </Link>
                <Link to="/blog" className="text-[20px] text-foreground hover:text-primary transition-colors">
                  {t("blog")}
                </Link>
                <Button
                  onClick={() => navigate("/questionnaire")}
                  className="bg-foreground hover:bg-foreground/90 text-background text-[20px] px-6 py-2 rounded-[10px]"
                >
                  {t("start")}
                </Button>
              </nav>

              {/* Mobil: Menü */}
              <button
                className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
                onClick={() => setMenuOpen(true)}
                aria-label={t("Menü öffnen")}
              >
                <span className="block w-6 h-0.5 bg-foreground rounded-full" />
                <span className="block w-6 h-0.5 bg-foreground rounded-full" />
                <span className="block w-6 h-0.5 bg-foreground rounded-full" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer (slide in from right) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-secondary shadow-xl flex flex-col pt-6 px-8 gap-8 transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label={t("Menü schließen")}
          className="self-end text-foreground hover:text-primary transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav className="flex flex-col gap-6">
          <Link
            to="/about"
            className="text-[20px] text-foreground hover:text-primary transition-colors"
          >
            {t("über uns")}
          </Link>
          <Link
            to="/blog"
            className="text-[20px] text-foreground hover:text-primary transition-colors"
          >
            {t("blog")}
          </Link>
          <Button
            onClick={() => navigate("/questionnaire")}
            className="bg-foreground hover:bg-foreground/90 text-background text-[20px] px-6 py-2 rounded-[10px] w-full"
          >
            {t("start")}
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Header;
