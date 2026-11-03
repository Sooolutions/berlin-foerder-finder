import { Globe } from "lucide-react";
import { LANGUAGES, useLanguage } from "./LanguageContext";

/**
 * Sprachumschalter für die Navigationsleiste. Jede Sprache steht in ihrer
 * eigenen Schreibweise, ohne Flaggen (Flaggen stehen für Staaten, nicht für
 * Sprachen).
 */
const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Sprache / Language"
      className={`flex flex-none items-center gap-0.5 sm:gap-1 rounded-full border border-foreground/15 bg-white/60 p-1 ${className}`}
    >
      <Globe className="hidden sm:block w-4 h-4 mx-1 text-foreground/60 flex-none" aria-hidden="true" />
      {LANGUAGES.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            title={l.label}
            aria-label={l.label}
            aria-pressed={active}
            onClick={() => !active && setLang(l.code)}
            className={`rounded-full px-2 sm:px-2.5 py-1 text-[13px] font-semibold leading-none transition-colors ${
              active ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
