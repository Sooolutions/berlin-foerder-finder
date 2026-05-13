
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFundingResults } from '@/hooks/useFundingResults';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import FundingGrid from '@/components/results/FundingGrid';

const Results = () => {
  const navigate = useNavigate();
  const { answers } = useQuestionnaire();
  const { data: fundings, isLoading, error } = useFundingResults(answers);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg text-gray-600">Wir durchsuchen alle verfügbaren Angebote für dich...</p>
            <p className="text-sm text-gray-500">Das dauert nur einen Moment</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center my-12 max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-red-800">Es ist ein Fehler aufgetreten</h2>
              <p className="text-red-600 mb-6">Bitte versuche es später erneut.</p>
              <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                Neue Suche starten
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!fundings || fundings.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center my-12 max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Keine passenden Angebote gefunden</h2>
              <p className="text-gray-600 mb-6">
                Versuche es mit anderen Kriterien oder kontaktiere direkt die Beratungsstellen.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                  Neue Suche starten
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://berlin.de/sen/soziales/themen/soziale-sicherung/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Beratung finden
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Deine Ergebnisse:</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {fundings.length} {fundings.length === 1 ? 'Angebot gefunden' : 'Angebote gefunden'}
          </p>
          <div id="filter-container" className="flex gap-3 mt-4 items-center" />
        </div>

        <FundingGrid
          fundings={fundings}
          expandedId={expandedId}
          onExpand={handleExpand}
          onClose={() => setExpandedId(null)}
        />

        {/* Action buttons */}
        <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Neue Suche starten
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a
                href="https://www.berlin.de/sen/soziales/themen/soziale-sicherung/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Beratungsstellen finden
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
