"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type MediaItem = {
  _id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
};

type Props = {
  items: MediaItem[];
  onCopy: (url: string) => void;
  onDelete: (item: MediaItem) => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default function MediaGrid({ items, onCopy, onDelete }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 2,
      }}
    >
      {items.map((item) => (
        <Card key={item._id} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="160"
            image={item.url}
            alt={item.originalName}
            sx={{ objectFit: "cover", bgcolor: "grey.100" }}
          />

          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={800} noWrap>
              {item.originalName}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              <Chip size="small" label={formatBytes(item.size)} />
              <Chip size="small" variant="outlined" label={item.mimeType.replace("image/", "")} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Tooltip title="Copy URL">
                <IconButton onClick={() => onCopy(item.url)} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete(item)} size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
