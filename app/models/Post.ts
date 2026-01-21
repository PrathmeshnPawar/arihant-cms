import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // later rich text JSON can be used
    excerpt: { type: String },
    coverImage: { type: String },

    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },

    categories: [{ type: String }],
    tags: [{ type: String }],

    authorId: { type: String }, // later link user model
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", PostSchema);
