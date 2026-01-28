"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto, Open_Sans } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

/* ---------- COLOR MODE CONTEXT ---------- */

export const ColorModeContext = React.createContext<{
  mode: "light" | "dark";
  toggleColorMode: () => void;
}>({
  mode: "light",
  toggleColorMode: () => {},
});

/* ---------- THEME FACTORY ---------- */

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            background: {
              default: "#020617",
              paper: "#020617",
            },
            text: {
              primary: "#f8fafc",     // almost white
              secondary: "#cbd5e1",   // readable gray
              disabled: "#94a3b8",    // visible muted text
            },
            divider: "rgba(255,255,255,0.12)",
          }
        : {}),
    },
    typography: {
      fontFamily: openSans.style.fontFamily,
      h1: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
      h2: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
      h3: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
      h4: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
      h5: { fontFamily: roboto.style.fontFamily, fontWeight: 800 },
      h6: { fontFamily: roboto.style.fontFamily, fontWeight: 800 },
    },
  });

/* ---------- PROVIDER ---------- */

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const colorMode = React.useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AppRouterCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  );
}
