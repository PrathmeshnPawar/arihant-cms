import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("❌ MONGODB_URI missing. Add it in .env.local");
  process.exit(1);
}

const uri: string = MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  await mongoose.connect(uri);

  const email = "admin@test.com".toLowerCase().trim();
  const password = "123456";

  const hashed = await bcrypt.hash(password, 10);

  // ✅ FORCE UPSERT
  const admin = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Admin",
        email,
        password: hashed,
        role: "admin",
        isActive: true,
      },
    },
    { upsert: true, new: true }
  );

  console.log("✅ Admin ensured (created/updated) successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Admin ID:", admin._id.toString());

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
