
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Funding, fundingData } from "@/data/mockData";
import { useQuestionnaire, UserAnswers } from "@/context/QuestionnaireContext";

const ResultsList = () => {
  const { answers } = useQuestionnaire();
  
  // Filtern der Förderungen basierend auf den Antworten des Nutzers
  const matchedFundings = filterFundingsByUserAnswers(fundingData, answers);

  if (matchedFundings.length === 0) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold mb-4">Keine passenden Förderungen gefunden</h2>
        <p className="text-gray-600 mb-6">
          Leider konnten wir keine Förderungen finden, die zu Ihren Angaben passen.
          Versuchen Sie es mit anderen Kriterien oder kontaktieren Sie direkt die Beratungsstellen.
        </p>
        <Button onClick={() => window.location.href = "/"}>
          Neue Suche starten
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Ihre passenden Förderungsmöglichkeiten</h2>
        <p className="text-gray-600">
          Wir haben {matchedFundings.length} Förderungsmöglichkeiten gefunden, die zu Ihren Angaben passen könnten.
        </p>
      </div>
      
      {matchedFundings.map((funding) => (
        <Card key={funding.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-1">{funding.title}</CardTitle>
                <CardDescription className="text-berlin-blue">
                  {funding.organization}
                </CardDescription>
              </div>
              <div>
                <Badge variant="outline" className="bg-berlin-blue/10 text-berlin-blue">
                  {funding.tags[0]}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{funding.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Förderhöhe:</h4>
                <p>{funding.amount}</p>
              </div>
              
              {funding.applicationDeadline && (
                <div>
                  <h4 className="font-semibold mb-1">Bewerbungsfrist:</h4>
                  <p>{funding.applicationDeadline}</p>
                </div>
              )}
              
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-1">Antragsprozess:</h4>
                <p>{funding.applicationProcess}</p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-1">
              {funding.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Kontakt:</span>{" "}
              {funding.contactInfo.email && <span>{funding.contactInfo.email}</span>}
              {funding.contactInfo.phone && <span> | Tel: {funding.contactInfo.phone}</span>}
            </div>
            <Button asChild size="sm">
              <a href={funding.url} target="_blank" rel="noopener noreferrer">
                Mehr Details
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <div className="text-center my-8">
        <Button onClick={() => window.location.href = "/"} variant="outline" className="mr-2">
          Neue Suche starten
        </Button>
        <Button asChild>
          <a href="https://www.berlin.de/sen/soziales/themen/soziale-sicherung/" target="_blank" rel="noopener noreferrer">
            Beratungsstellen finden
          </a>
        </Button>
      </div>
    </div>
  );
};

function filterFundingsByUserAnswers(fundings: Funding[], userAnswers: UserAnswers): Funding[] {
  return fundings.filter((funding) => {
    // Altersfilter
    if (
      funding.eligibility.minAge !== undefined &&
      userAnswers.age !== null &&
      userAnswers.age < funding.eligibility.minAge
    ) {
      return false;
    }
    
    if (
      funding.eligibility.maxAge !== undefined &&
      userAnswers.age !== null &&
      userAnswers.age > funding.eligibility.maxAge
    ) {
      return false;
    }
    
    // Einkommensfilter
    if (
      funding.eligibility.income?.max !== undefined &&
      userAnswers.income !== null &&
      userAnswers.income > funding.eligibility.income.max
    ) {
      return false;
    }
    
    if (
      funding.eligibility.income?.min !== undefined &&
      userAnswers.income !== null &&
      userAnswers.income < funding.eligibility.income.min
    ) {
      return false;
    }
    
    // Bezirksfilter
    if (
      funding.eligibility.district !== undefined &&
      funding.eligibility.district.length > 0 &&
      userAnswers.district !== null &&
      !funding.eligibility.district.includes(userAnswers.district)
    ) {
      return false;
    }
    
    // Familienfilter
    if (
      funding.eligibility.family?.married !== undefined &&
      userAnswers.maritalStatus !== null &&
      ((funding.eligibility.family.married && userAnswers.maritalStatus !== 'married') ||
       (!funding.eligibility.family.married && userAnswers.maritalStatus === 'married'))
    ) {
      return false;
    }
    
    if (
      funding.eligibility.family?.children !== undefined &&
      userAnswers.hasChildren !== null &&
      funding.eligibility.family.children !== userAnswers.hasChildren
    ) {
      return false;
    }
    
    // Bildungsfilter
    if (
      funding.eligibility.education !== undefined &&
      funding.eligibility.education.length > 0 &&
      userAnswers.educationLevel !== null &&
      !funding.eligibility.education.includes(userAnswers.educationLevel)
    ) {
      return false;
    }
    
    // Beschäftigungsfilter
    if (
      funding.eligibility.employment !== undefined &&
      funding.eligibility.employment.length > 0 &&
      userAnswers.employmentStatus !== null &&
      !funding.eligibility.employment.includes(userAnswers.employmentStatus)
    ) {
      return false;
    }
    
    // Interessenfilter
    if (
      funding.eligibility.interests !== undefined &&
      funding.eligibility.interests.length > 0 &&
      userAnswers.interests.length > 0 &&
      !funding.eligibility.interests.some(interest => userAnswers.interests.includes(interest))
    ) {
      return false;
    }
    
    // Wenn alle Filter bestanden wurden, ist dies eine passende Förderung
    return true;
  });
}

export default ResultsList;
