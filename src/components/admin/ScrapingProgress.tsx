
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { scrapeFundingSource } from '@/services/fundingScraper';

const FUNDING_SOURCES = [
  { name: 'Datenportal Berlin', url: 'https://daten.berlin.de' },
  { name: 'Förderdatenbank', url: 'https://www.foerderdatenbank.de' },
  { name: 'GovData', url: 'https://www.govdata.de' },
  { name: 'IBB', url: 'https://www.ibb.de' },
  { name: 'VBB', url: 'https://www.vbb.de' }
];

export function ScrapingProgress() {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSource, setCurrentSource] = useState('');

  const startScraping = async () => {
    setIsRunning(true);
    setProgress(0);
    
    let successCount = 0;
    const totalSources = FUNDING_SOURCES.length;

    for (const source of FUNDING_SOURCES) {
      try {
        setCurrentSource(source.name);
        console.log(`Starting to scrape ${source.name}...`);
        
        const result = await scrapeFundingSource(source.url);
        
        if (result.success) {
          successCount++;
          toast({
            title: `${source.name} erfolgreich gescraped`,
            description: `${result.data?.length || 0} Förderungen gefunden`,
          });
        } else {
          toast({
            title: `Fehler beim Scrapen von ${source.name}`,
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        toast({
          title: `Fehler beim Scrapen von ${source.name}`,
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setProgress((successCount / totalSources) * 100);
      }
    }

    setIsRunning(false);
    setCurrentSource('');
    
    toast({
      title: "Scraping abgeschlossen",
      description: `${successCount} von ${totalSources} Quellen erfolgreich verarbeitet`,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Förderungs-Daten Sammlung</h2>
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500">
          Fortschritt: {Math.round(progress)}%
          {currentSource && ` - Verarbeite: ${currentSource}`}
        </p>
      </div>
      <Button 
        onClick={startScraping} 
        disabled={isRunning}
        className="w-full"
      >
        {isRunning ? 'Scraping läuft...' : 'Scraping starten'}
      </Button>
      
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Zu scrapende Quellen:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {FUNDING_SOURCES.map((source) => (
            <li key={source.url} className="text-sm">
              {source.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
