import { Outlet, useNavigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import { useAuth } from "../features/auth/hooks/useAuth";
import FloatingDecorations from "../components/FloatingDecorations";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg, #1B4F72 0%, #2E86C1 25%, #5DADE2 55%, #AED6F1 80%, #D6EAF8 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          px: 2,
          py: 1,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Clau Lessons"
            onClick={() => navigate("/dashboard")}
            sx={{
              height: 90,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          />
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "#D6EAF8",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "12px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#1B4F72" }}
                >
                  {user.nombre}
                </Typography>
              </Box>
              <Box
                onClick={handleLogout}
                sx={{
                  bgcolor: "#E0E0E0",
                  color: "#616161",
                  borderRadius: "12px",
                  px: 2,
                  py: 0.6,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#BDBDBD" },
                }}
              >
                Salir
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      <FloatingDecorations />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, sm: 4 }, position: "relative", zIndex: 1 }}
      >
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 4,
          py: 3,
          px: 2,
          bgcolor: "#1B4F72",
          borderTop: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="/greenwich.png"
              alt="Greenwich School"
              sx={{ height: 32, opacity: 0.9 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}
            >
              Greenwich School — Curso 2025/2026
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.65rem",
              textAlign: { xs: "center", sm: "right" },
              maxWidth: 360,
              lineHeight: 1.4,
            }}
          >
            Proyecto educativo sin afiliaci&oacute;n oficial con Greenwich
            School. Hecho con fines exclusivamente did&aacute;cticos.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
