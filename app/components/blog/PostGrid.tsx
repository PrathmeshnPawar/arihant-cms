import Link from "next/link";
import { Box } from "@mui/material";
import PostCard from "@/app/components/blog/PostCard";

export default function PostGrid({ posts }: { posts: any[] }) {
  return (
    <Box
      sx={{
        mt: 3,
        display: "grid",
        gap: 2,
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}
    >
      {posts.map((p: any) => (
        <Link key={p._id} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
          <PostCard post={p} />
        </Link>
      ))}
    </Box>
  );
}
