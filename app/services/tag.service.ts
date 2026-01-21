import { Tag } from "@/app/models/Tag";

export const TagService = {
  async create(dto: any) {
    const exists = await Tag.findOne({ slug: dto.slug });
    if (exists) throw new Error("SLUG_EXISTS");

    return Tag.create(dto);
  },

  async findAll() {
    return Tag.find().sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return Tag.findById(id);
  },

  async update(id: string, dto: any) {
    return Tag.findByIdAndUpdate(id, dto, { new: true });
  },

  async remove(id: string) {
    return Tag.findByIdAndDelete(id);
  },
};
