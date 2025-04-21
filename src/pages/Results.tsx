
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResultsList from "@/components/ResultsList";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";

const Results = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <QuestionnaireProvider>
          <ResultsList />
        </QuestionnaireProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
