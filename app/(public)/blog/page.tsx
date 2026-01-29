import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Container,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Core Logic Imports
import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";
import { formatDate, readingTime } from "../../lib/utils/blogformat";
import { Category } from "@/app/models/Category";

// Model registration to ensure .populate() works correctly
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";

export const dynamic = "force-dynamic";

const clamp = (lines: number) => ({
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
});

const SectionHeader = ({ title, href }: { title: string; href?: string }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ mb: 3, mt: 5 }}
  >
    <Typography variant="h5" fontWeight={900} color="#020617">
      {title}
    </Typography>

    {href && (
      <Link href={href} style={{ textDecoration: "none" }}>
        <Button
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{
            fontWeight: 700,
            textTransform: "none",
            color: "text.secondary",
          }}
        >
          View All
        </Button>
      </Link>
    )}
  </Stack>
);

export default async function BlogPage() {
  // 1. DIRECT DATABASE ACCESS
  // This happens in milliseconds and avoids all networking timeouts.
  await connectDB();
  
  const posts = await Post.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(20)
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

    const categories = await Category.find().sort({ name: 1 }).lean();
  if (!posts || posts.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5">No stories found yet.</Typography>
      </Container>
    );
  }

  // 2. DATA DISTRIBUTION
  const trendingPost = posts[0];
  const sidePosts = posts.slice(1, 5);
  const latestStories = posts.slice(5, 8);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ===== TOP SECTION: TRENDING & PRODUCT NEWS ===== */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 3 }}>
            Trending Now
          </Typography>

          {trendingPost && (
            <Link
              href={`/blog/${trendingPost.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", mb: 2 }}>
                <Box
                  sx={{
                    height: 400,
                    backgroundImage: `url(${trendingPost.coverImage?.url || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 4,
                  }}
                />
                <Box sx={{ py: 2 }}>
                  <Typography variant="caption" color="primary" fontWeight={800}>
                    TRENDING
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={950}
                    sx={{ mt: 1, color: "#020617", letterSpacing: -0.5 }}
                  >
                    {trendingPost.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    {readingTime(trendingPost.content || "")} • {formatDate(trendingPost.publishedAt || trendingPost.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Link>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" fontWeight={900} sx={{ mb: 3 }}>
            Product News
          </Typography>
          <Stack spacing={3}>
            {sidePosts.map((p: any) => (
              <Box key={p._id} sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.disabled">
                  {readingTime(p.content || "")}
                </Typography>
                <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      color: "#020617",
                      "&:hover": { color: "primary.main" },
                      ...clamp(2),
                    }}
                  >
                    {p.title}
                  </Typography>
                </Link>
                <Chip
                  label={p.category?.name}
                  size="small"
                  sx={{ height: 20, fontSize: 10, mt: 1, fontWeight: 700 }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* ===== LATEST STORIES ROW ===== */}
      <SectionHeader title="Latest Stories" href="/blog/latest" />
      <Grid container spacing={3}>
        {latestStories.map((p: any) => (
          <Grid size={{ xs: 12, sm: 4 }} key={p._id}>
            <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
              <Paper
                elevation={0}
                sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "transparent" }}
              >
                <Box
                  sx={{
                    height: 180,
                    borderRadius: 3,
                    backgroundImage: `url(${p.coverImage?.url || ""})`,
                    backgroundSize: "cover",
                    mb: 2,
                  }}
                />
                <Typography variant="caption" color="primary" fontWeight={700}>
                  {p.category?.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  sx={{ color: "#020617", mt: 0.5, ...clamp(2) }}
                >
                  {p.title}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {readingTime(p.content || "")} • {formatDate(p.publishedAt || p.createdAt)}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
      <SectionHeader title="Browse by Category" />
      
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={2}>
          {categories.map((cat: any) => (
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={cat._id.toString()}>
              <Link href={`/blog/category/${cat.slug}`} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: '#f8fafc',
                    cursor: 'pointer',
                    '&:hover': { 
                      bgcolor: 'primary.main', 
                      color: '#fff',
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800} sx={{ fontSize: '0.85rem' }}>
                    {cat.name}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}