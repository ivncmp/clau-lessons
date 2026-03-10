import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Chip, alpha } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useCursoDetail } from "@/hooks/useDataQueries";
import { courseToSlug } from "@/utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProgress, getAllInProgressExams } from "@/utils/storage";

interface FlatAttempt {
  subjectId: string;
  topicId: string;
  attemptId: string;
  completedAt: string;
  score: number;
  total: number;
  durationSeconds: number;
}

interface InProgressItem {
  subjectId: string;
  topicId: string;
  answeredCount: number;
  startedAt: number;
}

export default function ExamHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);
  const { data: cursoData, isLoading } = useCursoDetail(slug || undefined);

  const inProgress = useMemo<InProgressItem[]>(() => {
    if (!user) return [];
    return getAllInProgressExams(user.id).sort(
      (a, b) => b.startedAt - a.startedAt,
    );
  }, [user]);

  const attempts = useMemo(() => {
    if (!user) return [];
    const progress = getProgress(user.id);
    const flat: FlatAttempt[] = [];
    for (const [subjectId, subj] of Object.entries(progress.subjects)) {
      for (const [topicId, topic] of Object.entries(subj.topics)) {
        for (const attempt of topic.examAttempts) {
          flat.push({
            subjectId,
            topicId,
            attemptId: attempt.id,
            completedAt: attempt.completedAt,
            score: attempt.score,
            total: attempt.total,
            durationSeconds: attempt.durationSeconds,
          });
        }
      }
    }
    flat.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
    return flat;
  }, [user]);

  const subjectMap = useMemo(() => {
    const map: Record<string, { name: string; icon: string; color: string }> =
      {};
    for (const s of cursoData?.subjects ?? []) {
      map[s.id] = { name: s.name, icon: s.icon, color: s.color };
    }
    return map;
  }, [cursoData]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  const isEmpty = attempts.length === 0 && inProgress.length === 0;

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
        Historial de exámenes
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
        Tus exámenes en curso y completados
      </Typography>

      {isEmpty ? (
        <Box
          className="fade-in-up stagger-3"
          sx={{
            bgcolor: "rgba(255,255,255,0.93)",
            borderRadius: "24px",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>📝</Typography>
          <Typography variant="h6" fontWeight={600}>
            Aún no has hecho ningún examen
          </Typography>
          <Typography variant="body2" sx={{ color: "#78909C", mt: 0.5 }}>
            Cuando empieces o termines un examen, aparecerá aquí
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* In-progress exams */}
          {inProgress.map((ip, i) => {
            const subj = subjectMap[ip.subjectId];
            const date = new Date(ip.startedAt);
            const dateStr = date.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            });
            const timeStr = date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Box
                key={`ip-${ip.subjectId}-${ip.topicId}`}
                className={`fade-in-up stagger-${Math.min(i + 3, 12)}`}
                onClick={() =>
                  navigate(`/subject/${ip.subjectId}/topic/${ip.topicId}/exam`)
                }
                sx={{
                  bgcolor: "rgba(255,255,255,0.95)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                  border: "2px solid #FFA726",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 8px 24px ${alpha("#FFA726", 0.3)}`,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 5,
                      alignSelf: "stretch",
                      bgcolor: "#FFA726",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 2 },
                      p: { xs: 1.5, sm: 2 },
                      minHeight: 56,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "1.8rem" },
                        lineHeight: 1,
                      }}
                    >
                      {subj?.icon ?? "📝"}
                    </Typography>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          color: "#37474F",
                        }}
                        noWrap
                      >
                        {subj?.name ?? ip.subjectId} — Unidad{" "}
                        {parseInt(ip.topicId, 10) || ip.topicId}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#90A4AE", fontWeight: 500 }}
                      >
                        Empezado {dateStr} · {timeStr} · {ip.answeredCount}{" "}
                        respondidas
                      </Typography>
                    </Box>

                    <Chip
                      icon={<EditIcon sx={{ fontSize: 14 }} />}
                      label="Continuar"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        bgcolor: "#FFF3E0",
                        color: "#E65100",
                        border: "1px solid #FFCC80",
                        "& .MuiChip-icon": { color: "#E65100" },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Completed exams */}
          {attempts.map((a, i) => {
            const subj = subjectMap[a.subjectId];
            const pct = Math.round((a.score / a.total) * 100);
            const date = new Date(a.completedAt);
            const dateStr = date.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const minutes = Math.floor(a.durationSeconds / 60);
            const seconds = a.durationSeconds % 60;
            const color = subj?.color ?? "#78909C";

            return (
              <Box
                key={a.attemptId}
                className={`fade-in-up stagger-${Math.min(i + inProgress.length + 3, 12)}`}
                onClick={() =>
                  navigate(
                    `/exam-history/${a.subjectId}/${a.topicId}/${a.attemptId}`,
                  )
                }
                sx={{
                  bgcolor: "rgba(255,255,255,0.95)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 8px 24px ${alpha(color, 0.2)}`,
                    borderColor: color,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 5,
                      alignSelf: "stretch",
                      bgcolor: color,
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 2 },
                      p: { xs: 1.5, sm: 2 },
                      minHeight: 56,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "1.8rem" },
                        lineHeight: 1,
                      }}
                    >
                      {subj?.icon ?? "📝"}
                    </Typography>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          color: "#37474F",
                        }}
                        noWrap
                      >
                        {subj?.name ?? a.subjectId} — Unidad{" "}
                        {parseInt(a.topicId, 10) || a.topicId}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#90A4AE", fontWeight: 500 }}
                      >
                        {dateStr} · {timeStr} · {minutes}:
                        {seconds.toString().padStart(2, "0")}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "center", flexShrink: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CheckCircleIcon
                          sx={{
                            fontSize: 18,
                            color:
                              pct >= 70
                                ? "#43A047"
                                : pct >= 50
                                  ? "#E65100"
                                  : "#EF5350",
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: "1.1rem", sm: "1.3rem" },
                            color:
                              pct >= 70
                                ? "#2E7D32"
                                : pct >= 50
                                  ? "#E65100"
                                  : "#D32F2F",
                          }}
                        >
                          {pct}%
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#90A4AE", fontSize: "0.7rem" }}
                      >
                        {a.score}/{a.total}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
