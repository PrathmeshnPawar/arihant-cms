import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/db/connect";
import { fail } from "@/app/lib/response";
import { loginSchema } from "@/app/lib/validators/user.schema";
import { UserService } from "@/app/services/user.service";
import { comparePassword } from "@/app/lib/auth/password";
import { signJwt } from "@/app/lib/auth/jwt";
import { setAuthCookie } from "@/app/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ Log DB name
    console.log("✅ Connected DB:", mongoose.connection.name);

    const body = await req.json();
    console.log("✅ Raw body:", body);

    const parsed = loginSchema.safeParse(body);
    console.log("✅ Zod parsed success:", parsed.success);

    if (!parsed.success) {
      console.log("❌ Zod error:", parsed.error.flatten());
      return fail("Validation error", 400, parsed.error.flatten());
    }

    // ✅ normalize email
    const email = parsed.data.email.toLowerCase().trim();
    console.log("✅ Normalized email:", email);

    const user = await UserService.findByEmail(email);

    // ✅ log user details (safe)
    console.log(
      "✅ User fetched:",
      user
        ? {
            id: user._id?.toString(),
            email: user.email,
            role: user.role,
            hasPassword: !!user.password,
            passwordPreview: user.password
              ? String(user.password).slice(0, 20)
              : null,
          }
        : null
    );

    if (!user) return fail("Invalid credentials", 401);

    // ✅ If password not selected, show it clearly
    if (!user.password) {
      console.log("❌ Password is missing in user object.");
      return fail("Password missing in DB query (select issue)", 500);
    }

    // ✅ test bcrypt compare
    const isValid = await comparePassword(parsed.data.password, user.password);
    console.log("✅ Password compare result:", isValid);

    // ✅ also compare with hardcoded just to test
    const testCompare = await comparePassword("123456", user.password);
    console.log("✅ Hardcoded compare('123456'):", testCompare);

    if (!isValid) return fail("Invalid credentials", 401);

    const token = signJwt({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    let res: NextResponse<any> = NextResponse.json({
      success: true,
      message: "Login successful",
      data: { user: user.toJSON() },
    });

    res = setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    console.log("❌ Login route error:", err);
    return fail("Login failed", 500, err?.message);
  }
}
