"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import MediaUploader from "@/app/components/admin/media/MediaUploader";
import MediaGrid, { MediaItem } from "@/app/components/admin/media/MediaGrid";
import ConfirmDialog from "../../../components/admin/common/ConfirmDialouge";

export default function MediaPage() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  // delete
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<MediaItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // snackbar
  const [snack, setSnack] = React.useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  function toast(type: "success" | "error", message: string) {
    setSnack({ open: true, type, message });
  }

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/media", {
        method: "GET",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Failed to fetch media");
        setItems([]);
        return;
      }

      setItems(json.data || []);
    } catch (e: any) {
      toast("error", e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchMedia();
  }, []);

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast("success", "Copied URL to clipboard");
    } catch {
      toast("error", "Copy failed");
    }
  }

  function askDelete(item: MediaItem) {
    setDeleteTarget(item);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/media/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Delete failed");
        return;
      }

      toast("success", "Media deleted");
      setConfirmOpen(false);
      setDeleteTarget(null);
      await fetchMedia();
    } catch (e: any) {
      toast("error", e?.message || "Network error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={900}>
          Media Library
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload images and use them in posts (cover image, app flow screens, etc.)
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <MediaUploader
            onUploaded={fetchMedia}
            onSuccess={(msg) => toast("success", msg)}
            onError={(msg) => toast("error", msg)}
          />

          <IconButton onClick={fetchMedia} title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </Paper>

      {loading ? (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No media uploaded yet.
          </Typography>
        </Paper>
      ) : (
        <MediaGrid items={items} onCopy={copyUrl} onDelete={askDelete} />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete media?"
        description={
          deleteTarget
            ? `This will permanently delete "${deleteTarget.originalName}".`
            : "This will permanently delete this media file."
        }
        confirmText="Delete"
        loading={deleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={doDelete}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.type}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
