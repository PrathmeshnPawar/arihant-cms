import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { formatDate, readingTime } from "../../lib/utils/blogformat"
import { getBaseUrl } from "@/app/lib/utils/baseUrl";

export const dynamic = "force-dynamic";

async function getPosts() {
    const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/public/posts?limit=12`, {
    cache: "no-store",
  });

  return res.json();
}

function clamp2() {
  return {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
  };
}

function clamp3() {
  return {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
  };
}

export default async function BlogPage() {
  const json = await getPosts();
  const posts = json?.data?.posts || [];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: -0.6 }}>
          Blog
        </Typography>
        <Typography color="text.secondary">
          Latest updates and insights
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 2.5,
        }}
      >
        {posts.map((p: any) => {
          const cover = p.coverImage?.url || p.coverImageUrl || "";

          return (
            <Link
              key={p._id}
              href={`/blog/${p.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Paper
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  height: "100%",
                  transition: "0.2s",
                  boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 18px 40px rgba(2,6,23,0.10)",
                  },
                }}
              >
                {/* Cover */}
                <Box
                  sx={{
                    height: 220,
                    bgcolor: "grey.100",
                    backgroundImage: cover ? `url(${cover})` : "none",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />

                <Box sx={{ p: 2.25 }}>
                  {/* Meta */}
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    {p.category?.name && (
                      <Chip
                        size="small"
                        label={p.category.name}
                        component="a"
                        href={`/blog/category/${p.category.slug}`}
                        clickable
                        sx={{ fontWeight: 700 }}
                      />
                    )}

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(p.publishedAt || p.createdAt)} • {readingTime(p.content || "")}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1.3 }} />

                  <Typography variant="h6" fontWeight={900} sx={{ ...clamp2(), mb: 0.7 }}>
                    {p.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ ...clamp3(), fontSize: 14.5 }}>
                    {p.excerpt || "Read the full post →"}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          );
        })}
      </Box>

      {posts.length === 0 && (
        <Typography color="text.secondary">No posts found.</Typography>
      )}
    </Box>
  );
}
