import { useMemo } from "react";
import { Stack, Typography, Box } from "@mui/material";
import type { WordBankFillQuestion as WordBankFillType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";
import { shuffle } from "../../../../utils/shuffle";

interface WordBankFillQuestionProps {
  question: WordBankFillType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function WordBankFillQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<WordBankFillQuestionProps>) {
  const words = answer?.type === "word-bank-fill" ? answer.words : [];

  const shuffledBank = useMemo(() => shuffle(question.wordBank), [question]);

  const usedWords = new Set(words.filter(Boolean) as string[]);

  const handleWordClick = (word: string) => {
    const firstEmpty = words.findIndex((w) => w === null);
    const targetIndex = firstEmpty >= 0 ? firstEmpty : words.length;
    if (targetIndex >= question.blanks.length) return;

    const newWords = [...words];
    while (newWords.length <= targetIndex) newWords.push(null);
    newWords[targetIndex] = word;
    onAnswer({ type: "word-bank-fill", words: newWords });
  };

  const handleBlankClick = (index: number) => {
    const newWords = [...words];
    newWords[index] = null;
    onAnswer({ type: "word-bank-fill", words: newWords });
  };

  const parts = question.sentence.split("_____");

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        {question.emoji} {question.question}
      </Typography>

      <Box
        sx={{
          p: 2.5,
          bgcolor: "white",
          border: "2px solid #E0E0E0",
          borderRadius: "16px",
        }}
      >
        <Typography
          component="div"
          sx={{ fontSize: "1.05rem", lineHeight: 2.4 }}
        >
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <Box
                  component="span"
                  onClick={() => handleBlankClick(i)}
                  sx={{
                    display: "inline-block",
                    minWidth: 80,
                    mx: 0.5,
                    px: 1,
                    py: 0.3,
                    verticalAlign: "bottom",
                    cursor: "pointer",
                    fontWeight: 700,
                    color: words[i] ? "#2E7D32" : "#9E9E9E",
                    borderBottom: words[i]
                      ? "3px solid #43A047"
                      : "3px dashed #66BB6A",
                    bgcolor: words[i] ? "#C8E6C9" : "transparent",
                    borderRadius: words[i] ? "8px" : 0,
                    transition: "all 0.2s",
                    textAlign: "center",
                    "&:hover": { bgcolor: "#E8F5E9" },
                  }}
                >
                  {words[i] ?? "___"}
                </Box>
              )}
            </span>
          ))}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {shuffledBank.map((word) => {
          const used = usedWords.has(word);
          return (
            <Box
              key={word}
              onClick={used ? undefined : () => handleWordClick(word)}
              sx={{
                bgcolor: used ? "#F5F5F5" : "#FFF9C4",
                border: "2px solid",
                borderColor: used ? "#E0E0E0" : "#FDD835",
                borderRadius: "14px",
                px: 2,
                py: 1,
                color: used ? "#BDBDBD" : "#F57F17",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: used ? "default" : "pointer",
                opacity: used ? 0.35 : 1,
                transition: "all 0.2s",
                pointerEvents: used ? "none" : "auto",
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
