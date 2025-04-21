
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { Button } from "@/components/ui/button";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";
import { ArrowDown } from "lucide-react";

const Index = () => {
  const [startQuestionnaire, setStartQuestionnaire] = useState(false);

  const scrollToInfo = () => {
    document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-primary animate-fade-in-up">
              Berliner Förderungs-Matcher
            </h1>
            <p className="text-xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Finden Sie schnell und einfach Förderungen und Unterstützungsangebote in Berlin, 
              die perfekt zu Ihrer persönlichen Situation passen.
            </p>
            
            {!startQuestionnaire ? (
              <div className="space-y-8">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                  onClick={() => setStartQuestionnaire(true)}
                >
                  Jetzt Förderungen finden
                </Button>
                
                <div 
                  className="flex flex-col items-center cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: '0.6s' }}
                  onClick={scrollToInfo}
                >
                  <p className="text-sm text-muted-foreground mb-2">Mehr erfahren</p>
                  <ArrowDown className="animate-bounce" />
                </div>
              </div>
            ) : (
              <QuestionnaireProvider>
                <QuestionnaireForm />
              </QuestionnaireProvider>
            )}
          </div>
        </section>

        <section id="info-section" className="py-24 bg-secondary/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold mb-6 text-secondary">
                  Warum der Förderungs-Matcher?
                </h2>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-center space-x-3">
                    <span className="text-primary">✓</span>
                    <span>Basierend auf aktuellen Daten aus offiziellen Quellen</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-primary">✓</span>
                    <span>Persönlich auf Ihre Situation zugeschnitten</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-primary">✓</span>
                    <span>Einfacher Zugang zu oft übersehenen Förderungen</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-primary">✓</span>
                    <span>Zeit- und ressourcensparend ohne Behördengänge</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold mb-6 text-secondary">
                  Datenquellen
                </h2>
                <p className="text-lg mb-4">
                  Unser Förderungs-Matcher nutzt Daten aus offiziellen Quellen, darunter:
                </p>
                <ul className="space-y-2 text-lg text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>Datenportal Berlin</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>Förderdatenbank Bund, Länder, EU</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>Investitionsbank Berlin (IBB)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>Berliner Senatsverwaltungen</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
