
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-berlin-blue">Über den Berliner Förderungs-Matcher</h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Unsere Mission</h2>
            <p className="mb-4">
              Der Berliner Förderungs-Matcher hat es sich zur Aufgabe gemacht, Berliner Bürger*innen und 
              kleinen Unternehmen den Zugang zu öffentlichen Förderungen und Unterstützungsangeboten 
              zu erleichtern. Wir glauben, dass viele Menschen und Unternehmen nicht alle Förderungen kennen, 
              die ihnen zustehen oder helfen könnten.
            </p>
            <p>
              Mit unserem intelligenten Matching-System möchten wir dazu beitragen, dass Fördergelder 
              dort ankommen, wo sie benötigt werden, und dass mehr Menschen von den vielfältigen 
              Unterstützungsangeboten in Berlin profitieren können.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Datenquellen</h2>
            <p className="mb-4">
              Unser Förderungs-Matcher greift auf Daten aus verschiedenen offiziellen Quellen zurück:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <a href="https://daten.berlin.de" target="_blank" rel="noopener noreferrer" className="text-berlin-blue hover:underline">
                  Datenportal Berlin
                </a> - Offene Daten der Berliner Verwaltung
              </li>
              <li>
                <a href="https://www.foerderdatenbank.de" target="_blank" rel="noopener noreferrer" className="text-berlin-blue hover:underline">
                  Förderdatenbank Bund, Länder, EU
                </a> - Zentrale Informationsplattform für Förderprogramme
              </li>
              <li>
                <a href="https://www.govdata.de" target="_blank" rel="noopener noreferrer" className="text-berlin-blue hover:underline">
                  GovData.de
                </a> - Das Datenportal für Deutschland
              </li>
              <li>
                <a href="https://www.ibb.de" target="_blank" rel="noopener noreferrer" className="text-berlin-blue hover:underline">
                  Investitionsbank Berlin (IBB)
                </a> - Förderbank des Landes Berlin
              </li>
              <li>
                <a href="https://www.berlin.de/sen/bjf" target="_blank" rel="noopener noreferrer" className="text-berlin-blue hover:underline">
                  Berliner Senatsverwaltungen
                </a> - Informationen zu Förderungen einzelner Ressorts
              </li>
            </ul>
            <p>
              Alle Daten werden regelmäßig aktualisiert, um den aktuellsten Stand der verfügbaren 
              Förderungen abzubilden. Dennoch empfehlen wir, die gefundenen Informationen bei den 
              jeweiligen Anbietern zu verifizieren, da sich Förderrichtlinien ändern können.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Datenschutz</h2>
            <p className="mb-4">
              Wir nehmen den Schutz Ihrer Daten ernst. Alle eingegebenen Informationen werden ausschließlich 
              für die Suche nach passenden Förderungen verwendet und nicht dauerhaft gespeichert oder 
              an Dritte weitergegeben.
            </p>
            <p>
              Die Nutzung des Förderungs-Matchers ist vollständig anonym möglich. Wir verzichten bewusst 
              auf eine Registrierung oder Anmeldung, um Ihnen einen niedrigschwelligen Zugang zu 
              ermöglichen.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="mb-4">
              Haben Sie Fragen, Anregungen oder Feedback zum Berliner Förderungs-Matcher? Wir freuen uns 
              über Ihre Nachricht!
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-2"><strong>E-Mail:</strong> info@foerderung-matcher.berlin</p>
              <p><strong>Adresse:</strong> Musterstraße 123, 10115 Berlin</p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
