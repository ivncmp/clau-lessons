import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useExamData, useSubjectDetail } from "@/hooks/useDataQueries";
import { courseToSlug } from "@/utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProgress } from "@/utils/storage";
import ExamResults from "../../exam/components/ExamResults";

export default function ExamAttemptDetailPage() {
  const { subjectId, topicId, attemptId } = useParams<{
    subjectId: string;
    topicId: string;
    attemptId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);

  const { data: examData, isPending: examLoading } = useExamData(
    slug || undefined,
    subjectId,
    topicId,
  );
  const { data: subjectData } = useSubjectDetail(slug || undefined, subjectId);

  const attempt = useMemo(() => {
    if (!user || !subjectId || !topicId || !attemptId) return null;
    const progress = getProgress(user.id);
    const topic = progress.subjects[subjectId]?.topics[topicId];
    return topic?.examAttempts.find((a) => a.id === attemptId) ?? null;
  }, [user, subjectId, topicId, attemptId]);

  if (examLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(170deg, #2E86C1 0%, #5DADE2 25%, #AED6F1 55%, #D6EAF8 80%, #AED6F1 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#1B4F72" }} />
      </Box>
    );
  }

  if (!attempt || !examData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(170deg, #2E86C1 0%, #5DADE2 25%, #AED6F1 55%, #D6EAF8 80%, #AED6F1 100%)",
        }}
      >
        <Box sx={{ textAlign: "center", px: 3 }}>
          <Typography sx={{ fontSize: "3rem", mb: 1 }}>🔍</Typography>
          <Typography variant="h5" sx={{ color: "#01579B" }}>
            Examen no encontrado
          </Typography>
          <Box
            onClick={() => navigate("/exam-history")}
            sx={{
              mt: 3,
              color: "#1B4F72",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Volver al historial
          </Box>
        </Box>
      </Box>
    );
  }

  const topicNum = parseInt(topicId!, 10) || topicId;
  const title = subjectData
    ? `${subjectData.icon} ${subjectData.name} — Unidad ${topicNum}`
    : `Unidad ${topicNum}`;

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
        <Box
          onClick={() => navigate("/exam-history")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mb: 2,
            cursor: "pointer",
            color: "rgba(255,255,255,0.85)",
            "&:hover": { color: "white" },
            transition: "color 0.2s",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Historial
          </Typography>
        </Box>

        <Typography
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.15rem" },
            mb: 3,
            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          {title}
        </Typography>

        <ExamResults
          questions={examData.questions}
          answers={attempt.answers}
          score={attempt.score}
          durationSeconds={attempt.durationSeconds}
          onRestart={() =>
            navigate(`/subject/${subjectId}/topic/${topicId}/exam`)
          }
          onExit={() => navigate("/exam-history")}
        />
      </Container>
    </Box>
  );
}
