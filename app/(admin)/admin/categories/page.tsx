"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import CategoryDialog, { CategoryForm } from "../../../components/admin/Category/CategoryDialog";
import ConfirmDialog from "../common/ConfirmDialouge";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
};

export default function CategoriesPage() {
  const [rows, setRows] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(false);

  // dialog states
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create");
  const [form, setForm] = React.useState<CategoryForm>(emptyForm);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // delete confirm
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);

  // snackbar
  const [snack, setSnack] = React.useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  function toast(type: "success" | "error", message: string) {
    setSnack({ open: true, type, message });
  }

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "GET",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Failed to fetch categories");
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
    fetchCategories();
  }, []);

  function openCreate() {
    setDialogMode("create");
    setForm(emptyForm);
    setActiveId(null);
    setDialogOpen(true);
  }

  function openEdit(row: Category) {
    setDialogMode("edit");
    setActiveId(row._id);
    setForm({
      name: row.name,
      slug: row.slug,
      description: row.description || "",
      isActive: !!row.isActive,
    });
    setDialogOpen(true);
  }

  async function submitCategory(values: CategoryForm) {
    setSaving(true);
    try {
      const url =
        dialogMode === "create"
          ? "/api/categories"
          : `/api/categories/${activeId}`;

      const method = dialogMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Save failed");
        return;
      }

      toast("success", dialogMode === "create" ? "Category created" : "Category updated");
      setDialogOpen(false);
      await fetchCategories();
    } catch (e: any) {
      toast("error", e?.message || "Network error");
    } finally {
      setSaving(false);
    }
  }

  function askDelete(row: Category) {
    setDeleteTarget(row);
    setConfirmOpen(true);
  }

  async function doDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        toast("error", json?.message || "Delete failed");
        return;
      }

      toast("success", "Category deleted");
      setConfirmOpen(false);
      setDeleteTarget(null);
      await fetchCategories();
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
          Categories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage blog categories used for posts
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              Create
            </Button>

            <IconButton onClick={fetchCategories} title="Refresh">
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
                <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No categories found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                    <TableCell>
                      <Chip label={row.slug} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {row.isActive ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => openEdit(row)} title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => askDelete(row)}
                        title="Delete"
                        color="error"
                      >
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

      {/* Create/Edit dialog */}
      <CategoryDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={form}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={submitCategory}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete category?"
        description={
          deleteTarget
            ? `This will permanently delete "${deleteTarget.name}".`
            : "This will permanently delete the category."
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
