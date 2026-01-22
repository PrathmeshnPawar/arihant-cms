import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { PostService } from "@/app/services/post.service";
import { updatePostSchema } from "@/app/lib/validators/post.schema";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  try {
    await connectDB();

    const { id } = await ctx.params; // ✅ await params

    const post = await PostService.findById(id);
    if (!post) return fail("Post not found", 404);

    return ok(post);
  } catch (err: any) {
    return fail("Failed to fetch post", 500, err?.message);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await connectDB();

    const { id } = await ctx.params; // ✅ await params

    const body = await req.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    // optional normalize slug
    if ((parsed.data as any).slug) {
      (parsed.data as any).slug = (parsed.data as any).slug.toLowerCase().trim();
    }

    const updated = await PostService.update(id, parsed.data);
    if (!updated) return fail("Post not found", 404);

    return ok(updated, "Post updated");
  } catch (err: any) {
    return fail("Failed to update post", 500, err?.message);
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await connectDB();

    const { id } = await ctx.params; // ✅ await params

    const deleted = await PostService.remove(id);
    if (!deleted) return fail("Post not found", 404);

    return ok(deleted, "Post deleted");
  } catch (err: any) {
    return fail("Failed to delete post", 500, err?.message);
  }
}
