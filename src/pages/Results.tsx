
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFundingResults } from "@/hooks/useFundingResults";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Star, MapPin, Euro, Calendar, ExternalLink, Users, Shield } from "lucide-react";

const ResultsContent = () => {
  // Call useFundingResults without providing answers to get all funding entries
  const { data: fundings, isLoading, error } = useFundingResults();

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
              <a href="https://www.berlin.de/sen/soziales/themen/soziale-sicherung/" target="_blank" rel="noopener noreferrer">
                Beratung finden
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Success Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-full p-4">
            <Star className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">
          Perfekt! Wir haben passende Förderungen für dich gefunden
        </h2>
        <p className="text-blue-100 text-lg">
          {fundings.length} Förderungsmöglichkeiten, die zu deiner Situation in Berlin passen.
        </p>
      </div>

      {/* Trust indicators */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2 text-green-700">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Alle Daten offiziell verifiziert</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Users className="w-4 h-4" />
            <span className="font-medium">Persönlich auf dich abgestimmt</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Speziell für Berlin</span>
          </div>
        </div>
      </div>

      {/* Funding Cards */}
      {fundings.map((funding, index) => (
        <Card key={funding.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-gray-900">{funding.title}</CardTitle>
                <CardDescription className="text-lg font-medium text-blue-600">
                  {funding.organization}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {funding.categories && funding.categories.map((category) => (
                  <Badge key={category} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-6 leading-relaxed">{funding.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {funding.amount && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Euro className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Förderhöhe</h4>
                  </div>
                  <p className="text-green-700 font-medium">{funding.amount}</p>
                </div>
              )}
              
              {funding.application_deadline && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Bewerbungsfrist</h4>
                  </div>
                  <p className="text-orange-700 font-medium">{funding.application_deadline}</p>
                </div>
              )}
            </div>
            
            {funding.application_process && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h4 className="font-semibold mb-2 text-blue-800">Antragsprozess</h4>
                <p className="text-blue-700">{funding.application_process}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {funding.tags && funding.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-between bg-gray-50 border-t pt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Kontakt:</span>{" "}
              {funding.contact_email && <span className="text-blue-600">{funding.contact_email}</span>}
              {funding.contact_phone && <span> | Tel: <span className="text-blue-600">{funding.contact_phone}</span></span>}
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
      <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Was möchtest du als nächstes tun?</h3>
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
        <ResultsContent />
      </main>
      <Footer />
    </div>
  );
};

export default Results;
