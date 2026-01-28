"use client";

import { readingTime } from "@/app/lib/utils/blogformat";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

export default function PostCard({ post }: { post: any }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
        transition: "0.2s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 12px 30px rgba(0,0,0,0.10)" },
      }}
    >
      {post.coverImage?.url ? (
        <Box
          component="img"
          src={post.coverImage.url}
          alt={post.title}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
          }}
        />
      ) : (
        <Box sx={{ height: 180, bgcolor: "grey.200" }} />
      )}

      <CardContent>
        <Typography fontWeight={900} fontSize={16} sx={{ mb: 1 }}>
          {post.title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {post.category?.name && <Chip size="small" label={post.category.name} variant="outlined" />}
          {post.status && <Chip size="small" label={post.status} />}
        </Box>

        <Typography
  variant="caption"
  color="text.secondary"
  sx={{ mt: 1, display: "block" }}
>
  {readingTime(post.content)}
  {post.publishedAt && (
    <> • {new Date(post.publishedAt).toLocaleDateString()}</>
  )}
</Typography>

      </CardContent>
    </Card>
  );
}
