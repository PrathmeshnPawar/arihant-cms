"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";

export type TagForm = {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: TagForm;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: TagForm) => void;
};

export default function TagDialog({
  open,
  mode,
  initialValues,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = React.useState<TagForm>(initialValues);

  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues, open]);

  function set<K extends keyof TagForm>(key: K, val: TagForm[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleSubmit() {
    const cleaned: TagForm = {
      ...values,
      name: values.name.trim(),
      slug: values.slug.trim() ? slugify(values.slug) : slugify(values.name),
      description: values.description?.trim() || "",
    };

    onSubmit(cleaned);
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "create" ? "Create Tag" : "Edit Tag"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={values.name}
            onChange={(e) => {
              const name = e.target.value;
              set("name", name);
              if (mode === "create") set("slug", slugify(name));
            }}
            fullWidth
          />

          <TextField
            label="Slug"
            value={values.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            helperText="Auto-generated from name (you can edit)"
            fullWidth
          />

          <TextField
            label="Description"
            value={values.description || ""}
            onChange={(e) => set("description", e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <FormControlLabel
            control={
              <Switch
                checked={values.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
