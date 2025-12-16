
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Heart, Users, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FundingTeaser {
  id: string;
  title: string;
  description: string;
  organization: string;
  url: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [fundingTeasers, setFundingTeasers] = useState<FundingTeaser[]>([]);

  useEffect(() => {
    const fetchRandomFunding = async () => {
      const { data, error } = await supabase
        .from('funding')
        .select('id, title, description, organization, url');
      
      if (data && !error) {
        // Shuffle and take 5 random items
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFundingTeasers(shuffled.slice(0, 5));
      }
    };

    fetchRandomFunding();
  }, []);

  const startQuestionnaire = () => {
    navigate("/questionnaire");
  };

  // Community images - 16 images in 2 rows of 8
  const communityImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                <h1 className="text-foreground">
                  Dein Zugang zu Chancen, die dich weiterbringen
                </h1>
                <p className="text-muted-foreground max-w-lg">
                  Entdecke Förderungen, Angebote und Unterstützung, die zu deiner Lebenssituation passen.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-[10px] shadow-lg"
                  onClick={startQuestionnaire}
                >
                  Jetzt Entdecken!
                  <ArrowRight className="ml-2 w-6 h-6" strokeWidth={2.5} />
                </Button>
              </div>

              {/* Right: 6 Elements in 3 columns - varying sizes */}
              <div className="flex gap-4 items-start">
                {/* Column 1 - Largest */}
                <div className="space-y-4 w-[200px]">
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <img 
                      src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop" 
                      alt="Glückliche Menschen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl bg-primary aspect-square flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-white font-semibold text-[30px] leading-tight">Finde was dir zusteht</p>
                      <p className="text-white/80 text-sm mt-2">Entdecke Fördermöglichkeiten, die zu dir passen.</p>
                    </div>
                  </div>
                </div>
                {/* Column 2 - Medium */}
                <div className="space-y-4 pt-6 w-[160px]">
                  <div className="rounded-2xl bg-accent aspect-square flex items-center justify-center p-5">
                    <div className="text-center">
                      <p className="text-white font-semibold text-[30px] leading-tight">Weniger Bürokratie</p>
                      <p className="text-white/80 text-sm mt-2">Einfache Anträge ohne komplizierte Formulare.</p>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop" 
                      alt="Team arbeitet zusammen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Column 3 - Smallest */}
                <div className="space-y-4 w-[120px]">
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" 
                      alt="Erfolgreiche Person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl bg-destructive aspect-square flex items-center justify-center p-4">
                    <div className="text-center">
                      <p className="text-white font-semibold text-[30px] leading-tight">Deine persönliche Übersicht</p>
                      <p className="text-white/80 text-sm mt-2">Alle Infos auf einen Blick.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Überblick Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Eye className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-foreground mb-6">
              Ein klarer Überblick, damit du keine Chance verpasst!
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Wir durchsuchen alle verfügbaren Förderprogramme und filtern die relevanten Angebote für dich heraus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-secondary">
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground">Förderprogramme</p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary">
                <div className="text-4xl font-bold text-primary mb-2">12</div>
                <p className="text-muted-foreground">Bezirke abgedeckt</p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary">
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <p className="text-muted-foreground">Kategorien</p>
              </div>
            </div>
          </div>
        </section>

        {/* Angebote Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="bg-primary rounded-[30px] p-12">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Heart className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-primary-foreground mb-6">
                  Für alle Bedürfnisse die passende Unterstützung
                </h2>
                <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                  Egal ob Bildung, Wohnen, Familie oder Gesundheit – finde Angebote, die zu dir passen.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {fundingTeasers.map((funding) => (
                  <a 
                    key={funding.id}
                    href={funding.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-primary-foreground"
                  >
                    <h3 className="font-semibold mb-2 line-clamp-2 text-lg">{funding.title}</h3>
                    <p className="text-sm text-primary-foreground/70 mb-3">{funding.organization}</p>
                    <p className="text-sm text-primary-foreground/80 line-clamp-3">{funding.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-foreground mb-6">
              Werde Teil einer Community, die profitiert!
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Tausende haben bereits Förderungen gefunden, die ihr Leben verbessert haben.
            </p>
            <div className="space-y-4 max-w-5xl mx-auto">
              {/* Row 1 - 8 images */}
              <div className="flex justify-center gap-4">
                {communityImages.slice(0, 8).map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`Community Mitglied ${index + 1}`}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-[7px] object-cover"
                  />
                ))}
              </div>
              {/* Row 2 - 8 images */}
              <div className="flex justify-center gap-4">
                {communityImages.slice(8, 16).map((img, index) => (
                  <img 
                    key={index + 8}
                    src={img}
                    alt={`Community Mitglied ${index + 9}`}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-[7px] object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <HelpCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-foreground mb-6">
                Antworten auf die häufig gestellten Fragen
              </h2>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-xl px-6 bg-secondary">
                <AccordionTrigger className="text-lg font-medium">
                  Was ist MehrDrin?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  MehrDrin ist eine Plattform, die dir hilft, passende Förderungen und Unterstützungsangebote für deine Lebenssituation zu finden.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border rounded-xl px-6 bg-secondary">
                <AccordionTrigger className="text-lg font-medium">
                  Ist die Nutzung kostenlos?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ja, die Nutzung von MehrDrin ist komplett kostenlos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border rounded-xl px-6 bg-secondary">
                <AccordionTrigger className="text-lg font-medium">
                  Welche Daten werden erhoben?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Wir erheben nur die Daten, die für die Ermittlung passender Förderungen notwendig sind. Deine Daten werden vertraulich behandelt.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border rounded-xl px-6 bg-secondary">
                <AccordionTrigger className="text-lg font-medium">
                  Wie aktuell sind die Informationen?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Unsere Datenbank wird regelmäßig aktualisiert und basiert auf offiziellen Quellen.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-foreground mb-6">
              Es ist Mehr für dich drin. Finde jetzt heraus was dir zusteht!
            </h2>
            <p className="text-muted-foreground mb-8">
              In nur wenigen Minuten zu deinen passenden Förderungen.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl rounded-full"
              onClick={startQuestionnaire}
            >
              Jetzt starten
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
