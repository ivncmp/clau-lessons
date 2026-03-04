import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "../../auth/hooks/useAuth";

const AVATARS = [
  // Caras
  "😊",
  "😎",
  "🤓",
  "🥳",
  "😜",
  "🤗",
  "😇",
  "🥰",
  "🤩",
  "😺",
  // Animales
  "🐶",
  "🐱",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐸",
  "🐵",
  "🦄",
  "🐲",
  "🦋",
  "🐢",
  "🐬",
  "🦩",
  "🦜",
  "🐝",
  "🐙",
  "🦈",
  "🐘",
  "🦒",
  "🐧",
  "🦉",
  "🐞",
  "🦎",
  "🐳",
  "🦑",
  "🐿️",
  // Naturaleza
  "🌈",
  "⭐",
  "🌸",
  "🍀",
  "🌻",
  "🌺",
  "🍄",
  "🌵",
  "🌴",
  "🌙",
  // Objetos y actividades
  "🎨",
  "🎵",
  "🚀",
  "⚽",
  "🏀",
  "🎸",
  "👑",
  "💎",
  "🍭",
  "🎪",
  "🦸",
  "🎯",
  "🛹",
  "🎮",
  "🏆",
  "🎭",
  "🔮",
  "🧸",
  "🎈",
  "🌍",
  // Comida
  "🍕",
  "🍩",
  "🍓",
  "🍉",
  "🍎",
  "🧁",
  "🍪",
  "🌮",
  "🍦",
  "🥑",
  // Transporte
  "🚗",
  "✈️",
  "🚂",
  "🛸",
  "🚁",
  "⛵",
  "🏎️",
  "🚲",
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "😊");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges = name !== user?.name || avatar !== (user?.avatar ?? "😊");

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box>
      <Box
        className="fade-in-left"
        onClick={() => navigate("/dashboard")}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          mb: 3,
          color: "rgba(255,255,255,0.85)",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { color: "white" },
        }}
      >
        <ArrowBackIcon fontSize="small" />
        Volver
      </Box>

      <Typography
        variant="h4"
        component="h1"
        className="fade-in-up stagger-2"
        sx={{
          fontWeight: 800,
          mb: 0.5,
          color: "white",
          textShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Mi perfil
      </Typography>
      <Typography
        className="fade-in-up stagger-3"
        sx={{
          mb: { xs: 2, sm: 4 },
          color: "rgba(255,255,255,0.8)",
          fontWeight: 500,
          fontSize: { xs: "0.85rem", sm: "1rem" },
        }}
      >
        {user?.course}
        {user?.classId ? ` · ${user.classId}` : ""}
      </Typography>

      <Box
        className="fade-in-up stagger-4"
        sx={{
          bgcolor: "rgba(255,255,255,0.93)",
          borderRadius: "24px",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          maxWidth: 500,
        }}
      >
        {/* Avatar preview — click to open picker */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            onClick={() => setAvatarOpen(true)}
            sx={{
              width: 96,
              height: 96,
              mx: "auto",
              mb: 1,
              borderRadius: "50%",
              bgcolor: "#D6EAF8",
              border: "3px solid #2E86C1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "scale(1.08)",
                boxShadow: "0 4px 16px rgba(46,134,193,0.3)",
              },
            }}
          >
            {avatar}
          </Box>
          <Typography
            variant="caption"
            onClick={() => setAvatarOpen(true)}
            sx={{
              color: "#2E86C1",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Cambiar avatar
          </Typography>
        </Box>

        {/* Name field */}
        <TextField
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": { borderRadius: "14px" },
          }}
        />

        {/* Save button */}
        <Box
          component="button"
          type="button"
          onClick={handleSave}
          sx={{
            width: "100%",
            p: 1.5,
            border: "none",
            borderRadius: "18px",
            background:
              hasChanges && name.trim()
                ? "linear-gradient(135deg, #5DADE2, #2E86C1)"
                : saved
                  ? "#66BB6A"
                  : "#E0E0E0",
            color: hasChanges || saved ? "white" : "#9E9E9E",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "1.05rem",
            cursor: hasChanges && name.trim() ? "pointer" : "default",
            boxShadow:
              hasChanges && name.trim()
                ? "0 4px 14px rgba(38,198,218,0.4)"
                : "none",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            "&:hover":
              hasChanges && name.trim()
                ? {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(38,198,218,0.5)",
                  }
                : {},
          }}
          disabled={!hasChanges || !name.trim()}
        >
          {saved ? (
            <>
              <CheckIcon fontSize="small" />
              Guardado
            </>
          ) : (
            "Guardar cambios"
          )}
        </Box>
      </Box>

      {/* Avatar picker modal */}
      <Dialog
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
          Elige tu avatar
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.8,
              justifyContent: "center",
              maxWidth: 430,
            }}
          >
            {AVATARS.map((emoji) => (
              <Box
                key={emoji}
                onClick={() => {
                  setAvatar(emoji);
                  setAvatarOpen(false);
                }}
                sx={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border:
                    avatar === emoji
                      ? "2px solid #2E86C1"
                      : "2px solid transparent",
                  bgcolor: avatar === emoji ? "#D6EAF8" : "transparent",
                  transition: "all 0.15s",
                  "&:hover": {
                    bgcolor: "#EBF5FB",
                    transform: "scale(1.2)",
                  },
                }}
              >
                {emoji}
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
