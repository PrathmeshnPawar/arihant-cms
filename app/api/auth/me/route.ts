import { connectDB } from "@/app/lib/db/connect";
import { fail, ok } from "@/app/lib/response";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/app/lib/auth/cookies";
import { verifyJwt } from "@/app/lib/auth/jwt";
import { UserService } from "@/app/services/user.service";


export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return fail("Unauthorized", 401);

    const payload = verifyJwt(token);

    const user = await UserService.findById(payload.sub);
    if (!user) return fail("User not found", 404);

    return ok({ user });
  } catch (err: any) {
    return fail("Failed to fetch session", 500, err?.message);
  }
}
