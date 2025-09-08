import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const QUESTIONNAIRE_ANSWERS_KEY = "questionnaireAnswers";
const QUESTIONNAIRE_HISTORY_KEY = "questionnaireHistory";

export type UserAnswers = Record<string, string>;

interface QuestionnaireContextType {
  currentQuestionId: string;
  answers: Record<string, string>;
  updateAnswer: (questionId: string, answer: string) => void;
  goToNextQuestion: (answerOverride?: string) => void;
  goToPreviousQuestion: () => void;
  resetQuestionnaire: () => void;
  questionHistory: string[];
  isLastQuestion: boolean;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// Initial answers state
const initialAnswers: Record<string, string> = {};

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("Q1");
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
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
    return answers[questionId];
  };

  // Navigation logic for the new questionnaire structure
  const getNextQuestionId = (currentId: string, answerValue?: string): string => {
    const answer = answerValue || getAnswer(currentId);
    
    console.log(`Getting next question for ${currentId} with answer: ${answer}`);
    
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
        
      // Placeholder routes for other age groups
      case "Q2_25-34":
      case "Q2_35-49":
      case "Q2_50-64":
      case "Q2_65plus":
        return "END"; // End for now, will be implemented later
        
      default:
        console.warn(`No next question defined for ${currentId}`);
        return "END";
    }
  };

  // Update answer and move to next question
  const updateAnswer = (questionId: string, answer: string) => {
    console.log(`Updating answer for ${questionId}: ${answer}`);
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Go to next question with optional answer override
  const goToNextQuestion = (answerOverride?: string) => {
    console.log(`goToNextQuestion called with override: ${answerOverride}`);
    
    const nextQuestionId = getNextQuestionId(currentQuestionId, answerOverride);
    console.log(`Next question ID: ${nextQuestionId}`);
    
    if (nextQuestionId === "END") {
      console.log("Reached end of questionnaire");
      setIsLastQuestion(true);
      return;
    }
    
    setCurrentQuestionId(nextQuestionId);
    setQuestionHistory(prev => [...prev, nextQuestionId]);
    setIsLastQuestion(false);
  };

  // Go back to previous question
  const goToPreviousQuestion = () => {
    console.log("Going to previous question");
    if (questionHistory.length > 1) {
      const newHistory = questionHistory.slice(0, -1);
      setQuestionHistory(newHistory);
      setCurrentQuestionId(newHistory[newHistory.length - 1]);
      setIsLastQuestion(false);
    }
  };

  // Reset questionnaire to beginning
  const resetQuestionnaire = () => {
    console.log("Resetting questionnaire");
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