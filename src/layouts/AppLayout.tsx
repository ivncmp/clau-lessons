import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../features/auth/hooks/useAuth";
import { downloadUserData } from "../utils/storage";
import FloatingDecorations from "../components/FloatingDecorations";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
          px: { xs: 0, sm: 2 },
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
              height: { xs: 60, sm: 90 },
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          />
          {user && (
            <>
              {/* Desktop nav */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  onClick={() => navigate("/profile")}
                  sx={{
                    bgcolor: "#D6EAF8",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "#AED6F1" },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "#AED6F1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {user.avatar || "😊"}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#1B4F72" }}
                  >
                    <b>{user.name}</b> · {user.course} {user.classId}
                  </Typography>
                </Box>
                <Tooltip title="Descargar datos">
                  <IconButton
                    onClick={() => user && downloadUserData(user.id)}
                    size="small"
                    sx={{
                      bgcolor: "#D6EAF8",
                      color: "#1B4F72",
                      "&:hover": { bgcolor: "#AED6F1" },
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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

              {/* Mobile hamburger */}
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  display: { xs: "flex", sm: "none" },
                  bgcolor: "#D6EAF8",
                  color: "#1B4F72",
                  "&:hover": { bgcolor: "#AED6F1" },
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Mobile drawer */}
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: { borderRadius: "20px 0 0 20px", width: 280 },
                }}
              >
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 1,
                      borderRadius: "50%",
                      bgcolor: "#D6EAF8",
                      border: "3px solid #2E86C1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    {user.avatar || "😊"}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#78909C" }}>
                    {user.course}
                    {user.classId ? ` · ${user.classId}` : ""}
                  </Typography>
                </Box>
                <Divider />
                <List sx={{ px: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate("/profile");
                    }}
                    sx={{ borderRadius: "12px", mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <PersonIcon sx={{ color: "#2E86C1" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mi perfil"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => {
                      setDrawerOpen(false);
                      downloadUserData(user.id);
                    }}
                    sx={{ borderRadius: "12px", mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <DownloadIcon sx={{ color: "#2E86C1" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Descargar datos"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                  <Divider sx={{ my: 1 }} />
                  <ListItemButton
                    onClick={() => {
                      setDrawerOpen(false);
                      handleLogout();
                    }}
                    sx={{ borderRadius: "12px" }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LogoutIcon sx={{ color: "#EF5350" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Salir"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: "#EF5350",
                      }}
                    />
                  </ListItemButton>
                </List>
              </Drawer>
            </>
          )}
        </Container>
      </Box>

      <FloatingDecorations />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, sm: 4 }, position: "relative", zIndex: 1, flex: 1 }}
      >
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: "auto",
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
              maxWidth: 600,
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            Proyecto educativo sin afiliaci&oacute;n oficial con Greenwich
            School.
            <br />
            Hecho con fines exclusivamente did&aacute;cticos y no debe sustituir
            al material oficial en ningún caso.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
