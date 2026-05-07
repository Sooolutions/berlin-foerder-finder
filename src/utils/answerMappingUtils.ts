
import { UserAnswers } from "@/context/QuestionnaireContext";
import { getQuestionData } from "@/data/questionnaireData";

/**
 * Maps an age-range answer to numeric min/max for DB filtering.
 */
export const getAgeRange = (ageAnswer: string): { minAge: number; maxAge: number } | null => {
  switch (ageAnswer) {
    case "unter 18": return { minAge: 0, maxAge: 17 };
    case "18-24": return { minAge: 18, maxAge: 24 };
    case "25-34": return { minAge: 25, maxAge: 34 };
    case "35-49": return { minAge: 35, maxAge: 49 };
    case "50-64": return { minAge: 50, maxAge: 64 };
    case "über 65": return { minAge: 65, maxAge: 120 };
    default: return null;
  }
};

/**
 * Extracts all relevant tags from user answers.
 * Handles both single-select (string) and multi-select (string[]) answers.
 */
export const extractTagsFromAnswers = (answers: UserAnswers): string[] => {
  const collectedTags: string[] = [];
  
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    const questionData = getQuestionData(questionId);
    if (!questionData?.tags || !questionData?.options) return;
    
    // Normalize to array for uniform processing
    const selectedValues = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
    
    selectedValues.forEach(val => {
      const answerIndex = questionData.options.indexOf(val);
      if (answerIndex !== -1 && questionData.tags![answerIndex]) {
        collectedTags.push(questionData.tags![answerIndex]);
      }
    });
  });
  
  return Array.from(new Set(collectedTags));
};

/**
 * Tag priority weights — tags from different question types have different
 * importance for matching. Activity and specific-need tags are most important.
 */
const TAG_WEIGHTS: Record<string, number> = {
  // Age group tags (already filtered by DB, low extra weight)
  "U18": 0.5, "18-24": 0.5, "25-34": 0.5, "35-49": 0.5, "50-64": 0.5, "65plus": 0.5,
  // Nationality tags (medium weight)
  "Deutsch": 1, "EU": 1, "Ukrainisch": 1.5, "Türkisch": 1.5, "Syrisch": 1.5, "Drittstaat": 1.5,
};

function getTagWeight(tag: string): number {
  if (TAG_WEIGHTS[tag]) return TAG_WEIGHTS[tag];
  
  // Activity-specific tags (Q4) get highest weight
  const prefix = tag.split('_')[0];
  if (['Schule', 'Ausbildung', 'Studium', 'Arbeiten', 'Gründung', 'Selbstständig',
       'Arbeitssuche', 'Weiterbildung', 'Übergang', 'Pflege', 'Familie', 'FSJ',
       'Rente', 'Erwerbsunfähig', 'Sonstiges'].includes(prefix)) {
    return 3;
  }
  
  // Need-specific tags (challenges, health, wishes)
  if (['Herausforderung', 'Gesundheit', 'Wunsch'].includes(prefix)) return 2;
  
  // Financial/housing tags
  if (['Finanzen', 'Miete', 'Eigentum', 'Prekär', 'Ohne'].includes(prefix)) return 2;
  
  // Health status tags
  if (prefix === 'Beeinträchtigung') return 1.5;
  
  return 1;
}

/**
 * Compute a relevance score for a funding item against user tags.
 * Returns a number 0-100. Higher = more relevant.
 */
export const computeRelevanceScore = (
  fundingTags: string[],
  userTags: string[]
): number => {
  if (!fundingTags || fundingTags.length === 0 || userTags.length === 0) return 0;
  
  let matchedWeight = 0;
  let totalWeight = 0;
  let matchCount = 0;
  
  userTags.forEach(userTag => {
    const weight = getTagWeight(userTag);
    totalWeight += weight;
    
    if (fundingTags.includes(userTag)) {
      matchedWeight += weight;
      matchCount++;
    }
  });
  
  if (totalWeight === 0) return 0;
  
  // Weighted match ratio (0-1)
  const weightedRatio = matchedWeight / totalWeight;
  
  // Bonus for absolute number of matches (rewards breadth)
  const matchBonus = Math.min(matchCount / 3, 1) * 0.2;
  
  return Math.round((weightedRatio + matchBonus) * 100);
};

/**
 * Groups tags by category for debugging/display.
 */
export const groupTagsByCategory = (tags: string[]): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};
  tags.forEach(tag => {
    const category = tag.split('_')[0] || 'general';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(tag);
  });
  return grouped;
};
