import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { MediaService } from "@/app/services/media.service";

import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    const media = await MediaService.findById(id);
    if (!media) return fail("Media not found", 404);

    // delete file from disk
    const filePath = path.join(process.cwd(), "public", media.url); 
    // media.url is "/uploads/xyz.png" → this path will be correct

    try {
      await fs.unlink(filePath);
    } catch {
      // file missing, ignore
    }

    const deleted = await MediaService.remove(id);
    return ok(deleted, "Media deleted");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to delete media", 500, err?.message);
  }
}
