import { useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import { getProfile } from "./utils/storage";
import type { StudentProfile } from "./types/profile";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getProfile();
    setProfile(stored);
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {profile ? (
        <HomePage profile={profile} onLogout={() => setProfile(null)} />
      ) : (
        <LoginForm onLogin={(newProfile) => setProfile(newProfile)} />
      )}
    </ThemeProvider>
  );
}
