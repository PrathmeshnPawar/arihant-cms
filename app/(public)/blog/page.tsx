import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
  Container,
  Button,
  // Use this import for stability
} from "@mui/material";
import Grid from "@mui/material/Grid";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatDate, readingTime } from "../../lib/utils/blogformat";
import { getBaseUrl } from "@/app/lib/utils/baseUrl";

export const dynamic = "force-dynamic";

async function getPosts(retries = 2) {
  try {
    const baseUrl = await getBaseUrl();

    const res = await fetch(`${baseUrl}/api/public/posts?limit=20`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (err) {
    if (retries > 0) {
      const baseDelay = 500;
      const attempt = 3 - retries;
      const delay = Math.max(baseDelay, attempt * baseDelay);

      await new Promise((r) => setTimeout(r, delay));
      return getPosts(retries - 1);
    }

    // ❌ do NOT fake empty posts
    console.error("getPosts failed after retries:", err);
    return null;
  }
}

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
  const json = await getPosts();
  const posts = json?.data?.posts || [];

  const trendingPost = posts[0];
  const sidePosts = posts.slice(1, 5);
  const latestStories = posts.slice(5, 8);
  const stockStories = posts.slice(8, 12);

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
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  mb: 2,
                }}
              >
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
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight={800}
                  >
                    TRENDING
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{ mt: 1, color: "#020617", letterSpacing: -0.5 }}
                  >
                    {trendingPost.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {readingTime(trendingPost.content)} •{" "}
                    {formatDate(trendingPost.publishedAt)}
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
              <Box
                key={p._id}
                sx={{
                  pb: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" color="text.disabled">
                  {readingTime(p.content)}
                </Typography>
                <Link
                  href={`/blog/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
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
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  bgcolor: "transparent",
                }}
              >
                <Box
                  sx={{
                    height: 180,
                    borderRadius: 3,
                    backgroundImage: `url(${p.coverImage?.url})`,
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
                  {readingTime(p.content)} • {formatDate(p.publishedAt)}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
