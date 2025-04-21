
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

  const startScraping = async () => {
    setIsRunning(true);
    setProgress(0);

    for (let i = 0; i < FUNDING_SOURCES.length; i++) {
      const source = FUNDING_SOURCES[i];
      try {
        await scrapeFundingSource(source.url);
        setProgress(((i + 1) / FUNDING_SOURCES.length) * 100);
        
        toast({
          title: `${source.name} successfully scraped`,
          description: "Data has been added to the database",
        });
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        toast({
          title: `Error scraping ${source.name}`,
          description: error.message,
          variant: "destructive",
        });
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Funding Data Collection</h2>
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500">
          Progress: {Math.round(progress)}%
        </p>
      </div>
      <Button 
        onClick={startScraping} 
        disabled={isRunning}
      >
        {isRunning ? 'Scraping...' : 'Start Scraping'}
      </Button>
    </div>
  );
}
