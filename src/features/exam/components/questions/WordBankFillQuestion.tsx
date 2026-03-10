import { useMemo, useState, type DragEvent } from "react";
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
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const shuffledBank = useMemo(() => shuffle(question.wordBank), [question]);

  // Count how many times each word has been used
  const usedCounts = new Map<string, number>();
  for (const w of words) {
    if (w) usedCounts.set(w, (usedCounts.get(w) ?? 0) + 1);
  }

  // Count how many times each word appears in the bank
  const bankCounts = new Map<string, number>();
  for (const w of question.wordBank) {
    bankCounts.set(w, (bankCounts.get(w) ?? 0) + 1);
  }

  // Track which bank index is disabled (used up its quota)
  const bankUsedSoFar = new Map<string, number>();

  const placeWord = (word: string, targetIndex: number) => {
    if (targetIndex >= question.blanks.length) return;
    const newWords = [...words];
    while (newWords.length <= targetIndex) newWords.push(null);
    newWords[targetIndex] = word;
    onAnswer({ type: "word-bank-fill", words: newWords });
  };

  const handleWordClick = (word: string) => {
    const firstEmpty = words.findIndex((w) => w === null);
    const targetIndex = firstEmpty >= 0 ? firstEmpty : words.length;
    placeWord(word, targetIndex);
  };

  const handleBlankClick = (index: number) => {
    const newWords = [...words];
    newWords[index] = null;
    onAnswer({ type: "word-bank-fill", words: newWords });
  };

  const handleDragStart = (e: DragEvent, word: string) => {
    e.dataTransfer.setData("text/plain", word);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const word = e.dataTransfer.getData("text/plain");
    if (!word) return;
    placeWord(word, index);
  };

  // Build segments: split by tab first (word groups), then by blanks within each
  const blankPlaceholder = "_____";
  const wordGroups = question.sentence.split("\t");

  // Assign blank indices globally across all groups
  let blankIdx = 0;
  const groups = wordGroups.map((group) => {
    const fragments = group.split(blankPlaceholder);
    const groupBlanks: number[] = [];
    for (let f = 0; f < fragments.length - 1; f++) {
      groupBlanks.push(blankIdx++);
    }
    return { fragments, blanks: groupBlanks };
  });

  function renderBlank(idx: number, inline = true) {
    return (
      <Box
        key={`blank-${idx}`}
        component={inline ? "span" : "div"}
        onClick={() => handleBlankClick(idx)}
        onDragOver={(e: DragEvent) => handleDragOver(e, idx)}
        onDragLeave={handleDragLeave}
        onDrop={(e: DragEvent) => handleDrop(e, idx)}
        sx={{
          display: inline ? "inline-block" : "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: inline ? 80 : 100,
          mx: inline ? 0.5 : 0,
          px: 1.5,
          py: inline ? 0.3 : 1,
          verticalAlign: inline ? "bottom" : undefined,
          cursor: "pointer",
          fontWeight: 700,
          fontSize: inline ? undefined : "1rem",
          color: words[idx] ? "#2E7D32" : "#9E9E9E",
          borderBottom: inline
            ? dragOverIndex === idx
              ? "3px solid #2E86C1"
              : words[idx]
                ? "3px solid #43A047"
                : "3px dashed #66BB6A"
            : undefined,
          border: inline
            ? undefined
            : dragOverIndex === idx
              ? "3px solid #2E86C1"
              : words[idx]
                ? "3px solid #43A047"
                : "3px dashed #66BB6A",
          bgcolor:
            dragOverIndex === idx
              ? "#D6EAF8"
              : words[idx]
                ? "#C8E6C9"
                : "transparent",
          borderRadius: inline
            ? words[idx] || dragOverIndex === idx
              ? "8px"
              : 0
            : "12px",
          transition: "all 0.2s",
          textAlign: "center",
          "&:hover": { bgcolor: "#E8F5E9" },
        }}
      >
        {words[idx] ?? "___"}
      </Box>
    );
  }

  const compassLayout =
    question.layout === "compass" && question.blanks.length === 4;

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {question.emoji} {question.question}
      </Typography>
      <Typography variant="body2" sx={{ color: "#78909C" }}>
        Pulsa o arrastra una palabra para rellenar cada hueco
      </Typography>

      {compassLayout ? (
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            border: "2px solid #E0E0E0",
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gridTemplateRows: "auto auto auto",
              justifyItems: "center",
              alignItems: "center",
              gap: 1.5,
              maxWidth: 320,
              mx: "auto",
            }}
          >
            <Box />
            {renderBlank(0, false)}
            <Box />
            {renderBlank(3, false)}
            <Typography
              sx={{
                fontSize: "3.5rem",
                lineHeight: 1,
                transform: "rotate(-45deg)",
                mx: 2,
                my: 1,
              }}
            >
              🧭
            </Typography>
            {renderBlank(1, false)}
            <Box />
            {renderBlank(2, false)}
            <Box />
          </Box>
        </Box>
      ) : (
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
            {groups.map((group, gi) => (
              <span key={gi}>
                <span
                  style={
                    groups.length > 1 ? { whiteSpace: "nowrap" } : undefined
                  }
                >
                  {group.fragments.map((frag, fi) => (
                    <span key={fi}>
                      {frag}
                      {fi < group.blanks.length &&
                        renderBlank(group.blanks[fi])}
                    </span>
                  ))}
                </span>
                {gi < groups.length - 1 && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 1,
                      height: 24,
                      backgroundColor: "#BDBDBD",
                      margin: "0 14px",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </span>
            ))}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {shuffledBank.map((word, index) => {
          const seenSoFar = (bankUsedSoFar.get(word) ?? 0) + 1;
          bankUsedSoFar.set(word, seenSoFar);
          const used = seenSoFar <= (usedCounts.get(word) ?? 0);
          return (
            <Box
              key={`${word}-${index}`}
              draggable={!used}
              onClick={used ? undefined : () => handleWordClick(word)}
              onDragStart={
                used ? undefined : (e: DragEvent) => handleDragStart(e, word)
              }
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
                cursor: used ? "default" : "grab",
                opacity: used ? 0.35 : 1,
                transition: "all 0.2s",
                pointerEvents: used ? "none" : "auto",
                userSelect: "none",
                "&:hover": {
                  bgcolor: "#FFF176",
                  transform: "scale(1.05)",
                },
                "&:active": {
                  cursor: "grabbing",
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
