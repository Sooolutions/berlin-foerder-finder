
export interface Funding {
  id: string;
  title: string;
  description: string;
  organization: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    district?: string[];
    income?: {
      min?: number;
      max?: number;
    };
    family?: {
      married?: boolean;
      children?: boolean;
    };
    education?: string[];
    employment?: string[];
    interests?: string[];
  };
  amount: string;
  applicationDeadline?: string;
  applicationProcess: string;
  url: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  tags: string[];
}

export const fundingData: Funding[] = [
  {
    id: "1",
    title: "Gründungszuschuss für Existenzgründer",
    description: "Finanzielle Unterstützung für Arbeitslose, die sich selbstständig machen möchten.",
    organization: "Agentur für Arbeit Berlin",
    eligibility: {
      minAge: 18,
      employment: ["Arbeitslos"],
    },
    amount: "Bis zu 300€ pro Woche für 6 Monate",
    applicationProcess: "Antrag bei der Agentur für Arbeit mit Businessplan",
    url: "https://www.arbeitsagentur.de/existenzgruendung-gruendungszuschuss",
    contactInfo: {
      phone: "030 555570",
      email: "berlin@arbeitsagentur.de",
    },
    tags: ["Existenzgründung", "Arbeitslosigkeit", "Selbstständigkeit"],
  },
  {
    id: "2",
    title: "Wohngeld",
    description: "Zuschuss zur Miete oder zur Belastung von selbstgenutztem Wohneigentum für Haushalte mit geringem Einkommen.",
    organization: "Bezirksamt Berlin",
    eligibility: {
      income: {
        max: 30000,
      },
    },
    amount: "Abhängig vom Einkommen und der Miethöhe",
    applicationProcess: "Antrag beim zuständigen Wohnungsamt des Bezirks",
    url: "https://service.berlin.de/dienstleistung/120656/",
    contactInfo: {
      address: "Abhängig vom Wohnbezirk",
    },
    tags: ["Wohnen", "Miete", "Sozialleistung"],
  },
  {
    id: "3",
    title: "Bildungspaket für Kinder und Jugendliche",
    description: "Förderung für Bildung und Teilhabe von Kindern und Jugendlichen aus einkommensschwachen Familien.",
    organization: "Jobcenter Berlin",
    eligibility: {
      maxAge: 25,
      income: {
        max: 20000,
      },
      education: ["Schule", "Ausbildung"],
    },
    amount: "Abhängig von den beantragten Leistungen",
    applicationProcess: "Antrag beim Jobcenter oder Bezirksamt",
    url: "https://www.berlin.de/sen/soziales/themen/soziale-sicherung/bildungspaket/",
    contactInfo: {
      phone: "030 115",
    },
    tags: ["Bildung", "Kinder", "Jugend", "Sozialleistung"],
  },
  {
    id: "4",
    title: "IBB Mikrokredit Berlin",
    description: "Kleinkredite für Kleinunternehmen und Selbstständige in Berlin.",
    organization: "Investitionsbank Berlin (IBB)",
    eligibility: {
      minAge: 18,
      employment: ["Selbstständig", "Kleinunternehmer"],
    },
    amount: "2.000€ bis 25.000€",
    applicationProcess: "Antrag bei der IBB mit Businessplan und Bonitätsnachweis",
    url: "https://www.ibb.de/de/foerderprogramme/mikrokredit-berlin.html",
    contactInfo: {
      phone: "030 2125-0",
      email: "info@ibb.de",
    },
    tags: ["Kredit", "Unternehmen", "Selbstständigkeit", "Finanzierung"],
  },
  {
    id: "5",
    title: "Berlin-Pass",
    description: "Vergünstigter Zugang zu Kultur-, Bildungs- und Freizeitangeboten für Bezieher von Sozialleistungen.",
    organization: "Bezirksamt Berlin",
    eligibility: {
      income: {
        max: 15000,
      },
    },
    amount: "Vergünstigungen für verschiedene Angebote",
    applicationProcess: "Antrag beim zuständigen Bürgeramt des Bezirks",
    url: "https://service.berlin.de/dienstleistung/121742/",
    contactInfo: {
      address: "Abhängig vom Wohnbezirk",
    },
    tags: ["Kultur", "Freizeit", "Sozialleistung", "Vergünstigung"],
  },
  {
    id: "6",
    title: "Stipendium der Studienstiftung des deutschen Volkes",
    description: "Förderung für besonders begabte Studierende aller Fachrichtungen.",
    organization: "Studienstiftung des deutschen Volkes",
    eligibility: {
      minAge: 17,
      maxAge: 35,
      education: ["Studium"],
    },
    amount: "Bis zu 1.000€ monatlich plus Büchergeld",
    applicationProcess: "Vorschlag durch Hochschule oder Selbstbewerbung",
    url: "https://www.studienstiftung.de/",
    contactInfo: {
      email: "info@studienstiftung.de",
    },
    tags: ["Studium", "Stipendium", "Bildung"],
  },
  {
    id: "7",
    title: "Berliner StartUp Stipendium",
    description: "Förderung für innovative Gründungsvorhaben in Berlin.",
    organization: "Berliner Senatsverwaltung für Wirtschaft",
    eligibility: {
      minAge: 18,
      interests: ["Technologie", "Innovation", "Gründung"],
    },
    amount: "Bis zu 2.000€ monatlich für ein Jahr",
    applicationDeadline: "Jährlich zum 31. März",
    applicationProcess: "Online-Bewerbung mit Businessplan und Pitch",
    url: "https://www.berlin.de/wirtschaft/gruendung/",
    contactInfo: {
      email: "startup@berlin.de",
    },
    tags: ["Gründung", "Innovation", "StartUp", "Technologie"],
  },
  {
    id: "8",
    title: "Berufsausbildungsbeihilfe (BAB)",
    description: "Finanzielle Unterstützung während einer dualen Ausbildung.",
    organization: "Agentur für Arbeit Berlin",
    eligibility: {
      maxAge: 30,
      education: ["Ausbildung"],
    },
    amount: "Abhängig vom Einkommen und der Unterkunftssituation",
    applicationProcess: "Antrag bei der zuständigen Agentur für Arbeit",
    url: "https://www.arbeitsagentur.de/bildung/ausbildung/berufsausbildungsbeihilfe-bab",
    contactInfo: {
      phone: "030 555570",
    },
    tags: ["Ausbildung", "Bildung", "Finanzierung"],
  },
  {
    id: "9",
    title: "Berliner Landeszuschuss für energetische Sanierung",
    description: "Förderung für energetische Modernisierungsmaßnahmen an Wohngebäuden in Berlin.",
    organization: "IBB Wohnungsbauförderung",
    eligibility: {
      interests: ["Energieeinsparung", "Immobilien"],
    },
    amount: "Bis zu 30% der förderfähigen Kosten",
    applicationDeadline: "Laufendes Programm",
    applicationProcess: "Antrag bei der IBB vor Beginn der Maßnahmen",
    url: "https://www.ibb.de/de/foerderprogramme/energetische-gebaeudesanierung.html",
    contactInfo: {
      email: "wohnungsbau@ibb.de",
    },
    tags: ["Energie", "Sanierung", "Immobilien", "Klimaschutz"],
  },
  {
    id: "10",
    title: "Elterngeld",
    description: "Staatliche Leistung für Eltern, die ihr Kind nach der Geburt selbst betreuen.",
    organization: "Bezirksamt Berlin - Jugendamt",
    eligibility: {
      family: {
        children: true,
      },
    },
    amount: "300€ bis 1.800€ monatlich für bis zu 14 Monate",
    applicationProcess: "Antrag beim zuständigen Jugendamt des Bezirks",
    url: "https://service.berlin.de/dienstleistung/326079/",
    contactInfo: {
      address: "Abhängig vom Wohnbezirk",
    },
    tags: ["Familie", "Kinder", "Eltern", "Sozialleistung"],
  },
];

// Berlin-Bezirke für die Auswahl
export const berlinDistricts = [
  "Charlottenburg-Wilmersdorf",
  "Friedrichshain-Kreuzberg",
  "Lichtenberg",
  "Marzahn-Hellersdorf",
  "Mitte",
  "Neukölln",
  "Pankow",
  "Reinickendorf",
  "Spandau",
  "Steglitz-Zehlendorf",
  "Tempelhof-Schöneberg",
  "Treptow-Köpenick"
];

// Bildungsstufen
export const educationLevels = [
  "Ohne Schulabschluss",
  "Hauptschulabschluss",
  "Mittlere Reife",
  "Abitur",
  "Berufsausbildung",
  "Bachelor",
  "Master",
  "Promotion"
];

// Beschäftigungsstatus
export const employmentStatus = [
  "Angestellt",
  "Selbstständig",
  "Arbeitslos",
  "Student/in",
  "Ausbildung",
  "Rentner/in",
  "Elternzeit"
];

// Interessengebiete
export const interestAreas = [
  "Bildung",
  "Kultur",
  "Sport",
  "Technologie",
  "Umwelt",
  "Gesundheit",
  "Soziales",
  "Gründung",
  "Wohnen",
  "Mobilität",
  "Energie",
  "Familie"
];
