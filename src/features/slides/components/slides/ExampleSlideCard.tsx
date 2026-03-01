import { Box, Typography, Stack } from "@mui/material";
import type { ExampleSlide } from "@/types/data";

interface ExampleSlideCardProps {
  slide: ExampleSlide;
}

export default function ExampleSlideCard({
  slide,
}: Readonly<ExampleSlideCardProps>) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography sx={{ fontSize: "2rem" }}>{slide.emoji}</Typography>
        <Typography variant="h5" fontWeight={800}>
          {slide.title}
        </Typography>
      </Box>

      <Box
        sx={{
          fontSize: "1.05rem",
          lineHeight: 1.7,
          color: "#37474F",
          mb: 2,
          "& .hl": {
            bgcolor: "#E3F2FD",
            px: 0.5,
            borderRadius: "4px",
            fontWeight: 700,
            color: "#1565C0",
          },
        }}
        dangerouslySetInnerHTML={{ __html: slide.problem }}
      />

      <Stack spacing={1.5} sx={{ mb: 2.5 }}>
        {slide.steps.map((step, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: "#E3F2FD",
              borderRadius: "12px",
              px: 2.5,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1565C0",
            }}
          >
            {step}
          </Box>
        ))}
      </Stack>

      <Box
        sx={{
          bgcolor: "#E8F5E9",
          border: "2px solid #66BB6A",
          borderRadius: "14px",
          px: 2.5,
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#2E7D32" }}
        >
          {slide.answer}
        </Typography>
      </Box>
    </Box>
  );
}
