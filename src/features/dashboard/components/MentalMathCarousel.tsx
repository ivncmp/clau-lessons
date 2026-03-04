import { useState, useMemo, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { MathOperationQuestion } from "../../../types/data";
import { recordMentalMathRound } from "../../../utils/storage";
import { useAuth } from "../../auth/hooks/useAuth";

const NUM_OPS = 4;

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOperations(): MathOperationQuestion[] {
  return Array.from({ length: NUM_OPS }, (_, i) => {
    const isSum = Math.random() < 0.5;
    if (isSum) {
      const a = randInt(10, 999);
      const b = randInt(10, 999);
      return {
        id: `mental-${i}`,
        emoji: "🧮",
        question: "Calcula",
        type: "math-operation" as const,
        operands: [a, b] as [number, number],
        operator: "+" as const,
        answer: a + b,
      };
    } else {
      const a = randInt(10, 999);
      const b = randInt(10, a);
      return {
        id: `mental-${i}`,
        emoji: "🧮",
        question: "Calcula",
        type: "math-operation" as const,
        operands: [a, b] as [number, number],
        operator: "-" as const,
        answer: a - b,
      };
    }
  });
}

interface MentalMathCarouselProps {
  onComplete?: () => void;
}

export default function MentalMathCarousel({
  onComplete,
}: Readonly<MentalMathCarouselProps>) {
  const { user } = useAuth();
  const [seed, setSeed] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [checked, setChecked] = useState(false);

  const operations = useMemo(() => generateOperations(), [seed]);

  const correct = checked
    ? operations.filter((op, i) => answers[i] === op.answer).length
    : 0;

  const handleAnswer = (idx: number, value: number | null) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleCheck = () => {
    setChecked(true);
    if (user) {
      const c = operations.filter((op, i) => answers[i] === op.answer).length;
      recordMentalMathRound(user.id, c, NUM_OPS);
      onComplete?.();
    }
  };

  const handleNext = () => {
    setSeed((s) => s + 1);
    setAnswers({});
    setChecked(false);
  };

  const allAnswered = operations.every(
    (_, i) => answers[i] !== undefined && answers[i] !== null,
  );

  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.93)",
        borderRadius: { xs: "16px", sm: "24px" },
        p: { xs: 2, sm: 3 },
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: 1.5, sm: 2 },
          mb: 2,
        }}
      >
        {operations.map((op, i) => {
          const userAnswer = answers[i] ?? null;
          const isCorrect = checked && userAnswer === op.answer;

          return (
            <Box key={`${seed}-${op.id}`} sx={{ position: "relative" }}>
              <MiniOperation
                question={op}
                value={userAnswer}
                onChange={(v) => handleAnswer(i, v)}
                disabled={checked}
              />
              {checked && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  {isCorrect ? (
                    <CheckCircleIcon sx={{ color: "#66BB6A", fontSize: 20 }} />
                  ) : (
                    <>
                      <CancelIcon sx={{ color: "#EF5350", fontSize: 20 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "#EF5350", fontWeight: 700 }}
                      >
                        = {op.answer}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Action button */}
      {!checked ? (
        <Box
          component="button"
          type="button"
          onClick={handleCheck}
          disabled={!allAnswered}
          sx={{
            width: "100%",
            p: 1.2,
            border: "none",
            borderRadius: "14px",
            background: allAnswered
              ? "linear-gradient(135deg, #5DADE2, #2E86C1)"
              : "#E0E0E0",
            color: allAnswered ? "white" : "#9E9E9E",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: allAnswered ? "pointer" : "default",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            "&:hover": allAnswered
              ? {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 14px rgba(46,134,193,0.3)",
                }
              : {},
          }}
        >
          Comprobar
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ color: correct === NUM_OPS ? "#66BB6A" : "#78909C" }}
          >
            {correct} de {NUM_OPS} correctas
            {correct === NUM_OPS
              ? " — Perfecto!"
              : correct >= 3
                ? " — Muy bien!"
                : " — Sigue practicando!"}
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={handleNext}
            sx={{
              width: "100%",
              p: 1.2,
              border: "none",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #5DADE2, #2E86C1)",
              color: "white",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 14px rgba(46,134,193,0.3)",
              },
            }}
          >
            Siguiente <ArrowForwardIcon fontSize="small" />
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ─── Mini operation (reuses the vertical layout from MathOperationQuestion) ── */

const DIGIT_SIZE = 36;
const FONT_SIZE = "1.4rem";
const FONT_FAMILY = "'Courier New', Courier, monospace";

interface MiniOperationProps {
  question: MathOperationQuestion;
  value: number | null;
  onChange: (value: number | null) => void;
  disabled: boolean;
}

function MiniOperation({
  question,
  onChange,
  disabled,
}: Readonly<MiniOperationProps>) {
  const [a, b] = question.operands;
  const answerLen = String(question.answer).length;
  const maxDigits = Math.max(String(a).length, String(b).length, answerLen);

  const [digits, setDigits] = useState<string[]>(() =>
    Array(maxDigits).fill(""),
  );

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
    if (disabled) return false;
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
    if (disabled) return;
    const char = raw.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    onChange(computeValue(newDigits));
    if (char) {
      const next = getActiveIndex(newDigits);
      if (next < index) {
        focusProgrammatic(next);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Backspace") {
      if (digits[index] === "") {
        if (index < maxDigits - 1) focusProgrammatic(index + 1);
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        for (let i = 0; i < index; i++) newDigits[i] = "";
        setDigits(newDigits);
        onChange(computeValue(newDigits));
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

  const aDigits = String(a).padStart(maxDigits, " ").split("");
  const bDigits = String(b).padStart(maxDigits, " ").split("");

  return (
    <Box
      sx={{
        bgcolor: "#FFFDE7",
        border: "2px solid #FFD54F",
        borderRadius: "12px",
        p: { xs: 1.5, sm: 2 },
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 0.3,
      }}
    >
      <Box sx={{ display: "flex", gap: "3px", pl: `${DIGIT_SIZE + 6}px` }}>
        {aDigits.map((d, i) => (
          <MiniDigitCell key={`a-${i}`} value={d} />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: "3px", alignItems: "center" }}>
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
          <MiniDigitCell key={`b-${i}`} value={d} />
        ))}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: 2,
          bgcolor: "#333",
          borderRadius: 1,
          my: 0.3,
        }}
      />
      <Box sx={{ display: "flex", gap: "3px", pl: `${DIGIT_SIZE + 6}px` }}>
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
                borderRadius: "6px",
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
  );
}

function MiniDigitCell({ value }: Readonly<{ value: string }>) {
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
