/**
 * Blogartikel als reine Daten.
 *
 * Diese Datei wird sowohl von der React-App (src/pages/Blog.tsx, src/pages/BlogPost.tsx)
 * als auch vom Build-Skript scripts/prerender.ts gelesen. Sie darf deshalb nur
 * reines TypeScript enthalten (keine React-, Bild- oder CSS-Imports).
 *
 * Fußnoten im Fließtext: [^1], [^2] … verweisen auf post.footnotes[0], [1] …
 */

export type ChartSpec =
  | {
      /** Je Leistung eine Kennzahl mit Anteilsbalken (0–100 %) */
      kind: "shares";
      items: { label: string; period: string; value: number }[];
      valueNote: string;
    }
  | {
      /** Einfache horizontale Balken */
      kind: "bars";
      items: { label: string; value: number }[];
      valueNote: string;
    }
  | {
      /** Kleine Vielfache: je Kategorie ein Panel mit denselben Gruppen */
      kind: "panels";
      groups: string[];
      panels: { label: string; values: number[] }[];
      max: number;
      valueNote: string;
    };

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "figure"; number: number; caption: string; source: string; chart: ChartSpec };

export interface Source {
  text: string;
  url?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Meta-Description für Google (ca. 140–160 Zeichen) */
  description: string;
  /** Kurzer Teaser für die Blog-Übersicht */
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  category: string;
  readTime: string;
  keywords: string[];
  /** Optionale Kennzahl für die Karte in der Blog-Übersicht */
  highlight?: { value: number; label: string };
  blocks: Block[];
  footnotes: string[];
  sources: Source[];
}

export const SITE_URL = "https://mehrdrin-berlin.de";

export const blogPosts: BlogPost[] = [
  {
    slug: "non-take-up-sozialleistungen-berlin",
    title: "Non-Take-Up-Rates und ihre Folgen",
    description:
      "Viele Berechtigte rufen ihnen zustehende Sozialleistungen nie ab. Beim Kinderzuschlag sind es 87 Prozent. Was diese Lücke für Berlin und das Vertrauen in die Demokratie bedeutet.",
    excerpt:
      "Mehr als die Hälfte der Berechtigten bezieht zentrale Sozialleistungen nicht. Warum das so ist, warum Berlin besonders betroffen ist und was diese Lücke mit dem Vertrauen in demokratische Institutionen zu tun hat.",
    date: "2026-10-29",
    author: "Team MehrDrin",
    category: "Sozialstaat",
    readTime: "6 Min",
    keywords: [
      "Non-Take-Up",
      "Nichtinanspruchnahme Sozialleistungen",
      "Kinderzuschlag",
      "Grundsicherung im Alter",
      "Bildungs- und Teilhabepaket",
      "Armut Berlin",
      "Sozialstaat",
    ],
    highlight: { value: 87, label: "der Berechtigten beziehen den Kinderzuschlag nicht" },
    blocks: [
      {
        type: "p",
        text: "Demokratische Gesellschaften basieren auf sozialer Absicherung. Durch sie erhalten Bürgerinnen und Bürger unabhängig von ihrer Herkunft oder ihrem Einkommen die Möglichkeit zur Teilhabe am gesellschaftlichen Leben. Soziale und ökonomische Ungleichheit kann zu politischer Destabilisierung sowie einem Vertrauensverlust in die Institutionen führen. Insbesondere Staaten, die über ausgeprägte Sozialsysteme verfügen, können ihr Handeln legitimieren, indem sie Disparitäten verringern. Dadurch sind Sozialsysteme für demokratische Systeme unerlässlich. Sie stärken den gesellschaftlichen Zusammenhalt und sind Ausdruck eines gemeinschaftlichen und solidarischen Miteinanders.[^1]",
      },
      {
        type: "p",
        text: "In vielen Volkswirtschaften mit einem ausgeprägten Sozialsystem werden diese Leistungen zu großen Teilen jedoch nicht in Anspruch genommen. In Deutschland nahmen 56 % der berechtigten Empfänger das Arbeitslosengeld II nicht in Anspruch.[^2] Noch höhere Raten sind bei der Grundsicherung im Alter und dem Kinderzuschlag feststellbar (vgl. Abbildung 1). Neben der Zunahme sozialer Ungleichheiten kann dadurch auch das Vertrauen in demokratische Institutionen verloren gehen. Darüber hinaus gefährdet eine Nichtinanspruchnahme die Effizienz und Zielgenauigkeit der Familien- und Sozialpolitik und kann verdeckte Armut und Desintegration schaffen.[^3]",
      },
      {
        type: "figure",
        number: 1,
        caption: "Non-Take-Up-Rate ausgewählter Sozialleistungen in Deutschland",
        source: "Eigene Darstellung nach Baisch et al. (2023)",
        chart: {
          kind: "shares",
          valueNote: "Anteil der Berechtigten, die die Leistung nicht beziehen",
          items: [
            { label: "Arbeitslosengeld II", period: "2005 bis 2014", value: 56 },
            { label: "Grundsicherung im Alter", period: "2010 bis 2015", value: 62 },
            { label: "Kinderzuschlag (1 Kind)", period: "2013", value: 87 },
          ],
        },
      },
      {
        type: "p",
        text: "Das Problem nicht in Anspruch genommener Sozialleistungen ist in der Forschung bereits Gegenstand zahlreicher Untersuchungen. Die Höhe der sogenannten „Non-Take-Up-Rates“ in modernen Sozialstaaten wird dabei auf mehrere Gründe zurückgeführt. Neben gesellschaftlicher Stigmatisierung oder komplizierten Bewerbungsprozessen findet dabei insbesondere die fehlende Bereitstellung von Informationen sowie die Unwissenheit berechtigter Empfänger über die Leistungen Erwähnung.[^4]",
      },
      { type: "h2", text: "Die Zuspitzung sozialer Spannungsverhältnisse: Extremfall Berlin" },
      {
        type: "p",
        text: "Städte sind meist geprägt von einem diversen Sozialgefüge, sowohl auf kultureller als auch auf ökonomischer Ebene. Insbesondere für Berlin stellt diese Diversität ein Alleinstellungsmerkmal dar. Zeitgleich weist Berlin jedoch die zweithöchste Armutsgefährdungsquote eines deutschen Bundeslandes auf. 2023 verdienen 19,6 % der Berliner Bevölkerung weniger als 60 % des Medianeinkommens des Landes Berlin.[^5] Hinzu kommen hohe Mieten, zunehmende psychische Belastung und Erkrankungen, insbesondere bei Jugendlichen, und wachsende Bildungsungleichheiten. Zwischen 2012 und 2024 stieg der Mietpreis im Durchschnitt von 7,63 EUR/m² auf 16,44 EUR/m², in den inneren Bezirken teilweise auf ca. 20 EUR/m².[^6] Zudem stellen die Integration Geflüchteter sowie zunehmende Diskriminierung und Rassismus gegenüber diesen Gruppen eine weitere Herausforderung dar. Zwar gibt es in Berlin zahlreiche Angebote, die diesen Problemen entgegenwirken sollen, doch werden diese teils kaum bis wenig genutzt. Barrieren in der Nutzung stellen unter anderem fehlende Informationen und Berichterstattung über diese Angebote dar.[^7] Aber auch unabhängig von den Einkommensgruppen und der Lebenssituation besteht eine hohe Unkenntnis über Förderangebote in Berlin. Beispielhaft kann hierfür das Bildungs- und Teilhabepaket herangezogen werden. Dieses wurde im April 2020 in Berlin von nur 8,7 % der Anspruchsberechtigten genutzt.[^8]",
      },
      { type: "h2", text: "Der ineffektive Sozialstaat und die Strapazierung der Gesellschaft" },
      {
        type: "p",
        text: "Viele Menschen in Deutschland sind sich über zahlreiche Sozialleistungen nicht bewusst. Besonders bei spezifischeren Sozialleistungen, die nur über bestimmte Zeiträume in bestimmten Lebenssituationen nutzbar sind, ist diese Unkenntnis stark ausgeprägt. Exemplarisch lässt sich hierfür der Kinderzuschlag heranziehen, der zusätzlich zum Kindergeld bis zu einer bestimmten Einkommensschwelle beantragt werden kann. 79 % der Deutschen kennen diese Sozialleistung nicht, darunter auch viele berechtigte Empfänger (vgl. Abbildung 2).",
      },
      {
        type: "figure",
        number: 2,
        caption: "Unkenntnis über Familienleistungen in Deutschland",
        source: "Eigene Darstellung nach Baisch et al. (2023)",
        chart: {
          kind: "bars",
          valueNote: "Anteil der Befragten, denen die Leistung unbekannt ist",
          items: [
            { label: "GKV: Beitragsfreie Mitversicherung Ehepartner", value: 40 },
            { label: "Unterhaltsvorschuss für Alleinerziehende", value: 75 },
            { label: "Kinderzuschlag", value: 79 },
          ],
        },
      },
      {
        type: "p",
        text: "Die fehlende Information über und die Wahrnehmung von Sozialleistungen subvertieren die Leistungsfähigkeit und Aufgabe des Sozialstaates.[^9] Dies trägt unmittelbar zu einer sich intensivierenden sozioökonomischen Krise bei. Immer mehr Menschen in Deutschland leben unterhalb oder nahe der Armutsgrenze. Besonders in den Städten und Metropolregionen besteht zudem ein erheblicher Wohnungsmangel, wodurch Mietpreise stark steigen. Auch führt das niedrige Einkommen bei vielen zu sozialer Ausgrenzung bzw. reduzierter Teilhabe am sozialen Leben. 25 % der armen Menschen geben an, dass sie in sozialen Interaktionen abwertend behandelt werden.[^10] Sie nehmen weniger am sozialen Leben teil und daher auch weniger entsprechende Angebote wahr. Zudem besitzen Menschen mit geringerem Einkommensniveau meist niedrigere Bildungsabschlüsse und dadurch geringere berufliche Perspektiven. Auch ist das Niveau des Bildungsabschlusses stark abhängig von dem der Eltern.[^11]",
      },
      {
        type: "p",
        text: "Insgesamt reduziert sich dadurch nicht nur die Lebensqualität für signifikante Teile der Bevölkerung, sondern es kann auch zu einem Vertrauensverlust in demokratische Strukturen und Prozesse führen. Während bei der Einkommensgruppe „Hohes Einkommen“ (über 200 % des Medianeinkommens) nur 6 % der Polizei bzw. 8 % dem deutschen Rechtssystem nicht vertrauen, liegt der Anteil bei der dauerhaft armen Bevölkerungsgruppe (unter 60 % des Medianeinkommens zwischen 2017 und 2021) bei 22 % bei der Polizei und 37 % beim deutschen Rechtssystem. Auch gegenüber Politiker:innen oder Parteien ist das Misstrauen in den ärmeren Bevölkerungsschichten deutlich höher (vgl. Abbildung 3). Personen mit nicht-EU-Migrationshintergrund sind von diesen Problemen überproportional betroffen. Sie nehmen deutlich seltener Sozialleistungen in Anspruch, obwohl sie häufiger empfangsberechtigt sind.[^12]",
      },
      {
        type: "figure",
        number: 3,
        caption: "Misstrauen gegenüber Institutionen nach Einkommensgruppe, 2021",
        source: "Eigene Darstellung nach Brülle/Spannagel (2023)",
        chart: {
          kind: "panels",
          valueNote: "Anteil der Befragten, die der Institution nicht vertrauen",
          max: 60,
          groups: ["Dauerhaft arm", "Temporär arm", "Mittlere Einkommen", "Hohe Einkommen"],
          panels: [
            { label: "Bundestag", values: [47, 40, 30, 19] },
            { label: "Rechtssystem", values: [37, 32, 22, 8] },
            { label: "Polizei", values: [22, 16, 12, 6] },
            { label: "Politiker:innen", values: [58, 53, 49, 37] },
            { label: "Parteien", values: [56, 54, 50, 37] },
          ],
        },
      },
      {
        type: "p",
        text: "Wenn Sozialleistungen von vielen Empfangsberechtigten nicht genutzt werden, reduziert dies ihren Nutzen. Das erhöhte Misstrauen gegen staatliche Institutionen in den primären Empfangsgruppen von Sozialleistungen kann als Indikator für gesellschaftliche Konsequenzen dienen. Ein System, welches durch eine wachsende Bevölkerungsgruppe zunehmend mit Misstrauen konfrontiert wird, wird zwangsläufig destabilisiert und subvertiert. Wenn die diesen Prozessen entgegenwirkenden Mechanismen des Systems dysfunktional gestaltet sind, besteht die Gefahr, dass sich diese Prozesse verselbständigen. Ausbleibende Hilfe vom Staat kann in diesem Fall das Misstrauen gegenüber diesem erhöhen, weshalb bestehende Hilfe zunehmend ausgeschlagen wird. In der Konsequenz ist es von höchster Relevanz, dass empfangsberechtigte Personen einfachen Zugang zu ihnen zustehenden Leistungen erhalten. Dieser Prozess beginnt mit der zielgerichteten Informierung dieser Gruppen über entsprechende Leistungen. Hierfür wollen wir von MehrDrin einen entsprechenden Beitrag leisten, um die soziale Teilhabe aller durch Kenntnisgewinn über passende Angebote zu fördern.",
      },
    ],
    footnotes: [
      "Goedemé/Janssens (2020), S. 4.",
      "Baisch et al. (2023), S. 21.",
      "Baisch et al. (2023), S. 87.",
      "Goedemé/Janssens (2020), S. 11.",
      "Statistische Ämter des Bundes und der Länder (2025).",
      "IBB (2024), S. 65.",
      "Baisch et al. (2023), S. 7.",
      "Dehmer (2021).",
      "Baisch et al. (2023), S. 88.",
      "Brülle/Spannagel (2023), S. 15.",
      "Maaz/Lörz (2024), S. 17.",
      "Baisch et al. (2023), S. 77 & 80.",
    ],
    sources: [
      {
        text: "Baisch, Benjamin; Müller, Dagmar; Zollner, Corinna; Castiglioni, Laura & Boll, Christina (2023): Barrieren der Inanspruchnahme monetärer Leistungen für Familien. Deutsches Jugendinstitut e. V. (abgerufen am 9.6.2025).",
        url: "https://doi.org/10.36189/DJI202305",
      },
      {
        text: "Brülle, Jan & Spannagel, Dorothee (2023): Einkommensungleichheit als Gefahr für die Demokratie. Wirtschafts- und Sozialwissenschaftliches Institut.",
      },
      {
        text: "Dehmer, Mara (2021): Eine Hilfe, die nur selten ankommt. Berlin, Gewerkschaft Erziehung und Wissenschaft.",
      },
      {
        text: "Goedemé, Tim & Janssens, Julie (2020): The concept and measurement of non-take-up. An overview, with a focus on the non-take-up of social benefits.",
        url: "https://doi.org/10.13140/RG.2.2.24515.43048",
      },
      { text: "IBB (2024): IBB Wohnungsmarktbericht 2024. Berlin." },
      {
        text: "Maaz, Kai & Lörz, Markus (2024): 20 Jahre PISA. Soziale Bildungsungleichheit im Fokus. Haben die sozialen Ungleichheiten in den Lese- und Mathematikkompetenzen zwischen 2000 und 2018 zu- oder abgenommen?",
        url: "https://doi.org/10.11586/2024112",
      },
      { text: "Statistische Ämter des Bundes und der Länder (2025): Armutsgefährdungsquote." },
    ],
  },
];

export const getPostBySlug = (slug: string | undefined) =>
  blogPosts.find((p) => p.slug === slug);

/** Neueste zuerst */
export const sortedPosts = () => [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
