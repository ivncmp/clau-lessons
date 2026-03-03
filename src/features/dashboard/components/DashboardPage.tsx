import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, alpha, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import QuizIcon from "@mui/icons-material/Quiz";
import StarIcon from "@mui/icons-material/Star";
import { loadCursoDetail } from "../../../utils/dataLoader";
import { cursoToSlug } from "../../../utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import { getProgress } from "../../../utils/storage";
import type { SubjectSummary, Evaluation } from "../../../types/data";

// Evaluation color palette (by index)
const EVAL_COLORS = [
  { bg: "#E8F5E9", color: "#2E7D32", header: "#2E7D32" }, // 1ª - green
  { bg: "#E3F2FD", color: "#1565C0", header: "#1565C0" }, // 2ª - blue
  { bg: "#FFF3E0", color: "#E65100", header: "#E65100" }, // 3ª - orange
  { bg: "#F3E5F5", color: "#7B1FA2", header: "#7B1FA2" }, // 4ª - purple
  { bg: "#FCE4EC", color: "#C62828", header: "#C62828" }, // Final - red
];

export function getEvalColor(index: number) {
  return EVAL_COLORS[index % EVAL_COLORS.length];
}

const MONTH_MAP: Record<string, { num: number; abbr: string }> = {
  enero: { num: 0, abbr: "ene" },
  febrero: { num: 1, abbr: "feb" },
  marzo: { num: 2, abbr: "mar" },
  abril: { num: 3, abbr: "abr" },
  mayo: { num: 4, abbr: "may" },
  junio: { num: 5, abbr: "jun" },
  julio: { num: 6, abbr: "jul" },
  agosto: { num: 7, abbr: "ago" },
  septiembre: { num: 8, abbr: "sep" },
  octubre: { num: 9, abbr: "oct" },
  noviembre: { num: 10, abbr: "nov" },
  diciembre: { num: 11, abbr: "dic" },
};

function parseSpanishDate(dateStr: string): Date {
  const [dayStr, , monthName] = dateStr.split(" ");
  const day = parseInt(dayStr);
  const { num: month } = MONTH_MAP[monthName];
  const now = new Date();
  const year =
    now.getMonth() >= 8
      ? month >= 8
        ? now.getFullYear()
        : now.getFullYear() + 1
      : month >= 8
        ? now.getFullYear() - 1
        : now.getFullYear();
  return new Date(year, month, day);
}

function formatDateFull(dateStr: string): string {
  const [dayStr, , monthName] = dateStr.split(" ");
  const { num: month } = MONTH_MAP[monthName];
  const now = new Date();
  const year =
    now.getMonth() >= 8
      ? month >= 8
        ? now.getFullYear()
        : now.getFullYear() + 1
      : month >= 8
        ? now.getFullYear() - 1
        : now.getFullYear();
  return `${dayStr} ${MONTH_MAP[monthName].abbr} ${year}`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    loadCursoDetail(cursoToSlug(user.curso))
      .then((data) => {
        setSubjects(data.subjects);
        setEvaluations(data.evaluations ?? []);
      })
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));
  }, [user]);

  const nextEvalIndex = useMemo(() => {
    if (evaluations.length === 0) return -1;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const idx = evaluations.findIndex((ev) => {
      const lastExam = ev.exams[ev.exams.length - 1];
      return parseSpanishDate(lastExam.date) >= now;
    });
    return idx === -1 ? evaluations.length - 1 : idx;
  }, [evaluations]);

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

      {/* Calendar section */}
      {evaluations.length > 0 && (
        <>
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
            Calendario
          </Typography>
          <Typography
            sx={{
              mb: 3,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
              textShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            Fechas de los exámenes
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {evaluations.map((ev, i) => {
              const isNext = i === nextEvalIndex;
              const isPast = i < nextEvalIndex;
              const statusLabel = isPast
                ? "Completada"
                : isNext
                  ? "Próxima"
                  : null;
              const evalColor = getEvalColor(i);
              return (
                <Box
                  key={ev.name}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                      md: "calc(33.33% - 11px)",
                    },
                    bgcolor: "rgba(255,255,255,0.93)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    border: "2px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      background: evalColor.header,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CalendarMonthIcon sx={{ fontSize: 20, color: "white" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      {ev.name}
                    </Typography>
                    {statusLabel && (
                      <Chip
                        label={statusLabel}
                        size="small"
                        sx={{
                          ml: "auto",
                          bgcolor: "rgba(255,255,255,0.25)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: 22,
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.8,
                    }}
                  >
                    {ev.exams.map((exam) => {
                      const subj = subjects.find(
                        (s) => s.id === exam.subjectId,
                      );
                      const content = ev.content?.[exam.subjectId];
                      return (
                        <Box
                          key={exam.date}
                          sx={{
                            px: 1,
                            py: 0.8,
                            borderRadius: "10px",
                            borderLeft: `3px solid ${subj?.color ?? "#ccc"}`,
                            bgcolor: "rgba(0,0,0,0.02)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "0.95rem", lineHeight: 1 }}
                            >
                              {subj?.icon}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: subj?.color ?? "#333",
                                fontSize: "0.8rem",
                              }}
                            >
                              {subj?.name ?? exam.subjectId}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                ml: "auto",
                                color: "#37474F",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                fontFamily: '"Quicksand", sans-serif',
                              }}
                            >
                              {formatDateFull(exam.date)}
                            </Typography>
                          </Box>
                          {content?.units?.length && (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                pl: 3.2,
                                mt: 0.3,
                                flexWrap: "wrap",
                              }}
                            >
                              {content.units.map((u) => (
                                <Chip
                                  key={u}
                                  label={`Unit ${u}`}
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                      `/subject/${exam.subjectId}/topic/${String(u).padStart(3, "0")}/lesson`,
                                    );
                                  }}
                                  sx={{
                                    height: 20,
                                    fontSize: "0.68rem",
                                    fontWeight: 600,
                                    bgcolor: alpha(
                                      subj?.color ?? "#78909C",
                                      0.1,
                                    ),
                                    color: subj?.color ?? "#78909C",
                                    cursor: "pointer",
                                    "&:hover": {
                                      bgcolor: alpha(
                                        subj?.color ?? "#78909C",
                                        0.2,
                                      ),
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}

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
