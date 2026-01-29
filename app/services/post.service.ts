import { Post } from "./../models/Post";
import mongoose from "mongoose";

export const PostService = {
  async create(dto: any) {
    const post = await Post.create(dto);
    return post;
  },

  async findAll() {
    return Post.find().sort({ createdAt: -1 });
  },

  /**
   * Automatically detects if 'identifier' is an ID or a Slug
   */
  async findByIdOrSlug(identifier: string) {
    const isId = mongoose.Types.ObjectId.isValid(identifier);
    const query = isId ? { _id: identifier } : { slug: identifier };

    return Post.findOne(query)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("coverImage", "url")
      .populate('appFlow.media')
      .lean();
  },

  // app/services/PostService.ts
async update(identifier: string, dto: any) {
  const isId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isId ? { _id: identifier } : { slug: identifier };

  // If the user is trying to update the slug, check if the NEW slug is taken
  if (dto.slug) {
    const existing = await Post.findOne({ slug: dto.slug, _id: { $ne: identifier } });
    if (existing) {
      throw new Error("This slug is already in use by another post.");
    }
  }

  return Post.findOneAndUpdate(
    query,
    { $set: dto },
    {
      new: true,
      runValidators: true,
      // context: 'query' is often needed for unique validators in update
    }
  ).populate("category tags coverImage appFlow.media");
},
  async remove(id: string) {
    return Post.findByIdAndDelete(id);
  },

  
};

