
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sun, Share2, Users, SmilePlus, ArrowRight } from "lucide-react";
import teamPortrait from "@/assets/team-portrait.jpg";

const carouselCards = [
  {
    text: "Wusstest du, dass ca. 50% der staatlichen Hilfeleistungen nicht in Anspruch genommen werden?"
  },
  {
    text: "Jährlich bleiben über 10 Milliarden Euro an Fördergeldern ungenutzt – weil Menschen nicht wissen, dass sie Anspruch haben."
  },
  {
    text: "Besonders Familien, Studierende und Geringverdiener verpassen häufig wichtige Unterstützungsangebote."
  }
];

const About = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % carouselCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + carouselCards.length) % carouselCards.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Section 1: Team Image + Intro Text */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Team Image - 75% width */}
            <div className="lg:w-3/4">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-muted">
                <img 
                  src={teamPortrait} 
                  alt="Das MehrDrin Team" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Text Content - Right aligned */}
            <div className="lg:w-1/4 lg:text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Mehr drin für dich!
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wir glauben, dass Berlin mehr verdient.<br />
                Mehr Bildung. Mehr Geld. Mehr Chancen.<br />
                Deswegen haben wir MehrDrin gestartet.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Blue Box with Carousel */}
        <section className="px-4 py-16">
          <div 
            className="bg-primary w-full py-16 px-6 md:px-12"
            style={{ borderRadius: '30px' }}
          >
            <div className="max-w-4xl mx-auto text-center">
              {/* Headers */}
              <h2 className="text-xl md:text-2xl font-medium text-white/80 mb-2">
                Unsere Vision
              </h2>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-12">
                Unterstützung die ankommt
              </h1>

              {/* White Card Carousel */}
              <div className="bg-white rounded-3xl p-8 md:p-12 mb-8 min-h-[200px] flex items-center justify-center">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground text-center leading-relaxed">
                  {carouselCards[currentCard].text}
                </h1>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevCard}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white rounded-full w-12 h-12"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextCard}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white rounded-full w-12 h-12"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {carouselCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCard(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentCard ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Vielfalt */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Wir stehen für Vielfalt
            </h1>
            <p className="text-lg text-muted-foreground">
              Wir wünschen uns Einfachheit, Fairness und echten Zugang zu Chancen für Alle!
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Transparenz Card */}
              <div className="bg-blue-100 rounded-3xl p-8 flex-1">
                <div className="bg-foreground w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Sun className="h-7 w-7 text-white" />
                </div>
                <p className="text-foreground text-lg">
                  <span className="font-bold">Transparenz</span> bedeutet für uns eine offene, leicht zugängliche Datenbank ohne Hürden.
                </p>
              </div>
              
              {/* Partnerschaft Card */}
              <div className="bg-rose-100 rounded-3xl p-8 flex-1">
                <div className="bg-foreground w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Share2 className="h-7 w-7 text-white" />
                </div>
                <p className="text-foreground text-lg">
                  <span className="font-bold">Partnerschaft</span> verstehen wir als keine Alleingänge, sondern enge Zusammenarbeit mit Behörden.
                </p>
              </div>
            </div>

            {/* Center Image */}
            <div className="flex items-center justify-center">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] w-full max-w-sm">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop" 
                  alt="Team Member" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Gemeinwohl Card */}
              <div className="bg-amber-100 rounded-3xl p-8 flex-1">
                <div className="bg-foreground w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <p className="text-foreground text-lg">
                  <span className="font-bold">Gemeinwohl</span> heißt für uns keine Gewinne, keine Werbung.
                </p>
              </div>
              
              {/* Selbstbestimmung Card */}
              <div className="bg-blue-100 rounded-3xl p-8 flex-1">
                <div className="bg-foreground w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <SmilePlus className="h-7 w-7 text-white" />
                </div>
                <p className="text-foreground text-lg">
                  <span className="font-bold">Selbstbestimmung</span> bedeutet für uns, Menschen jeder Sprache und Herkunft zu befähigen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Es ist Mehr für dich drin.<br />
              Finde jetzt heraus was dir zusteht!
            </h1>
            <p className="text-muted-foreground mb-8">
              Kostenlos und anonym zum vollständigen Angebot!
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl rounded-xl"
              onClick={() => window.location.href = '/questionnaire'}
            >
              Jetzt Entdecken!
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
