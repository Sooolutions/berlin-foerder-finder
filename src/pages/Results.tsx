
import { Component, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFundingResults } from '@/hooks/useFundingResults';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ResultsScreen from '@/components/results/ResultsScreen';
import { getActiveAnswers } from '@/utils/answerMappingUtils';

// Catches render errors in the grid so the page never shows a blank white screen
class GridErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 mb-4">Die Ergebnisliste konnte nicht geladen werden.</p>
          <a href="/" className="text-blue-600 hover:underline text-sm">
            Zur Startseite
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

const Results = () => {
  const navigate = useNavigate();
  const { answers, questionHistory } = useQuestionnaire();
  // Nur Antworten des tatsächlich durchlaufenen Pfads zählen
  const activeAnswers = useMemo(() => getActiveAnswers(answers, questionHistory), [answers, questionHistory]);
  const { data: fundings, isLoading, error } = useFundingResults(activeAnswers);

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
              <p className="text-xl font-bold mb-4 text-red-800">Es ist ein Fehler aufgetreten</p>
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
              <p className="text-xl font-bold mb-4 text-blue-800">Keine passenden Angebote gefunden</p>
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
      <main className="flex-grow container mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <GridErrorBoundary>
          <ResultsScreen fundings={fundings} answers={activeAnswers} />
        </GridErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
