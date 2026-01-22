import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Post } from "@/app/models/Post";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * GET /api/public/posts/:slug
 * - returns ONLY published post by slug
 */
export async function GET(_: Request, ctx: Ctx) {
  try {
    await connectDB();

    const { slug } = await ctx.params;

    const post = await Post.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("coverImage", "url originalName mimeType")
      .populate("gallery", "url originalName mimeType") // if you have gallery images
      .select("+content");

    if (!post) return fail("Post not found", 404);

    return ok(post, "Public post fetched");
  } catch (err: any) {
    return fail("Failed to fetch public post", 500, err?.message);
  }
}
