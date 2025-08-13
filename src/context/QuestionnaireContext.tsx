import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const QUESTIONNAIRE_ANSWERS_KEY = "questionnaireAnswers";
const QUESTIONNAIRE_HISTORY_KEY = "questionnaireHistory";

export type UserAnswers = Record<string, string>;

interface QuestionnaireContextType {
  currentQuestionId: string;
  answers: Record<string, string>;
  updateAnswer: (questionId: string, answer: string) => void;
  goToNextQuestion: () => void;
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

  // Helper functions for navigation logic
  const getFinancialQuestionU18 = (): string => {
    const currentActivity = getAnswer("Q3_U18");
    
    if (currentActivity === "Schule") {
      return "Q7_U18";
    } else if (currentActivity === "Ausbildung") {
      return "Q7_U18";
    } else if (currentActivity === "FSJ oder FÖJ") {
      return "Q7_U18";
    } else {
      return "Q7_U18";
    }
  };

  const getFinancialQuestion18_24 = (): string => {
    const currentActivity = getAnswer("Q3_18-24");
    
    if (currentActivity === "Schule") {
      return "Q7_18-24_Schule";
    } else if (currentActivity === "Ausbildung") {
      return "Q7_18-24_Ausbildung";
    } else if (currentActivity === "Studium") {
      return "Q7_18-24_Studium";
    } else if (currentActivity === "Arbeiten") {
      return "Q7_18-24_Arbeiten";
    } else if (currentActivity === "Arbeitssuchend") {
      return "Q7_18-24_Arbeitssuchend";
    } else if (currentActivity === "Weiterbildung/Umschulung") {
      return "Q7_18-24_Weiterbildung";
    } else if (currentActivity === "Übergangsphase") {
      return "Q7_18-24_Übergangsphase";
    } else if (currentActivity === "Pflege von Angehörigen oder Familienzeit") {
      return "Q7_18-24_Pflege";
    } else {
      return "Q7_18-24_Sonstiges";
    }
  };

  const getFinancialQuestion25_64 = (): string => {
    const currentActivity = getAnswer("Q3_25-64");
    
    if (currentActivity === "Ausbildung") {
      return "Q7_25-64_Ausbildung";
    } else if (currentActivity === "Studium") {
      return "Q7_25-64_Studium";
    } else if (currentActivity === "Arbeiten") {
      return "Q7_25-64_Arbeiten";
    } else if (currentActivity === "Arbeitssuchend") {
      return "Q7_25-64_Arbeitssuchend";
    } else if (currentActivity === "Weiterbildung/Umschulung") {
      return "Q7_25-64_Weiterbildung";
    } else if (currentActivity === "Übergangsphase") {
      return "Q7_25-64_Übergangsphase";
    } else if (currentActivity === "Pflege von Angehörigen oder Familienzeit") {
      return "Q7_25-64_Pflege";
    } else {
      return "Q7_25-64_Sonstiges";
    }
  };

  const getSupportQuestionU18 = (): string => {
    const nationality = getAnswer("Q2_U18");
    const isNonGerman = nationality && nationality !== "Deutsch";
    
    return isNonGerman ? "Q8_U18_Ausland_Nein" : "Q8_U18_Nein";
  };

  const getSupportQuestion18_24 = (): string => {
    const nationality = getAnswer("Q2_18-24");
    const isNonGerman = nationality && nationality !== "Deutsch";
    
    return isNonGerman ? "Q9_18-24_Ausland_Nein" : "Q9_18-24_Nein";
  };

  const getSupportQuestion25_64 = (): string => {
    const nationality = getAnswer("Q2_25-64");
    const isNonGerman = nationality && nationality !== "Deutsch";
    
    return isNonGerman ? "Q9_25-64_Ausland_Nein" : "Q9_25-64_Nein";
  };

  const getSupportQuestion65plus = (): string => {
    const nationality = getAnswer("Q2_65plus");
    const isNonGerman = nationality && nationality !== "Deutsch";
    
    return isNonGerman ? "Q9_65plus_Ausland_Nein" : "Q9_65plus_Nein";
  };

  const getFinancialQuestion65plus = (): string => {
    const currentActivity = getAnswer("Q3_65plus");
    
    if (currentActivity === "Ich bin Rente") {
      return "Q7_65plus_Rente";
    } else if (currentActivity === "Arbeiten (Voll- oder Teilzeit)") {
      return "Q7_65plus_Arbeiten";
    } else if (currentActivity === "Pflege von Angehörigen") {
      return "Q7_65plus_Pflege";
    } else if (currentActivity === "Ich bin erwerbsunfähig") {
      return "Q7_65plus_Erwerbsunfähig";
    } else if (currentActivity === "Ich engagiere mich ehrenamtlich") {
      return "Q7_65plus_Ehrenamt";
    } else {
      return "Q7_65plus_Sonstiges";
    }
  };

  const getNextQuestionId = (currentId: string, answer: string): string => {
    console.log(`Determining next question for ${currentId} with answer: ${answer}`);
    
    switch (currentId) {
      // Initial age question
      case "Q1":
        if (answer === "unter 18") return "Q2_U18";
        if (answer === "18-24") return "Q2_18-24";
        if (answer === "25-64") return "Q2_25-64";
        return "Q2_65plus";

      // Under 18 paths - NEW STRUCTURE
      case "Q2_U18":
        return "Q3_U18";
        
      case "Q3_U18":
        if (answer === "Schule") return "Q4_U18_Schule";
        if (answer === "Ausbildung") return "Q4_U18_Ausbildung";
        if (answer === "FSJ oder FÖJ") return "Q4_U18_FSJ";
        return "Q4_U18_Sonstiges";
        
      case "Q4_U18_Schule":
      case "Q4_U18_Ausbildung":
      case "Q4_U18_FSJ":
      case "Q4_U18_Sonstiges":
        return "Q5_U18";
        
      case "Q5_U18":
        if (answer === "Ja") return "Q6_U18_Eltern";
        if (answer === "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)") return "Q6_U18_Betreuung";
        return "Q6_U18_Verwandte";
        
      case "Q6_U18_Eltern":
      case "Q6_U18_Betreuung":
      case "Q6_U18_Verwandte":
        return "Q7_U18";
        
      case "Q7_U18":
        return answer === "Ja" ? "Q8_U18_Ja" : getSupportQuestionU18();
        
      case "Q8_U18_Ja":
      case "Q8_U18_Nein":
      case "Q8_U18_Ausland_Nein":
        return "Q9_U18";

      // 18-24 paths - NEW STRUCTURE
      case "Q2_18-24":
        return "Q3_18-24";
        
      case "Q3_18-24":
        if (answer === "Schule") return "Q4_18-24_Schule";
        if (answer === "Ausbildung") return "Q4_18-24_Ausbildung";
        if (answer === "Studium") return "Q4_18-24_Studium";
        if (answer === "Arbeiten") return "Q4_18-24_Arbeiten";
        if (answer === "Arbeitssuchend") return "Q4_18-24_Arbeitssuchend";
        if (answer === "Weiterbildung/Umschulung") return "Q4_18-24_Weiterbildung";
        if (answer === "Übergangsphase") return "Q4_18-24_Übergangsphase";
        if (answer === "Pflege von Angehörigen oder Familienzeit") return "Q4_18-24_Pflege";
        return "Q4_18-24_Sonstiges";
        
      case "Q4_18-24_Schule":
      case "Q4_18-24_Ausbildung":
      case "Q4_18-24_Studium":
      case "Q4_18-24_Arbeiten":
      case "Q4_18-24_Arbeitssuchend":
      case "Q4_18-24_Weiterbildung":
      case "Q4_18-24_Übergangsphase":
      case "Q4_18-24_Pflege":
      case "Q4_18-24_Sonstiges":
        return "Q5_18-24";
        
      case "Q5_18-24":
        if (answer === "Alleine (eigene Wohnung)") return "Q6_18-24_Alleine";
        if (answer === "Bei meiner Familie") return "Q6_18-24_Familie";
        if (answer === "Wohngemeinschaft (WG)") return "Q6_18-24_WG";
        if (answer === "In einem Wohnheim (Studentenwohnheim, etc.)") return "Q6_18-24_Wohnheim";
        return "Q6_18-24_Ohne";
        
      case "Q6_18-24_Alleine":
      case "Q6_18-24_Familie":
      case "Q6_18-24_WG":
      case "Q6_18-24_Wohnheim":
      case "Q6_18-24_Ohne":
        return getFinancialQuestion18_24();
        
      case "Q7_18-24_Schule":
      case "Q7_18-24_Ausbildung":
      case "Q7_18-24_Studium":
      case "Q7_18-24_Arbeiten":
      case "Q7_18-24_Arbeitssuchend":
      case "Q7_18-24_Weiterbildung":
      case "Q7_18-24_Übergangsphase":
      case "Q7_18-24_Pflege":
      case "Q7_18-24_Sonstiges":
        return "Q8_18-24";
        
      case "Q8_18-24":
        return answer === "Ja" ? "Q9_18-24_Ja" : getSupportQuestion18_24();
        
      case "Q9_18-24_Ja":
      case "Q9_18-24_Nein":
      case "Q9_18-24_Ausland_Nein":
        return "Q10_18-24";

      // 25-64 paths - NEW STRUCTURE
      case "Q2_25-64":
        return "Q3_25-64";
        
      case "Q3_25-64":
        if (answer === "Ausbildung") return "Q4_25-64_Ausbildung";
        if (answer === "Studium") return "Q4_25-64_Studium";
        if (answer === "Arbeiten") return "Q4_25-64_Arbeiten";
        if (answer === "Arbeitssuchend") return "Q4_25-64_Arbeitssuchend";
        if (answer === "Weiterbildung/Umschulung") return "Q4_25-64_Weiterbildung";
        if (answer === "Übergangsphase") return "Q4_25-64_Übergangsphase";
        if (answer === "Pflege von Angehörigen oder Familienzeit") return "Q4_25-64_Pflege";
        return "Q4_25-64_Sonstiges";
        
      case "Q4_25-64_Ausbildung":
      case "Q4_25-64_Studium":
      case "Q4_25-64_Arbeiten":
      case "Q4_25-64_Arbeitssuchend":
      case "Q4_25-64_Weiterbildung":
      case "Q4_25-64_Übergangsphase":
      case "Q4_25-64_Pflege":
      case "Q4_25-64_Sonstiges":
        return "Q5_25-64";
        
      case "Q5_25-64":
        if (answer === "ich wohne zur Miete") return "Q6_25-64_Miete";
        if (answer === "Wohneigentum") return "Q6_25-64_Eigentum";
        if (answer === "Bei meiner Familie") return "Q6_25-64_Familie";
        if (answer === "Wohngemeinschaft (WG)") return "Q6_25-64_WG";
        return "Q6_25-64_Ohne";
        
      case "Q6_25-64_Miete":
      case "Q6_25-64_Eigentum":
      case "Q6_25-64_Familie":
      case "Q6_25-64_WG":
      case "Q6_25-64_Ohne":
        return getFinancialQuestion25_64();
        
      case "Q7_25-64_Ausbildung":
      case "Q7_25-64_Studium":
      case "Q7_25-64_Arbeiten":
      case "Q7_25-64_Arbeitssuchend":
      case "Q7_25-64_Weiterbildung":
      case "Q7_25-64_Übergangsphase":
      case "Q7_25-64_Pflege":
      case "Q7_25-64_Sonstiges":
        return "Q8_25-64";
        
      case "Q8_25-64":
        return answer === "Ja" ? "Q9_25-64_Ja" : getSupportQuestion25_64();
        
      case "Q9_25-64_Ja":
      case "Q9_25-64_Nein":
      case "Q9_25-64_Ausland_Nein":
        return "Q10_25-64";

      // 65+ paths
      case "Q2_65plus":
        return "Q3_65plus";
        
      case "Q3_65plus":
        if (answer === "Ich bin Rente") return "Q4_65plus_Rente";
        if (answer === "Arbeiten (Voll- oder Teilzeit)") return "Q4_65plus_Arbeit";
        if (answer === "Pflege von Angehörigen") return "Q4_65plus_Pflege";
        if (answer === "Ich bin erwerbsunfähig") return "Q4_65plus_Erwerbsunfähig";
        if (answer === "Ich engagiere mich ehrenamtlich") return "Q4_65plus_Ehrenamt";
        return "Q4_65plus_Sonstiges";
        
      case "Q4_65plus_Rente":
      case "Q4_65plus_Arbeit":
      case "Q4_65plus_Pflege":
      case "Q4_65plus_Erwerbsunfähig":
      case "Q4_65plus_Ehrenamt":
      case "Q4_65plus_Sonstiges":
        return "Q5_65plus";
        
      case "Q5_65plus":
        if (answer === "Alleine (eigene Wohnung)") return "Q6_65plus_Alleine";
        if (answer === "Mit Partner:in/Familie") return "Q6_65plus_Familie";
        if (answer === "Seniorenheim/Pflegeeinrichtung") return "Q6_65plus_Heim";
        return "Q6_65plus_Ohne";
        
      case "Q6_65plus_Alleine":
      case "Q6_65plus_Familie":
      case "Q6_65plus_Heim":
      case "Q6_65plus_Ohne":
        return getFinancialQuestion65plus();
        
      case "Q7_65plus_Rente":
      case "Q7_65plus_Arbeiten":
      case "Q7_65plus_Pflege":
      case "Q7_65plus_Erwerbsunfähig":
      case "Q7_65plus_Ehrenamt":
      case "Q7_65plus_Sonstiges":
        return "Q8_65plus";
        
      case "Q8_65plus":
        return answer === "Ja" ? "Q9_65plus_Ja" : getSupportQuestion65plus();
        
      case "Q9_65plus_Ja":
      case "Q9_65plus_Nein":
      case "Q9_65plus_Ausland_Nein":
        return "Q10_65plus";

      // Over 65 activity options (old format - keeping for compatibility)
      case "Q2_Ü65":
        if (answer === "Berufstätig") return "Q3_Ü65_Berufstätig";
        if (answer === "Übergang in den Ruhestand") return "Q3_Ü65_Übergang";
        if (answer === "In Rente") return "Q3_Ü65_Rente";
        if (answer === "Pflege oder Betreuung (selbst betroffen oder Angehörige)") return "Q3_Ü65_Pflege";
        return "Q3_Ü65_Sonstiges";

      // Final questions for all paths
      case "Q9_U18":
      case "Q10_18-24":
      case "Q10_25-64":
      case "Q10_65plus":
      case "Q3_Ü65_Berufstätig":
      case "Q3_Ü65_Übergang":
      case "Q3_Ü65_Rente":
      case "Q3_Ü65_Pflege":
      case "Q3_Ü65_Sonstiges":
        return "final";

      default:
        console.warn(`Unknown question ID: ${currentId}`);
        return "final";
    }
  };

  const updateAnswer = (questionId: string, answer: string) => {
    console.log(`Updating answer for ${questionId}: ${answer}`);
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNextQuestion = () => {
    const currentAnswer = answers[currentQuestionId];
    
    if (!currentAnswer) {
      console.warn("No answer provided for current question");
      return;
    }

    try {
      const nextQuestionId = getNextQuestionId(currentQuestionId, currentAnswer);
      console.log(`Next question: ${nextQuestionId}`);

      if (nextQuestionId === "final") {
        setIsLastQuestion(true);
        return;
      }

      setCurrentQuestionId(nextQuestionId);
      setQuestionHistory(prev => [...prev, nextQuestionId]);
      setIsLastQuestion(false);
    } catch (error) {
      console.error("Error navigating to next question:", error);
    }
  };

  const goToPreviousQuestion = () => {
    if (questionHistory.length <= 1) {
      console.warn("Cannot go back - at first question");
      return;
    }

    try {
      const newHistory = [...questionHistory];
      newHistory.pop(); // Remove current question
      const previousQuestionId = newHistory[newHistory.length - 1];
      
      setCurrentQuestionId(previousQuestionId);
      setQuestionHistory(newHistory);
      setIsLastQuestion(false);
    } catch (error) {
      console.error("Error navigating to previous question:", error);
    }
  };

  const resetQuestionnaire = () => {
    console.log("Resetting questionnaire");
    setCurrentQuestionId("Q1");
    setAnswers(initialAnswers);
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
        isLastQuestion
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = (): QuestionnaireContextType => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
};