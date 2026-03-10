import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import type { WordSelectionQuestion as WordSelectionQuestionType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";

interface WordSelectionQuestionProps {
  question: WordSelectionQuestionType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function WordSelectionQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<WordSelectionQuestionProps>) {
  const [selected, setSelected] = useState<number[][]>(() => {
    if (answer?.type === "word-selection")
      return answer.selected.map((s) => [...s]);
    return question.sentences.map(() => []);
  });

  function toggleWord(sentenceIdx: number, wordIdx: number) {
    const newSelected = selected.map((s) => [...s]);
    const sentence = newSelected[sentenceIdx];
    const pos = sentence.indexOf(wordIdx);
    if (pos >= 0) {
      sentence.splice(pos, 1);
    } else {
      sentence.push(wordIdx);
    }
    newSelected[sentenceIdx] = sentence;
    setSelected(newSelected);
    onAnswer({ type: "word-selection", selected: newSelected });
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {question.emoji} {question.question}
      </Typography>
      <Typography variant="body2" sx={{ color: "#78909C" }}>
        Pulsa las palabras correctas en cada frase
      </Typography>

      <Stack spacing={1.5}>
        {question.sentences.map((sentence, sIdx) => {
          const words = sentence.split(" ");
          return (
            <Box
              key={sIdx}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                alignItems: "center",
                p: 1.5,
                bgcolor: "#FAFAFA",
                borderRadius: "12px",
                border: "1px solid #E0E0E0",
              }}
            >
              {words.map((word, wIdx) => {
                const isSelected = selected[sIdx]?.includes(wIdx);
                return (
                  <Box
                    key={wIdx}
                    component="button"
                    onClick={() => toggleWord(sIdx, wIdx)}
                    sx={{
                      all: "unset",
                      cursor: "pointer",
                      px: 0.8,
                      py: 0.3,
                      borderRadius: "6px",
                      fontSize: "1.1rem",
                      fontWeight: isSelected ? 700 : 400,
                      color: isSelected ? "#1565C0" : "#333",
                      bgcolor: isSelected ? "#BBDEFB" : "transparent",
                      border: isSelected
                        ? "2px solid #42A5F5"
                        : "2px solid transparent",
                      transition: "all 0.15s ease",
                      userSelect: "none",
                      WebkitTapHighlightColor: "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "#90CAF9" : "#E3F2FD",
                      },
                    }}
                  >
                    {word}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
