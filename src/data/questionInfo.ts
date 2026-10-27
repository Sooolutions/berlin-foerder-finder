/**
 * Kurze Begründungen, warum wir eine Frage stellen. Angezeigt über das
 * Fragezeichen oben rechts im Fragebogen. Zuordnung über den Fragetext,
 * damit alle Altersvarianten derselben Frage denselben Hinweis erhalten.
 */
const RULES: Array<[RegExp, string]> = [
  [/wie alt/i,
    'Viele Förderungen gelten nur für bestimmte Altersgruppen, etwa BAföG, Jugendhilfe oder die Grundsicherung im Alter. Mit deinem Alter blenden wir Angebote aus, die für dich nicht in Frage kommen.'],
  [/staatsangehörigkeit/i,
    'Manche Angebote richten sich gezielt an Menschen aus bestimmten Ländern oder an Neuzugewanderte, zum Beispiel Integrationskurse oder Anerkennungsberatung. Wir fragen nur, damit wir dir diese Angebote zeigen können.'],
  [/was machst du aktuell/i,
    'Ob du zur Schule gehst, studierst, arbeitest oder in Rente bist, entscheidet über viele Förderungen, etwa BAföG, Berufsausbildungsbeihilfe oder Gründungszuschüsse.'],
  [/wie wohnst du aktuell/i,
    'Für Menschen ohne feste Wohnung gibt es spezielle Notunterkünfte und Beratungsstellen. Deine Angabe hilft uns, die dringendsten Hilfen zuerst zu zeigen.'],
  [/wohnsituation|wohnst du bei/i,
    'Wohngeld, Mieterberatung oder Hilfen für Wohngruppen hängen davon ab, wie du wohnst. Deshalb fließt deine Wohnsituation in die Auswahl ein.'],
  [/finanziert deinen aufenthalt/i,
    'Je nachdem, wer deinen Aufenthalt bezahlt, kommen andere Hilfen und Ansprechpartner in Frage. Wir fragen nicht nach Beträgen.'],
  [/finanziell/i,
    'Viele Leistungen richten sich nach dem Einkommen, etwa Wohngeld, Kinderzuschlag oder das Berlin Ticket S. Wir fragen nicht nach Beträgen, sondern nur grob nach deiner Lage.'],
  [/unterstützung wünschst du dir im umgang/i,
    'So zeigen wir dir genau die Art von Hilfe, die du dir wünschst, zum Beispiel Austausch mit anderen Betroffenen oder Hilfe bei Anträgen.'],
  [/gesundheitliche besonderheiten/i,
    'Für Menschen mit gesundheitlichen Einschränkungen gibt es eigene Ansprüche und Beratungsstellen, etwa den Schwerbehindertenausweis oder die Teilhabeberatung.'],
  [/herausforderungen/i,
    'Für viele Lebenslagen wie Einsamkeit, Ärger mit Behörden oder psychische Belastung gibt es spezialisierte und meist kostenlose Angebote. Deine Auswahl bringt sie nach oben.'],
  [/was wünschst du dir\?$/i,
    'Auch für Freizeit, Kultur, Ehrenamt oder Weiterbildung gibt es Ermäßigungen und Förderungen. Damit runden wir deine Ergebnisse ab.'],
];

const DEFAULT_INFO =
  'Förderangebote richten sich oft nach genau solchen Angaben. Mit deiner Antwort filtern wir die Datenbank, damit du nur passende Angebote siehst.';

/** Frage zur Tätigkeit (Q4): Wünsche und Bedarfe zur aktuellen Situation. */
const NEEDS_INFO =
  'Viele Angebote sind auf ein bestimmtes Anliegen zugeschnitten. Mit deiner Auswahl filtern wir aus allen Angeboten die heraus, die genau dabei helfen.';

export const getQuestionInfo = (questionId: string, questionText: string): string => {
  if (/^Q4_/i.test(questionId)) return NEEDS_INFO;
  const hit = RULES.find(([re]) => re.test(questionText));
  return hit ? hit[1] : DEFAULT_INFO;
};
