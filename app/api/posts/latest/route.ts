import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db/connect";
import { Post } from "@/app/models/Post";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const days = Number(searchParams.get("days") || 30);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);

    const skip = (page - 1) * limit;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const [posts, total] = await Promise.all([
      Post.find({
        status: "published",
        publishedAt: { $gte: fromDate },
      })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .populate("coverImage", "url")
        .lean(),

      Post.countDocuments({
        status: "published",
        publishedAt: { $gte: fromDate },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("LATEST POSTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch latest posts" },
      { status: 500 }
    );
  }
}
