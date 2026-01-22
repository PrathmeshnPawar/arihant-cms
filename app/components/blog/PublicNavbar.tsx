"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

export default function PublicTopbar() {
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#0b1220" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/blog" style={{ textDecoration: "none" }}>
          <Typography fontWeight={900} color="#fff" sx={{ letterSpacing: 0.6 }}>
            Arihant Blog
          </Typography>
        </Link>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button sx={{ color: "#fff" }}>Blog</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
