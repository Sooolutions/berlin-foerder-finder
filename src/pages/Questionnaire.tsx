
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

      <main className="flex-grow overflow-x-hidden bg-[var(--md-paper)] md:pt-2">
        <QuestionnaireFeed />
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
