import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAuth } from "../hooks/useAuth";
import { handleFileImport } from "../../../utils/storage";
import { useCursosIndex, useCursoDetail } from "@/hooks/useDataQueries";
import { courseToSlug } from "../../../utils/cursoSlug";
import FloatingDecorations from "../../../components/FloatingDecorations";

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

export default function LoginPage() {
  const { users, login, createUser, deleteUser } = useAuth();
  const { data: cursosData } = useCursosIndex();
  const cursos = cursosData?.cursos ?? [];

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(users.length === 0);
  const [nombre, setNombre] = useState("");
  const [curso, setCurso] = useState("");
  const [clase, setClase] = useState("");
  const [avatar, setAvatar] = useState("😊");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const profile = await handleFileImport(file);
      login(profile.id);
      navigate("/dashboard");
    } catch {
      alert("Archivo no válido");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectedSlug = curso
    ? (() => {
        const obj = cursos.find((c) => c.name === curso);
        return obj ? courseToSlug(obj.name) : undefined;
      })()
    : undefined;

  const { data: cursoDetail } = useCursoDetail(selectedSlug);
  const clases = cursoDetail?.classes ?? [];

  useEffect(() => {
    setClase("");
  }, [curso]);

  const handleLogin = (userId: string) => {
    login(userId);
    navigate("/dashboard");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !curso) return;
    if (clases.length > 0 && !clase) return;
    createUser(nombre, curso, clase, avatar);
    navigate("/dashboard");
  };

  const isValid =
    nombre.trim().length > 0 &&
    curso.length > 0 &&
    (clases.length === 0 || clase.length > 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #2E86C1 0%, #5DADE2 25%, #AED6F1 55%, #D6EAF8 80%, #AED6F1 100%)",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <FloatingDecorations />
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          className="fade-in-scale"
          sx={{
            bgcolor: "rgba(255,255,255,0.93)",
            backdropFilter: "blur(10px)",
            borderRadius: "28px",
            p: { xs: 3, sm: 4 },
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Clau Lessons"
              sx={{ height: { xs: 90, sm: 110 }, mx: "auto" }}
            />
          </Box>

          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "#78909C" }}
          >
            {users.length > 0
              ? "Elige tu perfil o crea uno nuevo"
              : "Crea tu perfil para empezar"}
          </Typography>

          {users.length > 0 && !showForm && (
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {users.map((u, i) => (
                <Box
                  key={u.id}
                  className={`fade-in-left stagger-${Math.min(i + 1, 12)}`}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "16px",
                    border: "2px solid #AED6F1",
                    bgcolor: "#D6EAF8",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#2E86C1",
                      transform: "translateX(4px)",
                    },
                  }}
                  onClick={() => handleLogin(u.id)}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "#AED6F1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      flexShrink: 0,
                      mr: 1.5,
                    }}
                  >
                    {u.avatar || "😊"}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {u.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#546E7A" }}>
                      {u.course}
                      {u.classId ? ` · ${u.classId}` : ""}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUser(u.id);
                    }}
                    sx={{
                      color: "#90A4AE",
                      "&:hover": { color: "#EF5350" },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Box
                className={`fade-in-up stagger-${Math.min(users.length + 1, 12)}`}
                onClick={() => setShowForm(true)}
                sx={{
                  p: 1.8,
                  textAlign: "center",
                  borderRadius: "16px",
                  border: "2px dashed #AED6F1",
                  color: "#2E86C1",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#D6EAF8",
                    borderColor: "#2E86C1",
                  },
                }}
              >
                + Crear nuevo perfil
              </Box>
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  p: 1.8,
                  textAlign: "center",
                  borderRadius: "16px",
                  border: "2px dashed #AED6F1",
                  color: "#78909C",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#D6EAF8",
                    borderColor: "#2E86C1",
                    color: "#2E86C1",
                  },
                }}
              >
                <UploadFileIcon fontSize="small" />
                Importar perfil
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: "none" }}
              />
            </Stack>
          )}

          {(showForm || users.length === 0) && (
            <form onSubmit={handleCreate}>
              {/* Avatar picker */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  onClick={() => setAvatarOpen(true)}
                  sx={{
                    width: 72,
                    height: 72,
                    mx: "auto",
                    mb: 0.5,
                    borderRadius: "50%",
                    bgcolor: "#D6EAF8",
                    border: "3px solid #2E86C1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.2rem",
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

              <TextField
                fullWidth
                label="Nombre del alumno"
                variant="outlined"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                  },
                }}
                required
                autoFocus
              />

              <FormControl
                fullWidth
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                  },
                }}
              >
                <InputLabel id="curso-label">Curso</InputLabel>
                <Select
                  labelId="curso-label"
                  value={curso}
                  label="Curso"
                  onChange={(e) => setCurso(e.target.value)}
                  required
                >
                  {cursos.map((c) => (
                    <MenuItem key={c.id} value={c.name}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {clases.length > 0 && (
                <FormControl
                  fullWidth
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                    },
                  }}
                >
                  <InputLabel id="clase-label">Clase</InputLabel>
                  <Select
                    labelId="clase-label"
                    value={clase}
                    label="Clase"
                    onChange={(e) => setClase(e.target.value)}
                    required
                  >
                    {clases.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Box
                component="button"
                type="submit"
                sx={{
                  width: "100%",
                  p: 1.8,
                  border: "none",
                  borderRadius: "18px",
                  background: isValid
                    ? "linear-gradient(135deg, #5DADE2, #2E86C1)"
                    : "#E0E0E0",
                  color: isValid ? "white" : "#9E9E9E",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor: isValid ? "pointer" : "default",
                  boxShadow: isValid
                    ? "0 4px 14px rgba(38,198,218,0.4)"
                    : "none",
                  transition: "all 0.2s",
                  "&:hover": isValid
                    ? {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(38,198,218,0.5)",
                      }
                    : {},
                }}
                disabled={!isValid}
              >
                Comenzar
              </Box>

              {users.length > 0 && (
                <Box
                  onClick={() => setShowForm(false)}
                  sx={{
                    textAlign: "center",
                    mt: 2,
                    color: "#2E86C1",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Volver a perfiles
                </Box>
              )}

              {users.length === 0 && (
                <>
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      mt: 2,
                      p: 1.8,
                      textAlign: "center",
                      borderRadius: "16px",
                      border: "2px dashed #AED6F1",
                      color: "#78909C",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "#D6EAF8",
                        borderColor: "#2E86C1",
                        color: "#2E86C1",
                      },
                    }}
                  >
                    <UploadFileIcon fontSize="small" />
                    Importar perfil
                  </Box>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </form>
          )}

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
      </Container>
    </Box>
  );
}
