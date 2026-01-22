import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "admin" | "manager";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // ✅ hidden by default (must select("+password") explicitly)
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ remove password automatically when sending JSON
UserSchema.set("toJSON", {
  transform: function (_doc, ret: any) {
    delete ret.password;
    return ret;
  },
});


export const User = models.User || model("User", UserSchema);
