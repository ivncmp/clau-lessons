import { Box, Typography, Stack } from "@mui/material";
import type { SummarySlide } from "@/types/data";

const POINT_COLORS = [
  { bg: "#D6EAF8", color: "#1B4F72" },
  { bg: "#E8F5E9", color: "#2E7D32" },
  { bg: "#FFF3E0", color: "#E65100" },
  { bg: "#FEF5E7", color: "#D4701A" },
  { bg: "#D6EAF8", color: "#00695C" },
  { bg: "#FFF8E1", color: "#F57F17" },
];

interface SummarySlideCardProps {
  slide: SummarySlide;
}

export default function SummarySlideCard({
  slide,
}: Readonly<SummarySlideCardProps>) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: "2rem" }}>{slide.emoji}</Typography>
        <Typography variant="h5" fontWeight={800}>
          {slide.title}
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {slide.points.map((point, i) => {
          const palette = POINT_COLORS[i % POINT_COLORS.length];
          return (
            <Box
              key={i}
              sx={{
                bgcolor: palette.bg,
                borderRadius: "14px",
                px: 2.5,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                color: palette.color,
              }}
            >
              {point}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
