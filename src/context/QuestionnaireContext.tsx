import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FIRST_QUESTION_ID, nextStep } from "@/questionnaire/flow";
import { resetSectionTracking, trackSection } from "@/questionnaire/tracking";

// v3: neuer Fragebogen mit eigenen Frage-ids (November 2026). Der neue
// Schlüssel verhindert, dass alte Sitzungsdaten falsch gelesen werden.
const QUESTIONNAIRE_ANSWERS_KEY = "questionnaireAnswers_v3";
const QUESTIONNAIRE_HISTORY_KEY = "questionnaireHistory_v3";

/** Gespeicherte Antworten je Frage, als Options-ids (siehe questionnaireData.ts). */
export type UserAnswers = Record<string, string | string[]>;

interface QuestionnaireContextType {
  currentQuestionId: string;
  answers: Record<string, string | string[]>;
  updateAnswer: (questionId: string, answer: string | string[]) => void;
  /** Ersetzt alle Antworten auf einmal (Feed, nach Bereinigung) */
  replaceAnswers: (answers: UserAnswers) => void;
  goToNextQuestion: (answerOverride?: string | string[]) => void;
  goToPreviousQuestion: () => void;
  resetQuestionnaire: () => void;
  questionHistory: string[];
  isLastQuestion: boolean;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// Initial answers state
const initialAnswers: Record<string, string | string[]> = {};

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(FIRST_QUESTION_ID);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [questionHistory, setQuestionHistory] = useState<string[]>([FIRST_QUESTION_ID]);
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const savedAnswers = sessionStorage.getItem(QUESTIONNAIRE_ANSWERS_KEY);
      const savedHistory = sessionStorage.getItem(QUESTIONNAIRE_HISTORY_KEY);
      
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
      console.error("Error loading from sessionStorage:", error);
    }
  }, []);

  // Save to sessionStorage whenever answers or history change
  useEffect(() => {
    try {
      sessionStorage.setItem(QUESTIONNAIRE_ANSWERS_KEY, JSON.stringify(answers));
      sessionStorage.setItem(QUESTIONNAIRE_HISTORY_KEY, JSON.stringify(questionHistory));
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  }, [answers, questionHistory]);

  const updateAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const replaceAnswers = (next: UserAnswers) => setAnswers(next);

  // Go to next question with optional answer override
  const goToNextQuestion = (answerOverride?: string | string[]) => {
    const next = nextStep(currentQuestionId, answers, answerOverride);

    if (!next) {
      setIsLastQuestion(true);
      return;
    }
    
    // Abschnittsmessung: neuer Abschnitt erreicht (zählt einmal pro Durchlauf)
    trackSection(next.section);

    setCurrentQuestionId(next.questionId);
    setQuestionHistory(prev => [...prev, next.questionId]);
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
    setCurrentQuestionId(FIRST_QUESTION_ID);
    setAnswers({});
    setQuestionHistory([FIRST_QUESTION_ID]);
    setIsLastQuestion(false);
    resetSectionTracking();
    
    // Clear sessionStorage
    try {
      sessionStorage.removeItem(QUESTIONNAIRE_ANSWERS_KEY);
      sessionStorage.removeItem(QUESTIONNAIRE_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        currentQuestionId,
        answers,
        updateAnswer,
        replaceAnswers,
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