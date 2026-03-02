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
      <Typography variant="h6" fontWeight={600}>
        {question.emoji} {question.question}
      </Typography>
      <Typography variant="body2" sx={{ color: "#78909C" }}>
        Elige si la frase es verdadera o falsa
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-start">
        {([true, false] as const).map((value) => {
          const isSelected = selected === value;
          const isTrue = value === true;
          return (
            <Box
              key={String(value)}
              onClick={() => onAnswer({ type: "true-false", selected: value })}
              sx={{
                flex: 1,
                maxWidth: 200,
                py: 2,
                px: 2,
                borderRadius: "20px",
                border: "3px solid",
                borderColor: isSelected
                  ? isTrue
                    ? "#43A047"
                    : "#D32F2F"
                  : isTrue
                    ? "#A5D6A7"
                    : "#EF9A9A",
                bgcolor: isSelected
                  ? isTrue
                    ? "#66BB6A"
                    : "#EF5350"
                  : isTrue
                    ? "#E8F5E9"
                    : "#FFEBEE",
                color: isSelected ? "white" : "text.primary",
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "1.1rem",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  transform: "scale(1.05)",
                  borderColor: isTrue ? "#66BB6A" : "#EF5350",
                },
              }}
            >
              <Typography sx={{ fontSize: "2rem", lineHeight: 1 }}>
                {isTrue ? "👍" : "👎"}
              </Typography>
              {isTrue ? "Verdadero" : "Falso"}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
