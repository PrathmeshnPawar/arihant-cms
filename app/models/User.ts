import mongoose, { Schema, model, models } from "mongoose";

export type UserRole = "admin" | "editor";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // store hashed password only
    password: { type: String, required: true },

    role: { type: String, enum: ["admin", "editor"], default: "editor" },
    isActive: { type: Boolean, default: true },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// IMPORTANT: do not return password in JSON
UserSchema.set("toJSON", {
  transform: function (_doc, ret) {
    delete ret.password;
    return ret;
  },
});

export const User = models.User || model("User", UserSchema);
