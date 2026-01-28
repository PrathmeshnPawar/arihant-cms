import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Post } from "@/app/models/Post";

// Register models for population
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";
import { PostService } from "@/app/services/post.service";

// app/api/posts/[id]/route.ts

// 1. Update the Type to match the folder name [id]
type Ctx = { params: Promise<{ id: string }> }; 

export async function GET(_: Request, ctx: Ctx) {
  try {
    await connectDB();

    // 2. Destructure 'id' (NOT slug)
    const { id } = await ctx.params; 

    // 3. Pass that 'id' to your service
    const post = await PostService.findByIdOrSlug(id); 
    
    if (!post) return fail("Post not found", 404);

    return ok(post);
  } catch (err: any) {
    return fail("Failed to fetch post", 500, err?.message);
  }
}