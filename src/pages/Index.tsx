import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowDown, Users, Target, Heart, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const scrollToInfo = () => {
    document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const startQuestionnaire = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
          {/* Berlin Skyline Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-berlin-blue/10 via-white to-berlin-orange/10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80"
                  alt="Berliner Person"
                  className="w-24 h-24 rounded-full border-4 border-berlin-orange shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-berlin-orange text-white rounded-full p-2">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 text-berlin-blue animate-fade-in-up">
              Berliner Förderungs-Matcher
            </h1>
            <p className="text-xl mb-8 text-gray-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="font-semibold text-berlin-orange">Persönlich. Einfach. Berlinisch.</span>
              <br />
              Finde Förderungen und Unterstützung, die wirklich zu dir und deiner Situation in Berlin passen.
            </p>
            
            <div className="space-y-8">
              <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <Users className="w-5 h-5 text-berlin-blue" />
                  <span className="text-sm font-medium">Über 200 Förderungen</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <Target className="w-5 h-5 text-berlin-orange" />
                  <span className="text-sm font-medium">Persönlich abgestimmt</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Offiziell verifiziert</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg bg-berlin-orange hover:bg-berlin-orange/90 text-white shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: '0.4s' }}
                onClick={startQuestionnaire}
              >
                Jetzt Förderungen finden
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
              
              <div 
                className="flex flex-col items-center cursor-pointer animate-fade-in-up text-gray-600 hover:text-berlin-blue transition-colors"
                style={{ animationDelay: '0.6s' }}
                onClick={scrollToInfo}
              >
                <p className="text-sm mb-2">Mehr über den Matcher erfahren</p>
                <ArrowDown className="animate-bounce w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        <section id="info-section" className="py-24 bg-gradient-to-r from-gray-50 to-berlin-lightGray/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-berlin-blue">
                Warum der Berliner Förderungs-Matcher?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Weil jeder Berliner und jede Berlinerin die Unterstützung verdient, die zu ihrer Lebenssituation passt.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-berlin-orange text-white rounded-full p-3 flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-berlin-blue">Persönlich & Nahbar</h3>
                    <p className="text-gray-600">Entwickelt von Berlinern für Berliner - wir verstehen deine Situation und kennen die Stadt.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-berlin-blue text-white rounded-full p-3 flex-shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-berlin-blue">Präzise Ergebnisse</h3>
                    <p className="text-gray-600">Nur die Förderungen, die wirklich zu dir passen - keine endlosen Listen, sondern gezielte Matches.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full p-3 flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-berlin-blue">Vertrauenswürdig</h3>
                    <p className="text-gray-600">Alle Daten stammen aus offiziellen Quellen der Berliner Verwaltung und werden regelmäßig aktualisiert.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                  alt="Menschen in Berlin bei der Beratung"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-berlin-blue/10 rounded-lg"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <p className="text-sm font-medium text-berlin-blue">
                    "Endlich eine einfache Art, Förderungen zu finden!"
                  </p>
                  <p className="text-xs text-gray-600 mt-1">- Sarah, 28, aus Kreuzberg</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-berlin-blue text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Offiziell verifizierte Datenquellen
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Alle Förderinformationen stammen direkt aus vertrauenswürdigen, offiziellen Quellen
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-berlin-orange mb-2">200+</div>
                <div className="text-sm text-blue-100">Förderungen</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-berlin-orange mb-2">12</div>
                <div className="text-sm text-blue-100">Bezirke</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-berlin-orange mb-2">50+</div>
                <div className="text-sm text-blue-100">Kategorien</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-berlin-orange mb-2">24/7</div>
                <div className="text-sm text-blue-100">Verfügbar</div>
              </div>
            </div>
            
            <div className="mt-12 space-y-2 text-blue-100">
              <p className="font-medium">Datenquellen:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span>• Datenportal Berlin</span>
                <span>• Investitionsbank Berlin (IBB)</span>
                <span>• Berliner Senatsverwaltungen</span>
                <span>• Förderdatenbank Bund, Länder, EU</span>
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
