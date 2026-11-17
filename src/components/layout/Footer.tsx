import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const columns = [
    {
      title: t("Seiten"),
      links: [
        { to: "/", label: t("Start") },
        { to: "/questionnaire", label: t("Fragebogen") },
        { to: "/blog", label: t("Blog") },
        { to: "/about", label: t("Über uns") },
      ],
    },
    {
      title: t("Rechtliches"),
      links: [
        { to: "/impressum", label: t("Impressum") },
        { to: "/datenschutz", label: t("Datenschutz") },
      ],
    },
  ];

  const social = [
    { href: "mailto:info@mehrdrin-berlin.de", label: "info@mehrdrin-berlin.de", Icon: Mail, external: false },
    { href: "https://www.instagram.com/mehrdrin/", label: "Instagram", Icon: Instagram, external: true },
    { href: "https://www.facebook.com/profile.php?id=61596090425681", label: "Facebook", Icon: Facebook, external: true },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-[var(--md-ink)] text-white">
      {/* Weicher Lichtfleck in Markenfarbe, rein dekorativ */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 end-[-10%] h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--md-brand), transparent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 text-[20px] font-bold tracking-tight">
              <img src={logo} alt="" className="h-8 w-auto brightness-0 invert" />
              MehrDrin
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
              {t("Finde passende Förderungen, Angebote und Unterstützung für deine Lebenssituation in Berlin. Kostenlos und vertraulich.")}
            </p>
            <Link
              to="/questionnaire"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-[var(--md-ink)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("Jetzt starten")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="mb-4 !text-[13px] font-semibold uppercase tracking-[0.12em] text-white/45">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[15px] text-white/80 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <h3 className="mb-4 !text-[13px] font-semibold uppercase tracking-[0.12em] text-white/45">{t("Kontakt")}</h3>
            <ul className="space-y-2.5">
              {social.map(({ href, label, Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2.5 break-all text-[15px] text-white/80 transition-colors hover:text-white"
                  >
                    <Icon className="h-4 w-4 flex-none opacity-70" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MehrDrin. {t("Alle Rechte vorbehalten.")}</p>
          <p>{t("Gebaut in Berlin.")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
