"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";

export default function SearchClient() {
  const sp = useSearchParams();
  const q = sp.get("q") || "";

  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/search?q=${encodeURIComponent(q)}`
        );
        const json = await res.json();
        setResults(json.data || []);
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={900}>
          Global Search
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Query: <b>{q || "—"}</b>
        </Typography>

        {loading && (
          <CircularProgress size={22} sx={{ mt: 2 }} />
        )}

        {!loading && results.length > 0 && (
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {results.map((r) => (
              <Link
                key={r.id}
                href={`/admin/posts/${r.id}/edit`}  // ✅ FIXED
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.4,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography fontWeight={700} color="text.primary">
                    {r.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Open post →
                  </Typography>
                </Box>
              </Link>
            ))}
          </Stack>
        )}

        {!loading && q && results.length === 0 && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No results found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
