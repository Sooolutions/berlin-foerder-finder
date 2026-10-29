import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { schemeOf } from "@/components/results/resultsTheme";
import ScrollReveal from "@/components/home/ScrollReveal";
import Counter from "@/components/home/Counter";
import heroImg from "@/assets/hero-wallet.jpg";
import heroImgMobile from "@/assets/hero-wallet-mobile.jpg";

interface FundingTeaser {
  id: string;
  title: string;
  description: string;
  organization: string;
  url: string;
  categories: string[] | null;
  funding_type?: "staatlich" | "privat" | "karitativ" | null;
}

const steps = [
  {
    title: "Fragen beantworten",
    desc: "10 kurze Fragen zu deiner Lebenssituation.",
  },
  {
    title: "Angebote entdecken",
    desc: "Wir zeigen dir passende Förderungen und Unterstützung.",
  },
  {
    title: "Förderung beantragen",
    desc: "Direkt zur richtigen Anlaufstelle — ohne Umwege.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [fundingTeasers, setFundingTeasers] = useState<FundingTeaser[]>([]);
  const [offerCount, setOfferCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRandomFunding = async () => {
      const { data, error, count } = await supabase
        .from("funding")
        .select("id, title, description, organization, url, categories, funding_type", { count: "exact" });
      if (data && !error) {
        setOfferCount(count ?? data.length);
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setFundingTeasers(shuffled.slice(0, 5));
      }
    };
    fetchRandomFunding();
  }, []);

  const startQuestionnaire = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      {/* Navigation liegt über dem Hero-Bild */}
      <div className="absolute inset-x-0 top-0 z-30">
        <Header />
      </div>

      <main className="flex-grow">
        {/* Hero — full-bleed, emotional, one message */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-20">
          <div className="absolute inset-0">
            {/* Portemonnaie liegt in beiden Bildvarianten exakt in der Bildmitte */}
            <picture>
              <source media="(max-aspect-ratio: 3/4)" srcSet={heroImgMobile} />
              <img
                src={heroImg}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/65 md:from-black/60 md:via-black/25 md:to-black/75" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_55%,rgba(0,0,0,0.3)_100%)] md:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.55)_100%)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          >
            <h1 className="text-white !text-[42px] md:!text-[72px] font-black leading-[1.05] mb-6 drop-shadow-[0_4px_28px_rgba(0,0,0,0.75)]">
              Da ist mehr drin!
            </h1>
            <p className="text-white/90 !text-lg md:!text-xl max-w-xl mx-auto mb-10 !font-normal [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              Beantworte 10 Fragen. Wir zeigen dir, was dir in Berlin zusteht.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg rounded-full shadow-xl"
              onClick={startQuestionnaire}
            >
              Jetzt herausfinden
              <ArrowRight className="ml-2 w-5 h-5" strokeWidth={2.5} />
            </Button>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 !text-sm z-10 tracking-wide uppercase"
          >
            Scroll
          </motion.div>
        </section>

        {/* Erkennungsmomente — persönliche Problem-Momente statt Makro-Statistik */}
        <section className="py-28 md:py-36 px-4 bg-white">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="space-y-8 md:space-y-10 mb-14">
              <ScrollReveal>
                <p className="!text-2xl md:!text-4xl !font-medium text-muted-foreground/50 leading-snug">
                  „Schon wieder knapp vor dem Monatsende?"
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <p className="!text-2xl md:!text-4xl !font-medium text-muted-foreground/70 leading-snug">
                  „Irgendwo gibt's bestimmt was für mich — aber wann soll ich das rausfinden?"
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.24}>
                <p className="!text-2xl md:!text-4xl !font-semibold text-foreground leading-snug">
                  „Den Antrag hab ich angefangen. Liegt noch irgendwo."
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.36}>
              <p className="!text-xl md:!text-2xl !font-semibold text-primary">
                Genau dafür ist MehrDrin da.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* So geht's */}
        <section className="py-24 px-4 bg-secondary/40">
          <div className="container mx-auto max-w-5xl">
            <ScrollReveal>
              <p className="text-center !text-sm md:!text-base !font-semibold tracking-wide text-primary mb-16 uppercase">
                Kein Amt. Keine Warteschlange. Nur deine Möglichkeiten.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-border" />
              {steps.map((step, i) => (
                <ScrollReveal key={step.title} delay={i * 0.15}>
                  <div className="text-center relative">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center !text-2xl font-bold mx-auto mb-6 relative z-10">
                      {i + 1}
                    </div>
                    <h3 className="mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Angebote — echte Daten, farbcodiert wie in den Ergebnissen */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <ScrollReveal>
              <h2 className="text-foreground text-center mb-4">Das wartet auf dich.</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
                Ein Ausschnitt aus {offerCount ? `über ${Math.floor(offerCount / 10) * 10}` : "vielen"} Angeboten für Bildung, Wohnen, Familie und Gesundheit.
              </p>
            </ScrollReveal>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible">
              {fundingTeasers.map((funding, i) => {
                const colors = schemeOf(funding);
                return (
                  <ScrollReveal
                    key={funding.id}
                    delay={i * 0.08}
                    className="snap-start flex-none w-[260px] md:w-auto"
                  >
                    <a
                      href={funding.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full p-6 rounded-2xl border transition-transform duration-200 hover:-translate-y-1"
                      style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
                    >
                      <span
                        className="inline-block !text-xs font-semibold px-2.5 py-1 rounded-full mb-4 text-white"
                        style={{ backgroundColor: colors.accent }}
                      >
                        {funding.categories?.[0] ?? funding.organization}
                      </span>
                      <h3 className="font-semibold mb-2 line-clamp-2 !text-lg text-foreground">
                        {funding.title}
                      </h3>
                      <p className="!text-sm line-clamp-3 text-muted-foreground">
                        {funding.description}
                      </p>
                    </a>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Zahlen — große Typografie statt Karten, mit Counter-Animation */}
        <section className="py-24 px-4 bg-foreground text-background">
          <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8 text-center">
            <ScrollReveal>
              <Counter to={offerCount ?? 0} className="block !text-6xl md:!text-7xl font-black mb-3" />
              <p className="text-background/70">Angebote, staatlich und nicht-staatlich</p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <Counter to={10} className="block !text-6xl md:!text-7xl font-black mb-3" />
              <p className="text-background/70">kurze Fragen bis zu deiner Übersicht</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <span className="block !text-6xl md:!text-7xl font-black mb-3">
                1-2<span className="!text-2xl align-top ml-1">min</span>
              </span>
              <p className="text-background/70">bis du weißt, was für dich drin ist</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Wir bauen für Berlin — ersetzt die KI-Portrait-Community-Section, ehrlich statt vorgetäuscht */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
                {/*
                  TODO: echtes Teamfoto einsetzen, sobald vorhanden — nicht das
                  vorhandene team-portrait.jpg verwenden, das ist KI-generiert.
                */}
                <div className="md:col-span-2 rounded-2xl aspect-[4/3] bg-secondary/50 border border-dashed border-border flex items-center justify-center text-center p-6">
                  <p className="text-muted-foreground !text-sm font-mono">
                    [ echtes Teamfoto hier einfügen ]
                  </p>
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-foreground mb-4">Wir bauen das für Berlin.</h2>
                  <p className="text-muted-foreground !text-lg">
                    MehrDrin entsteht gerade — von Menschen, die selbst durch Berliner
                    Bürokratie navigieren mussten. Noch gibt es keine große Geschichte zu
                    erzählen, nur den Anspruch, das für dich einfacher zu machen.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ — erweitert um Datenschutz & "Wer steckt dahinter" */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
              <ScrollReveal>
                <h2 className="text-foreground">Antworten auf die häufig gestellten Fragen.</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="item-1" className="border rounded-xl px-6 bg-secondary">
                    <AccordionTrigger className="!text-lg font-medium">Was ist MehrDrin?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      MehrDrin ist eine Plattform, die dir hilft, passende Förderungen und
                      Unterstützungsangebote für deine Lebenssituation zu finden.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border rounded-xl px-6 bg-secondary">
                    <AccordionTrigger className="!text-lg font-medium">Ist die Nutzung kostenlos?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Ja, die Nutzung von MehrDrin ist komplett kostenlos.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border rounded-xl px-6 bg-secondary">
                    <AccordionTrigger className="!text-lg font-medium">Welche Daten werden erhoben?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Wir erheben nur die Daten, die für die Ermittlung passender Förderungen
                      notwendig sind. Deine Daten werden vertraulich behandelt.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border rounded-xl px-6 bg-secondary">
                    <AccordionTrigger className="!text-lg font-medium">
                      Was passiert mit meinen Angaben nach der Nutzung?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Deine Antworten werden ausschließlich zur Ermittlung passender Angebote
                      verwendet und nicht an Dritte weitergegeben.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border rounded-xl px-6 bg-secondary">
                    <AccordionTrigger className="!text-lg font-medium">Wie aktuell sind die Informationen?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Unsere Datenbank wird regelmäßig aktualisiert und basiert auf offiziellen
                      Quellen.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6" className="border rounded-xl px-6 bg-secondary">
                    <AccordionTrigger className="!text-lg font-medium">Wer steckt hinter MehrDrin?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      MehrDrin wird von einem kleinen Berliner Team gebaut, das die Suche nach
                      Förderungen einfacher machen möchte.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Call to Action — stärkster visueller Moment, voller Blau-Block */}
        <section className="py-28 px-4 bg-primary">
          <ScrollReveal>
            <div className="container mx-auto text-center max-w-3xl">
              <h2 className="text-primary-foreground mb-6">
                Finde jetzt heraus, was dir zusteht.
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                In nur wenigen Minuten zu deinen passenden Förderungen.
              </p>
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-primary px-12 py-6 text-xl rounded-full shadow-xl"
                onClick={startQuestionnaire}
              >
                Jetzt starten
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
