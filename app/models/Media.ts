import mongoose, { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },     // stored file name
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },         // bytes

    url: { type: String, required: true },          // /uploads/xyz.png
    uploadedBy: { type: String },                   // userId (optional)
  },
  { timestamps: true }
);

export const Media = models.Media || model("Media", MediaSchema);
