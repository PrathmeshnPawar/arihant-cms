import { Post } from "./../models/Post";

export const PostService = {
  async create(dto: any) {
    const post = await Post.create(dto);
    return post;
  },

  async findAll() {
    return Post.find().sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return Post.findById(id);
  },

  async update(id: string, dto: any) {
    return Post.findByIdAndUpdate(id, dto, { new: true });
  },

  async remove(id: string) {
    return Post.findByIdAndDelete(id);
  },
};
