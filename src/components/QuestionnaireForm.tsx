
import { useNavigate } from "react-router-dom";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";
import DynamicQuestionnaireForm from "./DynamicQuestionnaireForm";

const QuestionnaireForm = () => {
  return (
    <QuestionnaireProvider>
      <DynamicQuestionnaireForm />
    </QuestionnaireProvider>
  );
};

export default QuestionnaireForm;
