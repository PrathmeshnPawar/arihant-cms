import { User } from "@/app/models/User";
import { hashPassword } from "@/app/lib/auth/password";

export type CreateAdminDto = {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
};

export type UpdateAdminDto = {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
};

export const UserService = {
  // ✅ Create admin
  async create(dto: CreateAdminDto) {
    const email = dto.email.toLowerCase().trim();

    const exists = await User.findOne({ email });
    if (exists) throw new Error("EMAIL_EXISTS");

    const hashed = await hashPassword(dto.password);

    const user = await User.create({
      name: dto.name.trim(),
      email,
      password: hashed,
      role: "admin",
      isActive: dto.isActive ?? true,
    });

    return user.toJSON();
  },

  // ✅ List admins
  async findAll() {
    return User.find().select("-password").sort({ createdAt: -1 });
  },

  // ✅ Find by id
  async findById(id: string) {
    return User.findById(id).select("-password");
  },

  // ✅ Find by email (login)
  async findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  },

  // ✅ Update admin
  async update(id: string, dto: UpdateAdminDto) {
    const updateData: any = { ...dto };

    if (dto.email) updateData.email = dto.email.toLowerCase().trim();
    if (dto.name) updateData.name = dto.name.trim();
    if (dto.password) updateData.password = await hashPassword(dto.password);

    const updated = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return updated;
  },

  // ✅ Delete admin
  async remove(id: string) {
    return User.findByIdAndDelete(id).select("-password");
  },

  // ✅ Activate / Deactivate
  async setActive(id: string, isActive: boolean) {
    return User.findByIdAndUpdate(id, { isActive }, { new: true }).select("-password");
  },
};
