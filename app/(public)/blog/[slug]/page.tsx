import Link from "next/link";
import { Box, Typography, Chip, Divider, Paper, Stack } from "@mui/material";
import { formatDate, readingTime } from "../../../lib/utils/blogformat"
import { getBaseUrl } from "@/app/lib/utils/baseUrl";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/public/posts/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const json = await getPost(slug);

  if (!json?.success) {
    return (
      <Box sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight={900}>
          Post not found
        </Typography>
      </Box>
    );
  }

  const post = json.data;
  const cover = post.coverImage?.url || "";

  return (
    <Box sx={{ maxWidth: 820, mx: "auto" }}>
      {/* Title */}
      <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -0.8 }}>
        {post.title}
      </Typography>

      {/* Meta */}
      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }} alignItems="center">
        {post.category?.name && (
          <Chip
            label={post.category.name}
            variant="outlined"
            component="a"
            href={`/blog/category/${post.category.slug}`}
            clickable
            sx={{ fontWeight: 800 }}
          />
        )}

        <Typography variant="body2" color="text.secondary">
          {formatDate(post.publishedAt || post.createdAt)} • {readingTime(post.content || "")}
        </Typography>
      </Stack>

      {/* Tags */}
      <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {(post.tags || []).map((t: any) => (
          <Chip
            key={t._id}
            label={t.name}
            size="small"
            component="a"
            href={`/blog/tag/${t.slug}`}
            clickable
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Cover */}
      {cover && (
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "grey.200",
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={cover}
            alt={post.title}
            sx={{
              width: "100%",
              maxHeight: 460,
              objectFit: "cover",
              display: "block",
            }}
          />
        </Paper>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <Typography
          sx={{
            fontSize: 18,
            color: "text.secondary",
            lineHeight: 1.9,
            mb: 3,
          }}
        >
          {post.excerpt}
        </Typography>
      )}

      {/* Content */}
      <Box
        sx={{
          "& p": { fontSize: 17, lineHeight: 2.0, mb: 2 },
          "& h2": { mt: 4, mb: 1.5, fontWeight: 900 },
          "& h3": { mt: 3, mb: 1.2, fontWeight: 900 },
          "& ul": { pl: 3, mb: 2 },
          "& li": { mb: 1 },
          "& img": { maxWidth: "100%", borderRadius: 2, margin: "14px 0" },
          "& blockquote": {
            borderLeft: "4px solid #111827",
            pl: 2,
            color: "text.secondary",
            fontStyle: "italic",
            my: 2,
          },
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer */}
      <Divider sx={{ my: 5 }} />

      <Link href="/blog" style={{ textDecoration: "none" }}>
        <Typography sx={{ fontWeight: 900 }}>← Back to Blog</Typography>
      </Link>
    </Box>
  );
}
