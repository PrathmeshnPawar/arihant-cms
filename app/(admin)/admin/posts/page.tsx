"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Button,
  IconButton,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Link from "next/link";
import ConfirmDialog from "../common/ConfirmDialouge";

type Post = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
};

export default function PostsPage() {
  const [rows, setRows] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Post | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [snack, setSnack] = React.useState<{ open: boolean; type: "success" | "error"; message: string }>({
    open: false,
    type: "success",
    message: "",
  });

  function toast(type: "success" | "error", message: string) {
    setSnack({ open: true, type, message });
  }

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", { credentials: "include" });
      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Failed to fetch posts");
        setRows([]);
        return;
      }
      setRows(json.data || []);
    } catch (e: any) {
      toast("error", e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchPosts();
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
      toast("success", "Post deleted");
      setConfirmOpen(false);
      setDeleteTarget(null);
      await fetchPosts();
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
          Posts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage blog posts
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link href="/admin/posts/new" style={{ textDecoration: "none" }}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create
              </Button>
            </Link>

            <IconButton onClick={fetchPosts}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Total: {rows.length}
          </Typography>
        </Toolbar>

        {loading ? (
          <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
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
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography sx={{ py: 2 }} variant="body2" color="text.secondary">
                      No posts found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell sx={{ fontWeight: 800 }}>{p.title}</TableCell>
                    <TableCell>
                      <Chip label={p.slug} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {p.status === "published" ? (
                        <Chip label="Published" color="success" size="small" />
                      ) : (
                        <Chip label="Draft" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>

                    <TableCell align="right">
                      <Link href={`/admin/posts/${p._id}/edit`} style={{ textDecoration: "none" }}>
                        <IconButton title="Edit">
                          <EditIcon />
                        </IconButton>
                      </Link>

                      <IconButton color="error" title="Delete" onClick={() => askDelete(p)}>
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
        title="Delete post?"
        description={
          deleteTarget ? `This will permanently delete "${deleteTarget.title}".` : "Delete this post?"
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
