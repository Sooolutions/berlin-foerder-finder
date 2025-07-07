
import DynamicQuestionnaireForm from "@/components/DynamicQuestionnaireForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import { useEffect } from "react";

const Questionnaire = () => {
  const { resetQuestionnaire } = useQuestionnaire();
  
  // Reset questionnaire when component mounts to ensure fresh start
  useEffect(() => {
    resetQuestionnaire();
  }, [resetQuestionnaire]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-berlin-blue/5 via-white to-berlin-orange/5 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <DynamicQuestionnaireForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Questionnaire;
