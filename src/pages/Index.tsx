
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, CheckCircle, Shield, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setShowContent(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startQuestionnaire = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Initial View */}
        <section className="min-h-screen flex items-center justify-center py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight">
                Berliner Förderungs-Matcher
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
                Finde passende Förderungen und Unterstützung für deine Situation in Berlin
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="px-16 py-8 text-xl bg-berlin-orange hover:bg-berlin-orange/90 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={startQuestionnaire}
            >
              Jetzt Förderung finden
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>
        </section>

        {/* Content that appears on scroll */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Trust Indicators */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-full shadow-sm">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="text-base font-medium text-gray-700">Sicher & Vertraulich</span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-full shadow-sm">
                  <Users className="w-6 h-6 text-berlin-blue" />
                  <span className="text-base font-medium text-gray-700">Von Berlinern für Berliner</span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-full shadow-sm">
                  <CheckCircle className="w-6 h-6 text-berlin-orange" />
                  <span className="text-base font-medium text-gray-700">Offiziell verifiziert</span>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Warum der Berliner Förderungs-Matcher?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Einfach, schnell und zuverlässig zu deinen passenden Förderungen
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-berlin-orange/10 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Target className="w-10 h-10 text-berlin-orange" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Präzise Ergebnisse</h3>
                  <p className="text-gray-600 text-lg">
                    Nur die Förderungen, die wirklich zu deiner Situation passen - keine endlosen Listen.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-berlin-blue/10 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Clock className="w-10 h-10 text-berlin-blue" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Schnell & Einfach</h3>
                  <p className="text-gray-600 text-lg">
                    In wenigen Minuten zu deinen passenden Förderungen - ohne komplizierte Formulare.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Award className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Vertrauenswürdig</h3>
                  <p className="text-gray-600 text-lg">
                    Alle Daten stammen aus offiziellen Quellen der Berliner Verwaltung.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-20 bg-berlin-blue text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-12">
                Vertrauenswürdige Datenquellen
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-berlin-orange mb-2">200+</div>
                  <div className="text-blue-100 text-lg">Förderungen</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-berlin-orange mb-2">12</div>
                  <div className="text-blue-100 text-lg">Bezirke</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-berlin-orange mb-2">50+</div>
                  <div className="text-blue-100 text-lg">Kategorien</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-berlin-orange mb-2">24/7</div>
                  <div className="text-blue-100 text-lg">Verfügbar</div>
                </div>
              </div>
              
              <div className="text-blue-100">
                <p className="font-medium mb-4 text-lg">Offizielle Datenquellen:</p>
                <div className="flex flex-wrap justify-center gap-6">
                  <span>• Datenportal Berlin</span>
                  <span>• Investitionsbank Berlin (IBB)</span>
                  <span>• Berliner Senatsverwaltungen</span>
                  <span>• Förderdatenbank Bund, Länder, EU</span>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 bg-white">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Bereit für deine Förderungen?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Starte jetzt und finde in wenigen Minuten die Unterstützung, die zu dir passt.
              </p>
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg bg-berlin-orange hover:bg-berlin-orange/90 text-white shadow-lg"
                onClick={startQuestionnaire}
              >
                Jetzt starten
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
