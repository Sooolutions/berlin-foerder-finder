
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuestionData, getQuestionData } from "@/data/questionnaireData";

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

  // Get the current question data
  const questionData = getQuestionData(currentQuestionId);

  // Handle the selection of an answer
  const handleSelect = (value: string) => {
    updateAnswer(currentQuestionId, value);
    const nextQuestionId = goToNextQuestion(currentQuestionId, value);
    
    // Fixed comparison by explicitly comparing to the 'final' string
    if (nextQuestionId === "final") {
      navigate("/results");
    }
  };

  // Simple progress calculation - how far we are in our question history
  const progressPercentage = Math.min(
    ((questionHistory.length - 1) / 7) * 100,
    100
  );

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
        <StepProgress currentStep={questionHistory.length} totalSteps={8} value={progressPercentage} />
        
        <div className="min-h-[400px] flex items-center justify-center py-8">
          {renderQuestion()}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={questionHistory.length <= 1}
          >
            Zurück
          </Button>

          {isLastQuestion && (
            <Button onClick={() => navigate("/results")}>
              Ergebnisse anzeigen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestionnaireForm;
