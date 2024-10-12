import useQuizContext from "../hooks/useQuizContext";
import Option from "./Option";

function Question() {
  // console.log(question);
  const { question } = useQuizContext();

  return (
    <div>
      <h4>{question.question}</h4>
      <Option />
    </div>
  );
}

export default Question;
