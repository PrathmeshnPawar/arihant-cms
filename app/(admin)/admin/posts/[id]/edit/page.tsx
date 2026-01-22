"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

import PostForm, { PostPayload } from "@/app/components/admin/posts/PostForm";

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = React.useState(true);
  const [initial, setInitial] = React.useState<PostPayload | null>(null);

  async function fetchPost() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) {
        setInitial(null);
        return;
      }

      const p = json.data;

      setInitial({
        title: p.title || "",
        slug: p.slug || "",
        excerpt: p.excerpt || "",
        content: p.content || "",
        status: p.status || "draft",
        coverImageId: p.coverImageId || "",
        coverImageUrl: p.coverImageUrl || "",
        categories: p.categories || [],
        tags: p.tags || [],
        appFlow: p.appFlow || [],
      });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!initial) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography fontWeight={900}>Post not found</Typography>
      </Box>
    );
  }

  return <PostForm mode="edit" postId={id} initialValues={initial} />;
}
