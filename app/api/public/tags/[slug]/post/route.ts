import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Tag } from "@/app/models/Tag";
import { Post } from "@/app/models/Post";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    await connectDB();

    const { slug } = await ctx.params;

    const tag = await Tag.findOne({ slug }).select("_id name slug");
    if (!tag) return fail("Tag not found", 404);

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const query: any = { status: "published", tags: tag._id };

    const [total, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .populate("coverImage", "url originalName mimeType")
        .select("-content"),
    ]);

    return ok(
      {
        tag,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Tag posts fetched"
    );
  } catch (err: any) {
    return fail("Failed to fetch tag posts", 500, err?.message);
  }
}
