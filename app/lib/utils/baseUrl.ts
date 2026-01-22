import "server-only";
import { headers } from "next/headers";

export async function getBaseUrl() {
  const h: any = await headers(); // ✅ must await in Next 16

  const get = (key: string) => {
    if (!h) return undefined;
    if (typeof h.get === "function") return h.get(key);
    return h[key];
  };

  const host = get("x-forwarded-host") ?? get("host") ?? "localhost:3000";
  const proto = get("x-forwarded-proto") ?? "http";

  return `${proto}://${host}`;
}
