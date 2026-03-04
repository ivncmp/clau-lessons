import { useState, useRef, useCallback } from "react";
import { Box, Stack, Typography } from "@mui/material";
import type { MathOperationQuestion as MathOperationQuestionType } from "../../../../types/data";
import type { UserAnswer } from "../../../../types/storage";

interface MathOperationQuestionProps {
  question: MathOperationQuestionType;
  answer: UserAnswer | undefined;
  onAnswer: (answer: UserAnswer) => void;
}

const DIGIT_SIZE = 44;
const FONT_SIZE = "1.75rem";
const FONT_FAMILY = "'Courier New', Courier, monospace";

export default function MathOperationQuestion({
  question,
  answer,
  onAnswer,
}: Readonly<MathOperationQuestionProps>) {
  const [a, b] = question.operands;
  const answerLen = String(question.answer).length;
  const maxDigits = Math.max(String(a).length, String(b).length, answerLen);

  const [digits, setDigits] = useState<string[]>(() => {
    if (answer?.type === "math-operation" && answer.value !== null) {
      const chars = String(answer.value).split("");
      const d = Array(maxDigits).fill("");
      for (let i = 0; i < chars.length; i++) {
        d[maxDigits - chars.length + i] = chars[i];
      }
      return d;
    }
    return Array(maxDigits).fill("");
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const programmaticFocus = useRef(false);

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  function getActiveIndex(d: string[]): number {
    for (let i = maxDigits - 1; i >= 0; i--) {
      if (d[i] === "") return i;
    }
    return 0;
  }

  function isDigitEnabled(index: number, d: string[]): boolean {
    for (let i = index + 1; i < maxDigits; i++) {
      if (d[i] === "") return false;
    }
    return true;
  }

  function focusProgrammatic(i: number) {
    programmaticFocus.current = true;
    inputRefs.current[i]?.focus();
  }

  function computeValue(d: string[]): number | null {
    const joined = d.join("");
    return joined === "" ? null : Number(joined);
  }

  function handleDigitChange(index: number, raw: string) {
    const char = raw.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    onAnswer({ type: "math-operation", value: computeValue(newDigits) });

    if (char) {
      const next = getActiveIndex(newDigits);
      if (next < index) {
        focusProgrammatic(next);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (digits[index] === "") {
        if (index < maxDigits - 1) {
          focusProgrammatic(index + 1);
        }
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        for (let i = 0; i < index; i++) newDigits[i] = "";
        setDigits(newDigits);
        onAnswer({ type: "math-operation", value: computeValue(newDigits) });
      }
      e.preventDefault();
    } else if (
      e.key === "ArrowLeft" &&
      index > 0 &&
      isDigitEnabled(index - 1, digits)
    ) {
      focusProgrammatic(index - 1);
    } else if (e.key === "ArrowRight" && index < maxDigits - 1) {
      focusProgrammatic(index + 1);
    }
  }

  function handleFocus(index: number) {
    if (programmaticFocus.current) {
      programmaticFocus.current = false;
      return;
    }
    if (!isDigitEnabled(index, digits)) {
      const active = getActiveIndex(digits);
      focusProgrammatic(active);
    }
  }

  // Pad operand digits right-aligned
  const aDigits = String(a).padStart(maxDigits, " ").split("");
  const bDigits = String(b).padStart(maxDigits, " ").split("");

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h6" fontWeight={600} alignSelf="flex-start">
        {question.emoji} {question.question}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#78909C", alignSelf: "flex-start" }}
      >
        Escribe el resultado cifra a cifra
      </Typography>

      {/* Vertical operation card */}
      <Box
        sx={{
          bgcolor: "#FFFDE7",
          border: "2px solid #FFD54F",
          borderRadius: "16px",
          p: 3,
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 0.5,
        }}
      >
        {/* First operand row */}
        <Box sx={{ display: "flex", gap: "4px", pl: `${DIGIT_SIZE + 8}px` }}>
          {aDigits.map((d, i) => (
            <DigitCell key={`a-${i}`} value={d} />
          ))}
        </Box>

        {/* Operator + second operand row */}
        <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <Box
            sx={{
              width: DIGIT_SIZE,
              textAlign: "center",
              fontFamily: FONT_FAMILY,
              fontSize: FONT_SIZE,
              fontWeight: 700,
              color: "#E65100",
            }}
          >
            {question.operator}
          </Box>
          {bDigits.map((d, i) => (
            <DigitCell key={`b-${i}`} value={d} />
          ))}
        </Box>

        {/* Separator line */}
        <Box
          sx={{
            width: "100%",
            height: 3,
            bgcolor: "#333",
            borderRadius: 1,
            my: 0.5,
          }}
        />

        {/* Answer digit inputs */}
        <Box sx={{ display: "flex", gap: "4px", pl: `${DIGIT_SIZE + 8}px` }}>
          {digits.map((d, i) => {
            const enabled = isDigitEnabled(i, digits);
            return (
              <Box
                key={`ans-${i}`}
                component="input"
                ref={setRef(i)}
                value={d}
                inputMode="numeric"
                readOnly={!enabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleDigitChange(i, e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(i, e)
                }
                onFocus={() => handleFocus(i)}
                sx={{
                  width: DIGIT_SIZE,
                  height: DIGIT_SIZE,
                  textAlign: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: FONT_SIZE,
                  fontWeight: 700,
                  border: enabled ? "2px solid #AED6F1" : "2px solid #E0E0E0",
                  borderRadius: "8px",
                  bgcolor: enabled ? "#EBF5FB" : "#F5F5F5",
                  color: "#1A5276",
                  outline: "none",
                  caretColor: "transparent",
                  cursor: enabled ? "text" : "pointer",
                  "&:focus": enabled
                    ? {
                        borderColor: "#2E86C1",
                        bgcolor: "#D6EAF8",
                        boxShadow: "0 0 0 3px rgba(46,134,193,0.2)",
                      }
                    : {},
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
}

function DigitCell({ value }: Readonly<{ value: string }>) {
  return (
    <Box
      sx={{
        width: DIGIT_SIZE,
        height: DIGIT_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE,
        fontWeight: 700,
      }}
    >
      {value === " " ? "" : value}
    </Box>
  );
}
