import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { MediaService } from "@/app/services/media.service";

import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return fail(auth.message, auth.status);

    const admin = auth.user;
    await connectDB();

    const formData = await req.formData();

    // supports: files[] OR file
    const files =
      (formData.getAll("files") as File[]).filter(Boolean) || [];

    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] =
      files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) {
      return fail("No file(s) uploaded", 400);
    }

    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    const savedItems: any[] = [];

    for (const file of allFiles) {
      if (!allowed.includes(file.type)) {
        return fail("File type not allowed", 400, {
          file: file.name,
          mimeType: file.type,
        });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "bin";
      const fileName = `${uuid()}.${ext}`;

      // ✅ Upload to Vercel Blob
      const blob = await put(fileName, buffer, {
        access: "public",
        contentType: file.type,
      });

      // ✅ Save metadata to DB (unchanged)
      const saved = await MediaService.create({
        originalName: file.name,
        fileName,
        mimeType: file.type,
        size: file.size,
        url: blob.url,
        uploadedBy: admin.sub,
      });

      savedItems.push(saved);
    }

    return ok(savedItems, `${savedItems.length} file(s) uploaded`, 201);
  } catch (err: any) {
    console.error("❌ UPLOAD ERROR:", err);
    return fail("Upload failed", 500, err?.message);
  }
}
