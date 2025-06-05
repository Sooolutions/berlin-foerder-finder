
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, CheckCircle, Shield, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const startQuestionnaire = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Berliner Förderungs-Matcher
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Finde passende Förderungen und Unterstützung für deine Situation in Berlin
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Sicher & Vertraulich</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-berlin-blue" />
                <span className="text-sm font-medium text-gray-700">Von Berlinern für Berliner</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-berlin-orange" />
                <span className="text-sm font-medium text-gray-700">Offiziell verifiziert</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="px-12 py-6 text-lg bg-berlin-orange hover:bg-berlin-orange/90 text-white shadow-lg"
              onClick={startQuestionnaire}
            >
              Jetzt Förderungen finden
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Warum der Berliner Förderungs-Matcher?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Einfach, schnell und zuverlässig zu deinen passenden Förderungen
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-berlin-orange/10 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Target className="w-8 h-8 text-berlin-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Präzise Ergebnisse</h3>
                <p className="text-gray-600">
                  Nur die Förderungen, die wirklich zu deiner Situation passen - keine endlosen Listen.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-berlin-blue/10 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-berlin-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Schnell & Einfach</h3>
                <p className="text-gray-600">
                  In wenigen Minuten zu deinen passenden Förderungen - ohne komplizierte Formulare.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Vertrauenswürdig</h3>
                <p className="text-gray-600">
                  Alle Daten stammen aus offiziellen Quellen der Berliner Verwaltung.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-berlin-blue text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">
              Vertrauenswürdige Datenquellen
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-berlin-orange mb-2">200+</div>
                <div className="text-blue-100">Förderungen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-berlin-orange mb-2">12</div>
                <div className="text-blue-100">Bezirke</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-berlin-orange mb-2">50+</div>
                <div className="text-blue-100">Kategorien</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-berlin-orange mb-2">24/7</div>
                <div className="text-blue-100">Verfügbar</div>
              </div>
            </div>
            
            <div className="mt-12 text-blue-100">
              <p className="font-medium mb-4">Offizielle Datenquellen:</p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <span>• Datenportal Berlin</span>
                <span>• Investitionsbank Berlin (IBB)</span>
                <span>• Berliner Senatsverwaltungen</span>
                <span>• Förderdatenbank Bund, Länder, EU</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
