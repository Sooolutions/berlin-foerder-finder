
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAnswers } from "@/context/QuestionnaireContext";

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
}

// Makes the answers parameter optional
export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', answers ? 'filtered' : 'all'],
    queryFn: async () => {
      // If no answers are provided or we want to show all results,
      // simply fetch all funding entries without filters
      const { data, error } = await supabase
        .from('funding')
        .select('*');

      if (error) {
        throw error;
      }

      return data as Funding[];
    },
  });
};
