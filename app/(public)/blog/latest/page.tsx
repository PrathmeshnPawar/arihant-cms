import Link from "next/link";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { formatDate, readingTime } from "@/app/lib/utils/blogformat";
import { getBaseUrl } from "@/app/lib/utils/baseUrl";

export const dynamic = "force-dynamic";

async function getLatestPosts() {
  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/posts/latest?days=30&limit=12`,
    { cache: "no-store" }
  );

  return res.ok ? res.json() : { data: { posts: [] } };
}

export default async function LatestStoriesPage() {
  const json = await getLatestPosts();
  const posts = json?.data?.posts || [];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>
        Latest Stories
      </Typography>

      <Grid container spacing={4}>
        {posts.map((p: any) => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
              <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${p.coverImage?.url || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Chip
                    label={p.category?.name}
                    size="small"
                    sx={{ mb: 1, fontWeight: 700 }}
                  />
                  <Typography variant="subtitle1" fontWeight={800}>
                    {p.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {readingTime(p.content)} • {formatDate(p.publishedAt)}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}


