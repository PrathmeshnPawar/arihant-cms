import { getBaseUrl } from "@/app/lib/utils/baseUrl";
import { Container, Typography, Box, Chip, Divider } from "@mui/material";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
   const baseUrl = await getBaseUrl();
   
  const res = await fetch(`${baseUrl}/api/public/posts/${slug}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const json = await getPost(params.slug);

  if (!json?.success) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight={900}>
          Post not found
        </Typography>
      </Container>
    );
  }

  const post = json.data;

  return (
    <Container sx={{ py: 4, maxWidth: "md" }}>
      <Typography variant="h3" fontWeight={900} sx={{ lineHeight: 1.2 }}>
        {post.title}
      </Typography>

      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {post.category?.name && (
          <Chip label={post.category.name} variant="outlined" />
        )}
        {(post.tags || []).map((t: any) => (
          <Chip key={t._id} label={t.name} size="small" />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Cover Image */}
      {post.coverImage?.url && (
        <Box
          component="img"
          src={post.coverImage.url}
          alt={post.title}
          sx={{
            width: "100%",
            borderRadius: 2,
            mb: 3,
            maxHeight: 420,
            objectFit: "cover",
          }}
        />
      )}

      {/* Content (HTML) */}
      <Box
        sx={{
          "& img": { maxWidth: "100%", borderRadius: 2 },
          "& p": { fontSize: 16, lineHeight: 1.8 },
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Container>
  );
}
