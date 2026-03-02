import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, alpha } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import QuizIcon from "@mui/icons-material/Quiz";
import StarIcon from "@mui/icons-material/Star";
import { loadCursoDetail } from "../../../utils/dataLoader";
import { cursoToSlug } from "../../../utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProgress } from "../../../utils/storage";
import type { SubjectSummary } from "../../../types/data";

export default function DashboardPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    loadCursoDetail(cursoToSlug(user.curso))
      .then((data) => setSubjects(data.subjects))
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, [user]);

  const stats = useMemo(() => {
    if (!user) return { totalExams: 0, avgScore: 0, bestScore: 0 };
    const progress = getProgress(user.id);
    let totalExams = 0;
    let totalScore = 0;
    let bestScore = 0;
    for (const subj of Object.values(progress.subjects)) {
      for (const topic of Object.values(subj.topics)) {
        for (const attempt of topic.examAttempts) {
          totalExams++;
          const pct = attempt.total > 0 ? attempt.score / attempt.total : 0;
          totalScore += pct;
          if (pct > bestScore) bestScore = pct;
        }
      }
    }
    return {
      totalExams,
      avgScore:
        totalExams > 0 ? Math.round((totalScore / totalExams) * 100) : 0,
      bestScore: Math.round(bestScore * 100),
    };
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (subjects.length === 0) {
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
        <Typography variant="h5" fontWeight={600} gutterBottom>
          No hay asignaturas disponibles
        </Typography>
        <Typography sx={{ color: "#546E7A" }}>
          Los contenidos para {user?.curso} se están preparando.
        </Typography>
      </Box>
    );
  }

  const visible = subjects.filter((s) => !s.disabled);

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        className="fade-in-up"
        sx={{
          fontWeight: 800,
          mb: 0.5,
          color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        Asignaturas
      </Typography>
      <Typography
        className="fade-in-up stagger-2"
        sx={{
          mb: 4,
          color: "rgba(255,255,255,0.9)",
          fontWeight: 500,
          textShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      >
        {user?.curso} — Elige una asignatura para empezar
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: { xs: 2, md: 3 },
        }}
      >
        {visible.map((subject, i) => {
          const hasContent = subject.topicCount > 0;
          return (
            <Box
              key={subject.id}
              className={`fade-in-up stagger-${i + 3}`}
              onClick={() => navigate(`/subject/${subject.id}`)}
              sx={{
                width: {
                  xs: "calc(50% - 8px)",
                  sm: "calc(33.33% - 16px)",
                  md: "calc(33.33% - 16px)",
                },
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "24px",
                overflow: "hidden",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                border: "2px solid transparent",
                opacity: hasContent ? 1 : 0.55,
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: `0 12px 40px ${alpha(subject.color, 0.25)}`,
                  borderColor: subject.color,
                  opacity: 1,
                },
              }}
            >
              {/* Color accent bar */}
              <Box
                sx={{
                  height: 6,
                  background: `linear-gradient(90deg, ${subject.color}, ${alpha(subject.color, 0.5)})`,
                }}
              />
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 1.5,
                    borderRadius: "16px",
                    bgcolor: alpha(subject.color, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "2.2rem", lineHeight: 1 }}>
                    {subject.icon}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {subject.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#78909C", mt: 0.5 }}>
                  {subject.topicCount}{" "}
                  {subject.topicCount === 1 ? "tema" : "temas"}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Progress section */}
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 800,
          mt: 6,
          mb: 0.5,
          color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Progreso
      </Typography>
      <Typography
        sx={{
          mb: 3,
          color: "rgba(255,255,255,0.85)",
          fontWeight: 500,
          textShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        Tus resultados en los exámenes
      </Typography>

      {stats.totalExams === 0 ? (
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.93)",
            borderRadius: "24px",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🎯</Typography>
          <Typography variant="h6" fontWeight={600}>
            Aún no has hecho ningún examen
          </Typography>
          <Typography variant="body2" sx={{ color: "#78909C", mt: 0.5 }}>
            Completa tu primer examen y aquí verás tus resultados
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 3 },
            flexWrap: "wrap",
          }}
        >
          {[
            {
              icon: <QuizIcon sx={{ fontSize: 28, color: "#2E86C1" }} />,
              value: stats.totalExams,
              label:
                stats.totalExams === 1 ? "examen hecho" : "exámenes hechos",
              color: "#2E86C1",
            },
            {
              icon: <StarIcon sx={{ fontSize: 28, color: "#FFA726" }} />,
              value: `${stats.avgScore}%`,
              label: "nota media",
              color: "#FFA726",
            },
            {
              icon: <EmojiEventsIcon sx={{ fontSize: 28, color: "#66BB6A" }} />,
              value: `${stats.bestScore}%`,
              label: "mejor nota",
              color: "#66BB6A",
            },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1,
                minWidth: 140,
                bgcolor: "rgba(255,255,255,0.93)",
                borderRadius: "20px",
                p: 3,
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              {stat.icon}
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: stat.color, mt: 1 }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#78909C", mt: 0.5 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
