import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Impressum = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-semibold mb-10">Impressum</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              [HIER EINTRAGEN: Vollständiger Name oder Name der Organisation]<br />
              [HIER EINTRAGEN: Straße und Hausnummer]<br />
              [HIER EINTRAGEN: PLZ und Ort]<br />
              Deutschland
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              E-Mail: [HIER EINTRAGEN: kontakt@beispiel.de]<br />
              Telefon: [HIER EINTRAGEN: +49 ...] (optional)
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Vereinsregister</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              [HIER EINTRAGEN: Registergericht, z. B. Amtsgericht Berlin-Charlottenburg]<br />
              [HIER EINTRAGEN: Registernummer, z. B. VR 12345 B]<br />
              <span className="text-sm">(Nur ausfüllen, wenn als eingetragener Verein organisiert)</span>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              [HIER EINTRAGEN: Vor- und Nachname der verantwortlichen Person]<br />
              [HIER EINTRAGEN: Anschrift, falls abweichend von oben]
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              <strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für
              eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
              10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
              fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter,
              auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
              keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Urheberrecht</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
              deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
              jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Impressum;
