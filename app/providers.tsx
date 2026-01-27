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

export const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    // 👇 Default body font
    fontFamily: openSans.style.fontFamily,

    // 👇 Headings use Roboto
    h1: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
    h2: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
    h3: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
    h4: { fontFamily: roboto.style.fontFamily, fontWeight: 900 },
    h5: { fontFamily: roboto.style.fontFamily, fontWeight: 800 },
    h6: { fontFamily: roboto.style.fontFamily, fontWeight: 800 },

    body1: {
      fontFamily: openSans.style.fontFamily,
      fontSize: "16px",
      lineHeight: 1.85,
    },
    body2: {
      fontFamily: openSans.style.fontFamily,
      fontSize: "14px",
      lineHeight: 1.75,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: openSans.style.fontFamily,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
