import { Post } from "@/app/models/Post";
import { connectDB } from "../db/connect";

export const getBlogPage = async (slug: string) => {
  try {
    await connectDB();
    const post = await Post.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("coverImage", "url originalName mimeType")
      .populate("gallery", "url originalName mimeType")
      .populate("seo.ogImage", "url originalName mimeType")
      .populate("appFlow.media", "url originalName mimeType")
      .lean();

    if (!post) return null;
    return { success: true, data: post, post };
  } catch (err) {
    console.error("❌ getPost direct DB error:", err);
    return null;
  }
};
