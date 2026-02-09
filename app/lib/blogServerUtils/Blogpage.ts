import { Post } from "@/app/models/Post";
import { Category } from "@/app/models/Category";
import { connectDB } from "@/app/lib/db/connect";

export const getPost = async () => {
  await connectDB();
  const posts = await Post.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(20)
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return { posts, categories };
};
