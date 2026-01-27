import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { PostService } from "@/app/services/post.service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    const updated = await PostService.update(id, {
      status: "draft",
      publishedAt: null,
    });

    if (!updated) return fail("Post not found", 404);
    return ok(updated, "Post moved to draft");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to unpublish post", 500, err?.message);
  }
}
