import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { createPostSchema } from "@/app/lib/validators/post.schema";
import { PostService } from "@/app/services/post.service";

import { Post } from "@/app/models/Post";

// ✅ register referenced models (for populate)
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";

/**
 * GET /api/posts?status=draft|published&search=&page=1&limit=10
 * Admin only
 */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const url = new URL(req.url);

    const status = (url.searchParams.get("status") || "").trim(); // draft|published
    const search = (url.searchParams.get("search") || "").trim();

    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const query: any = {};

    // ✅ filter draft/published
    if (status && ["draft", "published"].includes(status)) {
      query.status = status;
    }

    // ✅ search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const [total, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .populate("coverImage", "url originalName mimeType")
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
      "Posts fetched"
    );
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to fetch posts", 500, err?.message);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(); // ✅ ADMIN ONLY
    await connectDB();

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    const created = await PostService.create(parsed.data);
    return ok(created, "Post created", 201);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to create post", 500, err?.message);
  }
}
