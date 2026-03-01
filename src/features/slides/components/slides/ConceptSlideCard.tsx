import { Box, Typography } from "@mui/material";
import type { ConceptSlide } from "@/types/data";

interface ConceptSlideCardProps {
  slide: ConceptSlide;
}

export default function ConceptSlideCard({
  slide,
}: Readonly<ConceptSlideCardProps>) {
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
          lineHeight: 1.8,
          color: "#37474F",
          "& .hl": {
            bgcolor: "#E8EAF6",
            px: 0.5,
            borderRadius: "4px",
            fontWeight: 700,
            color: "#283593",
          },
        }}
        dangerouslySetInnerHTML={{ __html: slide.content }}
      />

      {slide.tip && (
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            bgcolor: "#FFF8E1",
            border: "2px solid #FFD54F",
            borderRadius: "14px",
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
          }}
        >
          <Typography sx={{ fontSize: "1.3rem", lineHeight: 1 }}>💡</Typography>
          <Typography
            sx={{ fontSize: "0.95rem", color: "#E65100", fontWeight: 600 }}
          >
            {slide.tip}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
