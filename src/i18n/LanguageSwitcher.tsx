import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useLanguage } from "./LanguageContext";

/**
 * Sprachauswahl in der Mitte der Navigationsleiste. Der Knopf zeigt das
 * Kürzel der aktuellen Sprache, das Menü jede Sprache in ihrer eigenen
 * Schreibweise. Keine Flaggen, denn Flaggen stehen für Staaten, nicht für
 * Sprachen.
 */
const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Sprache / Language: ${current.label}`}
        className={`flex flex-none items-center gap-1.5 rounded-full border border-foreground/15 bg-white/70 px-3 py-1.5 text-[14px] font-semibold text-foreground transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      >
        <Globe className="w-4 h-4 text-foreground/60" aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown className="w-3.5 h-3.5 text-foreground/50" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-[170px] bg-white">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            lang={l.code}
            dir={l.rtl ? "rtl" : "ltr"}
            onSelect={() => l.code !== lang && setLang(l.code)}
            className="flex items-center justify-between gap-4 text-[15px] cursor-pointer"
          >
            <span>{l.label}</span>
            {l.code === lang && <Check className="w-4 h-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
