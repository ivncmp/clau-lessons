import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useReviewExamData } from "@/hooks/useDataQueries";
import { courseToSlug } from "@/utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import { useExam } from "../../exam/hooks/useExam";
import QuestionRenderer from "../../exam/components/QuestionRenderer";
import { isCorrect } from "@/utils/grading";
import type { ReviewExamData } from "@/types/data";

export default function ReviewExamPage() {
  const { evaluationId, examId } = useParams<{
    evaluationId: string;
    examId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);
  const [key, setKey] = useState(0);

  const { data: examData, isPending } = useReviewExamData(
    slug || undefined,
    evaluationId,
    examId,
  );

  if (isPending || !examData || examData.questions.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(170deg, #1B4F72 0%, #2E86C1 25%, #5DADE2 55%, #AED6F1 80%, #D6EAF8 100%)",
        }}
      >
        {isPending ? (
          <CircularProgress sx={{ color: "#1B4F72" }} />
        ) : (
          <Box sx={{ textAlign: "center", px: 3 }}>
            <Typography sx={{ fontSize: "3rem", mb: 1 }}>📝</Typography>
            <Typography variant="h5" sx={{ color: "#01579B" }}>
              Examen no encontrado
            </Typography>
            <Button
              onClick={() => navigate("/review-exams")}
              sx={{ mt: 3, color: "#1B4F72" }}
            >
              Volver
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <ReviewExamRunner
      key={key}
      examData={examData}
      onExit={() => navigate("/review-exams")}
      onRestart={() => setKey((k) => k + 1)}
    />
  );
}

interface ReviewExamRunnerProps {
  examData: ReviewExamData;
  onExit: () => void;
  onRestart: () => void;
}

function ReviewExamRunner({
  examData,
  onExit,
  onRestart,
}: Readonly<ReviewExamRunnerProps>) {
  const exam = useExam(examData.questions);
  const [restartOpen, setRestartOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const currentId = exam.currentQuestion.id;
  const currentAnswer = exam.answers[currentId];
  const isChecked = checked.has(currentId);
  const currentCorrect =
    isChecked && currentAnswer
      ? isCorrect(exam.currentQuestion, currentAnswer)
      : null;

  const refText = exam.currentQuestion.refText;
  const readingText =
    refText && examData.texts ? examData.texts[refText] : undefined;

  const handleNext = useCallback(() => {
    if (!currentAnswer) {
      // No answer yet — just advance
      exam.next();
      return;
    }
    if (!checked.has(currentId)) {
      // First click: check the answer
      setChecked((prev) => new Set(prev).add(currentId));
    } else {
      // Already checked: advance
      exam.next();
    }
  }, [currentAnswer, currentId, checked, exam]);

  const handleFinish = useCallback(() => {
    if (currentAnswer && !checked.has(currentId)) {
      setChecked((prev) => new Set(prev).add(currentId));
      return;
    }
    exam.finish();
  }, [currentAnswer, currentId, checked, exam]);

  if (exam.status === "finished") {
    const correctCount = exam.questions.filter((q) => {
      const a = exam.answers[q.id];
      return a ? isCorrect(q, a) : false;
    }).length;

    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(170deg, #2E86C1 0%, #5DADE2 25%, #AED6F1 55%, #D6EAF8 80%, #AED6F1 100%)",
          backgroundAttachment: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: "28px",
            p: { xs: 3, sm: 5 },
            mx: 2,
            maxWidth: 420,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Typography sx={{ fontSize: "3.5rem", mb: 1 }}>
            {correctCount === exam.totalQuestions
              ? "🎉"
              : correctCount >= exam.totalQuestions / 2
                ? "👍"
                : "💪"}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {correctCount}/{exam.totalQuestions}
          </Typography>
          <Typography sx={{ color: "#546E7A", mb: 3, fontSize: "0.95rem" }}>
            {correctCount === exam.totalQuestions
              ? "¡Perfecto! Todo correcto"
              : correctCount >= exam.totalQuestions / 2
                ? "¡Buen trabajo! Sigue practicando"
                : "Hay que repasar un poco más"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              onClick={onRestart}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1.2,
                bgcolor: "#E0E0E0",
                color: "#424242",
                "&:hover": { bgcolor: "#BDBDBD" },
              }}
            >
              Repetir
            </Button>
            <Button
              onClick={onExit}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1.2,
                background: "linear-gradient(135deg, #FF8A65, #F4511E)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #FF7043, #E64A19)",
                },
              }}
            >
              Salir
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  const progress = ((exam.currentIndex + 1) / exam.totalQuestions) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #2E86C1 0%, #5DADE2 25%, #AED6F1 55%, #D6EAF8 80%, #AED6F1 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          px: 2,
          py: 1.5,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={onExit}
              size="small"
              sx={{
                bgcolor: "rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setRestartOpen(true)}
              size="small"
              sx={{
                bgcolor: "rgba(211,47,47,0.08)",
                color: "#D32F2F",
                "&:hover": { bgcolor: "rgba(211,47,47,0.15)" },
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: "#78909C",
                display: { xs: "none", sm: "block" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 320,
              }}
            >
              <Box component="span" sx={{ fontWeight: 600, color: "#546E7A" }}>
                {examData.title}
              </Box>
              {" · "}
              {examData.evaluation}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.secondary"
            sx={{ whiteSpace: "nowrap" }}
          >
            Pregunta {exam.currentIndex + 1} de {exam.totalQuestions}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              bgcolor: "#D6EAF8",
              px: 1.5,
              py: 0.3,
              borderRadius: 2,
              color: "#1565C0",
              whiteSpace: "nowrap",
            }}
          >
            {exam.answeredCount}/{exam.totalQuestions}
          </Typography>
        </Container>
        <Container maxWidth="lg" sx={{ mt: 1.5 }}>
          <Box
            sx={{
              height: 18,
              bgcolor: "rgba(255,255,255,0.5)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FF8A65, #F4511E, #D84315)",
                borderRadius: "20px",
                transition: "width 0.5s ease",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite linear",
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Question container */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <Box
          key={exam.currentQuestion.id}
          className="exam-card-in"
          sx={{
            bgcolor: "rgba(255,255,255,0.93)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Reading text (collapsible) */}
          {readingText && (
            <Box
              sx={{
                mb: 2.5,
                bgcolor: "#FFFDE7",
                border: "2px solid #FDD835",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <Box
                onClick={() => setTextOpen((o) => !o)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ color: "#E65100", flex: 1 }}
                >
                  {readingText.title}
                </Typography>
                <Typography sx={{ color: "#E65100", fontSize: "0.8rem" }}>
                  {textOpen ? "Ocultar ▲" : "Leer texto ▼"}
                </Typography>
              </Box>
              <Collapse in={textOpen}>
                <Box
                  sx={{
                    px: 2,
                    pb: 2,
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    color: "#3E2723",
                    "& .hl": {
                      bgcolor: "#FFF9C4",
                      px: 0.5,
                      borderRadius: "4px",
                      fontWeight: 700,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: readingText.html }}
                />
              </Collapse>
            </Box>
          )}

          <QuestionRenderer
            question={exam.currentQuestion}
            answer={exam.answers[exam.currentQuestion.id]}
            onAnswer={(answer) =>
              exam.setAnswer(exam.currentQuestion.id, answer)
            }
          />

          {/* Instant feedback after checking */}
          <Collapse in={isChecked}>
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: "16px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                bgcolor: currentCorrect ? "#E8F5E9" : "#FFEBEE",
                border: `2px solid ${currentCorrect ? "#66BB6A" : "#EF5350"}`,
              }}
            >
              {currentCorrect ? (
                <CheckCircleIcon sx={{ color: "#388E3C", mt: 0.2 }} />
              ) : (
                <CancelIcon sx={{ color: "#D32F2F", mt: 0.2 }} />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: currentCorrect ? "#2E7D32" : "#C62828",
                  }}
                >
                  {currentCorrect ? "¡Correcto!" : "Incorrecto"}
                </Typography>
                {exam.currentQuestion.explanation && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "0.88rem",
                      color: currentCorrect ? "#1B5E20" : "#B71C1C",
                      lineHeight: 1.5,
                    }}
                  >
                    {exam.currentQuestion.explanation}
                  </Typography>
                )}
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            disabled={exam.isFirst}
            onClick={exam.prev}
            sx={{
              bgcolor: "#E0E0E0",
              color: "#616161",
              borderRadius: "18px",
              px: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.05rem",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#BDBDBD",
                transform: "translateY(-2px)",
              },
              "&.Mui-disabled": { opacity: 0.4 },
              transition: "all 0.2s",
            }}
          >
            Anterior
          </Button>

          {exam.isLast ? (
            <Button
              disabled={!currentAnswer}
              onClick={handleFinish}
              sx={{
                background: isChecked
                  ? "linear-gradient(135deg, #F4511E, #D84315)"
                  : "linear-gradient(135deg, #42A5F5, #1E88E5)",
                color: "white",
                borderRadius: "18px",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.05rem",
                textTransform: "none",
                boxShadow: isChecked
                  ? "0 4px 14px rgba(244,81,30,0.4)"
                  : "0 4px 14px rgba(30,136,229,0.4)",
                "&:hover": {
                  background: isChecked
                    ? "linear-gradient(135deg, #E64A19, #BF360C)"
                    : "linear-gradient(135deg, #1E88E5, #1565C0)",
                  transform: "translateY(-2px)",
                  boxShadow: isChecked
                    ? "0 6px 20px rgba(244,81,30,0.5)"
                    : "0 6px 20px rgba(30,136,229,0.5)",
                },
                "&.Mui-disabled": {
                  opacity: 0.4,
                  background: "linear-gradient(135deg, #42A5F5, #1E88E5)",
                  color: "white",
                },
                transition: "all 0.2s",
              }}
            >
              {isChecked ? "Terminar" : "Comprobar"}
            </Button>
          ) : (
            <Button
              endIcon={isChecked ? <ArrowForwardIcon /> : undefined}
              onClick={handleNext}
              disabled={!currentAnswer}
              sx={{
                background: isChecked
                  ? "linear-gradient(135deg, #FF8A65, #F4511E)"
                  : "linear-gradient(135deg, #42A5F5, #1E88E5)",
                color: "white",
                borderRadius: "18px",
                px: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.05rem",
                textTransform: "none",
                boxShadow: isChecked
                  ? "0 4px 14px rgba(244,81,30,0.4)"
                  : "0 4px 14px rgba(30,136,229,0.4)",
                "&:hover": {
                  background: isChecked
                    ? "linear-gradient(135deg, #FF7043, #E64A19)"
                    : "linear-gradient(135deg, #1E88E5, #1565C0)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-disabled": {
                  opacity: 0.4,
                  background: "linear-gradient(135deg, #42A5F5, #1E88E5)",
                  color: "white",
                },
                transition: "all 0.2s",
              }}
            >
              {isChecked ? "Siguiente" : "Comprobar"}
            </Button>
          )}
        </Box>
      </Container>

      {/* Restart dialog */}
      <Dialog
        open={restartOpen}
        onClose={() => setRestartOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Empezar de cero</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Se borrarán todas tus respuestas y empezarás el examen desde la
            primera pregunta. ¿Estás seguro?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRestartOpen(false)}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              color: "#546E7A",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setRestartOpen(false);
              onRestart();
            }}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#D32F2F",
              color: "white",
              "&:hover": { bgcolor: "#B71C1C" },
            }}
          >
            Sí, empezar de cero
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
