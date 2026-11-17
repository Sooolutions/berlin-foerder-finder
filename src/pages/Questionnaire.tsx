
import QuestionnaireFeed from "@/components/questionnaire/QuestionnaireFeed";
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
      {/* Auf dem Handy übernimmt die Fortschrittsleiste des Feeds das Schließen */}
      <div className="hidden md:block">
        <Header backToHome sticky={false} />
      </div>

      <main className="flex-grow bg-[var(--md-paper)] pb-4 md:pt-4">
        <div className="max-w-4xl mx-auto px-4">
          <QuestionnaireFeed />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
