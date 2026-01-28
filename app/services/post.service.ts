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
      .populate("coverImage", "url");
  },

  async update(identifier: string, dto: any) {
    const isId = mongoose.Types.ObjectId.isValid(identifier);
    const query = isId ? { _id: identifier } : { slug: identifier };

    return Post.findOneAndUpdate(
      query,
      { $set: dto },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("coverImage", "url");
  },
  async remove(id: string) {
    return Post.findByIdAndDelete(id);
  },
};
