import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Datenschutz = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-semibold mb-4">Datenschutzerklärung</h1>
          <p className="text-muted-foreground text-lg mb-10">Stand: Mai 2026</p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. Verantwortliche Stelle</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br /><br />
              [HIER EINTRAGEN: Name / Organisation]<br />
              [HIER EINTRAGEN: Adresse]<br />
              E-Mail: [HIER EINTRAGEN: datenschutz@beispiel.de]
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. Grundsatz: Keine dauerhaften personenbezogenen Daten</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              MehrDrin ist so konzipiert, dass keine personenbezogenen Daten dauerhaft gespeichert werden.
              Der Fragebogen fragt ausschließlich nach allgemeinen Lebenssituationen (Alter, Wohnsituation,
              Beschäftigung etc.) — keine Namen, keine E-Mail-Adressen, keine Kontaktdaten.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Deine Antworten werden ausschließlich im lokalen Speicher deines Browsers (localStorage)
              zwischengespeichert, um dir eine unterbrechungsfreie Nutzung zu ermöglichen. Diese Daten
              verlassen deinen Browser nicht und werden nicht an unsere Server übertragen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. Erhebung von Nutzungsdaten</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Beim Besuch unserer Website werden automatisch technische Informationen erhoben, die dein
              Browser an unseren Server übermittelt. Dazu gehören:
            </p>
            <ul className="list-disc list-inside text-lg text-muted-foreground leading-relaxed mt-3 space-y-1">
              <li>IP-Adresse (anonymisiert)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Browsertyp und -version</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL (die zuvor besuchte Seite)</li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Diese Daten werden ausschließlich zur technischen Bereitstellung der Website benötigt und
              nicht für Marketingzwecke verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse am Betrieb der Website).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. Hosting: Vercel</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Diese Website wird über Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet.
              Vercel verarbeitet technische Zugriffsdaten (Server-Logs) im Rahmen der Bereitstellung des
              Hostings. Vercel ist nach dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen
              findest du in der{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Datenschutzerklärung von Vercel
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">5. Supabase als Datenverarbeiter</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Für die Bereitstellung der Angebotsdatenbank nutzen wir Supabase (Supabase Inc., San Francisco,
              USA). Supabase speichert ausschließlich die Angebotsdaten (Förderprogramme, Organisationen etc.),
              die wir selbst kuratieren. Keine Nutzerdaten oder Fragebogen-Antworten werden an Supabase
              übertragen.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Supabase ist nach dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen unter{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                supabase.com/privacy
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies und lokaler Speicher</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wir setzen keine Tracking-Cookies oder Analyse-Cookies ein. Die Website nutzt ausschließlich
              den lokalen Speicher (localStorage) deines Browsers, um deine Fragebogen-Antworten während
              der Sitzung zu speichern. Diese Daten werden nicht an uns übertragen und bleiben lokal auf
              deinem Gerät. Du kannst diese Daten jederzeit über die Einstellungen deines Browsers löschen.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. Eingebettete Inhalte und externe Dienste</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Die Website nutzt Google Fonts zur Darstellung der Schriftart. Beim Laden der Seite wird eine
              Anfrage an die Server von Google (Google LLC, USA) gesendet. Dabei kann deine IP-Adresse
              übertragen werden. Weitere Informationen unter{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">8. Deine Rechte</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Du hast gegenüber uns folgende Rechte hinsichtlich der dich betreffenden personenbezogenen Daten:
            </p>
            <ul className="list-disc list-inside text-lg text-muted-foreground leading-relaxed space-y-2">
              <li><strong>Auskunft</strong> (Art. 15 DSGVO): Du kannst Auskunft über die von uns gespeicherten Daten verlangen.</li>
              <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Du kannst die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong>Löschung</strong> (Art. 17 DSGVO): Du kannst die Löschung deiner Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
              <li><strong>Einschränkung</strong> (Art. 18 DSGVO): Du kannst die Einschränkung der Verarbeitung verlangen.</li>
              <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Du kannst der Verarbeitung deiner Daten widersprechen.</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Du kannst die Übertragung deiner Daten in einem gängigen Format verlangen.</li>
            </ul>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Zur Ausübung dieser Rechte wende dich bitte an: [HIER EINTRAGEN: datenschutz@beispiel.de]
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
              In Berlin ist das die Berliner Beauftragte für Datenschutz und Informationsfreiheit
              (www.datenschutz-berlin.de).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">9. Änderungen dieser Datenschutzerklärung</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie stets den
              aktuellen rechtlichen Anforderungen entsprechend zu halten. Die jeweils aktuelle Version
              ist auf dieser Seite abrufbar.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Datenschutz;
