import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Post } from "@/app/models/Post";

// Register models for population
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_: Request, ctx: Ctx) {
  try {
    await connectDB();
    const { slug } = await ctx.params;

    // Use findOne with the slug and ensure it's published
    const post = await Post.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("coverImage", "url originalName")
      .lean();

    if (!post) {
      return fail("Post not found", 404);
    }

    return ok(post, "Post fetched successfully");
  } catch (err: any) {
    console.error("❌ PUBLIC SLUG ERROR:", err);
    return fail("Failed to fetch post", 500, err?.message);
  }
}