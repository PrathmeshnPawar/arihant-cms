"use client";

import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function ThemeToggle({
  mode,
  toggle,
}: {
  mode: "light" | "dark";
  toggle: () => void;
}) {
  return (
    <IconButton onClick={toggle}>
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
