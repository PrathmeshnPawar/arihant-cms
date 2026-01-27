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
      const res = await fetch(`/api/posts/${id}`, {
        credentials: "include",
      });

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

        coverImage: p.coverImage?._id || "",
        coverImageUrl: p.coverImage?.url || "",

        category: p.category?._id || "",
        tags: p.tags?.map((t: any) => t?._id).filter(Boolean) || [],

        seo: {
          metaTitle: p.seo?.metaTitle || "",
          metaDescription: p.seo?.metaDescription || "",
          canonicalUrl: p.seo?.canonicalUrl || "",
          ogTitle: p.seo?.ogTitle || "",
          ogDescription: p.seo?.ogDescription || "",
          ogImage: p.seo?.ogImage?._id || null,
          robotsIndex: p.seo?.robotsIndex ?? true,
          robotsFollow: p.seo?.robotsFollow ?? true,
        },

        gallery: p.gallery?.map((g: any) => g._id) || [],

        appFlow: p.appFlow || [],
      });
    } catch (err) {
      console.error("❌ FETCH POST ERROR:", err);
      setInitial(null);
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
