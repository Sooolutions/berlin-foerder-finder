
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFundingResults } from "@/hooks/useFundingResults";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ResultsContent = () => {
  // Call useFundingResults without providing answers to get all funding entries
  const { data: fundings, isLoading, error } = useFundingResults();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Es ist ein Fehler aufgetreten
        </h2>
        <p className="text-gray-600 mb-6">
          Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.
        </p>
        <Button onClick={() => window.location.href = "/"}>
          Neue Suche starten
        </Button>
      </div>
    );
  }

  if (!fundings || fundings.length === 0) {
    return (
      <div className="text-center my-12">
        <h2 className="text-2xl font-bold mb-4">
          Keine passenden Förderungen gefunden
        </h2>
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
        <h2 className="text-2xl font-bold mb-2">
          Verfügbare Förderungsmöglichkeiten
        </h2>
        <p className="text-gray-600">
          Wir haben {fundings.length} Förderungsmöglichkeiten für Sie gefunden.
        </p>
      </div>

      {fundings.map((funding) => (
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
                {funding.categories && funding.categories.map((category) => (
                  <Badge key={category} variant="outline" className="bg-berlin-blue/10 text-berlin-blue ml-2">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{funding.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {funding.amount && (
                <div>
                  <h4 className="font-semibold mb-1">Förderhöhe:</h4>
                  <p>{funding.amount}</p>
                </div>
              )}
              
              {funding.application_deadline && (
                <div>
                  <h4 className="font-semibold mb-1">Bewerbungsfrist:</h4>
                  <p>{funding.application_deadline}</p>
                </div>
              )}
              
              {funding.application_process && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-1">Antragsprozess:</h4>
                  <p>{funding.application_process}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-1">
              {funding.tags && funding.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Kontakt:</span>{" "}
              {funding.contact_email && <span>{funding.contact_email}</span>}
              {funding.contact_phone && <span> | Tel: {funding.contact_phone}</span>}
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

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <ResultsContent />
      </main>
      <Footer />
    </div>
  );
};

export default Results;
