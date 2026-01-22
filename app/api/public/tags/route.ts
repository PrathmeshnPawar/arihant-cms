import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Tag } from "@/app/models/Tag";

export async function GET() {
  try {
    await connectDB();

    const tags = await Tag.find()
      .sort({ name: 1 })
      .select("name slug");

    return ok(tags, "Public tags fetched");
  } catch (err: any) {
    return fail("Failed to fetch tags", 500, err?.message);
  }
}
