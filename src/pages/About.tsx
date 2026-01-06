
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Team Image */}
            <div className="lg:w-1/2">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                  alt="Das MehrDrin Team" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="lg:w-1/2">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
