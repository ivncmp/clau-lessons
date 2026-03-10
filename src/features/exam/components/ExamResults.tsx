import { Box, Typography, Stack } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Question } from "../../../types/data";
import type { UserAnswer } from "../../../types/storage";
import { isCorrect } from "../../../utils/grading";

interface ExamResultsProps {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  score: number;
  durationSeconds: number;
  onRestart: () => void;
  onExit: () => void;
}

export default function ExamResults({
  questions,
  answers,
  score,
  durationSeconds,
  onRestart,
  onExit,
}: Readonly<ExamResultsProps>) {
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  let message: string;
  let color: string;
  if (pct >= 90) {
    message = "¡Excelente! 🌟";
    color = "#2E7D32";
  } else if (pct >= 70) {
    message = "¡Muy bien! 👏";
    color = "#43A047";
  } else if (pct >= 50) {
    message = "¡Sigue practicando! 💪";
    color = "#E65100";
  } else {
    message = "¡No te rindas! 📚";
    color = "#D32F2F";
  }

  return (
    <Box>
      {/* Score card */}
      <Box
        className="exam-pop-in"
        sx={{
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "28px",
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          mb: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h2"
          fontWeight={800}
          sx={{ color, mb: 0.5, fontSize: { xs: "3rem", sm: "3.5rem" } }}
        >
          {pct}%
        </Typography>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {message}
        </Typography>
        <Typography sx={{ color: "#546E7A", mb: 0.5 }}>
          {score} de {total} respuestas correctas
        </Typography>
        <Typography variant="body2" sx={{ color: "#90A4AE" }}>
          Tiempo: {minutes}:{seconds.toString().padStart(2, "0")}
        </Typography>
      </Box>

      {/* Detail grid */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            mb: 2,
            color: "white",
            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          Detalle
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {questions.map((q, i) => {
            const answer = answers[q.id];
            const correct = answer ? isCorrect(q, answer) : false;

            return (
              <QuestionCard
                key={q.id}
                index={i}
                question={q}
                answer={answer}
                correct={correct}
              />
            );
          })}
        </Box>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{}}>
        <Box
          onClick={onRestart}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            background: "linear-gradient(135deg, #5DADE2, #2E86C1)",
            color: "white",
            borderRadius: "18px",
            px: 3,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1.05rem",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(38,198,218,0.4)",
            transition: "all 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(38,198,218,0.5)",
            },
          }}
        >
          <ReplayIcon fontSize="small" />
          Repetir examen
        </Box>
        <Box
          onClick={onExit}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "#E0E0E0",
            color: "#616161",
            borderRadius: "18px",
            px: 3,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1.05rem",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#BDBDBD",
              transform: "translateY(-2px)",
            },
          }}
        >
          Volver
        </Box>
      </Stack>
    </Box>
  );
}

/* ─── Question Card ──────────────────────────────────────────── */

interface QuestionCardProps {
  index: number;
  question: Question;
  answer: UserAnswer | undefined;
  correct: boolean;
}

function QuestionCard({
  index,
  question,
  answer,
  correct,
}: Readonly<QuestionCardProps>) {
  return (
    <Box
      sx={{
        width: {
          xs: "calc(50% - 6px)",
          sm: "calc(33.33% - 8px)",
        },
        bgcolor: "rgba(255,255,255,0.95)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: `2px solid ${correct ? "#A5D6A7" : "#EF9A9A"}`,
      }}
    >
      {/* Top color bar */}
      <Box
        sx={{
          height: 4,
          bgcolor: correct ? "#43A047" : "#EF5350",
        }}
      />

      <Box sx={{ p: 1.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mb: 1,
          }}
        >
          {correct ? (
            <CheckCircleIcon
              sx={{ color: "#43A047", fontSize: 18, flexShrink: 0 }}
            />
          ) : (
            <CancelIcon
              sx={{ color: "#EF5350", fontSize: 18, flexShrink: 0 }}
            />
          )}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "#37474F",
              lineHeight: 1.3,
            }}
          >
            {index + 1}. {question.question}
          </Typography>
        </Box>

        {/* Answer detail */}
        <AnswerDetail question={question} answer={answer} correct={correct} />

        {question.explanation && (
          <Typography
            sx={{
              mt: 1,
              fontSize: "0.75rem",
              color: "#78909C",
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            {question.explanation}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ─── Answer Detail ──────────────────────────────────────────── */

interface AnswerDetailProps {
  question: Question;
  answer: UserAnswer | undefined;
  correct: boolean;
}

function AnswerDetail({
  question,
  answer,
  correct,
}: Readonly<AnswerDetailProps>) {
  if (!answer) {
    return (
      <Typography
        sx={{ fontSize: "0.8rem", color: "#EF5350", fontWeight: 600 }}
      >
        Sin respuesta
      </Typography>
    );
  }

  switch (question.type) {
    case "choice": {
      const userIdx = answer.type === "choice" ? answer.selected : -1;
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {question.options.map((opt, i) => {
            const isUser = i === userIdx;
            const isCorrectOpt = i === question.answer;
            let bg = "transparent";
            let border = "1px solid transparent";
            let fontWeight = 400;
            if (isCorrectOpt) {
              bg = "#E8F5E9";
              border = "1px solid #A5D6A7";
              fontWeight = 700;
            }
            if (isUser && !isCorrectOpt) {
              bg = "#FFEBEE";
              border = "1px solid #EF9A9A";
              fontWeight = 600;
            }
            return (
              <Box
                key={i}
                sx={{
                  px: 1,
                  py: 0.3,
                  borderRadius: "6px",
                  bgcolor: bg,
                  border,
                  fontSize: "0.78rem",
                  fontWeight,
                  color: "#37474F",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {isCorrectOpt && (
                  <CheckCircleIcon sx={{ fontSize: 14, color: "#43A047" }} />
                )}
                {isUser && !isCorrectOpt && (
                  <CancelIcon sx={{ fontSize: 14, color: "#EF5350" }} />
                )}
                {opt}
              </Box>
            );
          })}
        </Box>
      );
    }

    case "true-false": {
      const userVal = answer.type === "true-false" ? answer.selected : null;
      return (
        <Box sx={{ display: "flex", gap: 1 }}>
          {[true, false].map((val) => {
            const isUser = userVal === val;
            const isCorrectOpt = question.answer === val;
            let bg = "transparent";
            let border = "1px solid #E0E0E0";
            if (isCorrectOpt) {
              bg = "#E8F5E9";
              border = "1px solid #A5D6A7";
            }
            if (isUser && !isCorrectOpt) {
              bg = "#FFEBEE";
              border = "1px solid #EF9A9A";
            }
            return (
              <Box
                key={String(val)}
                sx={{
                  px: 1.5,
                  py: 0.3,
                  borderRadius: "8px",
                  bgcolor: bg,
                  border,
                  fontSize: "0.8rem",
                  fontWeight: isCorrectOpt || isUser ? 700 : 400,
                  color: "#37474F",
                }}
              >
                {val ? "Verdadero" : "Falso"}
              </Box>
            );
          })}
        </Box>
      );
    }

    case "word-bank-fill": {
      const userWords = answer.type === "word-bank-fill" ? answer.words : [];
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          {question.blanks.map((expected, i) => {
            const userWord = userWords[i] ?? "";
            const ok = userWord.toLowerCase() === expected.toLowerCase();
            return (
              <Box
                key={i}
                sx={{
                  fontSize: "0.78rem",
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    fontWeight: 700,
                    color: ok ? "#2E7D32" : "#D32F2F",
                  }}
                >
                  {userWord || "___"}
                </Typography>
                {!ok && (
                  <Typography
                    component="span"
                    sx={{ fontSize: "inherit", color: "#43A047" }}
                  >
                    → {expected}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      );
    }

    case "matching": {
      const sels = answer.type === "matching" ? answer.selections : {};
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          {question.pairs.map((pair, i) => {
            const userRight = sels[i] ?? "";
            const ok = userRight === pair.right;
            return (
              <Box
                key={i}
                sx={{
                  fontSize: "0.78rem",
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontSize: "inherit", fontWeight: 600 }}
                >
                  {pair.left}
                </Typography>
                <Typography
                  component="span"
                  sx={{ fontSize: "inherit", color: "#90A4AE" }}
                >
                  →
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    fontWeight: 700,
                    color: ok ? "#2E7D32" : "#D32F2F",
                  }}
                >
                  {userRight || "?"}
                </Typography>
                {!ok && (
                  <Typography
                    component="span"
                    sx={{ fontSize: "inherit", color: "#43A047" }}
                  >
                    → {pair.right}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      );
    }

    case "word-bank-classify": {
      const placements =
        answer.type === "word-bank-classify" ? answer.placements : {};
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {question.slots.map((slot, i) => {
            const placed = placements[i] ?? [];
            const allOk =
              slot.accepts.length === placed.length &&
              slot.accepts.every((w) => placed.includes(w));
            return (
              <Box key={i} sx={{ fontSize: "0.78rem" }}>
                <Typography
                  component="span"
                  sx={{ fontSize: "inherit", fontWeight: 600 }}
                >
                  {slot.label}:{" "}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    fontWeight: 700,
                    color: allOk ? "#2E7D32" : "#D32F2F",
                  }}
                >
                  {placed.length > 0 ? placed.join(", ") : "—"}
                </Typography>
                {!allOk && (
                  <Typography
                    component="span"
                    sx={{ fontSize: "inherit", color: "#43A047" }}
                  >
                    {" "}
                    → {slot.accepts.join(", ")}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      );
    }

    case "word-bank-order": {
      const userArr = answer.type === "word-bank-order" ? answer.arranged : "";
      return (
        <Box sx={{ fontSize: "0.78rem" }}>
          <Typography
            component="span"
            sx={{
              fontSize: "inherit",
              fontWeight: 700,
              color: correct ? "#2E7D32" : "#D32F2F",
            }}
          >
            {userArr || "—"}
          </Typography>
          {!correct && (
            <Typography
              component="span"
              sx={{ fontSize: "inherit", color: "#43A047" }}
            >
              {" "}
              → {question.answer}
            </Typography>
          )}
        </Box>
      );
    }

    case "math-operation": {
      const userVal = answer.type === "math-operation" ? answer.value : null;
      return (
        <Box
          sx={{
            fontSize: "0.78rem",
            display: "flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "inherit",
              fontWeight: 700,
              color: correct ? "#2E7D32" : "#D32F2F",
            }}
          >
            {userVal ?? "—"}
          </Typography>
          {!correct && (
            <Typography
              component="span"
              sx={{ fontSize: "inherit", color: "#43A047" }}
            >
              → {question.answer}
            </Typography>
          )}
        </Box>
      );
    }

    case "number-series": {
      const userVals = answer.type === "number-series" ? answer.values : [];
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {question.answers.map((expected, i) => {
            const userVal = userVals[i];
            const ok = userVal === expected;
            return (
              <Box
                key={i}
                sx={{
                  px: 0.8,
                  py: 0.2,
                  borderRadius: "6px",
                  bgcolor: ok ? "#E8F5E9" : "#FFEBEE",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: ok ? "#2E7D32" : "#D32F2F",
                }}
              >
                {userVal ?? "?"}
                {!ok && ` → ${expected}`}
              </Box>
            );
          })}
        </Box>
      );
    }

    case "word-selection": {
      const userSels = answer.type === "word-selection" ? answer.selected : [];
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          {question.sentences.map((sentence, i) => {
            const sel = userSels[i] ?? [];
            const correctIndices = question.answers[i] ?? [];
            const ok =
              correctIndices.length === sel.length &&
              correctIndices.every((idx) => sel.includes(idx));
            return (
              <Box key={i} sx={{ fontSize: "0.78rem" }}>
                {ok ? (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 12,
                      color: "#43A047",
                      mr: 0.5,
                      verticalAlign: "middle",
                    }}
                  />
                ) : (
                  <CancelIcon
                    sx={{
                      fontSize: 12,
                      color: "#EF5350",
                      mr: 0.5,
                      verticalAlign: "middle",
                    }}
                  />
                )}
                <Typography component="span" sx={{ fontSize: "inherit" }}>
                  {sentence}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }
  }
}
