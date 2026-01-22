import { Container, Typography } from "@mui/material";
import PostGrid from "@/app/components/blog/PostGrid";

export const dynamic = "force-dynamic";

async function getCategoryPosts(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/public/categories/${slug}/posts?limit=30`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
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
