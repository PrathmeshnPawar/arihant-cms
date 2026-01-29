import mongoose, { Schema, models, model } from "mongoose";

const AppFlowStepSchema = new Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  media: { type: Schema.Types.ObjectId, ref: "Media", default: null },
  imageUrl: { type: String, default: "" },
});

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

    coverImage: { type: Schema.Types.ObjectId, ref: "Media", required: false },
    gallery: [{ type: Schema.Types.ObjectId, ref: "Media" }],

    // ✅ ADD THIS: Mobile App Flow
    

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
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
    appFlow: [AppFlowStepSchema],
  },
  
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);