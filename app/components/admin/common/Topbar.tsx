"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  Button,
  Avatar,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const TOPBAR_HEIGHT = 72;

export default function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [q, setQ] = useState("");

  function onSearchSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    const query = q.trim();
    if (!query) return;

    router.push(`/admin/search?q=${encodeURIComponent(query)}`);
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      setUser(json.data.user);
    })();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: TOPBAR_HEIGHT,
        justifyContent: "center",
        bgcolor: "rgba(17, 24, 39, 0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        zIndex: 1300, // ✅ above sidebar
      }}
    >
      <Toolbar
        sx={{
          height: TOPBAR_HEIGHT,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          px: 2,
        }}
      >
        {/* left brand */}
        <Typography fontWeight={1200} fontSize={30} sx={{ letterSpacing: -0.4 }}>
          Arihant CMS
        </Typography>

        {/* search */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.12)",
            px: 2,
            py: 0.7,
            borderRadius: 2,
            width: 420,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SearchIcon sx={{ opacity: 0.8, color: "white" }} />
          <InputBase
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onSearchSubmit}
            sx={{
              ml: 1,
              color: "white",
              width: "100%",
              fontSize: 14,
            }}
          />
        </Box>

        {/* right user */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#2563eb" }}>
            {(user?.name || user?.email || "A").slice(0, 1).toUpperCase()}
          </Avatar>

          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              color: "rgba(255,255,255,0.85)",
              fontSize: 15,
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || user?.email}
          </Typography>

          <Button
            onClick={logout}
            variant="contained"
            size="small"
            sx={{
              ml: 1,
              bgcolor: "rgba(255,255,255,0.14)",
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              fontSize: 15,
              "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
