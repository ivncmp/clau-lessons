import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { NumberSeriesQuestion as NumberSeriesQuestionType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";

interface NumberSeriesQuestionProps {
  question: NumberSeriesQuestionType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

const CELL_SIZE = 52;
const FONT_FAMILY = "'Courier New', Courier, monospace";

export default function NumberSeriesQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<NumberSeriesQuestionProps>) {
  const blankIndices = question.series
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i >= 0);

  const [values, setValues] = useState<(number | null)[]>(() => {
    if (answer?.type === "number-series") return [...answer.values];
    return Array(blankIndices.length).fill(null);
  });

  function handleChange(blankIdx: number, raw: string) {
    const num = raw === "" ? null : Number(raw.replace(/[^0-9]/g, ""));
    const newValues = [...values];
    newValues[blankIdx] = num;
    setValues(newValues);
    onAnswer({ type: "number-series", values: newValues });
  }

  let blankCounter = 0;

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {question.emoji} {question.question}
      </Typography>
      <Typography variant="body2" sx={{ color: "#78909C", mb: 0.5 }}>
        Completa los huecos de la serie
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {question.series.map((val, i) => {
          const cell =
            val !== null ? (
              <Box
                key={`s-${i}`}
                sx={{
                  minWidth: CELL_SIZE,
                  height: CELL_SIZE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#E8F5E9",
                  border: "2px solid #A5D6A7",
                  borderRadius: "10px",
                  fontFamily: FONT_FAMILY,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  px: 1,
                }}
              >
                {val}
              </Box>
            ) : (
              (() => {
                const bIdx = blankCounter;
                blankCounter++;
                const currentVal = values[bIdx];
                return (
                  <Box
                    key={`s-${i}`}
                    component="input"
                    inputMode="numeric"
                    value={
                      currentVal !== null && currentVal !== undefined
                        ? String(currentVal)
                        : ""
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(bIdx, e.target.value)
                    }
                    sx={{
                      minWidth: CELL_SIZE,
                      width: CELL_SIZE + 16,
                      height: CELL_SIZE,
                      textAlign: "center",
                      fontFamily: FONT_FAMILY,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      border: "2px solid #AED6F1",
                      borderRadius: "10px",
                      bgcolor: "#EBF5FB",
                      color: "#1A5276",
                      outline: "none",
                      px: 0.5,
                      "&:focus": {
                        borderColor: "#2E86C1",
                        bgcolor: "#D6EAF8",
                        boxShadow: "0 0 0 3px rgba(46,134,193,0.2)",
                      },
                    }}
                  />
                );
              })()
            );

          // Show operation arrow between items
          const op = question.operations?.[i];
          const arrow =
            i < question.series.length - 1 && op ? (
              <Box
                key={`op-${i}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mx: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: op.startsWith("+") ? "#2E7D32" : "#C62828",
                    lineHeight: 1,
                    mb: -0.3,
                  }}
                >
                  {op}
                </Typography>
                <ArrowForwardIcon sx={{ fontSize: 18, color: "#90A4AE" }} />
              </Box>
            ) : null;

          return (
            <Box
              key={`pair-${i}`}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {cell}
              {arrow}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
