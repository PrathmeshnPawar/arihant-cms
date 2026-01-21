import { Media } from "@/app/models/Media";

export const MediaService = {
  async create(dto: any) {
    return Media.create(dto);
  },

  async findAll() {
    return Media.find().sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return Media.findById(id);
  },

  async remove(id: string) {
    return Media.findByIdAndDelete(id);
  },
};
