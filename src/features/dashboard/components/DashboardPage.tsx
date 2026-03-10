import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, alpha, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useCursoDetail, useEvaluations } from "@/hooks/useDataQueries";
import { courseToSlug } from "../../../utils/cursoSlug";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  getProgress,
  getAllInProgressExamsCount,
  getMentalMathStats,
} from "../../../utils/storage";
import MentalMathCarousel from "./MentalMathCarousel";
import ReviewExamsBanner from "../../review-exams/components/ReviewExamsBanner";

// Evaluation color palette (by index)
const EVAL_COLORS = [
  { bg: "#E8F5E9", color: "#2E7D32", header: "#2E7D32", border: "#A5D6A7" }, // 1ª - green
  { bg: "#E3F2FD", color: "#1565C0", header: "#1565C0", border: "#90CAF9" }, // 2ª - blue
  { bg: "#FFF3E0", color: "#E65100", header: "#E65100", border: "#FFCC80" }, // 3ª - orange
  { bg: "#F3E5F5", color: "#7B1FA2", header: "#7B1FA2", border: "#CE93D8" }, // 4ª - purple
  { bg: "#FCE4EC", color: "#C62828", header: "#C62828", border: "#EF9A9A" }, // Final - red
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
  const navigate = useNavigate();
  const slug = courseToSlug(user?.course);

  const { data: cursoData, isLoading: cursoLoading } = useCursoDetail(
    slug || undefined,
  );
  const { data: evaluations = [], isLoading: evalsLoading } = useEvaluations(
    slug || undefined,
    user?.classId || undefined,
  );

  const subjects = cursoData?.subjects ?? [];
  const loading = cursoLoading || evalsLoading;
  const [statsVersion, setStatsVersion] = useState(0);

  const nextEvalIndex = useMemo(() => {
    if (evaluations.length === 0) return -1;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const idx = evaluations.findIndex((ev) => {
      if (ev.exams.length === 0) return false;
      const lastExam = ev.exams[ev.exams.length - 1];
      if (!lastExam.date) return true;
      return parseSpanishDate(lastExam.date) >= now;
    });
    return idx === -1 ? evaluations.length - 1 : idx;
  }, [evaluations]);

  const stats = useMemo(() => {
    if (!user)
      return {
        totalExams: 0,
        avgScore: 0,
        bestScore: 0,
        inProgress: 0,
        mentalMath: { rounds: 0, totalCorrect: 0, totalAttempted: 0 },
      };
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
    const inProgress = getAllInProgressExamsCount(user.id);
    const mentalMath = getMentalMathStats(user.id);
    return {
      totalExams,
      avgScore:
        totalExams > 0 ? Math.round((totalScore / totalExams) * 100) : 0,
      bestScore: Math.round(bestScore * 100),
      inProgress,
      mentalMath,
    };
  }, [user, statsVersion]);

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
          Los contenidos para {user?.course} se están preparando.
        </Typography>
      </Box>
    );
  }

  const STATUS_CONFIG: Record<
    string,
    { label: string; bg: string; color: string; border: string }
  > = {
    ready: {
      label: "Listo",
      bg: "#E8F5E9",
      color: "#2E7D32",
      border: "#A5D6A7",
    },
    building: {
      label: "En progreso",
      bg: "#FFF3E0",
      color: "#E65100",
      border: "#FFCC80",
    },
    pending: {
      label: "Pendiente",
      bg: "#ECEFF1",
      color: "#78909C",
      border: "#CFD8DC",
    },
  };

  const visible = subjects.filter((s) => !s.disabled);
  const calBase = Math.min(visible.length + 3, 10);
  const progBase = Math.min(calBase + 2 + evaluations.length, 10);

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
          mb: { xs: 2, sm: 4 },
          color: "rgba(255,255,255,0.9)",
          fontWeight: 500,
          fontSize: { xs: "0.85rem", sm: "1rem" },
          textShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      >
        {user?.course} — Elige una asignatura para empezar
      </Typography>

      <ReviewExamsBanner />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: { xs: 2, md: 3 },
        }}
      >
        {visible.map((subject, i) => {
          return (
            <Box
              key={subject.id}
              className={`fade-in-up stagger-${Math.min(i + 3, 12)}`}
              sx={{
                width: {
                  xs: "calc(50% - 8px)",
                  sm: "calc(33.33% - 16px)",
                  md: "calc(33.33% - 16px)",
                },
              }}
            >
              <Box
                onClick={() => navigate(`/subject/${subject.id}`)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: { xs: "16px", sm: "24px" },
                  overflow: "hidden",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                  border: "2px solid transparent",
                  opacity: subject.status === "pending" ? 0.75 : 1,
                  filter:
                    subject.status === "pending" ? "grayscale(1)" : "none",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 12px 40px ${alpha(subject.color, 0.25)}`,
                    borderColor: subject.color,
                    opacity: 1,
                    filter: "none",
                  },
                }}
              >
                {/* Color accent bar */}
                <Box
                  sx={{
                    height: { xs: 4, sm: 6 },
                    background: `linear-gradient(90deg, ${subject.color}, ${alpha(subject.color, 0.5)})`,
                  }}
                />
                <Box sx={{ p: { xs: 1.5, sm: 3 }, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 64 },
                      height: { xs: 40, sm: 64 },
                      mx: "auto",
                      mb: { xs: 0.5, sm: 1.5 },
                      borderRadius: { xs: "10px", sm: "16px" },
                      bgcolor: alpha(subject.color, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "1.4rem", sm: "2.2rem" },
                        lineHeight: 1,
                      }}
                    >
                      {subject.icon}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.95rem", sm: "1.15rem" },
                    }}
                  >
                    {subject.name}
                  </Typography>
                  {subject.status && STATUS_CONFIG[subject.status] && (
                    <Chip
                      label={STATUS_CONFIG[subject.status].label}
                      size="small"
                      sx={{
                        mt: { xs: 0.5, sm: 1 },
                        height: { xs: 18, sm: 22 },
                        fontSize: { xs: "0.6rem", sm: "0.7rem" },
                        fontWeight: 700,
                        bgcolor: STATUS_CONFIG[subject.status].bg,
                        color: STATUS_CONFIG[subject.status].color,
                        border: `1px solid ${STATUS_CONFIG[subject.status].border}`,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Mental math section */}
      <Typography
        variant="h4"
        component="h2"
        className={`fade-in-up stagger-${calBase}`}
        sx={{
          fontWeight: 800,
          mt: { xs: 3, sm: 6 },
          mb: 0.5,
          color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Cálculo mental
      </Typography>
      <Typography
        className={`fade-in-up stagger-${calBase + 1}`}
        sx={{
          mb: { xs: 2, sm: 3 },
          color: "rgba(255,255,255,0.85)",
          fontWeight: 500,
          fontSize: { xs: "0.85rem", sm: "1rem" },
          textShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        Practica sumas y restas
      </Typography>
      <Box className={`fade-in-up stagger-${calBase + 2}`}>
        <MentalMathCarousel onComplete={() => setStatsVersion((v) => v + 1)} />
      </Box>

      {/* Calendar section */}
      {evaluations.length > 0 && (
        <>
          <Typography
            variant="h4"
            component="h2"
            className={`fade-in-up stagger-${calBase}`}
            sx={{
              fontWeight: 800,
              mt: { xs: 3, sm: 6 },
              mb: 0.5,
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Calendario
          </Typography>
          <Typography
            className={`fade-in-up stagger-${calBase + 1}`}
            sx={{
              mb: 3,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
              fontSize: { xs: "0.85rem", sm: "1rem" },
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
                  className={`fade-in-up stagger-${Math.min(calBase + 2 + i, 12)}`}
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
                          border: "1px solid rgba(255,255,255,0.4)",
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
                          key={`${exam.subjectId}-${exam.date ?? "nodate"}`}
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
                              {exam.date
                                ? formatDateFull(exam.date)
                                : "Sin fecha"}
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
                                    border: `1px solid ${alpha(subj?.color ?? "#78909C", 0.3)}`,
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
        className={`fade-in-up stagger-${progBase}`}
        sx={{
          fontWeight: 800,
          mt: { xs: 3, sm: 6 },
          mb: 0.5,
          color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Progreso
      </Typography>
      <Typography
        className={`fade-in-up stagger-${progBase + 1}`}
        sx={{
          mb: 3,
          color: "rgba(255,255,255,0.85)",
          fontWeight: 500,
          fontSize: { xs: "0.85rem", sm: "1rem" },
          textShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        Tus resultados en los exámenes
      </Typography>

      {stats.totalExams === 0 &&
      stats.inProgress === 0 &&
      stats.mentalMath.rounds === 0 ? (
        <Box
          className={`fade-in-up stagger-${progBase + 2}`}
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
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Exams */}
          <ProgressCard
            className={`fade-in-up stagger-${progBase + 2}`}
            emoji="📝"
            title="Exámenes"
            barValue={null}
            barColor=""
            headerAction={
              stats.totalExams > 0 ? (
                <Typography
                  variant="caption"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/exam-history");
                  }}
                  sx={{
                    color: "#2E86C1",
                    fontWeight: 700,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Ver todos
                </Typography>
              ) : undefined
            }
            mainText={
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: "#2E86C1" }}
                >
                  {stats.totalExams}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#78909C", fontWeight: 600 }}
                >
                  {stats.totalExams === 1 ? "completado" : "completados"}
                </Typography>
              </Box>
            }
            detail={
              stats.inProgress > 0
                ? `✏️ ${stats.inProgress} en curso`
                : undefined
            }
            motivation={
              stats.totalExams >= 5
                ? {
                    emoji: "🏅",
                    text: "¡Gran trabajo!",
                    color: "#2E7D32",
                    bg: "#E8F5E9",
                  }
                : stats.totalExams >= 2
                  ? {
                      emoji: "💪",
                      text: "¡Sigue así!",
                      color: "#1565C0",
                      bg: "#E3F2FD",
                    }
                  : {
                      emoji: "🚀",
                      text: "¡A por más exámenes!",
                      color: "#E65100",
                      bg: "#FFF3E0",
                    }
            }
          />

          {/* Average score */}
          {stats.totalExams > 0 && (
            <ProgressCard
              className={`fade-in-up stagger-${progBase + 3}`}
              emoji="⭐"
              title="Nota media"
              barValue={stats.avgScore}
              barColor={
                stats.avgScore >= 70
                  ? "linear-gradient(90deg, #66BB6A, #43A047)"
                  : stats.avgScore >= 40
                    ? "linear-gradient(90deg, #FFA726, #FB8C00)"
                    : "linear-gradient(90deg, #EF5350, #E53935)"
              }
              detail={`🏆 Mejor nota: ${stats.bestScore}%`}
              motivation={
                stats.avgScore >= 80
                  ? {
                      emoji: "🌟",
                      text: "¡Eres un hacha!",
                      color: "#2E7D32",
                      bg: "#E8F5E9",
                    }
                  : stats.avgScore >= 60
                    ? {
                        emoji: "👏",
                        text: "¡Sigue así!",
                        color: "#1565C0",
                        bg: "#E3F2FD",
                      }
                    : {
                        emoji: "📚",
                        text: "¡Tienes que mejorar!",
                        color: "#E65100",
                        bg: "#FFF3E0",
                      }
              }
            />
          )}

          {/* Mental math */}
          {stats.mentalMath.rounds > 0 &&
            (() => {
              const pct =
                stats.mentalMath.totalAttempted > 0
                  ? Math.round(
                      (stats.mentalMath.totalCorrect /
                        stats.mentalMath.totalAttempted) *
                        100,
                    )
                  : 0;
              return (
                <ProgressCard
                  className={`fade-in-up stagger-${progBase + 4}`}
                  emoji="🧮"
                  title="Cálculo mental"
                  barValue={pct}
                  barColor={
                    pct >= 70
                      ? "linear-gradient(90deg, #AB47BC, #8E24AA)"
                      : pct >= 40
                        ? "linear-gradient(90deg, #FFA726, #FB8C00)"
                        : "linear-gradient(90deg, #EF5350, #E53935)"
                  }
                  detail={`${stats.mentalMath.totalCorrect}/${stats.mentalMath.totalAttempted} aciertos en ${stats.mentalMath.rounds} ${stats.mentalMath.rounds === 1 ? "ronda" : "rondas"}`}
                  motivation={
                    pct >= 80
                      ? {
                          emoji: "🔥",
                          text: "¡Eres un hacha!",
                          color: "#7B1FA2",
                          bg: "#F3E5F5",
                        }
                      : pct >= 60
                        ? {
                            emoji: "💪",
                            text: "¡Sigue así!",
                            color: "#1565C0",
                            bg: "#E3F2FD",
                          }
                        : {
                            emoji: "🧠",
                            text: "¡Debes practicar más cálculo!",
                            color: "#E65100",
                            bg: "#FFF3E0",
                          }
                  }
                />
              );
            })()}
        </Box>
      )}
    </Box>
  );
}

/* ─── Progress Card ────────────────────────────────────────────── */

interface ProgressCardProps {
  className?: string;
  emoji: string;
  title: string;
  barValue: number | null;
  barColor: string;
  mainText?: React.ReactNode;
  detail?: string;
  motivation?: { text: string; emoji: string; color: string; bg: string };
  headerAction?: React.ReactNode;
}

function ProgressCard({
  className,
  emoji,
  title,
  barValue,
  barColor,
  mainText,
  detail,
  motivation,
  headerAction,
}: Readonly<ProgressCardProps>) {
  return (
    <Box
      className={className}
      sx={{
        width: { xs: "100%", sm: "calc(33.33% - 11px)" },
        bgcolor: "rgba(255,255,255,0.93)",
        borderRadius: "20px",
        p: { xs: 2.5, sm: 3 },
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        minHeight: 140,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: "auto" }}>
        <Typography sx={{ fontSize: "1.6rem", lineHeight: 1 }}>
          {emoji}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          sx={{ color: "#37474F", flex: 1 }}
        >
          {title}
        </Typography>
        {headerAction}
      </Box>

      {/* Bar or custom content */}
      <Box sx={{ mt: 2 }}>
        {barValue !== null ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                flex: 1,
                height: 14,
                borderRadius: "20px",
                bgcolor: "#F0F0F0",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${barValue}%`,
                  minWidth: barValue > 0 ? 14 : 0,
                  height: "100%",
                  borderRadius: "20px",
                  background: barColor,
                  transition: "width 1s ease-out",
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
            <Typography
              variant="body1"
              fontWeight={800}
              sx={{ color: "#37474F", minWidth: 45, textAlign: "right" }}
            >
              {barValue}%
            </Typography>
          </Box>
        ) : (
          mainText
        )}
      </Box>

      {/* Detail */}
      {detail && (
        <Typography
          variant="body2"
          sx={{ color: "#78909C", fontWeight: 600, mt: 1.5 }}
        >
          {detail}
        </Typography>
      )}

      {/* Motivational alert */}
      {motivation && (
        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 0.8,
            borderRadius: "10px",
            bgcolor: motivation.bg,
            display: "flex",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          <Typography sx={{ fontSize: "0.95rem", lineHeight: 1 }}>
            {motivation.emoji}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: motivation.color,
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            {motivation.text}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
