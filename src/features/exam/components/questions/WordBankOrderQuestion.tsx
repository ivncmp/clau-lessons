import { useMemo } from "react";
import { Stack, Typography, Box, Chip } from "@mui/material";
import type { WordBankOrderQuestion as WordBankOrderType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";
import { shuffle } from "../../../../utils/shuffle";

interface WordBankOrderQuestionProps {
  question: WordBankOrderType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

function splitIntoPieces(
  arranged: string,
  separator: string,
  words: string[],
): string[] {
  if (!arranged) return [];
  if (separator) return arranged.split(separator);
  // For empty separator (syllables), greedily match against word list
  const pieces: string[] = [];
  let remaining = arranged;
  const sorted = [...words].sort((a, b) => b.length - a.length);
  while (remaining.length > 0) {
    const match = sorted.find((w) => remaining.startsWith(w));
    if (!match) break;
    pieces.push(match);
    remaining = remaining.slice(match.length);
  }
  return pieces;
}

export default function WordBankOrderQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<WordBankOrderQuestionProps>) {
  const sep = question.separator ?? " ";
  const arranged = answer?.type === "word-bank-order" ? answer.arranged : "";
  const pieces = splitIntoPieces(arranged, sep, question.words);

  const shuffledWords = useMemo(() => shuffle(question.words), [question]);

  const handleWordClick = (word: string) => {
    const newArranged = arranged ? arranged + sep + word : word;
    onAnswer({ type: "word-bank-order", arranged: newArranged });
  };

  const handleRemoveLast = () => {
    if (pieces.length === 0) return;
    const newPieces = pieces.slice(0, -1);
    onAnswer({ type: "word-bank-order", arranged: newPieces.join(sep) });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {question.emoji} {question.question}
      </Typography>
      <Typography variant="body2" sx={{ color: "#78909C" }}>
        Pulsa las piezas en el orden correcto
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
        {pieces.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {pieces.map((piece, i) => (
              <Chip
                key={`${piece}-${i}`}
                label={piece}
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  bgcolor: "#66BB6A",
                  color: "white",
                  height: 36,
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: "#BDBDBD", fontSize: "1.1rem" }}>
            Pulsa las piezas en orden...
          </Typography>
        )}
        {arranged && (
          <Typography
            variant="caption"
            sx={{ color: "#558B2F", mt: 0.5, display: "block" }}
          >
            Pulsa para quitar la última pieza
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {shuffledWords.map((word, index) => {
          const usedCount = pieces.filter((w) => w === word).length;
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
