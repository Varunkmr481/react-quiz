import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

function useQuizContext() {
  const context = useContext(QuizContext);

  if (context === undefined) {
    throw new Error(
      "The QuizContext has been used outside the scope of QuizProvider"
    );
  }

  return context;
}

export default useQuizContext;
