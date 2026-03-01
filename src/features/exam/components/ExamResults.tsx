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
    <Box sx={{ maxWidth: 560, mx: "auto" }}>
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

      {/* Detail */}
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          p: { xs: 2, sm: 3 },
          mb: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Detalle
        </Typography>
        <Stack spacing={1}>
          {questions.map((q, i) => {
            const answer = answers[q.id];
            const correct = answer ? isCorrect(q, answer) : false;

            return (
              <Box
                key={q.id}
                sx={{
                  p: "10px 14px",
                  borderRadius: "12px",
                  bgcolor: correct ? "#E8F5E9" : "#FFEBEE",
                  borderLeft: "4px solid",
                  borderLeftColor: correct ? "#43A047" : "#EF5350",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {correct ? (
                  <CheckCircleIcon sx={{ color: "#43A047", fontSize: 20 }} />
                ) : (
                  <CancelIcon sx={{ color: "#EF5350", fontSize: 20 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    lineHeight: 1.4,
                  }}
                  noWrap
                >
                  {i + 1}. {q.question}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Box
          onClick={onRestart}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            background: "linear-gradient(135deg, #26C6DA, #0288D1)",
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
          Volver al tema
        </Box>
      </Stack>
    </Box>
  );
}
