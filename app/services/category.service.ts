import { Category } from "@/app/models/Category";

export const CategoryService = {
  async create(dto: any) {
    const exists = await Category.findOne({ slug: dto.slug });
    if (exists) throw new Error("SLUG_EXISTS");

    return Category.create(dto);
  },

  async findAll() {
    return Category.find().sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return Category.findById(id);
  },

  async update(id: string, dto: any) {
    return Category.findByIdAndUpdate(id, dto, { new: true });
  },

  async remove(id: string) {
    return Category.findByIdAndDelete(id);
  },
};
