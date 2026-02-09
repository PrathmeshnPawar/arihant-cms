import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";

export const getLatestPosts = async () => {
  await connectDB();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const posts = await Post.find({
    status: "published",
    publishedAt: { $gte: thirtyDaysAgo },
  })
    .sort({ publishedAt: -1 })
    .limit(12)
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

  return { posts };
};
