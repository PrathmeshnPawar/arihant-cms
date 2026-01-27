import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";
import { Tag } from "@/app/models/Tag"; // ✅ FIXED

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) return NextResponse.json({ data: [] });

    // 1️⃣ Find matching tags by name
    const matchedTags = await Tag.find(
      { name: { $regex: q, $options: "i" } },
      { _id: 1 }
    );

    const tagIds = matchedTags.map((t: any) => t._id);

    // 2️⃣ Search posts
    const posts = await Post.find(
      {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { excerpt: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
          { "seo.metaTitle": { $regex: q, $options: "i" } },
          { "seo.metaDescription": { $regex: q, $options: "i" } },
          ...(tagIds.length > 0 ? [{ tags: { $in: tagIds } }] : []),
        ],
      },
      {
        title: 1,
        slug: 1,
        status: 1,
      }
    )
      .limit(10)
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      data: posts.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        status: p.status,
      })),
    });
  } catch (err) {
    console.error("Admin search failed:", err);
    return NextResponse.json(
      { data: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
