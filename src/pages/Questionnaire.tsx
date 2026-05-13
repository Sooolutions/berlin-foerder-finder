
import DynamicQuestionnaireForm from "@/components/DynamicQuestionnaireForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { useEffect, useRef } from "react";

const Questionnaire = () => {
  const { resetQuestionnaire } = useQuestionnaire();
  const hasReset = useRef(false);
  
  // Reset questionnaire only once when component mounts
  useEffect(() => {
    if (!hasReset.current) {
      resetQuestionnaire();
      hasReset.current = true;
    }
  }, []); // Empty dependency array - only run once

  return (
    <div className="min-h-screen flex flex-col">
      <Header backToHome />
      
      <main className="flex-grow bg-gradient-to-br from-berlin-blue/5 via-white to-berlin-orange/5 py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center">
          <div className="w-full">
            <DynamicQuestionnaireForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Questionnaire;
