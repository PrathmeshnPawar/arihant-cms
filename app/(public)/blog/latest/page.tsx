import Link from "next/link";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
} from "@mui/material";

// Core logic and database imports
import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";
import { formatDate, readingTime } from "@/app/lib/utils/blogformat";

// Register referenced models to ensure .populate() works correctly
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";

export const dynamic = "force-dynamic";

export default async function LatestStoriesPage() {
  // 1. DIRECT DATABASE ACCESS
  // Connect and query directly to avoid internal network timeouts (UND_ERR_CONNECT_TIMEOUT).
  await connectDB();

  // Calculate the date 30 days ago to match your previous 'days=30' logic
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const posts = await Post.find({
    status: "published",
    publishedAt: { $gte: thirtyDaysAgo },
  })
    .sort({ publishedAt: -1 })
    .limit(12)
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>
        Latest Stories
      </Typography>

      {!posts || posts.length === 0 ? (
        <Typography color="text.secondary">No stories found from the last 30 days.</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
          }}
        >
          {posts.map((p: any) => (
            <Link
              href={`/blog/${p.slug}`}
              key={p._id.toString()} // Ensure the ID is a string for React keys
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
                    {readingTime(p.content || "")} • {formatDate(p.publishedAt || p.createdAt)}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          ))}
        </Box>
      )}
    </Container>
  );
}