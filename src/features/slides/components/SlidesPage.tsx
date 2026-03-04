import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import {
  useSlidesData,
  useTopicData,
  useSubjectDetail,
} from "@/hooks/useDataQueries";
import { courseToSlug } from "@/utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import { useSlides } from "../hooks/useSlides";
import SlideRenderer from "./SlideRenderer";
import type { SlidesData, TopicData, SubjectDetail } from "@/types/data";

export default function SlidesPage() {
  const { subjectId, topicId } = useParams<{
    subjectId: string;
    topicId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);

  const { data: slidesData, isPending: loading } = useSlidesData(
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

  const handleExit = () =>
    navigate(`/subject/${subjectId}/topic/${topicId}/lesson`);

  if (loading || !slidesData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(170deg, #E67E22 0%, #F0A04B 25%, #FAD7A0 55%, #FEF5E7 80%, #FDEBD0 100%)",
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: "white" }} />
        ) : (
          <Box sx={{ textAlign: "center", px: 3 }}>
            <Typography sx={{ fontSize: "3rem", mb: 1 }}>📖</Typography>
            <Typography variant="h5" sx={{ color: "white" }}>
              Diapositivas no disponibles
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 1 }}>
              Estamos preparando el contenido, pronto estará listo
            </Typography>
            <Button onClick={handleExit} sx={{ mt: 3, color: "white" }}>
              Volver
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <SlidesRunner
      slidesData={slidesData}
      topicData={topicData ?? null}
      subjectData={subjectData ?? null}
      course={user!.course}
      onExit={handleExit}
    />
  );
}

// ─── Inner component that uses the slides hook ─────────────────

interface SlidesRunnerProps {
  slidesData: SlidesData;
  topicData: TopicData | null;
  subjectData: SubjectDetail | null;
  course: string;
  onExit: () => void;
}

function SlidesRunner({
  slidesData,
  topicData,
  subjectData,
  course,
  onExit,
}: Readonly<SlidesRunnerProps>) {
  const slides = useSlides(slidesData.slides);
  const progress = ((slides.currentIndex + 1) / slides.totalSlides) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #E67E22 0%, #F0A04B 25%, #FAD7A0 55%, #FEF5E7 80%, #FDEBD0 100%)",
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
            Diapositiva {slides.currentIndex + 1} de {slides.totalSlides}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              bgcolor: "#FEF5E7",
              px: 1.5,
              py: 0.3,
              borderRadius: 2,
              color: "#E67E22",
              whiteSpace: "nowrap",
            }}
          >
            {slides.currentIndex + 1}/{slides.totalSlides}
          </Typography>
        </Container>
        {/* Progress bar */}
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
                background: "linear-gradient(90deg, #F0A04B, #E67E22, #C56A12)",
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

      {/* Slide content */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}
      >
        <Box
          key={slides.currentSlide.id}
          className="exam-card-in"
          sx={{
            bgcolor: "rgba(255,255,255,0.93)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <SlideRenderer slide={slides.currentSlide} />
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
            disabled={slides.isFirst}
            onClick={slides.prev}
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

          {slides.isLast ? (
            <Button
              onClick={onExit}
              sx={{
                background: "linear-gradient(135deg, #E67E22, #C56A12)",
                color: "white",
                borderRadius: "18px",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.05rem",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(123,31,162,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #D4701A, #A85C13)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(123,31,162,0.5)",
                },
                transition: "all 0.2s",
              }}
            >
              Volver al tema
            </Button>
          ) : (
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={slides.next}
              sx={{
                background: "linear-gradient(135deg, #F0A04B, #E67E22)",
                color: "white",
                borderRadius: "18px",
                px: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.05rem",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(171,71,188,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #E67E22, #D4701A)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(171,71,188,0.5)",
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
