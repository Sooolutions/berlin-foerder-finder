import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Heart, Users, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroFernsehturm from "@/assets/hero-fernsehturm.jpg";
import heroSbahn from "@/assets/hero-sbahn.jpg";
import heroPerson from "@/assets/hero-person.jpeg";
import community1 from "@/assets/community-1.jpg";
import community2 from "@/assets/community-2.jpg";
import community3 from "@/assets/community-3.jpg";
import community4 from "@/assets/community-4.jpg";
import community5 from "@/assets/community-5.jpg";
import community6 from "@/assets/community-6.jpg";
import community7 from "@/assets/community-7.jpg";
import community8 from "@/assets/community-8.jpg";
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
      const {
        data,
        error
      } = await supabase.from('funding').select('id, title, description, organization, url');
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

  // Community images - 16 portraits in 8 columns of 2 (U-shape arrangement)
  const communityImages = [community1, community2, community3, community4, community5, community6, community7, community8, community4, community7, community5, community2, community1, community6, community3, community8];
  return <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Left: Text - 2/5 */}
              <div className="lg:col-span-2 space-y-8">
                <h1 className="text-foreground">
                  Dein Zugang zu Chancen, die dich weiterbringen
                </h1>
                <p className="text-muted-foreground max-w-lg">
                  Entdecke Förderungen, Angebote und Unterstützung, die zu deiner Lebenssituation passen.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-[10px] shadow-lg" onClick={startQuestionnaire}>
                  Jetzt Entdecken!
                  <ArrowRight className="ml-2 w-6 h-6" strokeWidth={2.5} />
                </Button>
              </div>

              {/* Right: Grid forming a rectangle - 4 elements with staggered columns */}
              <div className="lg:col-span-3 flex gap-4">
                {/* Column 1 - no offset, wider */}
                <div className="flex flex-col gap-4" style={{ flex: '1.4' }}>
                  <div className="rounded-2xl overflow-hidden h-[200px]">
                    <img src={heroFernsehturm} alt="Berliner Fernsehturm" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[260px]">
                    <img src={heroSbahn} alt="S-Bahn Berlin" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Column 2 - offset down, narrower */}
                <div className="flex flex-col gap-4 mt-12" style={{ flex: '0.8' }}>
                  <div className="rounded-2xl bg-primary flex items-center justify-center p-6 h-[200px]">
                    <div className="text-right w-full">
                      <p className="text-white font-semibold text-[24px] leading-tight">Finde was dir zusteht!</p>
                      <p className="text-white/80 text-sm mt-2">Wir machen sichtbar was dir offensteht. Entdecke wo mehr für dich drin ist!</p>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[280px]">
                    <img alt="Person" className="w-full h-full object-cover" src="/lovable-uploads/6a406a45-8eda-4049-aef8-0067a8c3bac8.jpg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Überblick Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h1 className="text-foreground mb-4">
              Ein klarer Überblick, damit du keine Chance verpasst!
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Wir bringen Ordnung ins Angebot - und du entscheidest den nächsten Schritt!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Card 1 - Blue */}
              <div className="p-8 rounded-2xl flex flex-col shadow-lg" style={{ backgroundColor: '#84B1E8', aspectRatio: '1 / 1.1' }}>
                <h3 className="text-white font-semibold text-[30px] leading-tight text-left mb-auto">
                  Umfassend und Vollständig
                </h3>
                <div className="mt-auto">
                  <p className="text-white text-[100px] font-normal leading-none mb-4">1200+</p>
                  <p className="text-white/90 text-base text-left">
                    Staatliche und nicht-staatliche Angebote, Förderungen und Möglichkeiten
                  </p>
                </div>
              </div>
              {/* Card 2 - Yellow */}
              <div className="p-8 rounded-2xl flex flex-col shadow-lg bg-accent" style={{ aspectRatio: '1 / 1.1' }}>
                <h3 className="text-white font-semibold text-[30px] leading-tight text-left mb-auto">
                  Passend und Persönlich
                </h3>
                <div className="mt-auto">
                  <p className="text-white leading-none mb-4 flex items-baseline gap-3">
                    <span className="text-[100px] font-normal">10</span>
                    <span className="text-[30px] font-normal">Fragen</span>
                  </p>
                  <p className="text-white/90 text-base text-left">
                    Kurze Fragen bringen dich zu deiner individualisierten Übersichtsseite
                  </p>
                </div>
              </div>
              {/* Card 3 - Red */}
              <div className="p-8 rounded-2xl flex flex-col shadow-lg bg-destructive" style={{ aspectRatio: '1 / 1.1' }}>
                <h3 className="text-white font-semibold text-[30px] leading-tight text-left mb-auto">
                  Schnell und effizient
                </h3>
                <div className="mt-auto">
                  <p className="text-white leading-none mb-4 flex items-baseline gap-3">
                    <span className="text-[100px] font-normal">1-2</span>
                    <span className="text-[30px] font-normal">min</span>
                  </p>
                  <p className="text-white/90 text-base text-left">
                    Finde mit wenigen Klicks Angebote die dich wirklich weiterbringen
                  </p>
                </div>
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
                {fundingTeasers.map((funding) => <a key={funding.id} href={funding.url} target="_blank" rel="noopener noreferrer" className="p-6 rounded-2xl transition-colors text-primary-foreground bg-primary-foreground">
                    <h3 className="font-semibold mb-2 line-clamp-2 text-lg text-secondary-foreground">{funding.title}</h3>
                    <p className="text-sm mb-3 bg-primary-foreground text-primary">{funding.organization}</p>
                    <p className="text-sm line-clamp-3 text-secondary-foreground">{funding.description}</p>
                  </a>)}
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
                {communityImages.slice(0, 8).map((img, index) => <img key={index} src={img} alt={`Community Mitglied ${index + 1}`} className="w-16 h-16 md:w-20 md:h-20 rounded-[7px] object-cover" />)}
              </div>
              {/* Row 2 - 8 images */}
              <div className="flex justify-center gap-4">
                {communityImages.slice(8, 16).map((img, index) => <img key={index + 8} src={img} alt={`Community Mitglied ${index + 9}`} className="w-16 h-16 md:w-20 md:h-20 rounded-[7px] object-cover" />)}
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
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl rounded-full" onClick={startQuestionnaire}>
              Jetzt starten
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Index;