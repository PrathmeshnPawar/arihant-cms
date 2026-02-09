import { connectDB } from "@/app/lib/db/connect";
import { Tag } from "@/app/models/Tag";
import { Post } from "@/app/models/Post";

export const getTagPost = async (slug: string) => {
  await connectDB();

  const tagDoc = await Tag.findOne({ slug }).lean();

  if (!tagDoc) {
    return { posts: [], tagDoc: null };
  }

  const posts = await Post.find({
    status: "published",
    tags: tagDoc._id,
  })
    .sort({ publishedAt: -1 })
    .populate("category", "name slug")
    .populate("coverImage", "url")
    .lean();

  return { posts, tagDoc };
};
