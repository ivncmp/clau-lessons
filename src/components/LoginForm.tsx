import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { StudentProfile } from "../types/profile";
import { saveProfile } from "../utils/storage";

interface LoginFormProps {
  onLogin: (profile: StudentProfile) => void;
}

const cursos = [
  "1º Primaria",
  "2º Primaria",
  "3º Primaria",
  "4º Primaria",
  "5º Primaria",
  "6º Primaria",
  "1º ESO",
  "2º ESO",
  "3º ESO",
  "4º ESO",
];

export default function LoginForm({ onLogin }: Readonly<LoginFormProps>) {
  const [nombre, setNombre] = useState("");
  const [curso, setCurso] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !curso) return;

    const profile: StudentProfile = {
      nombre: nombre.trim(),
      curso,
      createdAt: new Date().toISOString(),
    };

    saveProfile(profile);
    onLogin(profile);
  };

  const isValid = nombre.trim().length > 0 && curso.length > 0;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Clau Lessons
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Bienvenido/a, por favor regístrate para empezar
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre del alumno"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              sx={{ mb: 3 }}
              required
              autoFocus
            />

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="curso-label">Curso</InputLabel>
              <Select
                labelId="curso-label"
                value={curso}
                label="Curso"
                onChange={(e) => setCurso(e.target.value)}
                required
              >
                {cursos.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!isValid}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Comenzar
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
