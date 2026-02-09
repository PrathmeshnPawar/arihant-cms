import { connectDB } from "../db/connect";
import { Category } from "@/app/models/Category";
import { Post } from "@/app/models/Post";

export const getCategoryPosts = async (slug: string) => {
  await connectDB();

  // 1. Find the Category by slug
  const categoryDoc = await Category.findOne({ slug }).lean();
  const posts = await Post.find({
    status: "published",
    category: categoryDoc._id,
  })
    .sort({ publishedAt: -1 })
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

  return { posts, categoryDoc };
};
