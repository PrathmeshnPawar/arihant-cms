import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { createCategorySchema } from "@/app/lib/validators/category.schema";
import { CategoryService } from "@/app/services/category.service";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const categories = await CategoryService.findAll();
    return ok(categories);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to fetch categories", 500, err?.message);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    // normalize slug
    parsed.data.slug = parsed.data.slug.toLowerCase().trim();

    const created = await CategoryService.create(parsed.data);
    return ok(created, "Category created", 201);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    if (err?.message === "SLUG_EXISTS") return fail("Slug already exists", 409);

    return fail("Failed to create category", 500, err?.message);
  }
}
