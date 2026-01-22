"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

type MediaItem = {
  _id: string;
  originalName: string;
  url: string;
  mimeType: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
};

export default function MediaPickerDialog({ open, onClose, onSelect }: Props) {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/media", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        setItems([]);
        return;
      }
      setItems(json.data || []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (open) fetchMedia();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 900 }}>Select Media</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No media found. Upload media first.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {items.map((m) => (
              <Card
                key={m._id}
                sx={{ borderRadius: 3, cursor: "pointer" }}
                onClick={() => onSelect(m)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={m.url}
                  alt={m.originalName}
                  sx={{ objectFit: "cover", bgcolor: "grey.100" }}
                />
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} noWrap>
                    {m.originalName}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
