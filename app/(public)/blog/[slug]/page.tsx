// 1. Move ALL imports to the top
import Link from "next/link";
import { Box, Typography, Chip, Divider, Paper, Stack } from "@mui/material";
import { formatDate, readingTime } from "../../../lib/utils/blogformat";
import { getBaseUrl } from "@/app/lib/utils/baseUrl";
import type { Metadata } from "next";
import { resolvePostSEO } from "@/app/lib/utils/seo";
import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";

// Force models to register
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";

export const dynamic = "force-dynamic";

// 2. The getPost function
async function getPost(slug: string) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("coverImage", "url originalName mimeType")
      .populate("gallery", "url originalName mimeType")
      .populate("seo.ogImage", "url originalName mimeType")
      .lean();

    if (!post) return null;
    return { success: true, data: post };
  } catch (err) {
    console.error("❌ getPost direct DB error:", err);
    return null;
  }
}

// 3. Metadata and Page components follow...

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const json = await getPost(slug);

  if (!json?.success) {
    return {
      title: "Post not found | Arihant CMS",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = await getBaseUrl();
  const canonical = `${baseUrl}/blog/${slug}`;
  return resolvePostSEO(json.data, { canonical });
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
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={900}>
          Post not found
        </Typography>
      </Box>
    );
  }

  const post = json.data;
  const cover = post.coverImage?.url || "";

  return (
    <Box>
      {/* ===== HERO ===== */}
      <Box
        sx={{
          mb: 6,
          borderRadius: 5,
          overflow: "hidden",
          position: "relative",
          background: cover
            ? `url(${cover})`
            : "linear-gradient(135deg, #020617, #0f172a)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 420,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(2,6,23,.9), rgba(2,6,23,.2))",
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: { xs: 3, md: 5 },
            maxWidth: 820,
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
            {post.category?.name && (
              <Chip
                label={post.category.name}
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontWeight: 800,
                }}
              />
            )}
            <Chip
              size="small"
              label={readingTime(post.content || "")}
              sx={{ bgcolor: "rgba(255,255,255,.15)", color: "#fff" }}
            />
          </Stack>

          <Typography
            variant="h3"
            fontWeight={950}
            sx={{ lineHeight: 1.15, letterSpacing: -0.8, mb: 1 }}
          >
            {post.title}
          </Typography>

          <Typography sx={{ opacity: 0.85 }}>
            {formatDate(post.publishedAt || post.createdAt)}
          </Typography>
        </Box>
      </Box>

      {/* ===== ARTICLE BODY ===== */}
      <Box sx={{ maxWidth: 820, mx: "auto" }}>
        {/* Tags */}
        <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
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

        {/* Excerpt */}
        {post.excerpt && (
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(180deg, #f8fafc, #ffffff)",
              borderLeft: "4px solid",
              borderColor: "primary.main",
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                lineHeight: 1.9,
                color: "text.secondary",
              }}
            >
              {post.excerpt}
            </Typography>
          </Paper>
        )}

        {/* Content */}
        <Box
          sx={{
            "& p": {
              fontSize: 17,
              lineHeight: 2.05,
              mb: 2.5,
            },
            "& h2": {
              mt: 6,
              mb: 2,
              fontWeight: 900,
              letterSpacing: -0.4,
            },
            "& h3": {
              mt: 4,
              mb: 1.5,
              fontWeight: 900,
            },
            "& ul": { pl: 3, mb: 3 },
            "& li": { mb: 1 },
            "& img": {
              maxWidth: "100%",
              borderRadius: 3,
              my: 3,
              boxShadow: "0 15px 40px rgba(2,6,23,.15)",
            },
            "& blockquote": {
              borderLeft: "4px solid #020617",
              pl: 3,
              py: 1,
              my: 3,
              color: "text.secondary",
              fontStyle: "italic",
              backgroundColor: "#f8fafc",
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <Divider sx={{ my: 6 }} />

        <Link href="/blog" style={{ textDecoration: "none" }}>
          <Typography sx={{ fontWeight: 900 }}>← Back to Blog</Typography>
        </Link>
      </Box>
    </Box>
  );
}
