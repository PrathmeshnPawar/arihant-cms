import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { createPostSchema } from "@/app/lib/validators/post.schema";
import { PostService } from "@/app/services/post.service";

export async function GET() {
  try {
    await connectDB();
    const posts = await PostService.findAll();
    return ok(posts);
  } catch (err: any) {
    return fail("Failed to fetch posts", 500, err?.message);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    const created = await PostService.create(parsed.data);
    return ok(created, "Post created", 201);
  } catch (err: any) {
    return fail("Failed to create post", 500, err?.message);
  }
}
