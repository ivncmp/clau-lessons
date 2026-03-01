import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import QuizIcon from "@mui/icons-material/Quiz";
import { loadTopicData } from "../../../utils/dataLoader";
import { cursoToSlug } from "../../../utils/cursoSlug";
import { markTopicViewed } from "../../../utils/storage";
import { useAuth } from "../../auth/hooks/useAuth";
import type { TopicData } from "../../../types/data";

export default function TopicPage() {
  const { subjectId, topicId } = useParams<{
    subjectId: string;
    topicId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId || !topicId || !user) return;
    loadTopicData(cursoToSlug(user.curso), subjectId, topicId)
      .then((data) => {
        setTopic(data);
        markTopicViewed(user.id, subjectId, topicId);
      })
      .catch(() => setTopic(null))
      .finally(() => setLoading(false));
  }, [subjectId, topicId, user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!topic) {
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
          Tema no encontrado
        </Typography>
        <Box
          onClick={() => navigate(`/subject/${subjectId}`)}
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
          Volver
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        className="fade-in-left"
        onClick={() => navigate(`/subject/${subjectId}`)}
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
        Volver a temas
      </Box>

      {/* Header card */}
      <Box
        className="fade-in-up stagger-2"
        sx={{
          bgcolor: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          p: { xs: 2.5, sm: 3.5 },
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography sx={{ fontSize: "2.4rem" }}>{topic.icon}</Typography>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={800}>
              {topic.title}
            </Typography>
            <Typography sx={{ color: "#546E7A" }}>
              {topic.description}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CTA Cards */}
      <Grid container spacing={2.5}>
        {/* Estudiar */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            className="fade-in-up stagger-3"
            onClick={() =>
              navigate(`/subject/${subjectId}/topic/${topicId}/slides`)
            }
            sx={{
              background: "linear-gradient(135deg, #7B1FA2, #AB47BC)",
              borderRadius: "24px",
              p: { xs: 3, sm: 4 },
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 6px 20px rgba(123,31,162,0.3)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 30px rgba(123,31,162,0.4)",
              },
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <AutoStoriesIcon
                sx={{ fontSize: 48, color: "rgba(255,255,255,0.9)", mb: 1.5 }}
              />
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: "white", mb: 0.5 }}
              >
                Estudiar
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}
              >
                Aprende los conceptos paso a paso
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.85rem",
                mt: 2,
                fontWeight: 600,
              }}
            >
              Empezar →
            </Typography>
          </Box>
        </Grid>

        {/* Hacer examen */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            className="fade-in-up stagger-4"
            onClick={() =>
              navigate(`/subject/${subjectId}/topic/${topicId}/exam`)
            }
            sx={{
              background: "linear-gradient(135deg, #26C6DA, #0288D1)",
              borderRadius: "24px",
              p: { xs: 3, sm: 4 },
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 6px 20px rgba(38,198,218,0.3)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 30px rgba(38,198,218,0.4)",
              },
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <QuizIcon
                sx={{ fontSize: 48, color: "rgba(255,255,255,0.9)", mb: 1.5 }}
              />
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: "white", mb: 0.5 }}
              >
                Hacer examen
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}
              >
                Comprueba lo que has aprendido
              </Typography>
            </Box>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.85rem",
                mt: 2,
                fontWeight: 600,
              }}
            >
              Empezar →
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
