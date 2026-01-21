import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { createTagSchema } from "@/app/lib/validators/tag.schema";
import { TagService } from "@/app/services/tag.service";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const tags = await TagService.findAll();
    return ok(tags);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to fetch tags", 500, err?.message);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const parsed = createTagSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    parsed.data.slug = parsed.data.slug.toLowerCase().trim();

    const created = await TagService.create(parsed.data);
    return ok(created, "Tag created", 201);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    if (err?.message === "SLUG_EXISTS") return fail("Slug already exists", 409);

    return fail("Failed to create tag", 500, err?.message);
  }
}
