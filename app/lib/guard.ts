import { cookies } from "next/headers";
import { verifyJwt } from "./auth/jwt";
import { COOKIE_NAME } from "./auth/cookies";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return { ok: false as const, status: 401, message: "Unauthorized" };

  try {
    const payload = verifyJwt(token);
    return { ok: true as const, user: payload };
  } catch {
    return { ok: false as const, status: 401, message: "Invalid token" };
  }
}

export async function requireAdmin() {
  const result = await getAuthUser();

  if (!result.ok) return result;

  if (result.user.role !== "admin") {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }

  return { ok: true as const, user: result.user };
}
