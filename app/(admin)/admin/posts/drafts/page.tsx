"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";

import ConfirmDialog from "../../../../components/admin/common/ConfirmDialouge";

type Post = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
};

export default function DraftPostsPage() {
  const [rows, setRows] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);

  // publish state
  const [publishingId, setPublishingId] = React.useState<string | null>(null);

  // delete state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Post | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // filter
  const [search, setSearch] = React.useState("");

  // toast
  const [snack, setSnack] = React.useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  function toast(type: "success" | "error", message: string) {
    setSnack({ open: true, type, message });
  }

  async function fetchPostsAndFilterDrafts() {
  setLoading(true);
  try {
    const res = await fetch("/api/posts?status=draft", { credentials: "include" });
    const json = await res.json();

    if (!res.ok) {
      toast("error", json?.message || "Failed to fetch drafts");
      setRows([]);
      return;
    }

    const drafts = Array.isArray(json?.data?.posts) ? json.data.posts : [];
    setRows(drafts);
  } catch (e: any) {
    toast("error", e?.message || "Network error");
    setRows([]); // ✅ important
  } finally {
    setLoading(false);
  }
}



  React.useEffect(() => {
    fetchPostsAndFilterDrafts();
  }, []);

  function askDelete(post: Post) {
    setDeleteTarget(post);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/posts/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Delete failed");
        return;
      }

      toast("success", "Draft deleted");
      setConfirmOpen(false);
      setDeleteTarget(null);
      await fetchPostsAndFilterDrafts();
    } catch (e: any) {
      toast("error", e?.message || "Network error");
    } finally {
      setDeleting(false);
    }
  }

  async function publishPost(postId: string) {
    setPublishingId(postId);

    try {
      // ✅ you HAVE this route according to your tree: posts/[id]/publish
      const res = await fetch(`/api/posts/${postId}/publish`, {
        method: "POST",
        credentials: "include",
      });

      const json = await res.json();

      if (res.ok) {
      toast("success", "Post Published Successfully!");
      
      // ✅ RE-FETCH the list immediately
      // This removes the published post from the 'Drafts' table
      await fetchPostsAndFilterDrafts(); 
    } else {
      const errorData = await res.json();
      toast("error", errorData.message || "Failed to publish");
    }

      toast("success", "Post published ✅");
      await fetchPostsAndFilterDrafts();
    } catch (e: any) {
      toast("error", e?.message || "Network error");
    } finally {
      setPublishingId(null);
    }
  }

  const filtered = rows.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography fontWeight={900} fontSize={18}>
            Draft Posts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Posts saved as draft (not published yet)
          </Typography>
        </Box>

        <Divider sx={{ mt: 2 }} />

        {/* Actions */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={fetchPostsAndFilterDrafts} title="Refresh">
              <RefreshIcon />
            </IconButton>

            <Typography variant="body2" color="text.secondary">
              Total Drafts: {filtered.length}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search drafts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Link href="/admin/posts/new" style={{ textDecoration: "none" }}>
              <Button variant="contained">+ Create Post</Button>
            </Link>
          </Box>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f6f7fb" }}>
                <TableCell sx={{ fontWeight: 900 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 900 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 900 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography sx={{ py: 2 }} variant="body2" color="text.secondary">
                      No draft posts found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{p.title}</TableCell>

                    <TableCell>
                      <Chip label={p.slug} size="small" variant="outlined" />
                    </TableCell>

                    <TableCell>
                      <Chip label="Draft" color="warning" size="small" />
                    </TableCell>

                    <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>

                    <TableCell align="right">
                      {/* Publish */}
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PublishIcon />}
                        sx={{ mr: 1, bgcolor: "#0ea5e9" }}
                        disabled={publishingId === p._id}
                        onClick={() => publishPost(p._id)}
                      >
                        {publishingId === p._id ? "Publishing..." : "Publish"}
                      </Button>

                      {/* Edit */}
                      <Link href={`/admin/posts/${p._id}/edit`} style={{ textDecoration: "none" }}>
                        <IconButton title="Edit" sx={{ color: "#16a34a" }}>
                          <EditIcon />
                        </IconButton>
                      </Link>

                      {/* Delete */}
                      <IconButton title="Delete" color="error" onClick={() => askDelete(p)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Draft?"
        description={
          deleteTarget
            ? `This will permanently delete "${deleteTarget.title}".`
            : "Delete this draft?"
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
