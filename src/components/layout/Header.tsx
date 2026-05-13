
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

interface HeaderProps {
  backToHome?: boolean;
}

const Header = ({ backToHome = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-[20px] font-semibold text-foreground">
            <img src={logo} alt="MehrDrin Logo" className="h-8 w-auto" />
            MehrDrin
          </Link>

          {backToHome ? (
            <Link to="/" className="text-[18px] text-foreground hover:text-primary transition-colors">
              ← Zurück zur Startseite
            </Link>
          ) : (
            <>
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-12">
                <Link to="/about" className="text-[20px] text-foreground hover:text-primary transition-colors">
                  über uns
                </Link>
                <Link to="/blog" className="text-[20px] text-foreground hover:text-primary transition-colors">
                  blog
                </Link>
                <Button
                  onClick={() => navigate("/questionnaire")}
                  className="bg-foreground hover:bg-foreground/90 text-background text-[20px] px-6 py-2 rounded-[10px]"
                >
                  start
                </Button>
              </nav>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
                onClick={() => setMenuOpen(true)}
                aria-label="Menü öffnen"
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
          aria-label="Menü schließen"
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
            über uns
          </Link>
          <Link
            to="/blog"
            className="text-[20px] text-foreground hover:text-primary transition-colors"
          >
            blog
          </Link>
          <Button
            onClick={() => navigate("/questionnaire")}
            className="bg-foreground hover:bg-foreground/90 text-background text-[20px] px-6 py-2 rounded-[10px] w-full"
          >
            start
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Header;
