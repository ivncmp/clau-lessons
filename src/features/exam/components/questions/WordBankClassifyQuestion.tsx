import { useState, useMemo } from "react";
import { Stack, Typography, Chip, Box } from "@mui/material";
import type { WordBankClassifyQuestion as WordBankClassifyType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";
import { shuffle } from "../../../../utils/shuffle";

interface WordBankClassifyQuestionProps {
  question: WordBankClassifyType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

export default function WordBankClassifyQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<WordBankClassifyQuestionProps>) {
  const placements =
    answer?.type === "word-bank-classify" ? answer.placements : {};
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const shuffledWords = useMemo(() => shuffle(question.words), [question]);

  const placedWords = new Set(Object.values(placements).flat());

  const handleWordClick = (word: string) => {
    if (activeSlot === null) return;

    const current = placements[activeSlot] ?? [];
    const newPlacements = {
      ...placements,
      [activeSlot]: [...current, word],
    };
    onAnswer({ type: "word-bank-classify", placements: newPlacements });
  };

  const handleRemoveWord = (slotIndex: number, word: string) => {
    const current = placements[slotIndex] ?? [];
    const newPlacements = {
      ...placements,
      [slotIndex]: current.filter((w) => w !== word),
    };
    onAnswer({ type: "word-bank-classify", placements: newPlacements });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        {question.emoji} {question.question}
      </Typography>

      {/* Word bank */}
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          border: "2px solid #E0E0E0",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#78909C", mb: 1, display: "block", fontWeight: 500 }}
        >
          Pulsa una categoría y luego una palabra
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {shuffledWords.map((word) => {
            const placed = placedWords.has(word);
            return (
              <Box
                key={word}
                onClick={placed ? undefined : () => handleWordClick(word)}
                sx={{
                  bgcolor: placed ? "#F5F5F5" : "#FFF9C4",
                  border: "2px solid",
                  borderColor: placed ? "#E0E0E0" : "#FDD835",
                  borderRadius: "14px",
                  px: 2,
                  py: 0.8,
                  color: placed ? "#BDBDBD" : "#F57F17",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: placed ? "default" : "pointer",
                  opacity: placed ? 0.35 : 1,
                  transition: "all 0.2s",
                  pointerEvents: placed ? "none" : "auto",
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
      </Box>

      {/* Slots */}
      {question.slots.map((slot, index) => {
        const isActive = activeSlot === index;
        return (
          <Box
            key={index}
            onClick={() => setActiveSlot(index)}
            sx={{
              p: 2,
              borderRadius: "16px",
              border: isActive ? "3px solid #0288D1" : "2px solid #B3E5FC",
              bgcolor: isActive ? "#E3F2FD" : "#F5FBFF",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#0288D1" },
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 1, color: isActive ? "#0277BD" : "#546E7A" }}
            >
              {slot.label}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                minHeight: 36,
              }}
            >
              {(placements[index] ?? []).map((word) => (
                <Chip
                  key={word}
                  label={word}
                  size="small"
                  onDelete={() => handleRemoveWord(index, word)}
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    bgcolor: "#C8E6C9",
                    color: "#2E7D32",
                    "& .MuiChip-deleteIcon": {
                      color: "#558B2F",
                      "&:hover": { color: "#D32F2F" },
                    },
                  }}
                />
              ))}
              {(placements[index] ?? []).length === 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: "#B0BEC5", fontStyle: "italic" }}
                >
                  {isActive
                    ? "Ahora pulsa una palabra..."
                    : "Pulsa aquí para seleccionar"}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
