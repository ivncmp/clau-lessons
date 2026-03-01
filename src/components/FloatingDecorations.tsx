import { Box } from "@mui/material";

const decorations = [
  {
    emoji: "☁️",
    top: "6%",
    left: "5%",
    size: "2.5rem",
    animation: "floatCloud 20s ease-in-out infinite",
    opacity: 0.4,
  },
  {
    emoji: "☁️",
    top: "14%",
    right: "8%",
    size: "2rem",
    animation: "floatCloud 24s ease-in-out infinite -7s",
    opacity: 0.3,
  },
  {
    emoji: "⭐",
    top: "20%",
    left: "3%",
    size: "1.4rem",
    animation: "floatStar 6s ease-in-out infinite",
    opacity: 0.35,
  },
  {
    emoji: "✏️",
    top: "35%",
    right: "4%",
    size: "1.6rem",
    animation: "floatDrift 14s ease-in-out infinite",
    opacity: 0.3,
  },
  {
    emoji: "📚",
    bottom: "25%",
    left: "4%",
    size: "1.5rem",
    animation: "floatDrift 16s ease-in-out infinite -5s",
    opacity: 0.25,
  },
  {
    emoji: "🌟",
    bottom: "12%",
    right: "6%",
    size: "1.3rem",
    animation: "floatStar 5s ease-in-out infinite -2s",
    opacity: 0.3,
  },
  {
    emoji: "☁️",
    bottom: "35%",
    right: "12%",
    size: "1.8rem",
    animation: "floatCloud 22s ease-in-out infinite -10s",
    opacity: 0.25,
  },
  {
    emoji: "✨",
    top: "50%",
    left: "7%",
    size: "1.2rem",
    animation: "floatStar 4s ease-in-out infinite -1s",
    opacity: 0.3,
  },
];

export default function FloatingDecorations() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {decorations.map((d, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
            fontSize: d.size,
            opacity: d.opacity,
            animation: d.animation,
            willChange: "transform",
          }}
        >
          {d.emoji}
        </Box>
      ))}
    </Box>
  );
}
