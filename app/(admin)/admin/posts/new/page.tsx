import PostForm, { PostPayload } from "@/app/components/admin/posts/PostForm";

export default function NewPostPage() {
  const initialValues: PostPayload = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",

    category: "",
    tags: [],

    coverImage: "",
    coverImageUrl: "",

    // ✅ SEO aligns with resolver (minimal, intentional)
    seo: {
      robotsIndex: true,
      robotsFollow: true,
    },

    appFlow: [],
  };

  return <PostForm mode="create" initialValues={initialValues} />;
}
