import PostForm, { PostPayload } from "@/app/components/admin/posts/PostForm";

export default function NewPostPage() {
  const initialValues: PostPayload = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",

    category: "",        // ✅ Category ObjectId
    tags: [],            // ✅ Tag ObjectIds

    coverImage: "",      // ✅ Media ObjectId
    coverImageUrl: "",   // UI preview

    seo: {
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: null,
      robotsIndex: true,
      robotsFollow: true,
    },

    appFlow: [],
  };

  return <PostForm mode="create" initialValues={initialValues} />;
}
