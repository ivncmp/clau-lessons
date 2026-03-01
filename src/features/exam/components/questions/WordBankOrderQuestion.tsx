import { useMemo } from "react";
import { Stack, Typography, Box } from "@mui/material";
import type { WordBankOrderQuestion as WordBankOrderType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";
import { shuffle } from "../../../../utils/shuffle";

interface WordBankOrderQuestionProps {
  question: WordBankOrderType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function WordBankOrderQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<WordBankOrderQuestionProps>) {
  const arranged = answer?.type === "word-bank-order" ? answer.arranged : "";
  const selectedWords = arranged ? arranged.split("") : [];

  const shuffledWords = useMemo(() => shuffle(question.words), [question]);

  const handleWordClick = (word: string) => {
    const newArranged = arranged + word;
    onAnswer({ type: "word-bank-order", arranged: newArranged });
  };

  const handleRemoveLast = () => {
    const newArranged = arranged.slice(0, -1);
    onAnswer({ type: "word-bank-order", arranged: newArranged });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        {question.emoji} {question.question}
      </Typography>

      <Box
        onClick={arranged ? handleRemoveLast : undefined}
        sx={{
          p: 2.5,
          minHeight: 56,
          bgcolor: arranged ? "#C8E6C9" : "white",
          border: "2px solid",
          borderColor: arranged ? "#43A047" : "#E0E0E0",
          borderRadius: "16px",
          cursor: arranged ? "pointer" : "default",
          transition: "all 0.2s",
          "&:hover": arranged
            ? { bgcolor: "#A5D6A7", borderColor: "#2E7D32" }
            : {},
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 600,
            letterSpacing: 2,
            color: arranged ? "#1B5E20" : "#BDBDBD",
          }}
        >
          {arranged || "Pulsa las piezas en orden..."}
        </Typography>
        {arranged && (
          <Typography
            variant="caption"
            sx={{ color: "#558B2F", mt: 0.5, display: "block" }}
          >
            Pulsa para borrar la última pieza
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {shuffledWords.map((word, index) => {
          const usedCount = selectedWords.filter((w) => w === word).length;
          const availableCount = question.words.filter(
            (w) => w === word,
          ).length;
          const disabled = usedCount >= availableCount;

          return (
            <Box
              key={`${word}-${index}`}
              onClick={disabled ? undefined : () => handleWordClick(word)}
              sx={{
                bgcolor: disabled ? "#F5F5F5" : "#FFF9C4",
                border: "2px solid",
                borderColor: disabled ? "#E0E0E0" : "#FDD835",
                borderRadius: "14px",
                px: 2,
                py: 1,
                color: disabled ? "#BDBDBD" : "#F57F17",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: disabled ? "default" : "pointer",
                opacity: disabled ? 0.35 : 1,
                transition: "all 0.2s",
                pointerEvents: disabled ? "none" : "auto",
                "&:hover": {
                  bgcolor: "#FFF176",
                  transform: "scale(1.05)",
                },
              }}
            >
              {word}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
