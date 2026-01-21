import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { updateCategorySchema } from "@/app/lib/validators/category.schema";
import { CategoryService } from "@/app/services/category.service";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params; // ✅ await params

    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    if (parsed.data.slug) parsed.data.slug = parsed.data.slug.toLowerCase().trim();

    const updated = await CategoryService.update(id, parsed.data);
    if (!updated) return fail("Category not found", 404);

    return ok(updated, "Category updated");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to update category", 500, err?.message);
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params; // ✅ await params

    const deleted = await CategoryService.remove(id);
    if (!deleted) return fail("Category not found", 404);

    return ok(deleted, "Category deleted");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to delete category", 500, err?.message);
  }

  

}

export async function GET(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    const category = await CategoryService.findById(id);
    if (!category) return fail("Category not found", 404);

    return ok(category);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to fetch category", 500, err?.message);
  }
}
