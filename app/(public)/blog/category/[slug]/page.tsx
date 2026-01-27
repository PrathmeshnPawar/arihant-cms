import type { Metadata } from "next";
import { Container, Typography } from "@mui/material";
import PostGrid from "@/app/components/blog/PostGrid";
import { getBaseUrl } from "@/app/lib/utils/baseUrl";

export const dynamic = "force-dynamic";

async function getCategoryPosts(slug: string) {
  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/public/categories/${slug}/posts?limit=30`,
    { cache: "no-store" }
  );

  return res.json();
}

/** ✅ SEO TAGS */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const json = await getCategoryPosts(params.slug);

  // fallback if category not found
  if (!json?.success) {
    return {
      title: "Category not found | Arihant Blog",
      description: "This category does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const category = json.data.category;

  const title = `${category.name} | Arihant Blog`;
  const description =
    category.description?.trim() ||
    `Browse posts under ${category.name} category on Arihant Blog.`;

  const canonical = `/blog/category/${category.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const json = await getCategoryPosts(params.slug);

  if (!json?.success) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight={900}>
          Category not found
        </Typography>
      </Container>
    );
  }

  const category = json.data.category;
  const posts = json.data.posts || [];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={900}>
        Category: {category.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Showing {posts.length} posts
      </Typography>

      <PostGrid posts={posts} />
    </Container>
  );
}
