/**
 * Themenseiten unter /hilfe/<slug> als reine Daten.
 *
 * Zweck: Menschen suchen nicht nach „MehrDrin“, sondern nach ihrem Problem
 * („Miete zu hoch Hilfe Berlin“, „Geld für Klassenfahrt“). Jede Seite
 * beantwortet genau so eine Suche, nennt die passenden Hilfen, verlinkt den
 * offiziellen Rechner oder Antrag und führt zum Fragebogen.
 *
 * Grundsatz: Wir rechnen keine Beträge aus und nennen möglichst keine Beträge,
 * die sich jährlich ändern. Für die Höhe verlinken wir die amtlichen Rechner.
 * So bleibt die Pflege klein, wenn sich Gesetze ändern.
 *
 * Wird von src/pages/Thema.tsx, src/pages/Themen.tsx und scripts/prerender.ts
 * gelesen. Deshalb nur reines TypeScript, keine React- oder Bild-Imports.
 *
 * Pflege: Bei jeder inhaltlichen Prüfung `geprueft` auf das Datum setzen.
 */

export interface ThemaLink {
  label: string;
  url: string;
  /** rechner = offizieller Rechner/Check, antrag = Antragsseite, info = Erklärseite */
  art: "rechner" | "antrag" | "info";
}

export interface ThemaHilfe {
  name: string;
  text: string;
  /** Aufzählung, etwa einzelne Bausteine einer Leistung */
  punkte?: string[];
  wer?: string;
  wo?: string;
  links?: ThemaLink[];
  /** Verweis auf eine andere Themenseite */
  siehe?: string;
}

export interface Thema {
  slug: string;
  /** Kurzlabel für Kacheln, Footer und Vorschaubild */
  kurz: string;
  /** <title> */
  title: string;
  h1: string;
  /** Meta-Description, etwa 140 bis 160 Zeichen */
  description: string;
  intro: string;
  hilfen: ThemaHilfe[];
  faq: [string, string][];
  /** Suchbegriffe, wie Menschen das Problem formulieren */
  keywords: string[];
  verwandt: string[];
  /** Datum der letzten inhaltlichen Prüfung, ISO */
  geprueft: string;
}

export const THEMEN: Thema[] = [
  {
    slug: "miete-zu-hoch",
    kurz: "Miete zu hoch",
    title: "Miete zu hoch? Diese Hilfen gibt es in Berlin | MehrDrin",
    h1: "Miete zu hoch? Diese Hilfen gibt es in Berlin",
    description:
      "Frisst die Miete dein Einkommen auf, hilft oft Wohngeld, auch wenn du arbeitest oder Rente bekommst. So prüfst du das mit dem offiziellen Rechner.",
    intro:
      "Viele Menschen in Berlin zahlen einen großen Teil ihres Einkommens für die Miete. Dafür gibt es Unterstützung, auch wenn du arbeitest oder Rente bekommst. Die wichtigste ist das Wohngeld. Es ist ein Zuschuss und muss nicht zurückgezahlt werden.",
    hilfen: [
      {
        name: "Wohngeld",
        text: "Ein monatlicher Zuschuss zur Miete. Wie viel es gibt, hängt von Einkommen, Miete und der Zahl der Personen im Haushalt ab.",
        wer: "Haushalte mit kleinem oder mittlerem Einkommen, auch Berufstätige sowie Rentnerinnen und Rentner. Wer Grundsicherungsgeld (früher Bürgergeld) oder Sozialhilfe bekommt, erhält kein zusätzliches Wohngeld, weil dort die Wohnkosten schon enthalten sind.",
        wo: "Wohnungsamt oder Bürgeramt deines Bezirks. Den Antrag kannst du auch online stellen.",
        links: [
          { label: "Wohngeldrechner des Landes Berlin", url: "https://www.berlin.de/sen/wohnen/service/wohngeldrechner/", art: "rechner" },
          { label: "Wohngeld beantragen (Service-Portal Berlin)", url: "https://service.berlin.de/dienstleistung/120656/", art: "antrag" },
        ],
      },
      {
        name: "Wohnberechtigungsschein (WBS)",
        text: "Mit dem WBS kannst du dich auf geförderte Sozialwohnungen bewerben, die meist günstiger sind als Wohnungen auf dem freien Markt.",
        wer: "Haushalte unterhalb bestimmter Einkommensgrenzen. Je nach Einkommen gibt es unterschiedliche WBS-Arten.",
        wo: "Wohnungsamt oder Bürgeramt deines Bezirks, auch online.",
        links: [{ label: "WBS beantragen (Service-Portal Berlin)", url: "https://service.berlin.de/dienstleistung/120671/", art: "antrag" }],
      },
      {
        name: "Grundsicherungsgeld (früher Bürgergeld)",
        text: "Reicht dein Einkommen auch mit Wohngeld nicht für Miete und Lebensunterhalt, übernimmt das Jobcenter angemessene Wohnkosten. Seit dem 1. Juli 2026 heißt das Bürgergeld Grundsicherungsgeld.",
        wer: "Erwerbsfähige Menschen, deren Einkommen und Vermögen nicht für den Lebensunterhalt reicht, auch wenn sie arbeiten.",
        wo: "Jobcenter deines Bezirks.",
        links: [{ label: "Was sich mit dem Grundsicherungsgeld ändert (Bundesagentur für Arbeit)", url: "https://www.arbeitsagentur.de/grundsicherung-loest-buergergeld-ab", art: "info" }],
      },
    ],
    faq: [
      [
        "Kann ich Wohngeld bekommen, obwohl ich arbeite?",
        "Ja. Wohngeld ist gerade für Menschen gedacht, die arbeiten oder Rente bekommen, aber wegen der Wohnkosten knapp bei Kasse sind. Der offizielle Wohngeldrechner gibt dir eine erste unverbindliche Einschätzung.",
      ],
      [
        "Ab wann zahlt das Amt Wohngeld?",
        "Wohngeld gibt es frühestens ab dem Monat, in dem dein Antrag beim Amt eingeht. Stell den Antrag deshalb lieber früh. Fehlende Unterlagen kannst du nachreichen.",
      ],
      [
        "Ich kann die Miete schon jetzt nicht mehr zahlen. Was tun?",
        "Dann warte nicht ab. Wende dich sofort an die Soziale Wohnhilfe deines Bezirks. Wie das geht, steht auf unserer Seite zu Mietschulden und Kündigung.",
      ],
    ],
    keywords: ["Miete zu hoch Hilfe Berlin", "Wohngeld Berlin", "Mietzuschuss", "Wohngeld beantragen", "WBS Berlin"],
    verwandt: ["mietschulden-kuendigung", "wenig-geld-trotz-arbeit", "rente-reicht-nicht"],
    geprueft: "2026-11-20",
  },
  {
    slug: "mietschulden-kuendigung",
    kurz: "Mietschulden oder Kündigung",
    title: "Mietschulden, Kündigung, Räumung: schnelle Hilfe in Berlin | MehrDrin",
    h1: "Mietschulden oder Kündigung? Hier bekommst du in Berlin schnell Hilfe",
    description:
      "Mietrückstand, Kündigung oder Räumungsklage? Die Soziale Wohnhilfe deines Bezirks hilft. Mietschulden können übernommen werden, auch ohne laufende Sozialleistung.",
    intro:
      "Wenn du mit der Miete im Rückstand bist oder schon eine Kündigung bekommen hast, zählt jeder Tag. Je früher du dich meldest, desto mehr Möglichkeiten gibt es, deine Wohnung zu retten. Du musst dafür keine Sozialleistungen beziehen.",
    hilfen: [
      {
        name: "Fachstelle Soziale Wohnhilfe",
        text: "Jeder Bezirk hat beim Amt für Soziales eine Fachstelle, die bei Mietschulden, Kündigung und drohender Räumung berät. Sie prüft, ob die Schulden übernommen werden können, und klärt die Zuständigkeit mit dem Jobcenter.",
        wer: "Alle, denen der Verlust der Wohnung droht. Ein laufender Leistungsbezug ist nicht nötig.",
        wo: "Amt für Soziales deines Bezirks, meist mit offener Sprechstunde.",
        links: [
          { label: "Alle Fachstellen Soziale Wohnhilfe mit Sprechzeiten", url: "https://www.berlin.de/sen/soziales/besondere-lebenssituationen/wohnungslose/praevention/", art: "info" },
        ],
      },
      {
        name: "Übernahme von Mietschulden",
        text: "Sozialamt oder Jobcenter können Mietschulden übernehmen, meist als Darlehen, damit eine Räumung verhindert wird. In bestimmten Fällen gilt das auch für Schulden bei Strom oder Gas.",
        wer: "Wenn sonst der Verlust der Wohnung droht. Erste Anlaufstelle ist die Soziale Wohnhilfe.",
      },
      {
        name: "Kostenlose Schuldnerberatung",
        text: "Wenn neben der Miete noch andere Schulden drücken, hilft eine anerkannte Schuldner- und Insolvenzberatung. Sie ist kostenlos und vertraulich.",
        siehe: "schulden",
      },
    ],
    faq: [
      [
        "Ich habe schon eine Räumungsklage bekommen. Ist es zu spät?",
        "Oft nicht. Bei einer fristlosen Kündigung wegen Mietschulden gibt es eine Frist von zwei Monaten nach Zustellung der Räumungsklage. Zahlt in dieser Zeit das Amt den Rückstand oder sagt die Zahlung zu, kann die Kündigung unwirksam werden. Geh deshalb sofort zur Sozialen Wohnhilfe und lass dich beraten.",
      ],
      [
        "Muss ich dafür Grundsicherungsgeld oder Sozialhilfe bekommen?",
        "Nein. Die Soziale Wohnhilfe ist für alle da, denen Wohnungslosigkeit droht. Ob und wie Schulden übernommen werden, prüft sie im Einzelfall.",
      ],
    ],
    keywords: ["Mietschulden Hilfe Berlin", "Kündigung Mietrückstand", "Räumungsklage was tun", "Soziale Wohnhilfe", "Mietschuldenübernahme"],
    verwandt: ["miete-zu-hoch", "schulden"],
    geprueft: "2026-11-20",
  },
  {
    slug: "klassenfahrt-schulsachen",
    kurz: "Geld für Klassenfahrt",
    title: "Geld für Klassenfahrt, Schulessen und Nachhilfe in Berlin | MehrDrin",
    h1: "Geld für Klassenfahrt, Schulessen und Nachhilfe",
    description:
      "Klassenfahrt zu teuer? Mit dem Bildungspaket übernimmt Berlin Klassenfahrt und Schulessen voll, wenn du Wohngeld, Kinderzuschlag oder Grundsicherungsgeld bekommst.",
    intro:
      "Kein Kind soll zu Hause bleiben, weil die Klassenfahrt zu teuer ist. Dafür gibt es das Bildungs- und Teilhabepaket, kurz BuT. Viele Familien, die es bekommen könnten, wissen nichts davon, vor allem Familien mit Wohngeld oder Kinderzuschlag.",
    hilfen: [
      {
        name: "Bildungs- und Teilhabepaket (BuT)",
        text: "Das Paket übernimmt Kosten rund um Schule, Kita und Freizeit.",
        punkte: [
          "Klassenfahrten sowie Schul- und Kitaausflüge werden voll bezahlt.",
          "Mittagessen in Schule und Kita wird voll bezahlt.",
          "Geld für Schulbedarf wie Hefte, Stifte und Ranzen.",
          "Nachhilfe, wenn sie nötig ist, um das Lernziel zu erreichen.",
          "15 Euro im Monat für Sportverein, Musikschule oder Kurse, bis zum 18. Geburtstag.",
          "Fahrtkosten zur Schule, soweit das kostenlose Schülerticket sie nicht abdeckt.",
        ],
        wer: "Kinder und junge Menschen bis 25 Jahre, wenn die Familie Grundsicherungsgeld (früher Bürgergeld), Sozialhilfe, Asylbewerberleistungen, Wohngeld oder Kinderzuschlag bekommt. Für Sport, Musik und Kultur gilt die Grenze von 18 Jahren.",
        wo: "Mit Wohngeld oder Kinderzuschlag stellst du den Antrag beim Bürgeramt oder Wohnungsamt deines Bezirks, online oder per Post. Mit Grundsicherungsgeld brauchst du keinen eigenen Antrag, du reichst die Belege beim Jobcenter ein. Mit Sozialhilfe ist das Amt für Soziales zuständig, mit Asylbewerberleistungen das Landesamt für Flüchtlingsangelegenheiten.",
        links: [{ label: "Bildungspaket beantragen (Service-Portal Berlin)", url: "https://service.berlin.de/dienstleistung/324466/", art: "antrag" }],
      },
      {
        name: "berlinpass-BuT",
        text: "Der berlinpass-BuT ist der Nachweis für dein Kind, etwa gegenüber Schule oder Kita und für ermäßigten Eintritt in Bäder, Museen oder den Zoo. Du bekommst ihn von der Stelle, die auch das Bildungspaket bewilligt.",
      },
      {
        name: "Kinderzuschlag als Türöffner",
        text: "Wer Kinderzuschlag bekommt, hat auch Anspruch auf das Bildungspaket. Viele Familien mit kleinem Einkommen bekommen den Kinderzuschlag, haben ihn aber nie beantragt.",
        siehe: "kinderzuschlag",
      },
    ],
    faq: [
      [
        "Muss ich die Klassenfahrt erst selbst bezahlen?",
        "Nicht unbedingt. Am besten reichst du die Bestätigung der Schule schon vor der Fahrt ein, dafür gibt es ein Formular. Eine nachträgliche Erstattung ist ebenfalls möglich.",
      ],
      [
        "Mein Kind ist schon volljährig. Gilt das noch?",
        "Ja, bis zum 25. Geburtstag, solange es zur Schule geht und keine Ausbildungsvergütung bekommt. Nur der Zuschuss für Sport, Musik und Kultur endet mit 18.",
      ],
    ],
    keywords: ["Geld für Klassenfahrt", "Klassenfahrt bezahlen Zuschuss Berlin", "Bildungs- und Teilhabepaket Berlin", "BuT Berlin", "Schulessen kostenlos", "berlinpass BuT"],
    verwandt: ["kinderzuschlag", "wenig-geld-trotz-arbeit", "berlinpass-berlin-ticket-s"],
    geprueft: "2026-11-20",
  },
  {
    slug: "kinderzuschlag",
    kurz: "Kinderzuschlag",
    title: "Kinderzuschlag prüfen: Geld für Familien mit kleinem Einkommen | MehrDrin",
    h1: "Kinderzuschlag: Geld für Familien, bei denen es knapp ist",
    description:
      "Du arbeitest, aber das Geld reicht nicht für die ganze Familie? Dann kommt der Kinderzuschlag infrage. Mit dem KiZ-Lotsen der Familienkasse prüfst du das schnell.",
    intro:
      "Der Kinderzuschlag, kurz KiZ, ist für Eltern gedacht, die genug für sich selbst verdienen, bei denen das Einkommen aber nicht oder nur knapp für die ganze Familie reicht. Er kommt zusätzlich zum Kindergeld. Viele Familien, denen er zusteht, beantragen ihn nie.",
    hilfen: [
      {
        name: "Kinderzuschlag (KiZ)",
        text: "Ein monatlicher Zuschuss pro Kind zusätzlich zum Kindergeld. Er wird in der Regel für sechs Monate bewilligt, danach stellst du einen neuen Antrag.",
        wer: "Eltern, deren Einkommen für sie selbst reicht, aber nicht für den Bedarf der ganzen Familie.",
        wo: "Familienkasse der Bundesagentur für Arbeit, online oder schriftlich.",
        links: [
          { label: "KiZ-Lotse: Anspruch in wenigen Minuten prüfen (Familienkasse)", url: "https://www.arbeitsagentur.de/familie-und-kinder/kinderzuschlag-verstehen/kiz-lotse", art: "rechner" },
          { label: "Kinderzuschlag erklärt (Familienportal des Bundes)", url: "https://familienportal.de/familienportal/familienleistungen/kinderzuschlag", art: "info" },
        ],
      },
      {
        name: "Wohngeld zusätzlich",
        text: "Kinderzuschlag und Wohngeld lassen sich kombinieren. Gerade in Berlin mit hohen Mieten lohnt es sich, beides zu prüfen.",
        siehe: "miete-zu-hoch",
      },
      {
        name: "Bildungspaket für deine Kinder",
        text: "Mit Kinderzuschlag hast du auch Anspruch auf das Bildungs- und Teilhabepaket, also zum Beispiel auf kostenlose Klassenfahrten und kostenloses Schulessen.",
        siehe: "klassenfahrt-schulsachen",
      },
    ],
    faq: [
      [
        "Rechnet der KiZ-Lotse aus, wie viel ich bekomme?",
        "Nein. Der KiZ-Lotse prüft, ob ein Anspruch infrage kommt und sich ein Antrag lohnt. Die genaue Höhe legt die Familienkasse nach deinem Antrag fest.",
      ],
      [
        "Bekomme ich den Kinderzuschlag auch, wenn ich Grundsicherungsgeld beziehe?",
        "Der Kinderzuschlag soll verhindern, dass Familien Grundsicherungsgeld brauchen. Beides gleichzeitig gibt es in der Regel nicht. Ob der Wechsel für dich passt, prüft die Familienkasse.",
      ],
    ],
    keywords: ["Kinderzuschlag Berlin", "KiZ Lotse", "Kinderzuschlag prüfen", "Geld für Familien mit wenig Einkommen"],
    verwandt: ["klassenfahrt-schulsachen", "wenig-geld-trotz-arbeit", "miete-zu-hoch"],
    geprueft: "2026-11-20",
  },
  {
    slug: "wenig-geld-trotz-arbeit",
    kurz: "Wenig Geld trotz Job",
    title: "Wenig Geld trotz Arbeit? Diese Zuschüsse gibt es in Berlin | MehrDrin",
    h1: "Wenig Geld trotz Arbeit? Diese Zuschüsse gibt es",
    description:
      "Arbeiten und trotzdem knapp? Wohngeld, Kinderzuschlag und aufstockendes Grundsicherungsgeld können helfen. Hier siehst du, was für dich in Berlin infrage kommt.",
    intro:
      "Arbeiten und trotzdem kaum über die Runden kommen, das geht vielen in Berlin so. Es gibt staatliche Zuschüsse genau für diese Lage. Sie haben nichts mit Arbeitslosigkeit zu tun, und du verlierst deinen Job dadurch nicht.",
    hilfen: [
      {
        name: "Wohngeld",
        text: "Zuschuss zur Miete für Haushalte mit kleinem oder mittlerem Einkommen. Für viele Berufstätige mit Mindestlohn oder Teilzeit ist das die wichtigste Hilfe.",
        siehe: "miete-zu-hoch",
        links: [{ label: "Wohngeldrechner des Landes Berlin", url: "https://www.berlin.de/sen/wohnen/service/wohngeldrechner/", art: "rechner" }],
      },
      {
        name: "Kinderzuschlag",
        text: "Für Eltern, deren Einkommen für sie selbst reicht, aber nicht für die ganze Familie.",
        siehe: "kinderzuschlag",
        links: [{ label: "KiZ-Lotse der Familienkasse", url: "https://www.arbeitsagentur.de/familie-und-kinder/kinderzuschlag-verstehen/kiz-lotse", art: "rechner" }],
      },
      {
        name: "Aufstockendes Grundsicherungsgeld",
        text: "Reicht dein Lohn auch mit Wohngeld und Kinderzuschlag nicht zum Leben, kann das Jobcenter den Rest aufstocken. Seit dem 1. Juli 2026 heißt das Bürgergeld Grundsicherungsgeld.",
        wo: "Jobcenter deines Bezirks.",
      },
      {
        name: "Günstig mobil und ermäßigter Eintritt",
        text: "Mit Wohngeld kannst du in Berlin das günstige Berlin-Ticket S nutzen und bekommst Ermäßigungen bei Bädern, Museen und Kursen.",
        siehe: "berlinpass-berlin-ticket-s",
      },
    ],
    faq: [
      [
        "Was ist besser, Wohngeld oder Grundsicherungsgeld?",
        "Das lässt sich nicht allgemein sagen. Beides gleichzeitig geht nicht. Wohngeld und Kinderzuschlag sollen verhindern, dass du Grundsicherungsgeld brauchst. Eine Beratungsstelle oder die Ämter helfen dir, das Passende zu wählen.",
      ],
      [
        "Erfährt mein Arbeitgeber davon?",
        "Für Wohngeld oder Kinderzuschlag brauchst du in der Regel Lohnnachweise. Das Amt meldet deinem Arbeitgeber aber nicht, dass du die Leistung bekommst.",
      ],
    ],
    keywords: ["wenig Geld trotz Arbeit", "Aufstocken Berlin", "Zuschuss Geringverdiener", "Wohngeld trotz Job"],
    verwandt: ["miete-zu-hoch", "kinderzuschlag", "berlinpass-berlin-ticket-s"],
    geprueft: "2026-11-20",
  },
  {
    slug: "schulden",
    kurz: "Schulden",
    title: "Schulden? Kostenlose Schuldnerberatung in Berlin finden | MehrDrin",
    h1: "Schulden? So findest du kostenlose Hilfe in Berlin",
    description:
      "In jedem Berliner Bezirk gibt es mindestens eine staatlich anerkannte Schuldner- und Insolvenzberatung. Die Beratung ist kostenlos und vertraulich.",
    intro:
      "Schulden sind kein Grund, sich zu schämen, und mit Hilfe meist lösbar. In jedem Berliner Bezirk gibt es mindestens eine staatlich anerkannte Schuldner- und Insolvenzberatung. Sie kostet nichts und hilft dir, einen Plan zu machen.",
    hilfen: [
      {
        name: "Schuldner- und Insolvenzberatung",
        text: "Die Beratung verschafft dir einen Überblick, verhandelt mit Gläubigern und bereitet, wenn nötig, eine Privatinsolvenz vor.",
        wer: "Alle, die in Berlin wohnen. Wende dich an die Beratungsstelle in deinem Bezirk.",
        wo: "Anerkannte Beratungsstellen freier Träger in allen Bezirken.",
        links: [
          { label: "Liste der anerkannten Beratungsstellen nach Bezirk", url: "https://www.berlin.de/sen/soziales/besondere-lebenssituationen/schuldner/anerkannte-beratungsstellen/", art: "info" },
          { label: "Landesarbeitsgemeinschaft Schuldner- und Insolvenzberatung Berlin", url: "https://www.schuldnerberatung-berlin.de/", art: "info" },
        ],
      },
      {
        name: "Mietschulden zuerst",
        text: "Geht es um Mietrückstände oder droht eine Kündigung, ist die Soziale Wohnhilfe deines Bezirks die schnellste Hilfe.",
        siehe: "mietschulden-kuendigung",
      },
    ],
    faq: [
      [
        "Was kostet die Beratung?",
        "Bei den staatlich anerkannten Stellen nichts. Sei vorsichtig bei Firmen, die für Schuldenregulierung Geld verlangen.",
      ],
      [
        "Was ist eine Privatinsolvenz?",
        "Ein gerichtliches Verfahren, nach dem dir Restschulden erlassen werden können. Vorher muss eine anerkannte Stelle versuchen, sich außergerichtlich mit deinen Gläubigern zu einigen. Das übernimmt die Schuldnerberatung.",
      ],
    ],
    keywords: ["Schuldnerberatung Berlin kostenlos", "Schulden Hilfe Berlin", "Privatinsolvenz Berlin", "Insolvenzberatung"],
    verwandt: ["mietschulden-kuendigung", "wenig-geld-trotz-arbeit"],
    geprueft: "2026-11-20",
  },
  {
    slug: "berlinpass-berlin-ticket-s",
    kurz: "berlinpass und Berlin-Ticket S",
    title: "berlinpass und Berlin-Ticket S: Was gilt heute? | MehrDrin",
    h1: "berlinpass und Berlin-Ticket S: Was gilt heute?",
    description:
      "Für das Berlin-Ticket S und Ermäßigungen brauchst du als Erwachsener keinen berlinpass mehr. Dein Leistungsbescheid reicht. Wer berechtigt ist und was du brauchst.",
    intro:
      "Viele kennen noch den berlinpass. Als Erwachsener brauchst du ihn heute nicht mehr. Seit 2025 ist dein Leistungsbescheid selbst der Nachweis, zum Beispiel für die günstige Monatskarte Berlin-Ticket S und für ermäßigten Eintritt. Für Kinder gibt es weiterhin den berlinpass-BuT.",
    hilfen: [
      {
        name: "Berlin-Ticket S",
        text: "Eine preisreduzierte Monatskarte für alle Busse und Bahnen im Tarifbereich AB.",
        wer: "Menschen mit Hauptwohnsitz in Berlin, die Grundsicherungsgeld (früher Bürgergeld), Sozialhilfe, Grundsicherung im Alter oder bei Erwerbsminderung, Asylbewerberleistungen, Wohngeld oder bestimmte Leistungen für Opfer der SED-Diktatur bekommen. Auch Haushaltsmitglieder zählen meist dazu.",
        wo: "Unterwegs dabeihaben musst du das Ticket mit deinem vollen Namen, deinen Leistungsbescheid und einen amtlichen Ausweis.",
        links: [{ label: "Berlin-Ticket S und Vergünstigungen (Service-Portal Berlin)", url: "https://service.berlin.de/dienstleistung/121742/", art: "info" }],
      },
      {
        name: "Ermäßigter Eintritt",
        text: "Mit demselben Nachweis gibt es Ermäßigungen in Museen, Theatern, Konzerten und Kinos, in Schwimmbädern, im Zoo, im Tierpark und im Botanischen Garten sowie bei Bibliotheken, Volkshochschule und Musikschule.",
      },
      {
        name: "berlinpass-BuT für Kinder",
        text: "Kinder und Jugendliche aus Familien mit Leistungsbezug bekommen den berlinpass-BuT. Er ist der Nachweis für das Bildungspaket, etwa für kostenloses Schulessen und Klassenfahrten.",
        siehe: "klassenfahrt-schulsachen",
      },
    ],
    faq: [
      [
        "Kann ich mit Wohngeld das Berlin-Ticket S nutzen?",
        "Ja. Wohngeld gehört zu den Leistungen, die zum Berlin-Ticket S berechtigen. Auch die Personen, die im Wohngeldbescheid mitgezählt werden, sind berechtigt.",
      ],
      [
        "Wo bekomme ich noch einen berlinpass?",
        "Als Erwachsener brauchst du keinen mehr, dein Bescheid reicht als Nachweis. Für Kinder stellt die Stelle, die das Bildungspaket bewilligt, den berlinpass-BuT aus.",
      ],
    ],
    keywords: ["berlinpass", "berlinpass beantragen", "Berlin-Ticket S", "Sozialticket Berlin", "Ermäßigung Berlin Wohngeld"],
    verwandt: ["wenig-geld-trotz-arbeit", "klassenfahrt-schulsachen", "rente-reicht-nicht"],
    geprueft: "2026-11-20",
  },
  {
    slug: "rente-reicht-nicht",
    kurz: "Rente reicht nicht",
    title: "Rente reicht nicht? Grundsicherung im Alter und Wohngeld in Berlin | MehrDrin",
    h1: "Rente reicht nicht? Diese Hilfen gibt es in Berlin",
    description:
      "Wenn die Rente nicht zum Leben reicht, gibt es Grundsicherung im Alter oder Wohngeld. Wer was bekommt und wo du in Berlin den Antrag stellst.",
    intro:
      "Wer lange gearbeitet hat und trotzdem mit der Rente nicht auskommt, hat ein Recht auf Unterstützung. Das ist keine Bettelei, sondern eine gesetzliche Leistung. Viele ältere Menschen beantragen sie aus Scham nicht.",
    hilfen: [
      {
        name: "Wohngeld für Rentnerinnen und Rentner",
        text: "Ist deine Rente nur etwas zu niedrig für die Miete, reicht oft schon Wohngeld. Es ist ein Zuschuss und muss nicht zurückgezahlt werden.",
        siehe: "miete-zu-hoch",
        links: [{ label: "Wohngeldrechner des Landes Berlin", url: "https://www.berlin.de/sen/wohnen/service/wohngeldrechner/", art: "rechner" }],
      },
      {
        name: "Grundsicherung im Alter und bei Erwerbsminderung",
        text: "Reicht das Einkommen insgesamt nicht für den Lebensunterhalt, deckt die Grundsicherung den Bedarf einschließlich angemessener Wohnkosten.",
        wer: "Menschen ab der Regelaltersgrenze und dauerhaft voll erwerbsgeminderte Erwachsene, deren Einkommen und Vermögen nicht reicht.",
        wo: "Amt für Soziales deines Bezirks, per Post oder vor Ort.",
        links: [{ label: "Grundsicherung im Alter beantragen (Service-Portal Berlin)", url: "https://service.berlin.de/dienstleistung/324394/", art: "antrag" }],
      },
      {
        name: "Berlin-Ticket S und Ermäßigungen",
        text: "Mit Grundsicherung im Alter oder Wohngeld fährst du günstiger Bus und Bahn und bekommst ermäßigten Eintritt.",
        siehe: "berlinpass-berlin-ticket-s",
      },
    ],
    faq: [
      [
        "Müssen meine Kinder dafür zahlen?",
        "In der Regel nicht. Auf das Einkommen deiner Kinder greift das Amt erst zu, wenn eines von ihnen mehr als 100.000 Euro im Jahr verdient.",
      ],
      [
        "Wohngeld oder Grundsicherung, was passt für mich?",
        "Beides gleichzeitig geht nicht. Fehlt nur wenig, reicht oft Wohngeld. Fehlt mehr, ist die Grundsicherung richtig. Das Amt für Soziales prüft das mit dir.",
      ],
    ],
    keywords: ["Rente reicht nicht Berlin", "Grundsicherung im Alter Berlin", "Wohngeld Rentner", "Altersarmut Hilfe"],
    verwandt: ["miete-zu-hoch", "berlinpass-berlin-ticket-s"],
    geprueft: "2026-11-20",
  },
  {
    slug: "ausbildung-studium-geld",
    kurz: "Geld für Ausbildung oder Studium",
    title: "Geld für Ausbildung und Studium: BAföG und BAB prüfen | MehrDrin",
    h1: "Geld für Ausbildung und Studium: BAföG, BAB und mehr",
    description:
      "BAföG fürs Studium, Berufsausbildungsbeihilfe für die Ausbildung. Mit den offiziellen Rechnern prüfst du schnell, ob sich ein Antrag lohnt, und wo du ihn in Berlin stellst.",
    intro:
      "Ausbildung oder Studium sollen nicht am Geld scheitern. Für beides gibt es staatliche Unterstützung. Wichtig ist, den Antrag früh zu stellen, denn rückwirkend wird in der Regel nicht gezahlt.",
    hilfen: [
      {
        name: "BAföG",
        text: "Unterstützung für Studium und bestimmte Schulformen. Beim Studium ist in der Regel die Hälfte ein Zuschuss und die Hälfte ein zinsloses Darlehen. Schüler-BAföG muss nicht zurückgezahlt werden.",
        wer: "Studierende und Schülerinnen und Schüler an förderfähigen Schulen, abhängig vom eigenen Einkommen und dem der Eltern.",
        wo: "Für alle Studierenden an Berliner Hochschulen ist das studierendenWERK BERLIN zuständig. Den Antrag stellst du online.",
        links: [
          { label: "BAföG-Rechner (offiziell)", url: "https://www.bafoeg-rechner.de/Rechner/", art: "rechner" },
          { label: "BAföG online beantragen (BAföG Digital)", url: "https://www.bafoeg-digital.de/", art: "antrag" },
        ],
      },
      {
        name: "Berufsausbildungsbeihilfe (BAB)",
        text: "Zuschuss während einer betrieblichen Ausbildung, wenn die Ausbildungsvergütung nicht zum Leben reicht, etwa weil du nicht bei deinen Eltern wohnen kannst. Die BAB muss nicht zurückgezahlt werden.",
        wo: "Agentur für Arbeit, online oder vor Ort.",
        links: [
          { label: "BAB-Rechner der Bundesagentur für Arbeit", url: "https://www.babrechner.arbeitsagentur.de/", art: "rechner" },
          { label: "BAB beantragen (Bundesagentur für Arbeit)", url: "https://www.arbeitsagentur.de/bildung/ausbildung/berufsausbildungsbeihilfe-bab", art: "antrag" },
        ],
      },
    ],
    faq: [
      [
        "Ab wann bekomme ich BAföG?",
        "Frühestens ab dem Monat, in dem dein Antrag eingeht. Stell ihn deshalb, sobald du deinen Studienplatz hast. Unterlagen kannst du nachreichen.",
      ],
      [
        "Meine Eltern verdienen zu viel, zahlen aber nicht. Was nun?",
        "Dann kannst du beim BAföG-Amt Vorausleistung beantragen. Das Amt zahlt dann und holt sich das Geld von deinen Eltern. Lass dich dazu beim studierendenWERK beraten.",
      ],
    ],
    keywords: ["BAföG Berlin", "BAföG Rechner", "Berufsausbildungsbeihilfe", "BAB Rechner", "Geld für Ausbildung"],
    verwandt: ["miete-zu-hoch", "wenig-geld-trotz-arbeit"],
    geprueft: "2026-11-20",
  },
];

export const getThema = (slug?: string) => THEMEN.find((t) => t.slug === slug);

export const formatGeprueft = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("de-DE", { month: "long", year: "numeric" });

export const LINK_ART_LABEL: Record<ThemaLink["art"], string> = {
  rechner: "Offizieller Rechner",
  antrag: "Antrag",
  info: "Infos",
};
