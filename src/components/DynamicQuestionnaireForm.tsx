
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuestionData, getQuestionData } from "@/data/questionnaireData";
import { useEffect, useState } from "react";

const DynamicQuestionnaireForm = () => {
  const navigate = useNavigate();
  const {
    currentQuestionId,
    answers,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    questionHistory,
    isLastQuestion
  } = useQuestionnaire();

  // Track loading state to prevent multiple clicks
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get the current question data
  const questionData = getQuestionData(currentQuestionId);

  // Calculate total number of questions in the questionnaire path
  // This is an estimation based on the typical path length
  const estimatedTotalSteps = 7;
  
  // Calculate progress based on how far we are in our question history
  const progressPercentage = Math.min(
    ((questionHistory.length - 1) / estimatedTotalSteps) * 100,
    100
  );

  // Handle the selection of an answer
  const handleSelect = (value: string) => {
    if (isProcessing) return; // Prevent multiple clicks
    
    setIsProcessing(true);
    updateAnswer(currentQuestionId, value);
    
    const nextQuestionId = goToNextQuestion(currentQuestionId, value);
    
    // Navigate to results if we've reached the final step
    if (nextQuestionId === "final") {
      navigate("/results");
    }
    
    setIsProcessing(false);
  };

  // Render the current question
  const renderQuestion = () => {
    if (!questionData) {
      return <div>Question not found</div>;
    }

    const { question, options } = questionData;

    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-3xl font-medium text-center mb-8">{question}</h3>

        {Array.isArray(options) && options.length > 0 && (
          <RadioGroup
            value={answers[currentQuestionId] || ""}
            onValueChange={handleSelect}
            className="max-w-md mx-auto grid grid-cols-1 gap-4"
          >
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-4 rounded-lg border border-input hover:border-primary transition-colors">
                <RadioGroupItem value={option} id={`option-${option}`} />
                <Label htmlFor={`option-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-8">
        <StepProgress 
          currentStep={questionHistory.length} 
          totalSteps={estimatedTotalSteps} 
          value={progressPercentage} 
        />
        
        <div className="min-h-[400px] flex items-center justify-center py-8">
          {renderQuestion()}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={questionHistory.length <= 1 || isProcessing}
          >
            Zurück
          </Button>

          {isLastQuestion && (
            <Button 
              onClick={() => navigate("/results")}
              disabled={isProcessing}
            >
              Ergebnisse anzeigen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestionnaireForm;
