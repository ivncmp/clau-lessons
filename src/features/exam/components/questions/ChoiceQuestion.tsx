import { Box, Stack, Typography } from "@mui/material";
import type { ChoiceQuestion as ChoiceQuestionType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface ChoiceQuestionProps {
  question: ChoiceQuestionType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function ChoiceQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<ChoiceQuestionProps>) {
  const selected = answer?.type === "choice" ? answer.selected : null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" fontWeight={600}>
        {question.emoji} {question.question}
      </Typography>
      <Typography variant="body2" sx={{ color: "#78909C", mb: 0.5 }}>
        Elige la respuesta correcta
      </Typography>
      {question.options.map((option, index) => {
        const isSelected = selected === index;
        return (
          <Box
            key={index}
            onClick={() => onAnswer({ type: "choice", selected: index })}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: "14px 18px",
              borderRadius: "16px",
              border: "2px solid",
              borderColor: isSelected ? "#2E86C1" : "#AED6F1",
              bgcolor: isSelected ? "#2E86C1" : "#D6EAF8",
              color: isSelected ? "white" : "text.primary",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1.05rem",
              transition: "all 0.2s",
              transform: isSelected ? "translateX(4px)" : "none",
              "&:hover": {
                bgcolor: isSelected ? "#2E86C1" : "#AED6F1",
                transform: "translateX(4px)",
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.9rem",
                flexShrink: 0,
                bgcolor: isSelected
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.8)",
                color: isSelected ? "white" : "#2E86C1",
              }}
            >
              {LETTERS[index]}
            </Box>
            {option}
          </Box>
        );
      })}
    </Stack>
  );
}
