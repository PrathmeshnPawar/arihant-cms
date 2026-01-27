import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { MediaService } from "@/app/services/media.service";

import { del } from "@vercel/blob";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return fail(auth.message, auth.status);

    await connectDB();

    const { id } = await ctx.params;

    const media = await MediaService.findById(id);
    if (!media) return fail("Media not found", 404);

    // ✅ Delete from Vercel Blob
    try {
      await del(media.url);
    } catch (err) {
      console.warn("Blob already deleted or missing:", media.url);
    }

    // ✅ Delete DB record
    const deleted = await MediaService.remove(id);

    return ok(deleted, "Media deleted");
  } catch (err: any) {
    console.error("❌ DELETE MEDIA ERROR:", err);
    return fail("Failed to delete media", 500, err?.message);
  }
}
