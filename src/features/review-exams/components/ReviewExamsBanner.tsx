import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { useReviewExamsIndex } from "@/hooks/useDataQueries";
import { courseToSlug } from "@/utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ReviewExamsBanner() {
  const { user } = useAuth();
  const slug = courseToSlug(user?.course);
  const navigate = useNavigate();
  const { data } = useReviewExamsIndex(slug || undefined);

  if (!data || data.evaluations.length === 0) return null;

  const totalExams = data.evaluations.reduce(
    (sum, ev) => sum + ev.exams.length,
    0,
  );

  return (
    <Box
      onClick={() => navigate("/review-exams")}
      sx={{
        mb: { xs: 3, sm: 4 },
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: "16px", sm: "20px" },
        background:
          "linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #F4511E 100%)",
        boxShadow: "0 8px 32px rgba(244,81,30,0.3)",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 40px rgba(244,81,30,0.4)",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 44, sm: 52 },
          height: { xs: 44, sm: 52 },
          borderRadius: "14px",
          bgcolor: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <HistoryEduIcon sx={{ fontSize: { xs: 26, sm: 30 }, color: "white" }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: "white",
            fontWeight: 800,
            fontSize: { xs: "1rem", sm: "1.15rem" },
            lineHeight: 1.3,
          }}
        >
          Repasa los exámenes anteriores
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.85)",
            fontSize: { xs: "0.78rem", sm: "0.85rem" },
            fontWeight: 500,
            mt: 0.3,
          }}
        >
          {totalExams} exámenes disponibles
        </Typography>
      </Box>
      <ArrowForwardIcon
        sx={{ color: "rgba(255,255,255,0.8)", fontSize: { xs: 22, sm: 26 } }}
      />
    </Box>
  );
}
