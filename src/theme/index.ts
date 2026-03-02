import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2E86C1" },
    secondary: { main: "#E67E22" },
    success: { main: "#76C7A5" },
    error: { main: "#E74C3C" },
    warning: { main: "#E67E22" },
  },
  typography: {
    fontFamily:
      '"Bellota", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    fontWeightRegular: 700,
    h1: {
      fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
    },
    h2: {
      fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
    },
    h3: {
      fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
    },
    h4: {
      fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
    },
    h5: {
      fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
    },
    h6: {
      fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 300,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 48,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid",
          borderColor: "rgba(0,0,0,0.08)",
        },
      },
    },
  },
});
