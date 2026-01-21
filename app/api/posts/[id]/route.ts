import { connectDB } from "@/app/lib/db/connect";
import { ok , fail } from "@/app/lib/response";
import { PostService } from "@/app/services/post.service";
import { updatePostSchema } from "@/app/lib/validators/post.schema";
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const post = await PostService.findById(params.id);
    if (!post) return fail("Post not found", 404);

    return ok(post);
  } catch (err: any) {
    return fail("Failed to fetch post", 500, err?.message);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = updatePostSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    const updated = await PostService.update(params.id, parsed.data);
    if (!updated) return fail("Post not found", 404);

    return ok(updated, "Post updated");
  } catch (err: any) {
    return fail("Failed to update post", 500, err?.message);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deleted = await PostService.remove(params.id);
    if (!deleted) return fail("Post not found", 404);

    return ok(deleted, "Post deleted");
  } catch (err: any) {
    return fail("Failed to delete post", 500, err?.message);
  }
}
