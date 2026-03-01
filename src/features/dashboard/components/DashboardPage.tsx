import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { loadCursoDetail } from "../../../utils/dataLoader";
import { cursoToSlug } from "../../../utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
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
          textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Asignaturas
      </Typography>
      <Typography
        className="fade-in-up stagger-2"
        sx={{
          mb: 4,
          color: "rgba(255,255,255,0.85)",
          fontWeight: 500,
        }}
      >
        {user?.curso} — Elige una asignatura para empezar
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {subjects.map((subject, i) => (
          <Grid key={subject.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Box
              className={`fade-in-up stagger-${i + 3}`}
              onClick={() => navigate(`/subject/${subject.id}`)}
              sx={{
                bgcolor: "rgba(255,255,255,0.93)",
                backdropFilter: "blur(10px)",
                borderRadius: "24px",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                border: "2px solid transparent",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  borderColor: subject.color,
                },
              }}
            >
              <Typography sx={{ fontSize: "2.8rem", mb: 1 }}>
                {subject.icon}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {subject.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#78909C", mt: 0.5 }}>
                {subject.topicCount}{" "}
                {subject.topicCount === 1 ? "tema" : "temas"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
