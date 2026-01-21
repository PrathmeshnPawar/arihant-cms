import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/app/lib/auth/cookies";

export async function POST() {
  let res: NextResponse<any> = NextResponse.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });

  res = clearAuthCookie(res);
  return res;
}
