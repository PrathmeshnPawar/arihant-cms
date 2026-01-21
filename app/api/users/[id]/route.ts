import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { updateUserSchema } from "@/app/lib/validators/user.schema";
import { UserService } from "@/app/services/user.service";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await connectDB();

    const user = await UserService.findById(params.id);
    if (!user) return fail("User not found", 404);

    return ok(user);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to fetch user", 500, err?.message);
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    const updated = await UserService.update(params.id, parsed.data);
    if (!updated) return fail("User not found", 404);

    return ok(updated, "User updated");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to update user", 500, err?.message);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    await connectDB();

    const deleted = await UserService.remove(params.id);
    if (!deleted) return fail("User not found", 404);

    return ok(deleted, "User deleted");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to delete user", 500, err?.message);
  }
}
