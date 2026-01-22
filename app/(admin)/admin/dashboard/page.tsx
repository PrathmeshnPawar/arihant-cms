"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";

import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DraftsIcon from "@mui/icons-material/Drafts";
import CategoryIcon from "@mui/icons-material/Category";
import TagIcon from "@mui/icons-material/LocalOffer";
import ImageIcon from "@mui/icons-material/Image";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UrlObject } from "url";


type Post = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
};

type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
  totalMedia: number;
};

function StatCard({
  label,
  value,
  icon,
  color,
  
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
 
}) {
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: color || "grey.100",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={900}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  console.log('Dashboard Page Loaded');
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalMedia: 0,
  });

  const [recentPosts, setRecentPosts] = React.useState<Post[]>([]);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  function toast(type: "success" | "error", message: string) {
    setSnack({ open: true, type, message });
  }

  async function loadDashboard() {
    setLoading(true);

    try {
      const [postsRes, categoriesRes, tagsRes, mediaRes] = await Promise.all([
        fetch("/api/posts", { credentials: "include" }),
        fetch("/api/categories", { credentials: "include" }),
        fetch("/api/tags", { credentials: "include" }),
        fetch("/api/media", { credentials: "include" }),
      ]);

      const postsJson = postsRes.ok ? await postsRes.json() : { data: [] };
      const categoriesJson = categoriesRes.ok ? await categoriesRes.json() : { data: [] };
      const tagsJson = tagsRes.ok ? await tagsRes.json() : { data: [] };
      const mediaJson = mediaRes.ok ? await mediaRes.json() : { data: [] };

      const posts: Post[] = postsJson.data || [];
      const categories = categoriesJson.data || [];
      const tags = tagsJson.data || [];
      const media = mediaJson.data || [];

      const published = posts.filter((p) => p.status === "published").length;
      const draft = posts.filter((p) => p.status === "draft").length;

      setStats({
        totalPosts: posts.length,
        publishedPosts: published,
        draftPosts: draft,
        totalCategories: categories.length,
        totalTags: tags.length,
        totalMedia: media.length,
      });

      setRecentPosts(posts.slice(0, 5));
    } catch (e: any) {
      toast("error", e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Header */}
      <Paper sx={{ borderRadius: 3, p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overview of CMS activity and quick actions
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton onClick={loadDashboard} title="Refresh">
              <RefreshIcon />
            </IconButton>

            <Link href="/admin/posts/new" style={{ textDecoration: "none" }}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create Post
              </Button>
            </Link>

            <Link href="/admin/media" style={{ textDecoration: "none" }}>
              <Button variant="outlined" startIcon={<CloudUploadIcon />}>
                Upload Media
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      {loading ? (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 2,
            }}
          >
            <StatCard
              label="Total Posts"
              value={stats.totalPosts}
              icon={<ArticleIcon />}
              color="rgba(25,118,210,0.12)"
            />
            <StatCard
              label="Published"
              value={stats.publishedPosts}
              icon={<CheckCircleIcon />}
              color="rgba(46,125,50,0.12)"
            />
            <StatCard
              label="Drafts"
              value={stats.draftPosts}
              icon={<DraftsIcon />}
              color="rgba(237,108,2,0.12)"
            />
            <StatCard
              label="Categories"
              value={stats.totalCategories}
              icon={<CategoryIcon />}
              color="rgba(156,39,176,0.12)"
            />
            <StatCard
              label="Tags"
              value={stats.totalTags}
              icon={<TagIcon />}
              color="rgba(2,136,209,0.12)"
            />
            <StatCard
              label="Media Files"
              value={stats.totalMedia}
              icon={<ImageIcon />}
              color="rgba(97,97,97,0.12)"
            />
          </Box>

          {/* Recent posts */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={900}>
                Recent Posts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Latest posts created in the CMS
              </Typography>
            </Box>

            <Divider />

            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 900 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography sx={{ py: 2 }} variant="body2" color="text.secondary">
                        No posts yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentPosts.map((p) => (
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
                          <Button size="small" variant="outlined">
                            Edit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Quick links */}
          <Paper sx={{ borderRadius: 3, p: 2.5 }}>
            <Typography variant="h6" fontWeight={900}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Jump to common admin tasks
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Link href="/admin/posts/new" style={{ textDecoration: "none" }}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  New Post
                </Button>
              </Link>

              <Link href="/admin/categories" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Manage Categories</Button>
              </Link>

              <Link href="/admin/tags" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Manage Tags</Button>
              </Link>

              <Link href="/admin/media" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Open Media</Button>
              </Link>

              {/* <Link href="/admin/users" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Manage Users</Button>
              </Link> */}
            </Box>
          </Paper>
        </>
      )}

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
