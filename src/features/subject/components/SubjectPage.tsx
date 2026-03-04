import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSubjectDetail, useEvaluations } from "@/hooks/useDataQueries";
import { courseToSlug } from "../../../utils/cursoSlug";
import { getBestScore } from "../../../utils/storage";
import { useAuth } from "../../auth/hooks/useAuth";
import { getEvalColor } from "../../dashboard/components/DashboardPage";

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);

  const { data: subject, isPending: subjectLoading } = useSubjectDetail(
    slug || undefined,
    subjectId,
  );
  const { data: evaluations = [], isPending: evalsLoading } = useEvaluations(
    slug || undefined,
    user?.classId || undefined,
  );

  const loading = subjectLoading || evalsLoading;

  // Map topic ID (e.g. "003") → evaluation info for this subject
  const topicEvalMap = useMemo(() => {
    const map: Record<
      string,
      { evalName: string; date?: string; evalIndex: number }
    > = {};
    if (!subjectId) return map;
    for (let i = 0; i < evaluations.length; i++) {
      const ev = evaluations[i];
      const content = ev.content?.[subjectId];
      const exam = ev.exams.find((e) => e.subjectId === subjectId);
      if (!content?.units || !exam) continue;
      for (const unit of content.units) {
        const topicId = String(unit).padStart(3, "0");
        map[topicId] = { evalName: ev.name, date: exam.date, evalIndex: i };
      }
    }
    return map;
  }, [evaluations, subjectId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!subject) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          bgcolor: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Asignatura no encontrada
        </Typography>
        <Box
          onClick={() => navigate("/dashboard")}
          sx={{
            display: "inline-block",
            mt: 2,
            bgcolor: "#E0E0E0",
            color: "#616161",
            borderRadius: "14px",
            px: 3,
            py: 1,
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { bgcolor: "#BDBDBD" },
          }}
        >
          Volver al inicio
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        className="fade-in-left"
        onClick={() => navigate("/dashboard")}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          mb: 3,
          color: "rgba(255,255,255,0.85)",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { color: "white" },
        }}
      >
        <ArrowBackIcon fontSize="small" />
        Asignaturas
      </Box>

      <Box
        className="fade-in-up stagger-2"
        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}
      >
        <Typography sx={{ fontSize: "2.4rem" }}>{subject.icon}</Typography>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "white",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {subject.name}
        </Typography>
      </Box>
      <Typography
        className="fade-in-up stagger-3"
        sx={{ mb: 4, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}
      >
        {user?.course}
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {subject.topics.map((topic, i) => {
          const best =
            user && subjectId
              ? getBestScore(user.id, subjectId, topic.id)
              : null;

          return (
            <Grid key={topic.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                className={`fade-in-up stagger-${i + 4}`}
                onClick={() =>
                  navigate(`/subject/${subjectId}/topic/${topic.id}/lesson`)
                }
                sx={{
                  bgcolor: "rgba(255,255,255,0.93)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "24px",
                  p: 3,
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                    borderColor: subject.color,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "2rem" }}>
                    {topic.icon}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
                    {topicEvalMap[topic.id] &&
                      (() => {
                        const ec = getEvalColor(
                          topicEvalMap[topic.id].evalIndex,
                        );
                        return (
                          <Box
                            sx={{
                              bgcolor: ec.bg,
                              color: ec.color,
                              borderRadius: "10px",
                              px: 1.2,
                              py: 0.3,
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              fontFamily: '"Quicksand", sans-serif',
                              whiteSpace: "nowrap",
                            }}
                          >
                            {topicEvalMap[topic.id].evalName}
                          </Box>
                        );
                      })()}
                    {best !== null && (
                      <Box
                        sx={{
                          bgcolor: best >= 0.7 ? "#E8F5E9" : "#FFF3E0",
                          color: best >= 0.7 ? "#2E7D32" : "#E65100",
                          borderRadius: "10px",
                          px: 1.2,
                          py: 0.3,
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      >
                        {Math.round(best * 100)}%
                      </Box>
                    )}
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {topic.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#546E7A", mb: 1 }}>
                  {topic.description}
                </Typography>
                <Typography variant="caption" sx={{ color: "#90A4AE" }}>
                  {topic.slideCount
                    ? `${topic.slideCount} diapositivas · `
                    : ""}
                  {topic.questionCount} preguntas
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
