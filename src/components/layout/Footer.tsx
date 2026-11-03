
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Pages */}
          <div className="space-y-4">
            <h3 className="text-[25px] font-semibold mb-6">{t("Seiten")}</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                {t("Start")}
              </Link>
              <Link to="/questionnaire" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                {t("Fragebogen")}
              </Link>
              <Link to="/blog" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                {t("Über uns")}
              </Link>
            </nav>
          </div>

          {/* Column 2: Legal */}
          <div className="space-y-4">
            <h3 className="text-[25px] font-semibold mb-6">{t("Rechtliches")}</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/impressum" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                {t("Impressum")}
              </Link>
              <Link to="/datenschutz" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                {t("Datenschutz")}
              </Link>
              {/* TODO: Nutzungsbedingungen-Seite erstellen */}
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                {t("Nutzungsbedingungen")}
              </a>
            </nav>
          </div>

          {/* Column 3: Kontakt und Social Media */}
          <div className="space-y-4">
            <h3 className="text-[25px] font-semibold mb-6">{t("Kontakt")}</h3>
            <nav className="flex flex-col gap-3">
              <a
                href="mailto:info@mehrdrin-berlin.de"
                className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-3 break-all"
              >
                <Mail className="w-6 h-6 flex-none" />
                info@mehrdrin-berlin.de
              </a>
              <a
                href="https://www.instagram.com/mehrdrin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-3"
              >
                <Instagram className="w-6 h-6 flex-none" />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61596090425681"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-3"
              >
                <Facebook className="w-6 h-6 flex-none" />
                Facebook
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-[18px] text-primary-foreground/70">
            © 2026 MehrDrin. {t("Alle Rechte vorbehalten.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
