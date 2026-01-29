"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import MediaPickerDialog from "./MediaPickerDialog";
import AppFlowEditor, { AppFlowStep } from "./AppFlowEditor";
import TiptapEditor from "../common/TipTapEditor";

type Category = { _id: string; name: string; slug: string };
type Tag = { _id: string; name: string; slug: string };

export type PostPayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";

  // ✅ store IDs for DB
  coverImage?: string; // Media ObjectId
  coverImageUrl?: string; // UI preview only

  category?: string; // Category ObjectId (single)
  tags: string[]; // Tag ObjectIds

  gallery?: string[]; // Media ObjectIds (optional)

  // ✅ WordPress-style SEO fields
  seo?: {
    // Leave undefined / empty to auto-generate via SEO resolver
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;

    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string | null;

    robotsIndex?: boolean;
    robotsFollow?: boolean;
  };

  appFlow: AppFlowStep[];
};

type Props = {
  mode: "create" | "edit";
  initialValues: PostPayload;
  postId?: string;
};

export default function PostForm({ mode, initialValues, postId }: Props) {
  const [values, setValues] = React.useState<PostPayload>(initialValues);
  const [saving, setSaving] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const [pickerOpen, setPickerOpen] = React.useState(false);

  // ✅ Same picker used for both cover + OG
  const [mediaPickTarget, setMediaPickTarget] = React.useState<"cover" | "og">(
    "cover",
  );

  const [snack, setSnack] = React.useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const DRAFT_KEY = postId ? `cms_post_draft_${postId}` : "cms_post_draft_new";
  const [uploadingMedia, setUploadingMedia] = React.useState(false);

  async function uploadToServer(file: File) {
    const fd = new FormData();
    fd.append("files", file); // change to "file" if your api expects that

    const res = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Upload failed");

    const uploaded = json?.data?.[0];
    if (!uploaded?._id) throw new Error("Upload response invalid");

    return uploaded; // { _id, url, ... }
  }

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      setValues((prev) => ({ ...prev, ...saved }));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {}
    }, 700); // Gmail like debounce

    return () => clearTimeout(id);
  }, [values, DRAFT_KEY]);
  function toast(type: "success" | "error", message: string) {
    setSnack({ open: true, type, message });
  }

  function set<K extends keyof PostPayload>(key: K, val: PostPayload[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function setSeo(key: keyof NonNullable<PostPayload["seo"]>, val: any) {
    setValues((prev) => ({
      ...prev,
      seo: {
        ...(prev.seo || {}),
        [key]: val,
      },
    }));
  }

  function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function loadMeta() {
    const [catRes, tagRes] = await Promise.all([
      fetch("/api/categories", { credentials: "include" }),
      fetch("/api/tags", { credentials: "include" }),
    ]);

    if (catRes.ok) {
      const json = await catRes.json();
      setCategories(json.data || []);
    }
    if (tagRes.ok) {
      const json = await tagRes.json();
      setTags(json.data || []);
    }
  }

  React.useEffect(() => {
    loadMeta();
  }, []);

  async function submit() {
  setSaving(true);
  try {
    // ✅ clean SEO
    const cleanedSeo = values.seo
      ? Object.fromEntries(
          Object.entries(values.seo).filter(
            ([_, v]) =>
              v !== "" &&
              v !== null &&
              v !== undefined
          )
        )
      : undefined;

    // ✅ build backend-safe payload (NO spreading)
    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim()
        ? slugify(values.slug)
        : slugify(values.title),

      excerpt: values.excerpt,
      content: values.content,
      status: values.status,

      category:
        typeof values.category === "string" && values.category.length > 0
          ? values.category
          : undefined,

      tags: Array.isArray(values.tags)
        ? values.tags.filter(
            (t): t is string => typeof t === "string" && t.length > 0
          )
        : [],

      gallery: Array.isArray(values.gallery)
        ? values.gallery.filter(Boolean)
        : [],

      coverImage:
        typeof values.coverImage === "string" && values.coverImage.length > 0
          ? values.coverImage
          : undefined,

      seo: cleanedSeo
        ? {
            ...cleanedSeo,
            ogImage:
              typeof cleanedSeo.ogImage === "string"
                ? cleanedSeo.ogImage
                : undefined,
          }
        : undefined,

     appFlow: (values.appFlow || []).map((step: any) => ({
    title: step.title || "",
    description: step.description || "",
    imageUrl: step.imageUrl || "",
    // ✅ MAP mediaId from UI to media for DB
    media: step.mediaId || step.media || null, 
  })),
    };

    console.log("🚀 FINAL PAYLOAD:", payload); // remove later

    const url = mode === "create"
      ? "/api/posts"
      : `/api/posts/${postId}`;

    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("❌ API ERROR:", json);
      toast("error", json?.message || "Save failed");
      return;
    }

    toast("success", mode === "create" ? "Post created" : "Post updated");
  } catch (e: any) {
    toast("error", e?.message || "Network error");
  } finally {
    setSaving(false);
  }
}


  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={900}>
          {mode === "create" ? "Create Post" : "Edit Post"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Write content, attach cover image, add category/tags, and SEO like
          WordPress
        </Typography>
      </Box>

      {/* Main editor */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={values.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (mode === "create") set("slug", slugify(e.target.value));
            }}
            fullWidth
          />

          <TextField
            label="Slug"
            value={values.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            helperText="Auto-generated, you can edit"
            fullWidth
          />

          <TextField
            label="Excerpt"
            value={values.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Typography fontWeight={900} sx={{ mt: 1 }}>
            Content
          </Typography>

          <TiptapEditor
            value={values.content}
            onChange={(html) => set("content", html)}
            minHeight={320}
          />

          <TextField
            select
            label="Status"
            value={values.status}
            onChange={(e) => set("status", e.target.value as any)}
            fullWidth
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
          </TextField>

          {/* Cover Image */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* choose from media library */}
            <Button
              variant="outlined"
              onClick={() => {
                setMediaPickTarget("cover");
                setPickerOpen(true);
              }}
            >
              Choose Cover Image
            </Button>

            {/* ✅ upload from local machine */}
            <Button
              variant="contained"
              component="label"
              disabled={uploadingMedia}
              onClick={() => setMediaPickTarget("cover")}
            >
              {uploadingMedia ? "Uploading..." : "Upload from Computer"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setUploadingMedia(true);
                    const uploaded = await uploadToServer(file);

                    // ✅ set cover image
                    set("coverImage", uploaded._id);
                    set("coverImageUrl", uploaded.url);

                    toast("success", "Cover image uploaded ✅");
                  } catch (err: any) {
                    toast("error", err?.message || "Upload failed");
                  } finally {
                    setUploadingMedia(false);
                    e.target.value = "";
                  }
                }}
              />
            </Button>

            {/* preview */}
            {values.coverImageUrl ? (
              <Chip
                label={`Selected: ${values.coverImageUrl}`}
                onDelete={() => {
                  set("coverImageUrl", "");
                  set("coverImage", "");
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No cover image selected.
              </Typography>
            )}
          </Box>

          {/* Category */}
          <TextField
            select
            label="Category"
            value={values.category || ""}
            onChange={(e) => set("category", e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>No category</em>
            </MenuItem>
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name} ({c.slug})
              </MenuItem>
            ))}
          </TextField>

          {/* Tags */}
          <TextField
            select
            label="Tags (multi)"
            SelectProps={{
              multiple: true,
              value: values.tags,
              onChange: (e) => set("tags", e.target.value as any),
            }}
            fullWidth
          >
            {tags.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.name} ({t.slug})
              </MenuItem>
            ))}
          </TextField>

          {/* ✅ SEO Panel */}
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 3, bgcolor: "grey.50" }}
          >
            <Typography fontWeight={900} sx={{ mb: 0.5 }}>
              SEO (WordPress style)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Leave empty to auto use Title / Excerpt / Cover Image.
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Meta Title"
                value={values.seo?.metaTitle || ""}
                onChange={(e) => setSeo("metaTitle", e.target.value)}
                helperText="Recommended: 50–60 characters"
                fullWidth
              />

              <TextField
                label="Meta Description"
                value={values.seo?.metaDescription || ""}
                onChange={(e) => setSeo("metaDescription", e.target.value)}
                helperText="Recommended: 140–160 characters"
                fullWidth
                multiline
                minRows={3}
              />

              <TextField
                label="Canonical URL (optional)"
                value={values.seo?.canonicalUrl || ""}
                onChange={(e) => setSeo("canonicalUrl", e.target.value)}
                fullWidth
              />

              <TextField
                label="OG Title"
                value={values.seo?.ogTitle || ""}
                onChange={(e) => setSeo("ogTitle", e.target.value)}
                fullWidth
              />

              <TextField
                label="OG Description"
                value={values.seo?.ogDescription || ""}
                onChange={(e) => setSeo("ogDescription", e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* choose from media library */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    setMediaPickTarget("og");
                    setPickerOpen(true);
                  }}
                >
                  Choose OG Image
                </Button>

                {/* ✅ upload OG from local machine */}
                <Button
                  variant="contained"
                  component="label"
                  disabled={uploadingMedia}
                  onClick={() => setMediaPickTarget("og")}
                >
                  {uploadingMedia ? "Uploading..." : "Upload OG from Computer"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        setUploadingMedia(true);
                        const uploaded = await uploadToServer(file);

                        // ✅ set og image
                        setSeo("ogImage", uploaded._id);

                        toast("success", "OG image uploaded ✅");
                      } catch (err: any) {
                        toast("error", err?.message || "Upload failed");
                      } finally {
                        setUploadingMedia(false);
                        e.target.value = "";
                      }
                    }}
                  />
                </Button>

                {values.seo?.ogImage ? (
                  <Chip
                    label="OG Image selected"
                    onDelete={() => setSeo("ogImage", null)}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    If empty, cover image will be used
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  select
                  label="Robots Index"
                  value={(values.seo?.robotsIndex ?? true) ? "true" : "false"}
                  onChange={(e) =>
                    setSeo("robotsIndex", e.target.value === "true")
                  }
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="true">Index</MenuItem>
                  <MenuItem value="false">No Index</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Robots Follow"
                  value={(values.seo?.robotsFollow ?? true) ? "true" : "false"}
                  onChange={(e) =>
                    setSeo("robotsFollow", e.target.value === "true")
                  }
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="true">Follow</MenuItem>
                  <MenuItem value="false">No Follow</MenuItem>
                </TextField>
              </Box>
            </Stack>
          </Paper>

          {/* Save */}
          <Button variant="contained" onClick={submit} disabled={saving}>
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Post"
                : "Update Post"}
          </Button>
        </Stack>
      </Paper>

      {/* App Flow */}
      <AppFlowEditor
        value={values.appFlow}
        onChange={(steps) => set("appFlow", steps)}
      />

      {/* Media Picker */}
      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(m) => {
          if (mediaPickTarget === "cover") {
            set("coverImage", m._id);
            set("coverImageUrl", m.url);
          } else {
            setSeo("ogImage", m._id);
          }
          setPickerOpen(false);
        }}
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
