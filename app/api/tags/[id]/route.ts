import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { updateTagSchema } from "@/app/lib/validators/tag.schema";
import { TagService } from "@/app/services/tag.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    const tag = await TagService.findById(id);
    if (!tag) return fail("Tag not found", 404);

    return ok(tag);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to fetch tag", 500, err?.message);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    const body = await req.json();
    const parsed = updateTagSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    if (parsed.data.slug) parsed.data.slug = parsed.data.slug.toLowerCase().trim();

    const updated = await TagService.update(id, parsed.data);
    if (!updated) return fail("Tag not found", 404);

    return ok(updated, "Tag updated");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to update tag", 500, err?.message);
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    const deleted = await TagService.remove(id);
    if (!deleted) return fail("Tag not found", 404);

    return ok(deleted, "Tag deleted");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to delete tag", 500, err?.message);
  }
}
