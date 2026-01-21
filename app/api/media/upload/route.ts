import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { MediaService } from "@/app/services/media.service";

import path from "path";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return fail(auth.message, auth.status);

    const admin = auth.user;
    await connectDB();

    const formData = await req.formData();

    // ✅ supports both keys:
    // 1) file (single upload)
    // 2) files (multiple upload)
    const files =
      (formData.getAll("files") as File[]).filter(Boolean) ||
      [];

    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) return fail("No file(s) uploaded", 400);

    // ✅ allowed types
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const savedItems: any[] = [];

    for (const file of allFiles) {
      if (!allowed.includes(file.type)) {
        return fail("File type not allowed", 400, { file: file.name, mimeType: file.type });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "bin";
      const uniqueFileName = `${uuid()}.${ext}`;

      const filePath = path.join(uploadDir, uniqueFileName);
      await fs.writeFile(filePath, buffer);

      const url = `/uploads/${uniqueFileName}`;

      const saved = await MediaService.create({
        originalName: file.name,
        fileName: uniqueFileName,
        mimeType: file.type,
        size: file.size,
        url,
        uploadedBy: admin.sub,
      });

      savedItems.push(saved);
    }

    return ok(savedItems, `${savedItems.length} file(s) uploaded`, 201);
  } catch (err: any) {
    return fail("Upload failed", 500, err?.message);
  }
}
