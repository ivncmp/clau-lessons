import { Box, Stack, Typography } from "@mui/material";
import type { TrueFalseQuestion as TrueFalseQuestionType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function TrueFalseQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<TrueFalseQuestionProps>) {
  const selected = answer?.type === "true-false" ? answer.selected : null;

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        {question.emoji} {question.question}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        {([true, false] as const).map((value) => {
          const isSelected = selected === value;
          const isTrue = value === true;
          return (
            <Box
              key={String(value)}
              onClick={() => onAnswer({ type: "true-false", selected: value })}
              sx={{
                flex: 1,
                maxWidth: 180,
                py: 2.5,
                px: 2,
                borderRadius: "18px",
                border: "3px solid",
                borderColor: isSelected
                  ? isTrue
                    ? "#43A047"
                    : "#D32F2F"
                  : "#B3E5FC",
                bgcolor: isSelected
                  ? isTrue
                    ? "#66BB6A"
                    : "#EF5350"
                  : "#E3F2FD",
                color: isSelected ? "white" : "text.primary",
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "1.2rem",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  borderColor: isTrue ? "#66BB6A" : "#EF5350",
                },
              }}
            >
              {isTrue ? "Verdadero" : "Falso"}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
