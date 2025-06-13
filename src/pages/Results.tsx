import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFundingResults } from "@/hooks/useFundingResults";
import { useQuestionnaire, QuestionnaireProvider } from "@/context/QuestionnaireContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Euro, Calendar, ExternalLink } from "lucide-react";

const ResultsContent = () => {
  const { answers } = useQuestionnaire();
  // Pass the user's answers to get filtered results based on age
  const { data: fundings, isLoading, error } = useFundingResults(answers);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg text-gray-600">Wir durchsuchen alle verfügbaren Förderungen für dich...</p>
        <p className="text-sm text-gray-500">Das kann einen Moment dauern</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-12 max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-800">
            Es ist ein Fehler aufgetreten
          </h2>
          <p className="text-red-600 mb-6">
            Bitte versuche es später erneut oder kontaktiere den Support.
          </p>
          <Button onClick={() => window.location.href = "/"} className="bg-blue-600 hover:bg-blue-700">
            Neue Suche starten
          </Button>
        </div>
      </div>
    );
  }

  if (!fundings || fundings.length === 0) {
    return (
      <div className="text-center my-12 max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Keine passenden Förderungen gefunden
          </h2>
          <p className="text-gray-600 mb-6">
            Leider konnten wir keine Förderungen finden, die zu deinen Angaben passen.
            Versuche es mit anderen Kriterien oder kontaktiere direkt die Beratungsstellen.
          </p>
          <div className="space-x-4">
            <Button onClick={() => window.location.href = "/"} className="bg-blue-600 hover:bg-blue-700">
              Neue Suche starten
            </Button>
            <Button variant="outline" asChild>
              <a href="https://berlin.de/sen/soziales/themen/soziale-sicherung/" target="_blank" rel="noopener noreferrer">
                Beratung finden
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Sort fundings to show "Berufsausbildungsbeihilfe (BAB)" first
  const sortedFundings = fundings ? [...fundings].sort((a, b) => {
    if (a.title.includes("Berufsausbildungsbeihilfe") || a.title.includes("BAB")) return -1;
    if (b.title.includes("Berufsausbildungsbeihilfe") || b.title.includes("BAB")) return 1;
    return 0;
  }) : [];

  // Get age group for display
  const getAgeGroupDisplay = (ageAnswer: string) => {
    switch (ageAnswer) {
      case "unter 18":
        return "unter 18 Jahren";
      case "18-24":
        return "18-24 Jahren";
      case "25-64":
        return "25-64 Jahren";
      case "über 65":
        return "über 65 Jahren";
      default:
        return "";
    }
  };

  const ageDisplay = answers.Q1 ? getAgeGroupDisplay(answers.Q1) : "";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with personalized message */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          Förderungsmöglichkeiten {ageDisplay && `für ${ageDisplay}`}
        </h2>
        <p className="text-gray-600">
          {fundings.length} {fundings.length === 1 ? 'Förderung gefunden' : 'Förderungen gefunden'}
          {ageDisplay && ` für deine Altersgruppe`}
        </p>
      </div>

      {/* Funding Cards */}
      {sortedFundings.map((funding) => (
        <Card key={funding.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-1 text-gray-900">{funding.title}</CardTitle>
                <CardDescription className="text-lg text-blue-600">
                  {funding.organization}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {funding.categories && funding.categories.slice(0, 2).map((category) => (
                  <Badge key={category} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 leading-relaxed">{funding.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {funding.amount && (
                <div className="flex items-start space-x-2 text-sm">
                  <Euro className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <span className="font-medium block">Förderhöhe:</span>
                    <span className="text-green-700">{funding.amount}</span>
                  </div>
                </div>
              )}
              
              {funding.application_deadline && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Bewerbungsfrist:</span>
                  <span className="text-orange-700">{funding.application_deadline}</span>
                </div>
              )}
            </div>
            
            {funding.application_process && (
              <div className="bg-gray-50 p-3 rounded-lg border mb-4">
                <h4 className="font-medium mb-1 text-gray-800 text-sm">Antragsprozess</h4>
                <p className="text-gray-600 text-sm">{funding.application_process}</p>
              </div>
            )}
            
            {funding.tags && funding.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {funding.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    {tag}
                  </Badge>
                ))}
                {funding.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    +{funding.tags.length - 4} weitere
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between bg-gray-50 border-t pt-4">
            <div className="text-sm text-gray-600">
              {funding.contact_email && (
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Kontakt:</span>
                  <span className="text-blue-600">{funding.contact_email}</span>
                </div>
              )}
              {funding.contact_phone && (
                <div className="text-blue-600 text-xs">Tel: {funding.contact_phone}</div>
              )}
            </div>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <a href={funding.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <span>Mehr Details</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      {/* Action buttons */}
      <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
        <div className="space-x-4">
          <Button onClick={() => window.location.href = "/"} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            Neue Suche starten
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a href="https://www.berlin.de/sen/soziales/themen/soziale-sicherung/" target="_blank" rel="noopener noreferrer">
              Beratungsstellen finden
            </a>
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Bei Fragen stehen dir die Berliner Beratungsstellen gerne zur Verfügung.
        </p>
      </div>
    </div>
  );
};

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <QuestionnaireProvider>
          <ResultsContent />
        </QuestionnaireProvider>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
