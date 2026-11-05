
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAnswers } from "@/context/QuestionnaireContext";
import { getAgeRange, rankFundings } from "@/utils/answerMappingUtils";

export interface Funding {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount: string | null;
  application_deadline: string | null;
  application_process: string | null;
  url: string;
  contact_email: string | null;
  contact_phone: string | null;
  categories: string[];
  tags: string[];
  min_age: number | null;
  max_age: number | null;
  funding_type?: 'staatlich' | 'privat' | 'karitativ' | null;
  /** Bezirke, für die das Angebot gilt. Leer oder null bedeutet berlinweit. */
  district?: string[] | null;
  relevanceScore?: number;
}

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', 'filtered', JSON.stringify(answers)],
    retry: 1,
    queryFn: async () => {
      // 1. Server: grober Altersfilter über min_age und max_age. Angebote ohne
      //    gepflegte Altersfelder kommen immer mit.
      let query = supabase.from('funding').select('*');
      const ageAnswer = answers?.Q1;
      const ageRange = typeof ageAnswer === 'string' ? getAgeRange(ageAnswer) : null;
      if (ageRange) {
        query = query
          .or(`min_age.is.null,min_age.lte.${ageRange.maxAge}`)
          .or(`max_age.is.null,max_age.gte.${ageRange.minAge}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return [];

      // 2. Client: harte Kriterien (Alters-Tags, migrationsspezifische
      //    Angebote), Passung zur Lebenslage, Punktzahl und Auffüllung.
      //    Der Aufrufer übergibt nur Antworten des tatsächlich durchlaufenen
      //    Pfads (getActiveAnswers). Ohne Antworten bleibt die Liste leer.
      if (!answers) return [];
      return rankFundings(data as Funding[], answers);
    },
  });
};
