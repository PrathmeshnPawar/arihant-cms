import Link from "next/link";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
} from "@mui/material";
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

      {/* REPLACED GRID WITH CSS GRID BOX */}
      <Box
        sx={{
          display: "grid",
          gap: 4, // MUI spacing unit (4 = 32px)
          gridTemplateColumns: {
            xs: "1fr",           // 1 column on mobile
            sm: "1fr 1fr",       // 2 columns on tablet
            md: "1fr 1fr 1fr",   // 3 columns on desktop
          },
        }}
      >
        {posts.map((p: any) => (
          <Link
            href={`/blog/${p.slug}`}
            key={p._id}
            style={{ textDecoration: "none" }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${p.coverImage?.url || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: 'grey.100'
                }}
              />
              <Box sx={{ p: 2 }}>
                <Chip
                  label={p.category?.name || "News"}
                  size="small"
                  sx={{ mb: 1, fontWeight: 700 }}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.3, mb: 1 }}>
                  {p.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {readingTime(p.content)} • {formatDate(p.publishedAt)}
                </Typography>
              </Box>
            </Paper>
          </Link>
        ))}
      </Box>
    </Container>
  );
}