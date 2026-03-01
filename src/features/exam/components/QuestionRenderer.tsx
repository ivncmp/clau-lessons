import type { Question } from "../../../types/data";
import type { UserAnswer } from "../../../types/storage";
import ChoiceQuestion from "./questions/ChoiceQuestion";
import TrueFalseQuestion from "./questions/TrueFalseQuestion";
import MatchingQuestion from "./questions/MatchingQuestion";
import WordBankClassifyQuestion from "./questions/WordBankClassifyQuestion";
import WordBankFillQuestion from "./questions/WordBankFillQuestion";
import WordBankOrderQuestion from "./questions/WordBankOrderQuestion";

interface QuestionRendererProps {
  question: Question;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: Readonly<QuestionRendererProps>) {
  switch (question.type) {
    case "choice":
      return (
        <ChoiceQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "true-false":
      return (
        <TrueFalseQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "matching":
      return (
        <MatchingQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "word-bank-classify":
      return (
        <WordBankClassifyQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "word-bank-fill":
      return (
        <WordBankFillQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "word-bank-order":
      return (
        <WordBankOrderQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
  }
}
