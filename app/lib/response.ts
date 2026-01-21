import { NextResponse } from "next/server";

export function ok(data: any, message = "Success", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function fail(message = "Something went wrong", status = 500, error?: any) {
  return NextResponse.json(
    { success: false, message, error },
    { status }
  );
}
