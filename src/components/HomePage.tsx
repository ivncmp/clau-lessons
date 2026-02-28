import { Box, Button, Container, Paper, Typography } from "@mui/material";
import type { StudentProfile } from "../types/profile";
import { clearProfile } from "../utils/storage";

interface HomePageProps {
  profile: StudentProfile;
  onLogout: () => void;
}

export default function HomePage({
  profile,
  onLogout,
}: Readonly<HomePageProps>) {
  const handleLogout = () => {
    clearProfile();
    onLogout();
  };

  return (
    <Container maxWidth="md">
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
            p: { xs: 4, sm: 6 },
            width: "100%",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "3rem" },
              mb: 2,
            }}
          >
            ¡Hola, {profile.nombre}! 👋
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            {profile.curso}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Aquí empezará tu aventura de aprendizaje
          </Typography>

          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              px: 4,
              py: 1,
            }}
          >
            Cerrar sesión
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
