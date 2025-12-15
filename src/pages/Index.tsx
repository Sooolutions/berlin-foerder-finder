
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Heart, Users, HelpCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();

  const startQuestionnaire = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center py-16 px-4 bg-secondary">
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full"
                  onClick={startQuestionnaire}
                >
                  Jetzt starten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {/* Right: Images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden bg-accent/30 aspect-square flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop" 
                      alt="Glückliche Menschen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-destructive/30 aspect-[4/3] flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop" 
                      alt="Studierende"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden bg-primary/30 aspect-[4/3] flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" 
                      alt="Team arbeitet zusammen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-accent/30 aspect-square flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" 
                      alt="Erfolgreiche Person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Überblick Section */}
        <section className="py-20 px-4 bg-background">
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
        <section className="py-20 px-4 bg-accent/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Heart className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-foreground mb-6">
                Für alle Bedürfnisse die passende Unterstützung
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Egal ob Bildung, Wohnen, Familie oder Gesundheit – finde Angebote, die zu dir passen.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {["Bildung", "Wohnen", "Familie", "Gesundheit", "Arbeit", "Integration", "Kultur", "Soziales"].map((category) => (
                <div 
                  key={category}
                  className="p-6 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <p className="font-medium text-foreground">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Users className="w-10 h-10" />
            </div>
            <h2 className="mb-6">
              Werde Teil einer Community, die profitiert!
            </h2>
            <p className="max-w-2xl mx-auto mb-12 opacity-90">
              Tausende haben bereits Förderungen gefunden, die ihr Leben verbessert haben.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-primary-foreground/10">
                <p className="italic mb-4">"Dank MehrDrin habe ich endlich die Unterstützung gefunden, die ich brauchte."</p>
                <p className="font-semibold">– Maria, 34</p>
              </div>
              <div className="p-6 rounded-2xl bg-primary-foreground/10">
                <p className="italic mb-4">"So einfach war es noch nie, passende Förderungen zu finden."</p>
                <p className="font-semibold">– Thomas, 28</p>
              </div>
              <div className="p-6 rounded-2xl bg-primary-foreground/10">
                <p className="italic mb-4">"Ich hätte nie gedacht, dass es so viele Möglichkeiten gibt!"</p>
                <p className="font-semibold">– Leyla, 42</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-background">
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
        <section className="py-20 px-4 bg-accent/30">
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
