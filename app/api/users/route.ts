import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { createUserSchema } from "@/app/lib/validators/user.schema";
import { UserService } from "@/app/services/user.service";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const users = await UserService.findAll();
    return ok(users);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    return fail("Failed to fetch users", 500, err?.message);
  }
}

export async function POST(req: Request) {
  try {
     await requireAdmin();
    await connectDB();

    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return fail("Validation error", 400, parsed.error.flatten());
    }

    const created = await UserService.create(parsed.data);
    return ok(created, "User created", 201);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);
    if (err?.message === "EMAIL_EXISTS") return fail("Email already exists", 409);

    return fail("Failed to create user", 500, err?.message);
  }
}
