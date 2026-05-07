import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const QUESTIONNAIRE_ANSWERS_KEY = "questionnaireAnswers";
const QUESTIONNAIRE_HISTORY_KEY = "questionnaireHistory";

export type UserAnswers = Record<string, string | string[]>;

interface QuestionnaireContextType {
  currentQuestionId: string;
  answers: Record<string, string | string[]>;
  updateAnswer: (questionId: string, answer: string | string[]) => void;
  goToNextQuestion: (answerOverride?: string) => void;
  goToPreviousQuestion: () => void;
  resetQuestionnaire: () => void;
  questionHistory: string[];
  isLastQuestion: boolean;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// Initial answers state
const initialAnswers: Record<string, string | string[]> = {};

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("Q1");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [questionHistory, setQuestionHistory] = useState<string[]>(["Q1"]);
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(QUESTIONNAIRE_ANSWERS_KEY);
      const savedHistory = localStorage.getItem(QUESTIONNAIRE_HISTORY_KEY);
      
      if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers);
      }
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setQuestionHistory(parsedHistory);
        if (parsedHistory.length > 0) {
          setCurrentQuestionId(parsedHistory[parsedHistory.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever answers or history change
  useEffect(() => {
    try {
      localStorage.setItem(QUESTIONNAIRE_ANSWERS_KEY, JSON.stringify(answers));
      localStorage.setItem(QUESTIONNAIRE_HISTORY_KEY, JSON.stringify(questionHistory));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [answers, questionHistory]);

  const getAnswer = (questionId: string): string | undefined => {
    const val = answers[questionId];
    if (!val) return undefined;
    if (Array.isArray(val)) return val[0]; // For routing, use first selection
    return val;
  };

  // Navigation logic for the new questionnaire structure
  const getNextQuestionId = (currentId: string, answerValue?: string): string => {
    const answer = answerValue || getAnswer(currentId);
    
    switch (currentId) {
      case "Q1":
        // Age-based routing
        if (answer === "unter 18") return "Q2_U18";
        if (answer === "18-24") return "Q2_18-24";
        if (answer === "25-34") return "Q2_25-34";
        if (answer === "35-49") return "Q2_35-49";
        if (answer === "50-64") return "Q2_50-64";
        if (answer === "über 65") return "Q2_65plus";
        return "Q2_U18"; // Default to U18
        
      // Under 18 flow
      case "Q2_U18":
        return "Q3_U18";
        
      case "Q3_U18":
        if (answer === "Schule") return "Q4_U18_Schule";
        if (answer === "Ausbildung") return "Q4_U18_Ausbildung";
        if (answer === "FSJ oder FÖJ") return "Q4_U18_FSJ";
        if (answer === "Sonstiges") return "Q4_U18_Sonstiges";
        return "Q5_U18"; // Default
        
      case "Q4_U18_Schule":
      case "Q4_U18_Ausbildung":
      case "Q4_U18_FSJ":
      case "Q4_U18_Sonstiges":
        return "Q5_U18";
        
      case "Q5_U18":
        if (answer === "Ja") return "Q6_U18_Eltern";
        if (answer === "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)") return "Q6_U18_Betreuung";
        return "Q7_U18"; // Default
        
      case "Q6_U18_Eltern":
      case "Q6_U18_Betreuung":
        return "Q7_U18";
        
      case "Q7_U18":
        if (answer === "Keine Beeinträchtigungen") {
          // Check if user is from abroad
          const nationality = getAnswer("Q2_U18");
          if (nationality && nationality !== "Deutsch") {
            return "Q8_U18_Ausland_Nein";
          }
          return "Q8_U18_Nein";
        }
        if (answer === "Geringe Beeinträchtigungen" || answer === "Starke Beeinträchtigungen") {
          return "Q8_U18_Ja";
        }
        return "Q9_U18"; // Default
        
      case "Q8_U18_Ja":
      case "Q8_U18_Nein":
      case "Q8_U18_Ausland_Nein":
        return "Q9_U18";
        
      case "Q9_U18":
        return "END"; // End of questionnaire
        
      // 18-24 flow
      case "Q2_18-24":
        return "Q3_18-24";
        
      case "Q3_18-24":
        const activity = answer || "";
        if (activity === "Schule") return "Q4_18-24_Schule";
        if (activity === "Ausbildung") return "Q4_18-24_Ausbildung";
        if (activity === "Studium") return "Q4_18-24_Studium";
        if (activity === "FSJ oder FÖJ") return "Q4_18-24_FSJ";
        if (activity === "Arbeiten (angestellt)") return "Q4_18-24_Arbeiten";
        if (activity === "Gründung eines Unternehmens") return "Q4_18-24_Gründung";
        if (activity === "Selbstständig/Unternehmer:in") return "Q4_18-24_Selbstständig";
        if (activity === "Arbeitssuchend") return "Q4_18-24_Arbeitssuchend";
        if (activity === "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)") return "Q4_18-24_Übergangsphase";
        if (activity === "Pflege von Angehörigen") return "Q4_18-24_Pflege";
        if (activity === "Familienzeit oder Kinderbetreuung") return "Q4_18-24_Familie";
        if (activity === "Sonstiges") return "Q4_18-24_Sonstiges";
        return "Q5_18-24"; // Default
        
      case "Q4_18-24_Schule":
      case "Q4_18-24_Ausbildung":
      case "Q4_18-24_Studium":
      case "Q4_18-24_FSJ":
      case "Q4_18-24_Arbeiten":
      case "Q4_18-24_Gründung":
      case "Q4_18-24_Selbstständig":
      case "Q4_18-24_Arbeitssuchend":
      case "Q4_18-24_Weiterbildung":
      case "Q4_18-24_Übergangsphase":
      case "Q4_18-24_Pflege":
      case "Q4_18-24_Familie":
      case "Q4_18-24_Sonstiges":
        return "Q5_18-24";
        
      case "Q5_18-24":
        if (answer === "Ich habe aktuell keinen Wohnsitz") return "Q5A_18-24_Ohne";
        return "Q6_18-24";
        
      case "Q5A_18-24_Ohne":
        return "Q6_18-24";
        
      case "Q6_18-24":
        return "Q8_18-24";
        
      case "Q8_18-24":
        if (answer === "Keine Beeinträchtigungen") {
          // Check if user is from abroad
          const nationality = getAnswer("Q2_18-24");
          if (nationality && nationality !== "Deutsch") {
            return "Q9_18-24_Ausland_Nein";
          }
          return "Q9_18-24_Nein";
        }
        // Any health condition leads to the support question
        return "Q9_18-24_Ja";
        
      case "Q9_18-24_Ja":
      case "Q9_18-24_Nein":
      case "Q9_18-24_Ausland_Nein":
        return "Q10_18-24";
        
      case "Q10_18-24":
        return "END"; // End of 18-24 questionnaire
        
      // 25-34 flow
      case "Q2_25-34":
        return "Q3_25-34";
        
      case "Q3_25-34":
        const activity25_34 = answer || "";
        if (activity25_34 === "Ausbildung") return "Q4_25-34_Ausbildung";
        if (activity25_34 === "Studium") return "Q4_25-34_Studium";
        if (activity25_34 === "Arbeiten (angestellt)") return "Q4_25-34_Arbeiten";
        if (activity25_34 === "Gründung eines Unternehmens") return "Q4_25-34_Gründung";
        if (activity25_34 === "Selbstständig/Unternehmer:in") return "Q4_25-34_Selbstständigkeit";
        if (activity25_34 === "Arbeitssuchend") return "Q4_25-34_Arbeitssuchend";
        if (activity25_34 === "Berufliche Weiterbildung/Umschulung") return "Q4_25-34_Weiterbildung";
        if (activity25_34 === "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)") return "Q4_25-34_Übergangsphase";
        if (activity25_34 === "Pflege von Angehörigen") return "Q4_25-34_Pflege";
        if (activity25_34 === "Familienzeit oder Kinderbetreuung") return "Q4_25-34_Familie";
        if (activity25_34 === "Sonstiges") return "Q4_25-34_Sonstiges";
        return "Q5_25-34"; // Default
        
      case "Q4_25-34_Ausbildung":
      case "Q4_25-34_Studium":
      case "Q4_25-34_Arbeiten":
      case "Q4_25-34_Gründung":
      case "Q4_25-34_Selbstständigkeit":
      case "Q4_25-34_Arbeitssuchend":
      case "Q4_25-34_Weiterbildung":
      case "Q4_25-34_Übergangsphase":
      case "Q4_25-34_Pflege":
      case "Q4_25-34_Familie":
      case "Q4_25-34_Sonstiges":
        return "Q5_25-34";
        
      case "Q5_25-34":
        if (answer === "Ich habe aktuell keinen Wohnsitz") return "Q5A_25-34_Ohne";
        return "Q6_25-34";
        
      case "Q5A_25-34_Ohne":
        return "Q6_25-34";
        
      case "Q6_25-34":
        return "Q8_25-34";
        
      case "Q8_25-34":
        if (answer === "Keine Beeinträchtigungen") {
          // Check if user is from abroad
          const nationality = getAnswer("Q2_25-34");
          if (nationality && nationality !== "Deutsch") {
            return "Q9_25-34_Ausland_Nein";
          }
          return "Q9_25-34_Nein";
        }
        // Any health condition leads to the support question
        return "Q9_25-34_Ja";
        
      case "Q9_25-34_Ja":
      case "Q9_25-34_Nein":
      case "Q9_25-34_Ausland_Nein":
        return "Q10_25-34";
        
      case "Q10_25-34":
        return "END"; // End of 25-34 questionnaire
        
      // 35-49 flow
      case "Q2_35-49":
        return "Q3_35-49";
        
      case "Q3_35-49":
        const activity35_49 = answer || "";
        if (activity35_49 === "Arbeiten (angestellt)") return "Q4_35-49_Arbeiten";
        if (activity35_49 === "Gründung eines Unternehmens") return "Q4_35-49_Gründung";
        if (activity35_49 === "Selbstständig/Unternehmer:in") return "Q4_35-49_Selbstständigkeit";
        if (activity35_49 === "Arbeitssuchend") return "Q4_35-49_Arbeitssuchend";
        if (activity35_49 === "Berufliche Weiterbildung/Umschulung") return "Q4_35-49_Weiterbildung";
        if (activity35_49 === "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)") return "Q4_35-49_Übergangsphase";
        if (activity35_49 === "Pflege von Angehörigen") return "Q4_35-49_Pflege";
        if (activity35_49 === "Familienzeit oder Kinderbetreuung") return "Q4_35-49_Familie";
        if (activity35_49 === "Sonstiges") return "Q4_35-49_Sonstiges";
        return "Q5_35-49"; // Default
        
      case "Q4_35-49_Arbeiten":
      case "Q4_35-49_Gründung":
      case "Q4_35-49_Selbstständigkeit":
      case "Q4_35-49_Arbeitssuchend":
      case "Q4_35-49_Weiterbildung":
      case "Q4_35-49_Übergangsphase":
      case "Q4_35-49_Pflege":
      case "Q4_35-49_Familie":
      case "Q4_35-49_Sonstiges":
        return "Q5_35-49";
        
      case "Q5_35-49":
        if (answer === "Ich habe aktuell keinen Wohnsitz") return "Q5A_35-49_Ohne";
        return "Q6_35-49";
        
      case "Q5A_35-49_Ohne":
        return "Q6_35-49";
        
      case "Q6_35-49":
        return "Q8_35-49";
        
      case "Q8_35-49":
        if (answer === "Keine Beeinträchtigungen") {
          // Check if user is from abroad
          const nationality = getAnswer("Q2_35-49");
          if (nationality && nationality !== "Deutsch") {
            return "Q9_35-49_Ausland_Nein";
          }
          return "Q9_35-49_Nein";
        }
        // Any health condition leads to the support question
        return "Q9_35-49_Ja";
        
      case "Q9_35-49_Ja":
      case "Q9_35-49_Nein":
      case "Q9_35-49_Ausland_Nein":
        return "Q10_35-49";
        
      case "Q10_35-49":
        return "END";

      // 50-64 Age Group Navigation
      case "Q2_50-64":
        return "Q3_50-64";

      case "Q3_50-64":
        const currentActivity_50_64 = answerValue || answers[currentQuestionId];
        switch (currentActivity_50_64) {
          case "Arbeiten (angestellt)":
            return "Q4_50-64_Arbeiten";
          case "Gründung eines Unternehmens":
            return "Q4_50-64_Gründung";
          case "Selbstständig/Unternehmer:in":
            return "Q4_50-64_Selbstständig";
          case "Arbeitssuchend":
            return "Q4_50-64_Arbeitssuchend";
          case "Berufliche Weiterbildung/Umschulung":
            return "Q4_50-64_Weiterbildung";
          case "Orientierungs-/Überbrückungsphase (keine Ausbildung/Arbeit)":
            return "Q4_50-64_Übergangsphase";
          case "Pflege von Angehörigen":
            return "Q4_50-64_Pflege";
          case "Familienzeit oder Kinderbetreuung":
            return "Q4_50-64_Familie";
          case "Sonstiges":
            return "Q4_50-64_Sonstiges";
          default:
            return "Q5_50-64";
        }

      case "Q4_50-64_Arbeiten":
      case "Q4_50-64_Gründung":
      case "Q4_50-64_Selbstständig":
      case "Q4_50-64_Arbeitssuchend":
      case "Q4_50-64_Weiterbildung":
      case "Q4_50-64_Übergangsphase":
      case "Q4_50-64_Pflege":
      case "Q4_50-64_Familie":
      case "Q4_50-64_Sonstiges":
        return "Q5_50-64";

      case "Q5_50-64":
        const housingSituation_50_64 = answerValue || answers[currentQuestionId];
        if (housingSituation_50_64 === "Ich habe aktuell keinen Wohnsitz") {
          return "Q5A_50-64_Ohne";
        }
        return "Q6_50-64";

      case "Q5A_50-64_Ohne":
        return "Q6_50-64";

      case "Q6_50-64":
        return "Q7_50-64";

      case "Q7_50-64":
        const healthCondition_50_64 = answerValue || answers[currentQuestionId];
        if (healthCondition_50_64 === "Keine Beeinträchtigungen") {
          // Check nationality for different question paths
          const nationality_50_64 = answers["Q2_50-64"];
          if (nationality_50_64 && ["Ukrainisch", "Türkisch", "Syrisch", "EU-Ausland", "Drittstaat"].includes(nationality_50_64)) {
            return "Q9_50-64_Ausland_Nein";
          }
          return "Q8_50-64_Nein";
        }
        return "Q8_50-64_Ja";

      case "Q8_50-64_Ja":
        return "Q10_50-64";

      case "Q8_50-64_Nein":
        return "Q10_50-64";

      case "Q9_50-64_Ausland_Nein":
        return "Q10_50-64";

      case "Q10_50-64":
        return "END";
        
      // 65+ Age Group Navigation
      case "Q2_65plus":
        return "Q3_65plus";

      case "Q3_65plus":
        const activity65plus = answer || answers["Q3_65plus"];
        switch (activity65plus) {
          case "Ich bin Rente":
            return "Q4_65plus_Rente";
          case "Arbeiten (Voll- oder Teilzeit)":
            return "Q4_65plus_Arbeit";
          case "Selbstständig":
            return "Q4_65plus_Selbstständig";
          case "Pflege von Angehörigen":
            return "Q4_65plus_Pflege";
          case "Ich bin erwerbsunfähig":
            return "Q4_65plus_Erwerbsunfähig";
          case "Sonstiges":
            return "Q4_65plus_Sonstiges";
          default:
            return "Q5_65plus";
        }

      case "Q4_65plus_Rente":
      case "Q4_65plus_Arbeit":
      case "Q4_65plus_Selbstständig":
      case "Q4_65plus_Pflege":
      case "Q4_65plus_Erwerbsunfähig":
      case "Q4_65plus_Sonstiges":
        return "Q5_65plus";

      case "Q5_65plus":
        const housing65plus = answer || answers["Q5_65plus"];
        if (housing65plus === "Ich habe aktuell keinen Wohnsitz") {
          return "Q5A_65plus_Ohne";
        }
        return "Q6_65plus";

      case "Q5A_65plus_Ohne":
        return "Q6_65plus";

      case "Q6_65plus":
        return "Q8_65plus"; // Note: Skipping Q7 for 65+ path

      case "Q8_65plus":
        const health65plus = answer || answers["Q8_65plus"];
        if (health65plus === "Keine Beeinträchtigungen") {
          return "Q9_65plus_Nein";
        }
        return "Q9_65plus_Ja";

      case "Q9_65plus_Ja":
        return "Q10_65plus";

      case "Q9_65plus_Nein":
        const nationality65plus = answers["Q2_65plus"];
        if (nationality65plus !== "Deutsch") {
          return "Q9_65plus_Ausland_Nein";
        }
        return "Q10_65plus";

      case "Q9_65plus_Ausland_Nein":
        return "Q10_65plus";

      case "Q10_65plus":
        return "END";
        
      default:
        return "END";
    }
  };

  // Update answer (string for single-select, string[] for multi-select)
  const updateAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Go to next question with optional answer override
  const goToNextQuestion = (answerOverride?: string) => {
    const nextQuestionId = getNextQuestionId(currentQuestionId, answerOverride);

    if (nextQuestionId === "END") {
      setIsLastQuestion(true);
      return;
    }
    
    setCurrentQuestionId(nextQuestionId);
    setQuestionHistory(prev => [...prev, nextQuestionId]);
    setIsLastQuestion(false);
  };

  // Go back to previous question
  const goToPreviousQuestion = () => {
    if (questionHistory.length > 1) {
      const newHistory = questionHistory.slice(0, -1);
      setQuestionHistory(newHistory);
      setCurrentQuestionId(newHistory[newHistory.length - 1]);
      setIsLastQuestion(false);
    }
  };

  // Reset questionnaire to beginning
  const resetQuestionnaire = () => {
    setCurrentQuestionId("Q1");
    setAnswers({});
    setQuestionHistory(["Q1"]);
    setIsLastQuestion(false);
    
    // Clear localStorage
    try {
      localStorage.removeItem(QUESTIONNAIRE_ANSWERS_KEY);
      localStorage.removeItem(QUESTIONNAIRE_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        currentQuestionId,
        answers,
        updateAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        resetQuestionnaire,
        questionHistory,
        isLastQuestion,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = (): QuestionnaireContextType => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
};