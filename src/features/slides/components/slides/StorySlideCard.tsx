import { Box, Typography } from "@mui/material";
import type { StorySlide } from "@/types/data";

interface StorySlideCardProps {
  slide: StorySlide;
}

export default function StorySlideCard({
  slide,
}: Readonly<StorySlideCardProps>) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography sx={{ fontSize: "2rem" }}>{slide.emoji}</Typography>
        <Typography variant="h5" fontWeight={800} sx={{ color: "#E65100" }}>
          {slide.title}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2.5,
          bgcolor: "#FFFDE7",
          border: "2px solid #FDD835",
          borderRadius: "16px",
        }}
      >
        <Box
          sx={{
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "#3E2723",
            "& .hl": {
              bgcolor: "#FFF9C4",
              px: 0.5,
              borderRadius: "4px",
              fontWeight: 700,
            },
          }}
          dangerouslySetInnerHTML={{ __html: slide.html }}
        />
      </Box>
    </Box>
  );
}
