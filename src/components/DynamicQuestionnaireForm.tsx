
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuestionData, getQuestionData } from "@/data/questionnaireData";
import { useState } from "react";
import { CheckCircle, ArrowLeft, Shield, Users } from "lucide-react";

const DynamicQuestionnaireForm = () => {
  const navigate = useNavigate();
  const {
    currentQuestionId,
    answers,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    questionHistory,
    isLastQuestion,
  } = useQuestionnaire();

  // Track loading state to prevent multiple clicks
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track animation state for card transitions
  const [animationState, setAnimationState] = useState<'idle' | 'slide-out' | 'slide-in'>('idle');
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  
  // Get the current question data
  const questionData = getQuestionData(currentQuestionId);

  // Constant total steps to make progress more predictable
  const estimatedTotalSteps = 6;
  
  // Calculate progress based on how far we are in our question history
  const progressPercentage = Math.min(
    ((questionHistory.length) / estimatedTotalSteps) * 100,
    100
  );

  // Handle going back to previous question or home
  const handleBack = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setAnimationDirection('backward');
    setAnimationState('slide-out');
    
    setTimeout(() => {
      if (questionHistory.length > 1) {
        goToPreviousQuestion();
      } else {
        navigate("/");
      }
      setAnimationState('slide-in');
      
      setTimeout(() => {
        setAnimationState('idle');
        setIsProcessing(false);
      }, 250);
    }, 250);
  };

  // Handle the selection of an answer
  const handleSelect = (value: string) => {
    console.log('handleSelect called:', { value, isProcessing, currentQuestionId });
    
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }
    
    console.log('Processing answer selection...');
    setIsProcessing(true);
    
    // Update the answer first
    updateAnswer(currentQuestionId, value);
    
    // Start card swipe out animation
    setAnimationDirection('forward');
    setAnimationState('slide-out');
    
    // Wait for slide-out animation, then change question and slide in
    setTimeout(() => {
      console.log('Slide-out complete, navigating with value:', value);
      
      if (isLastQuestion) {
        console.log('Last question reached, going to results');
        navigate("/results");
      } else {
        console.log('Going to next question with answer:', value);
        goToNextQuestion(value);
      }
      
      // Start slide-in animation
      setAnimationState('slide-in');
      
      // Complete the transition
      setTimeout(() => {
        setAnimationState('idle');
        setIsProcessing(false);
        console.log('Card transition complete');
      }, 250);
    }, 250);
  };

  // If no question data is found, provide option to reset the questionnaire
  if (!questionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-2xl font-medium mb-4 text-red-800">Frage nicht gefunden</h3>
          <p className="text-red-600 mb-6">Die Frage mit der ID "{currentQuestionId}" konnte nicht gefunden werden.</p>
          <Button onClick={() => navigate("/")} className="bg-berlin-orange hover:bg-berlin-orange/90">
            Fragebogen neu starten
          </Button>
        </div>
      </div>
    );
  }

  // Add debug info
  console.log("Current question ID:", currentQuestionId);
  console.log("Question data:", questionData);
  console.log("Current answers:", answers);

  // Render the current question
  return (
    <div className="max-w-4xl mx-auto">
      {/* Trust header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-3 mb-4 rounded-t-lg">
        <div className="flex items-center justify-center space-x-4 md:space-x-6 text-xs md:text-sm text-gray-600">
          <div className="flex items-center space-x-1 md:space-x-2">
            <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
            <span className="hidden sm:inline">Sicher & Vertraulich</span>
            <span className="sm:hidden">Sicher</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Users className="w-3 h-3 md:w-4 md:h-4 text-berlin-blue" />
            <span className="hidden sm:inline">Von Berlinern für Berliner</span>
            <span className="sm:hidden">Berlin</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-berlin-orange" />
            <span className="hidden sm:inline">Offiziell verifiziert</span>
            <span className="sm:hidden">Verifiziert</span>
          </div>
        </div>
      </div>

      <div className={`bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 transition-all duration-250 ease-out ${
        animationState === 'slide-out' ? 
          (animationDirection === 'forward' ? 'animate-slide-out-left' : 'animate-slide-out-right') :
        animationState === 'slide-in' ? 
          (animationDirection === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left') :
        'animate-fade-in'
      }`}>
        <div className="p-6">
          <StepProgress 
            currentStep={questionHistory.length} 
            totalSteps={estimatedTotalSteps} 
            value={progressPercentage} 
          />
          
          <div className="py-6">
            <div className="space-y-6 w-full">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-berlin-blue mb-3">
                  {questionData.question}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                  Wähle die Option, die am besten zu deiner aktuellen Situation passt.
                </p>
              </div>

              {Array.isArray(questionData.options) && questionData.options.length > 0 && (
                <div className={`max-w-4xl mx-auto grid gap-3 ${
                  questionData.options.length <= 3 ? 'grid-cols-1' :
                  questionData.options.length <= 6 ? 'grid-cols-1 md:grid-cols-2' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {questionData.options.map((option, index) => (
                    <div 
                      key={`${currentQuestionId}-${option}`}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 hover:border-berlin-orange hover:shadow-md cursor-pointer ${
                        answers[currentQuestionId] === option 
                          ? 'border-berlin-orange bg-berlin-orange/5 shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          answers[currentQuestionId] === option 
                            ? 'border-berlin-orange bg-berlin-orange' 
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestionId] === option && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="flex-1 text-sm md:text-base font-medium text-gray-800 leading-tight">
                          {option}
                        </span>
                        {answers[currentQuestionId] === option && (
                          <CheckCircle className="h-5 w-5 text-berlin-orange animate-fade-in-up flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2 hover:bg-gray-50"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </Button>
            
            <div className="text-xs md:text-sm text-gray-500">
              Alle Angaben werden vertraulich behandelt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestionnaireForm;
