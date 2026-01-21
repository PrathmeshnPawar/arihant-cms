import { User } from "@/app/models/User";
import { hashPassword } from "@/app/lib/auth/password";

export const UserService = {
  async create(dto: any) {
    const exists = await User.findOne({ email: dto.email });
    if (exists) throw new Error("EMAIL_EXISTS");

    const hashed = await hashPassword(dto.password);

    const user = await User.create({
      ...dto,
      password: hashed,
    });

    return user.toJSON(); // remove password
  },

  async findAll() {
    return User.find().select("-password").sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return User.findById(id).select("-password");
  },

  async findByEmail(email: string) {
    return User.findOne({ email }).select("+password");
  },

  async update(id: string, dto: any) {
    const updateData: any = { ...dto };

    if (dto.password) {
      updateData.password = await hashPassword(dto.password);
    }

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    return updated;
  },

  async remove(id: string) {
    return User.findByIdAndDelete(id).select("-password");
  },
};
