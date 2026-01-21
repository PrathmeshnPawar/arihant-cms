import { NextResponse } from "next/server";

// Overload signatures
export function json<T>(data: T): NextResponse<T>;
export function json<T>(data: T, init: ResponseInit): NextResponse<T>;
export function json<T>(data: T, status: number): NextResponse<T>;

// Implementation
export function json<T>(data: T, initOrStatus?: ResponseInit | number) {
  if (typeof initOrStatus === "number") {
    return NextResponse.json(data, { status: initOrStatus }) as NextResponse<T>;
  }

  return NextResponse.json(data, initOrStatus) as NextResponse<T>;
}
