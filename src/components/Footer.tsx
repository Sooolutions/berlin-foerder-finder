
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Pages */}
          <div className="space-y-4">
            <h3 className="text-[25px] font-semibold mb-6">Seiten</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Start
              </Link>
              <Link to="/questionnaire" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Fragebogen
              </Link>
              <Link to="/blog" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Über uns
              </Link>
            </nav>
          </div>

          {/* Column 2: Legal */}
          <div className="space-y-4">
            <h3 className="text-[25px] font-semibold mb-6">Rechtliches</h3>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Impressum
              </a>
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Datenschutz
              </a>
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Nutzungsbedingungen
              </a>
            </nav>
          </div>

          {/* Column 3: Social */}
          <div className="space-y-4">
            <h3 className="text-[25px] font-semibold mb-6">Social Media</h3>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-3">
                <Instagram className="w-6 h-6" />
                Instagram
              </a>
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-3">
                <Linkedin className="w-6 h-6" />
                LinkedIn
              </a>
              <a href="#" className="text-[25px] text-primary-foreground/90 hover:text-primary-foreground transition-colors flex items-center gap-3">
                <Facebook className="w-6 h-6" />
                Facebook
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-[18px] text-primary-foreground/70">
            © 2025 MehrDrin. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
