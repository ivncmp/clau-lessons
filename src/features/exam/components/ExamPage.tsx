import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import {
  useExamData,
  useTopicData,
  useSubjectDetail,
} from "@/hooks/useDataQueries";
import { courseToSlug } from "../../../utils/cursoSlug";
import {
  recordExamAttempt,
  getInProgressExam,
  saveInProgressExam,
  clearInProgressExam,
} from "../../../utils/storage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useExam } from "../hooks/useExam";
import QuestionRenderer from "./QuestionRenderer";
import ExamResults from "./ExamResults";
import type { ExamData, TopicData, SubjectDetail } from "../../../types/data";

export default function ExamPage() {
  const { subjectId, topicId } = useParams<{
    subjectId: string;
    topicId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);
  const [key, setKey] = useState(0);

  const { data: examData, isPending: examLoading } = useExamData(
    slug || undefined,
    subjectId,
    topicId,
  );
  const { data: topicData } = useTopicData(
    slug || undefined,
    subjectId,
    topicId,
  );
  const { data: subjectData } = useSubjectDetail(slug || undefined, subjectId);

  const loading = examLoading;

  if (loading || !examData || examData.questions.length === 0) {
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
        {loading ? (
          <CircularProgress sx={{ color: "#1B4F72" }} />
        ) : (
          <Box sx={{ textAlign: "center", px: 3 }}>
            <Typography sx={{ fontSize: "3rem", mb: 1 }}>
              {examData?.questions.length === 0 ? "📝" : "🔍"}
            </Typography>
            <Typography variant="h5" sx={{ color: "#01579B" }}>
              {examData?.questions.length === 0
                ? "Este examen aún no tiene preguntas"
                : "Examen no encontrado"}
            </Typography>
            <Typography sx={{ color: "#1B4F72", mt: 1, opacity: 0.8 }}>
              Estamos preparando el contenido, pronto estará listo
            </Typography>
            <Button
              onClick={() =>
                navigate(`/subject/${subjectId}/topic/${topicId}/lesson`)
              }
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
    <ExamRunner
      key={key}
      examData={examData}
      topicData={topicData ?? null}
      subjectData={subjectData ?? null}
      course={user!.course}
      subjectId={subjectId!}
      topicId={topicId!}
      userId={user!.id}
      onExit={() => navigate(`/subject/${subjectId}/topic/${topicId}/lesson`)}
      onRestart={() => {
        clearInProgressExam(user!.id, subjectId!, topicId!);
        setKey((k) => k + 1);
      }}
    />
  );
}

// ─── Inner component that uses the exam hook ───────────────────

interface ExamRunnerProps {
  examData: ExamData;
  topicData: TopicData | null;
  subjectData: SubjectDetail | null;
  course: string;
  subjectId: string;
  topicId: string;
  userId: string;
  onExit: () => void;
  onRestart: () => void;
}

function ExamRunner({
  examData,
  topicData,
  subjectData,
  course,
  subjectId,
  topicId,
  userId,
  onExit,
  onRestart,
}: Readonly<ExamRunnerProps>) {
  const savedProgress = getInProgressExam(userId, subjectId, topicId);
  const exam = useExam(examData.questions, savedProgress ?? undefined);
  const [saved, setSaved] = useState(false);
  const [textOpen, setTextOpen] = useState(false);

  const handleFinish = useCallback(() => {
    exam.finish();
  }, [exam]);

  // Persist in-progress answers to localStorage on every change
  useEffect(() => {
    if (exam.status === "in-progress") {
      saveInProgressExam(userId, subjectId, topicId, {
        answers: exam.answers,
        currentIndex: exam.currentIndex,
        startedAt: exam.startedAt,
      });
    }
  }, [
    exam.answers,
    exam.currentIndex,
    exam.startedAt,
    exam.status,
    userId,
    subjectId,
    topicId,
  ]);

  // Save attempt and clear in-progress when exam finishes
  useEffect(() => {
    if (exam.status === "finished" && !saved) {
      setSaved(true);
      clearInProgressExam(userId, subjectId, topicId);
      recordExamAttempt(userId, subjectId, topicId, {
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
        score: exam.score,
        total: exam.totalQuestions,
        answers: exam.answers,
        durationSeconds: exam.durationSeconds,
      });
    }
  }, [
    exam.status,
    exam.score,
    exam.totalQuestions,
    exam.answers,
    exam.durationSeconds,
    saved,
    userId,
    subjectId,
    topicId,
  ]);

  if (exam.status === "finished") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(170deg, #2E86C1 0%, #5DADE2 25%, #AED6F1 55%, #D6EAF8 80%, #AED6F1 100%)",
          backgroundAttachment: "fixed",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <ExamResults
            questions={exam.questions}
            answers={exam.answers}
            score={exam.score}
            durationSeconds={exam.durationSeconds}
            onRestart={onRestart}
            onExit={onExit}
          />
        </Container>
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
              {course}
              {subjectData && (
                <>
                  {" · "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#546E7A" }}
                  >
                    {subjectData.icon} {subjectData.name}
                  </Box>
                </>
              )}
              {topicData && (
                <>
                  {" · "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#37474F" }}
                  >
                    {topicData.title}
                  </Box>
                </>
              )}
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
        {/* Shimmer progress bar */}
        <Container maxWidth="lg" sx={{ mt: 1.5 }}>
          <Box
            sx={{
              height: 18,
              bgcolor: "rgba(255,255,255,0.5)",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #5DADE2, #2E86C1, #1A5276)",
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
          {exam.currentQuestion.refText &&
            topicData?.texts[exam.currentQuestion.refText] && (
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
                    {topicData.texts[exam.currentQuestion.refText].title}
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
                    dangerouslySetInnerHTML={{
                      __html:
                        topicData.texts[exam.currentQuestion.refText].html,
                    }}
                  />
                </Collapse>
              </Box>
            )}

          {/* SVG image */}
          {exam.currentQuestion.image &&
            topicData?.images?.[exam.currentQuestion.image] && (
              <Box
                sx={{ mb: 3, textAlign: "center" }}
                dangerouslySetInnerHTML={{
                  __html: topicData.images[exam.currentQuestion.image],
                }}
              />
            )}

          <QuestionRenderer
            question={exam.currentQuestion}
            answer={exam.answers[exam.currentQuestion.id]}
            onAnswer={(answer) =>
              exam.setAnswer(exam.currentQuestion.id, answer)
            }
          />
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
              disabled={!exam.allAnswered}
              onClick={handleFinish}
              sx={{
                background: "linear-gradient(135deg, #2E86C1, #1A5276)",
                color: "white",
                borderRadius: "18px",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.05rem",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(2,136,209,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1B4F72, #154360)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(2,136,209,0.5)",
                },
                "&.Mui-disabled": {
                  opacity: 0.4,
                  background: "linear-gradient(135deg, #2E86C1, #1A5276)",
                  color: "white",
                },
                transition: "all 0.2s",
              }}
            >
              Terminar
            </Button>
          ) : (
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={exam.next}
              sx={{
                background: "linear-gradient(135deg, #5DADE2, #2E86C1)",
                color: "white",
                borderRadius: "18px",
                px: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.05rem",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(38,198,218,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5DADE2, #1B4F72)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(38,198,218,0.5)",
                },
                transition: "all 0.2s",
              }}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
