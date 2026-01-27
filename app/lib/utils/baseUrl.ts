import 'server-only'

/**
 * Returns absolute base URL for server-side fetches.
 * Works reliably on Vercel (dev, preview, prod).
 */
export function getBaseUrl() {
  // ✅ Preferred (Vercel-safe)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return process.env.NEXT_PUBLIC_VERCEL_URL
  }

  // 🔁 Fallback for local dev
  return 'http://localhost:3000'
}
