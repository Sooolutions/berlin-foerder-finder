
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAnswers } from "@/context/QuestionnaireContext";
import { extractTagsFromAnswers, getAgeRange, computeRelevanceScore } from "@/utils/answerMappingUtils";

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
  relevanceScore?: number;
}

const MIN_RESULTS = 5;

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', 'filtered', JSON.stringify(answers)],
    queryFn: async () => {
      // 1. Extract user tags from all answers
      const userTags = answers ? extractTagsFromAnswers(answers) : [];
      
      // 2. Build Supabase query with HARD age filter
      let query = supabase.from('funding').select('*');
      
      const ageAnswer = answers?.Q1;
      const ageRange = typeof ageAnswer === 'string' ? getAgeRange(ageAnswer) : null;
      
      if (ageRange) {
        // Server-side: only fetch fundings where the age range overlaps
        // A funding matches if: funding.min_age <= user.maxAge AND funding.max_age >= user.minAge
        // Also include fundings with null age fields (universal offers)
        query = query.or(
          `min_age.is.null,min_age.lte.${ageRange.maxAge}`
        ).or(
          `max_age.is.null,max_age.gte.${ageRange.minAge}`
        );
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // 3. Score each funding by tag relevance
      let scoredData: Funding[] = data.map(funding => ({
        ...funding,
        relevanceScore: computeRelevanceScore(
          funding.tags || [],
          userTags
        )
      })) as Funding[];
      
      // 4. Primary results: score > 0 (at least one tag match), sorted by score
      let results = scoredData
        .filter(f => (f.relevanceScore ?? 0) > 0)
        .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
      
      // 5. Fallback: if too few results, add age-appropriate offers without tag match
      if (results.length < MIN_RESULTS) {
        const existingIds = new Set(results.map(r => r.id));
        const fallbacks = scoredData
          .filter(f => !existingIds.has(f.id) && (f.relevanceScore ?? 0) === 0)
          .slice(0, MIN_RESULTS - results.length);
        
        // Mark fallbacks so UI can differentiate if needed
        fallbacks.forEach(f => { f.relevanceScore = 0; });
        results = [...results, ...fallbacks];
      }
      
      return results;
    },
  });
};
