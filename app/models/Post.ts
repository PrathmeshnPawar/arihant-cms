import mongoose, { Schema, models, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    excerpt: { type: String, default: "" }, // ✅ add excerpt (useful for SEO fallback)

    // ✅ Relations
    category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

    // ✅ media
    coverImage: { type: Schema.Types.ObjectId, ref: "Media", required: false },
    gallery: [{ type: Schema.Types.ObjectId, ref: "Media" }],

    // ✅ WordPress-style SEO (Yoast/RankMath)
    seo: {
      metaTitle: { type: String, default: "" }, // <= 70 chars recommended
      metaDescription: { type: String, default: "" }, // <= 160 chars recommended
      canonicalUrl: { type: String, default: "" },

      ogTitle: { type: String, default: "" },
      ogDescription: { type: String, default: "" },
      ogImage: { type: Schema.Types.ObjectId, ref: "Media", default: null },

      robotsIndex: { type: Boolean, default: true },
      robotsFollow: { type: Boolean, default: true },
    },

    status: { type: String, enum: ["draft", "published"], default: "draft" },
    content: { type: String, default: "" },

    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);
