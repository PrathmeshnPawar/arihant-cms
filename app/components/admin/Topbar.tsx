"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

export default function Topbar() {
  console.log("✅ NEW TOPBAR LOADED");

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
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "#111827", height: 56, justifyContent: "center" }}
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        {/* left brand */}
        <Typography fontWeight={900}>CMS</Typography>

        {/* search */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.12)",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            width: 420,
          }}
        >
          <SearchIcon sx={{ opacity: 0.8 }} />
          <InputBase
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onSearchSubmit}
            sx={{ ml: 1, color: "white", width: "100%" }}
          />
        </Box>

        {/* right user */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 30, height: 30 }}>
            {(user?.name || user?.email || "A").slice(0, 1).toUpperCase()}
          </Avatar>

          <Typography
            sx={{ display: { xs: "none", md: "block" } }}
            fontSize={13}
          >
            {user?.name || user?.email}
          </Typography>

          <Button
            onClick={logout}
            variant="contained"
            size="small"
            sx={{ ml: 1, bgcolor: "rgba(255,255,255,0.15)" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
