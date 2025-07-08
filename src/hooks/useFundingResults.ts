
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

// Maps Q1 answers to corresponding tags
const getAgeTagFromAnswer = (ageAnswer: string): string | null => {
  console.log("Mapping age answer to tag:", ageAnswer);
  switch (ageAnswer) {
    case "unter 18":
      return "U18";
    case "18-24":
      return "18-24";
    case "25-64":
      return "25-64";
    case "über 65":
      return "65plus";
    default:
      console.log("No matching tag found for age answer:", ageAnswer);
      return null;
  }
};

// Maps Q2 answers to corresponding tags
const getActivityTagFromAnswer = (activityAnswer: string): string | null => {
  console.log("Mapping activity answer to tag:", activityAnswer);
  switch (activityAnswer) {
    case "Schule":
      return "Schule";
    case "Ausbildung":
      return "Ausbildung";
    case "Studium":
      return "Studium";
    case "Arbeit":
    case "Arbeiten":
    case "Berufstätig":
      return "Arbeit";
    case "Übergangsphase":
      return "Übergangsphase";
    case "Arbeitssuchend":
      return "Arbeitssuchend";
    case "Weiterbildung/Umschulung":
      return "Weiterbildung";
    case "Pflege von Angehörigen oder Familienzeit":
      return "Familie";
    case "Sonstiges":
      return "Sonstiges";
    case "Übergang in den Ruhestand":
      return "Beratung";
    case "In Rente":
      return "Rente";
    case "Pflege oder Betreuung (selbst betroffen oder Angehörige)":
      return "Pflege";
    default:
      console.log("No matching tag found for activity answer:", activityAnswer);
      return null;
  }
};

// Helper function to get Q2 answer from all answers
const getQ2Answer = (answers: UserAnswers): string | null => {
  // Check all possible Q2 question IDs
  const q2Keys = Object.keys(answers).filter(key => key.startsWith('Q2_'));
  if (q2Keys.length > 0) {
    const q2Key = q2Keys[0]; // Get the first Q2 answer
    return answers[q2Key];
  }
  return null;
};

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', answers ? 'filtered' : 'all', answers?.Q1, getQ2Answer(answers)],
    queryFn: async () => {
      console.log("=== FUNDING QUERY DEBUG ===");
      console.log("Full answers object:", answers);
      console.log("Q1 answer:", answers?.Q1);
      
      const q2Answer = getQ2Answer(answers);
      console.log("Q2 answer:", q2Answer);
      
      let query = supabase.from('funding').select('*');

      // Get filter tags
      const ageTag = answers?.Q1 ? getAgeTagFromAnswer(answers.Q1) : null;
      const activityTag = q2Answer ? getActivityTagFromAnswer(q2Answer) : null;
      
      console.log("Mapped age tag:", ageTag);
      console.log("Mapped activity tag:", activityTag);

      // Apply database filters if we have tags
      if (ageTag && !activityTag) {
        // Only age filter
        console.log("Applying age filter only:", ageTag);
        query = query.contains('tags', [ageTag]);
      } else if (!ageTag && activityTag) {
        // Only activity filter  
        console.log("Applying activity filter only:", activityTag);
        query = query.contains('tags', [activityTag]);
      } else if (ageTag && activityTag) {
        // Both filters - we'll do this client-side since Supabase has limitations
        console.log("Will apply both filters client-side");
      } else {
        console.log("No filters - showing all funding");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Raw data from Supabase:", data);
      console.log("Number of entries returned:", data?.length || 0);
      
      // Client-side filtering for combined filters or as backup
      let filteredData = data;
      
      if (ageTag || activityTag) {
        filteredData = data?.filter(funding => {
          let hasAgeTag = true;
          let hasActivityTag = true;
          
          if (ageTag) {
            hasAgeTag = funding.tags && funding.tags.includes(ageTag);
            console.log(`Funding "${funding.title}" has age tag "${ageTag}":`, hasAgeTag);
          }
          
          if (activityTag) {
            hasActivityTag = funding.tags && funding.tags.includes(activityTag);
            console.log(`Funding "${funding.title}" has activity tag "${activityTag}":`, hasActivityTag);
          }
          
          const result = hasAgeTag && hasActivityTag;
          console.log(`Funding "${funding.title}" passes all filters:`, result, "Tags:", funding.tags);
          return result;
        }) || [];
        
        console.log("After client-side filtering:", filteredData.length, "entries remain");
      }

      console.log("=== END FUNDING QUERY DEBUG ===");
      return filteredData as Funding[];
    },
  });
};
