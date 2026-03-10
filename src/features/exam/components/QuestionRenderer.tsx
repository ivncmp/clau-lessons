import { Box } from "@mui/material";
import type { Question } from "../../../types/data";
import type { UserAnswer } from "../../../types/storage";
import ChoiceQuestion from "./questions/ChoiceQuestion";
import TrueFalseQuestion from "./questions/TrueFalseQuestion";
import MatchingQuestion from "./questions/MatchingQuestion";
import WordBankClassifyQuestion from "./questions/WordBankClassifyQuestion";
import WordBankFillQuestion from "./questions/WordBankFillQuestion";
import WordBankOrderQuestion from "./questions/WordBankOrderQuestion";
import MathOperationQuestion from "./questions/MathOperationQuestion";
import NumberSeriesQuestion from "./questions/NumberSeriesQuestion";
import WordSelectionQuestion from "./questions/WordSelectionQuestion";

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
  const imageUrl = question.image?.startsWith("/") ? question.image : undefined;

  const rendered = (() => {
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
      case "math-operation":
        return (
          <MathOperationQuestion
            question={question}
            answer={answer}
            onAnswer={onAnswer}
          />
        );
      case "number-series":
        return (
          <NumberSeriesQuestion
            question={question}
            answer={answer}
            onAnswer={onAnswer}
          />
        );
      case "word-selection":
        return (
          <WordSelectionQuestion
            question={question}
            answer={answer}
            onAnswer={onAnswer}
          />
        );
    }
  })();

  if (!imageUrl) return rendered;

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{
            maxWidth: "100%",
            maxHeight: 300,
            borderRadius: "12px",
            border: "2px solid #E0E0E0",
          }}
        />
      </Box>
      {rendered}
    </Box>
  );
}
