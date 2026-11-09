/**
 * Kurze Begründungen, warum wir eine Frage stellen. Angezeigt über das
 * Fragezeichen oben rechts im Fragebogen. Zuordnung über die Frage-id.
 */
const INFO: Record<string, string> = {
  alter:
    'Viele Förderungen gelten nur für bestimmte Altersgruppen, etwa BAföG, Jugendhilfe oder die Grundsicherung im Alter. Mit deinem Alter blenden wir Angebote aus, die für dich nicht in Frage kommen.',
  taetigkeit:
    'Ob du zur Schule gehst, studierst, arbeitest oder in Rente bist, entscheidet über viele Förderungen, etwa BAföG, Berufsausbildungsbeihilfe oder Gründungszuschüsse.',
  haushalt:
    'Ob Kinder bei dir leben oder ob du sie allein großziehst, entscheidet über viele Leistungen wie Kinderzuschlag, Unterhaltsvorschuss oder Hilfen für Schulkinder.',
  wohnen:
    'Wohngeld, Mieterberatung oder Hilfen für Wohngruppen hängen davon ab, wie du wohnst. Deshalb fließt deine Wohnsituation in die Auswahl ein.',
  wohnen_ohne:
    'Für Menschen ohne feste Wohnung gibt es spezielle Notunterkünfte und Beratungsstellen. Deine Angabe hilft uns, die dringendsten Hilfen zuerst zu zeigen.',
  einkommen:
    'Viele Leistungen richten sich nach dem Einkommen, etwa Wohngeld, Kinderzuschlag oder das Berlin Ticket S. Wir fragen nicht nach Beträgen, sondern nur grob nach deiner Lage.',
  leistungen:
    'Manche Hilfen setzen eine Leistung voraus, andere lassen sich nicht gleichzeitig beziehen. So können wir dir auch zeigen, was dir vielleicht zusätzlich zusteht.',
  gesundheit:
    'Für Menschen mit gesundheitlichen Einschränkungen gibt es eigene Ansprüche und Beratungsstellen, etwa den Schwerbehindertenausweis oder die Teilhabeberatung.',
  gesundheit_bedarf:
    'So zeigen wir dir genau die Art von Hilfe, die du dir wünschst, zum Beispiel Austausch mit anderen Betroffenen oder Hilfe bei Anträgen.',
  herausforderungen:
    'Für viele Lebenslagen wie Einsamkeit, Ärger mit Behörden oder psychische Belastung gibt es spezialisierte und meist kostenlose Angebote. Deine Auswahl bringt sie nach oben.',
  staatsangehoerigkeit:
    'Manche Angebote richten sich gezielt an Menschen aus bestimmten Ländern oder an Neuzugewanderte, zum Beispiel Integrationskurse oder Anerkennungsberatung. Wir fragen nur, damit wir dir diese Angebote zeigen können.',
  wuensche:
    'Auch für Freizeit, Kultur, Ehrenamt oder Weiterbildung gibt es Ermäßigungen und Förderungen. Damit runden wir deine Ergebnisse ab.',
};

/** Bedarfsfragen: Wünsche und Bedarfe zur aktuellen Situation. */
const NEEDS_INFO =
  'Viele Angebote sind auf ein bestimmtes Anliegen zugeschnitten. Mit deiner Auswahl filtern wir aus allen Angeboten die heraus, die genau dabei helfen.';

const DEFAULT_INFO =
  'Förderangebote richten sich oft nach genau solchen Angaben. Mit deiner Antwort filtern wir die Datenbank, damit du nur passende Angebote siehst.';

/** Varianten derselben Frage teilen sich den Hinweis. */
const SAME_AS: Record<string, string> = {
  wohnen_u18: 'wohnen',
  einkommen_familie: 'einkommen',
  leistungen_familie: 'leistungen',
};

export const getQuestionInfo = (questionId: string): string => {
  if (questionId === 'taetigkeit_bedarf' || questionId === 'familie_bedarf') return NEEDS_INFO;
  return INFO[SAME_AS[questionId] ?? questionId] ?? DEFAULT_INFO;
};

/** Alle Erklärtexte, z. B. für die Prüfung der Übersetzungen. */
export const ALL_QUESTION_INFO: string[] = [...Object.values(INFO), DEFAULT_INFO, NEEDS_INFO];
