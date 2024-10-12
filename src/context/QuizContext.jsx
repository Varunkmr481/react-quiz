import { createContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

function QuizProvider({ children }) {
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  const initialState = {
    questions: [],
    // 'loading', 'active', 'error', 'ready', 'finished'
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
  };

  const SECS_PER_QUESTION = 30;

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };

      case "dataFailed":
        return { ...state, status: "error" };

      case "start":
        return {
          ...state,
          status: "active",
          secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        };

      case "newAnswer":
        const question = state.questions[state.index];

        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };

      case "nextQuestion":
        return { ...state, index: state.index + 1, answer: null };

      case "finish":
        return {
          ...state,
          status: "finished",
          highScore:
            state.points > state.highScore ? state.points : state.highScore,
        };

      case "restart":
        return {
          ...state,
          status: "ready",
          index: 0,
          answer: null,
          points: 0,
          secondsRemaining: SECS_PER_QUESTION * state.questions.length,
        };

      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? "finished" : state.status,
        };

      default:
        throw new Error("Action is unknown!");
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsRemaining,
  } = state;

  const question = questions[index];
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((curr, question) => {
    return curr + Number(question.points);
  }, 0);

  return (
    <QuizContext.Provider
      value={{
        dispatch,
        questions,
        status,
        secondsRemaining,
        index,
        points,
        answer,
        highScore,
        question,
        numQuestions,
        maxPossiblePoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export { QuizProvider, QuizContext };
