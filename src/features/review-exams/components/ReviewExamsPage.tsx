import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Chip, alpha } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useReviewExamsIndex } from "@/hooks/useDataQueries";
import { courseToSlug } from "@/utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";

const EVAL_COLORS: Record<
  string,
  { bg: string; header: string; border: string }
> = {
  "3-evaluacion": { bg: "#FFF3E0", header: "#E65100", border: "#FFCC80" },
  "2-evaluacion": { bg: "#E3F2FD", header: "#1565C0", border: "#90CAF9" },
  "1-evaluacion": { bg: "#E8F5E9", header: "#2E7D32", border: "#A5D6A7" },
  "4-evaluacion": { bg: "#F3E5F5", header: "#7B1FA2", border: "#CE93D8" },
  final: { bg: "#FCE4EC", header: "#C62828", border: "#EF9A9A" },
};

const DEFAULT_COLOR = { bg: "#ECEFF1", header: "#546E7A", border: "#CFD8DC" };

export default function ReviewExamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);
  const { data, isLoading } = useReviewExamsIndex(slug || undefined);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!data || data.evaluations.length === 0) {
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
          No hay exámenes anteriores disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        onClick={() => navigate("/dashboard")}
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
          Dashboard
        </Typography>
      </Box>

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
        Repasa los exámenes anteriores
      </Typography>
      <Typography
        className="fade-in-up stagger-2"
        sx={{
          mb: { xs: 2, sm: 4 },
          color: "rgba(255,255,255,0.9)",
          fontWeight: 500,
          fontSize: { xs: "0.85rem", sm: "1rem" },
          textShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      >
        Vuelve a hacer los exámenes para practicar
      </Typography>

      {data.evaluations.map((evaluation, evalIdx) => {
        const colors = EVAL_COLORS[evaluation.id] ?? DEFAULT_COLOR;
        return (
          <Box
            key={evaluation.id}
            className={`fade-in-up stagger-${Math.min(evalIdx + 3, 12)}`}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: "white",
                textShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              {evaluation.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 2, md: 3 },
                mb: 4,
              }}
            >
              {evaluation.exams.map((exam, i) => (
                <Box
                  key={exam.id}
                  className={`fade-in-up stagger-${Math.min(i + 4, 12)}`}
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.33% - 16px)",
                    },
                  }}
                >
                  <Box
                    onClick={() =>
                      navigate(`/review-exams/${evaluation.id}/${exam.id}`)
                    }
                    sx={{
                      bgcolor: "rgba(255,255,255,0.95)",
                      borderRadius: { xs: "16px", sm: "20px" },
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      transition: "all 0.2s",
                      border: `2px solid transparent`,
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: `0 12px 40px ${alpha(colors.header, 0.25)}`,
                        borderColor: colors.header,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: { xs: 4, sm: 6 },
                        bgcolor: colors.header,
                      }}
                    />
                    <Box sx={{ p: { xs: 1.5, sm: 2.5 }, textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "2rem", sm: "2.5rem" },
                          lineHeight: 1,
                          mb: { xs: 0.5, sm: 1 },
                        }}
                      >
                        {exam.icon}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1.05rem" },
                        }}
                      >
                        {exam.title}
                      </Typography>
                      <Chip
                        label={`${exam.questionCount} preguntas`}
                        size="small"
                        sx={{
                          mt: 1,
                          height: { xs: 20, sm: 24 },
                          fontSize: { xs: "0.65rem", sm: "0.72rem" },
                          fontWeight: 700,
                          bgcolor: colors.bg,
                          color: colors.header,
                          border: `1px solid ${colors.border}`,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
