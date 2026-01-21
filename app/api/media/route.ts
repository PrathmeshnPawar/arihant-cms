import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { MediaService } from "@/app/services/media.service";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const items = await MediaService.findAll();
    return ok(items);
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to fetch media", 500, err?.message);
  }
}
