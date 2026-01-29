import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard"; // Ensure admin protection
import { PostService } from "@/app/services/post.service";

// Register models for population to prevent "Missing Schema" errors
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";
import "@/app/models/Post";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/posts/[id]
 */
export async function GET(_: Request, ctx: Ctx) {
  try {
    await connectDB();
    const { id } = await ctx.params; 

    const post = await PostService.findByIdOrSlug(id); 
    
    if (!post) return fail("Post not found", 404);

    return ok(post);
  } catch (err: any) {
    return fail("Failed to fetch post", 500, err?.message);
  }
}

/**
 * DELETE /api/posts/[id]
 * Handles post deletion from the Admin Dashboard
 */
export async function DELETE(_: Request, ctx: Ctx) {
  try {
    // 1. Security Check - Only admins should delete posts
    await requireAdmin(); 
    await connectDB();

    const { id } = await ctx.params;

    // 2. Perform Deletion via Service
    const deleted = await PostService.remove(id);

    if (!deleted) {
      return fail("Post not found or already deleted", 404);
    }

    return ok({ id }, "Post deleted successfully");
  } catch (err: any) {
    // Handle specific guard errors
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    console.error("💥 Delete Error:", err);
    return fail("Failed to delete post", 500, err?.message);
  }
}
/**
 * PATCH /api/posts/[id]
 * Updates an existing post using ID or Slug
 */
export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;
    const body = await req.json(); // Gets the data from your PostForm

    // Calls your PostService.update logic
    const updated = await PostService.update(id, body);

    if (!updated) {
      return fail("Post not found", 404);
    }

    // ✅ Crucial: This returns the JSON body your frontend is looking for
    return ok(updated, "Post updated successfully");

  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    
    console.error("💥 PATCH ERROR:", err);
    // Returning a fail() ensures JSON is sent even on error, 
    // preventing the "Unexpected end of JSON" crash.
    return fail("Failed to update post", 500, err?.message);
  }
}

