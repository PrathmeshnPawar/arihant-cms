import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";
import { Category } from "@/app/models/Category"; 
import { Container, Typography, Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import { formatDate, readingTime } from "@/app/lib/utils/blogformat";

// Ensure other models are registered for population
import "@/app/models/Media";
import "@/app/models/Tag";

export const dynamic = "force-dynamic";

export default async function CategoryArchivePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  await connectDB();

  // 1. Find the Category by slug
  const categoryDoc = await Category.findOne({ slug }).lean();

  if (!categoryDoc) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={900}>
          Category "{slug}" not found
        </Typography>
        <Link href="/blog" style={{ marginTop: '20px', display: 'block', color: '#1976d2' }}>
          Back to Blog
        </Link>
      </Container>
    );
  }

  // 2. Find all published posts under this category
  const posts = await Post.find({
    status: "published",
    category: categoryDoc._id, 
  })
    .sort({ publishedAt: -1 })
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1, mb: 1 }}>
          {categoryDoc.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {posts.length === 0 
            ? "No stories found in this category yet." 
            : `Showing ${posts.length} stories in ${categoryDoc.name}.`}
        </Typography>
      </Box>

      {posts.length > 0 && (
        <Grid container spacing={4}>
          {posts.map((p: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p._id.toString()}>
              <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    height: '100%',
                    transition: '0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <Box
                    sx={{
                      height: 180,
                      backgroundImage: `url(${p.coverImage?.url || ""})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      bgcolor: 'grey.100'
                    }}
                  />
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 1, lineHeight: 1.2 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(p.publishedAt || p.createdAt)} • {readingTime(p.content || "")}
                    </Typography>
                  </Box>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
      <Link href="/blog" style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontWeight: 900 }}>← Back to Blog</Typography>
       </Link>
    </Container>
    
  );
}