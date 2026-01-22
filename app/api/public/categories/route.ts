    import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Category } from "@/app/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .sort({ name: 1 })
      .select("name slug");

    return ok(categories, "Public categories fetched");
  } catch (err: any) {
    return fail("Failed to fetch categories", 500, err?.message);
  }
}
