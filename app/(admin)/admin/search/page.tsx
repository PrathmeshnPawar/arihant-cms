"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Box, Paper, Typography } from "@mui/material";

export default function AdminSearchPage() {
  const sp = useSearchParams();
  const q = sp.get("q") || "";

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={900}>
          Global Search
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Query: <b>{q}</b>
        </Typography>

        <Typography sx={{ mt: 2 }}>
          ✅ Search page is working now.
        </Typography>
      </Paper>
    </Box>
  );
}
