import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Post } from "@/app/models/Post";

// ✅ register referenced models
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";

/**
 * GET /api/public/posts?search=&page=1&limit=10
 * - returns ONLY published posts
 * - supports search (title, slug)
 * - supports pagination
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const search = (url.searchParams.get("search") || "").trim();
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get("limit") || "10")),
    );
    const skip = (page - 1) * limit;

    const query: any = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const [total, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .populate("coverImage", "url originalName mimeType")
        .populate("gallery", "url originalName mimeType")
        .populate("seo.ogImage", "url originalName mimeType")
        .select("-content"),
    ]);

    return ok(
      {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Public posts fetched",
    );
  } catch (err: any) {
    console.log("❌ PUBLIC POSTS ERROR:", err);
    return fail("Failed to fetch public posts", 500, err?.message);
  }
}
