
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, Shield, Users, User } from "lucide-react";
import { QuestionnaireProvider, useQuestionnaire } from "@/context/QuestionnaireContext";

const UserInfoContent = () => {
  const navigate = useNavigate();
  const { currentQuestionId, answers, updateAnswer, goToNextQuestion, resetQuestionnaire } = useQuestionnaire();
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset questionnaire when component mounts
  useEffect(() => {
    resetQuestionnaire();
  }, [resetQuestionnaire]);

  // Handle answer selection
  const handleSelect = (value: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    updateAnswer(currentQuestionId, value);
    
    try {
      const nextQuestionId = goToNextQuestion(currentQuestionId, value);
      
      // If we've completed the user info questions, navigate to questionnaire
      if (nextQuestionId && !nextQuestionId.startsWith("Q1") && !nextQuestionId.startsWith("Q2")) {
        setTimeout(() => {
          navigate("/questionnaire");
          setIsProcessing(false);
        }, 500);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
        }, 300);
      }
    } catch (error) {
      console.error("Error in user info flow:", error);
      setIsProcessing(false);
    }
  };

  // Get current question data
  const getQuestionData = () => {
    if (currentQuestionId === "Q1") {
      return {
        question: "Wie alt bist du?",
        options: ["unter 18", "18-24", "25-64", "über 65"]
      };
    }
    
    if (currentQuestionId === "Q2_U18") {
      return {
        question: "Was machst du aktuell?",
        options: ["Schule", "Ausbildung", "nichts davon"]
      };
    }
    
    if (currentQuestionId === "Q2_18_24") {
      return {
        question: "Was machst du aktuell?",
        options: ["Schule", "Ausbildung", "Studium", "Arbeit", "Übergangsphase", "Arbeitssuchend"]
      };
    }
    
    if (currentQuestionId === "Q2_25_64") {
      return {
        question: "Was machst du aktuell?",
        options: ["Studium", "Arbeiten", "Arbeitssuchend", "Weiterbildung/Umschulung", "Übergangsphase", "Pflege von Angehörigen oder Familienzeit", "Sonstiges"]
      };
    }
    
    if (currentQuestionId === "Q2_Ü65") {
      return {
        question: "Was machst du aktuell?",
        options: ["Berufstätig", "Übergang in den Ruhestand", "In Rente", "Pflege oder Betreuung (selbst betroffen oder Angehörige)", "Sonstiges"]
      };
    }
    
    return null;
  };

  const questionData = getQuestionData();

  if (!questionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-2xl font-medium mb-4 text-red-800">Fehler beim Laden</h3>
          <p className="text-red-600 mb-6">Die Frage konnte nicht geladen werden.</p>
          <Button onClick={() => navigate("/")} className="bg-berlin-orange hover:bg-berlin-orange/90">
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-berlin-blue/5 via-white to-berlin-orange/5 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Trust header */}
          <div className="bg-white shadow-sm border-b border-gray-100 p-4 mb-8 rounded-lg">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Sicher & Vertraulich</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-berlin-blue" />
                <span>Von Berlinern für Berliner</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-berlin-orange" />
                <span>Offiziell verifiziert</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg border border-gray-100 p-8">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-berlin-blue" />
                <h2 className="text-xl font-semibold text-berlin-blue">Persönliche Angaben</h2>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-berlin-blue to-berlin-orange h-2 rounded-full transition-all duration-500"
                  style={{ width: currentQuestionId === "Q1" ? "50%" : "100%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {currentQuestionId === "Q1" ? "Schritt 1 von 2" : "Schritt 2 von 2"}
              </p>
            </div>

            <div className="min-h-[400px] flex items-center justify-center">
              <div className="space-y-8 w-full">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-berlin-blue mb-4">
                    {questionData.question}
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Diese Angaben helfen uns, die passenden Förderungen für dich zu finden.
                  </p>
                </div>

                <RadioGroup
                  value={answers[currentQuestionId] || ""}
                  onValueChange={handleSelect}
                  className="max-w-2xl mx-auto grid grid-cols-1 gap-4"
                >
                  {questionData.options.map((option, index) => (
                    <div 
                      key={option}
                      className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-300 hover:border-berlin-orange hover:shadow-md cursor-pointer ${
                        answers[currentQuestionId] === option 
                          ? 'border-berlin-orange bg-berlin-orange/5 shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${currentQuestionId}-${option.replace(/\s/g, '-')}`}
                        className="text-berlin-orange border-berlin-orange" 
                      />
                      <Label 
                        htmlFor={`option-${currentQuestionId}-${option.replace(/\s/g, '-')}`}
                        className="flex-1 cursor-pointer text-lg font-medium text-gray-800"
                      >
                        {option}
                      </Label>
                      {answers[currentQuestionId] === option && (
                        <CheckCircle className="h-6 w-6 text-berlin-orange animate-fade-in-up" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück</span>
              </Button>
              
              <div className="text-sm text-gray-500">
                Alle Angaben werden vertraulich behandelt
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const UserInfo = () => {
  return (
    <QuestionnaireProvider>
      <UserInfoContent />
    </QuestionnaireProvider>
  );
};

export default UserInfo;
