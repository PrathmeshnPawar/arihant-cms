"use client";

import * as React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  onUploaded?: () => void;
  onError?: (msg: string) => void;
  onSuccess?: (msg: string) => void;
};

export default function MediaUploader({ onUploaded, onError, onSuccess }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = React.useState(false);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const fd = new FormData();

      // ✅ use "files" key multiple times
      Array.from(files).forEach((file) => fd.append("files", file));

      const res = await fetch("/api/media/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const json = await res.json();

      if (!res.ok) {
        onError?.(json?.message || "Upload failed");
        return;
      }

      onSuccess?.(json?.message || "Upload successful");
      onUploaded?.();

      // reset file input
      if (inputRef.current) inputRef.current.value = "";
    } catch (e: any) {
      onError?.(e?.message || "Network error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => uploadFiles(e.target.files)}
      />

      <Button
        variant="contained"
        startIcon={uploading ? <CircularProgress size={18} /> : <UploadIcon />}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Uploading..." : "Upload Media"}
      </Button>
    </Box>
  );
}
