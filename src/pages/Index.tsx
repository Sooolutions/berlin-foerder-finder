
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { Button } from "@/components/ui/button";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";

const Index = () => {
  const [startQuestionnaire, setStartQuestionnaire] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {!startQuestionnaire ? (
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-berlin-blue">
              Berliner Förderungs-Matcher
            </h1>
            <p className="text-xl mb-8">
              Finden Sie schnell und einfach Förderungen und Unterstützungsangebote in Berlin, 
              die perfekt zu Ihrer persönlichen Situation passen.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-md mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 rounded-lg border border-gray-200 hover:border-berlin-blue hover:shadow-md transition-all duration-300">
                  <div className="bg-berlin-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-berlin-blue text-xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Beantworten Sie Fragen</h3>
                  <p className="text-sm text-gray-600">
                    Teilen Sie uns einige Details zu Ihrer persönlichen Situation mit.
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg border border-gray-200 hover:border-berlin-blue hover:shadow-md transition-all duration-300">
                  <div className="bg-berlin-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-berlin-blue text-xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Matching-Algorithmus</h3>
                  <p className="text-sm text-gray-600">
                    Wir finden Förderungen, die zu Ihren spezifischen Umständen passen.
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg border border-gray-200 hover:border-berlin-blue hover:shadow-md transition-all duration-300">
                  <div className="bg-berlin-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-berlin-blue text-xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Erhalten Sie Ergebnisse</h3>
                  <p className="text-sm text-gray-600">
                    Bekommen Sie eine übersichtliche Liste mit allen passenden Förderungen.
                  </p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={() => setStartQuestionnaire(true)}
              >
                Jetzt Förderungen finden
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Warum der Förderungs-Matcher?</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Basierend auf aktuellen Daten aus offiziellen Quellen</li>
                  <li>✓ Persönlich auf Ihre Situation zugeschnitten</li>
                  <li>✓ Einfacher Zugang zu oft übersehenen Förderungen</li>
                  <li>✓ Zeit- und ressourcensparend ohne Behördengänge</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Datenquellen</h2>
                <p className="text-gray-700 mb-2">
                  Unser Förderungs-Matcher nutzt Daten aus offiziellen Quellen, darunter:
                </p>
                <ul className="text-sm text-gray-600">
                  <li>• Datenportal Berlin</li>
                  <li>• Förderdatenbank Bund, Länder, EU</li>
                  <li>• Investitionsbank Berlin (IBB)</li>
                  <li>• Berliner Senatsverwaltungen</li>
                  <li>• und weitere offizielle Verwaltungsportale</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <QuestionnaireProvider>
            <QuestionnaireForm />
          </QuestionnaireProvider>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
