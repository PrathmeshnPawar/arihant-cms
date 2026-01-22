import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Category } from "@/app/models/Category";
import { Post } from "@/app/models/Post";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    await connectDB();

    const { slug } = await ctx.params;

    const category = await Category.findOne({ slug }).select("_id name slug");
    if (!category) return fail("Category not found", 404);

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const query: any = { status: "published", category: category._id };

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
        category,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Category posts fetched"
    );
  } catch (err: any) {
    return fail("Failed to fetch category posts", 500, err?.message);
  }
}
