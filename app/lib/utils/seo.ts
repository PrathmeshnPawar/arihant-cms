// lib/seo.ts
import { Metadata } from 'next'
import { SEOResolvablePost } from '@/app/types/post'

export function resolvePostSEO(
  post: SEOResolvablePost,
  options?: {
    canonical?: string
    url?: string
  }
): Metadata {
  const seo = post.seo ?? {}

  // 1. Determine Sources of Truth
  const finalTitle = seo.metaTitle || post.title
  const finalDescription = seo.metaDescription || post.excerpt
  const featuredImage =
    seo.ogImage?.url || post.coverImage?.url || '/default-og-image.png'

  // 2. CRITICAL FIX: Sanitize the Date
  const rawDate = post.publishedAt || post.createdAt
  let publishedTime: string | undefined = undefined

  if (rawDate) {
    // Check if it's a standard Date object or a MongoDB-style date object
    if (rawDate instanceof Date) {
      publishedTime = rawDate.toISOString()
    } else if (typeof rawDate === 'string') {
      publishedTime = rawDate
    } else if (typeof rawDate === 'object' && '$date' in (rawDate as any)) {
      // Handles the MongoDB JSON format: { $date: "..." }
      publishedTime = new Date((rawDate as any).$date).toISOString()
    }
  }

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: options?.canonical || seo.canonicalUrl,
    },
    openGraph: {
      title: seo.ogTitle || finalTitle,
      description: seo.ogDescription || finalDescription,
      url: options?.url || options?.canonical,
      siteName: 'Arihant CMS',
      type: 'article',
      // Ensure this is a clean string, not [object Object]
      publishedTime: publishedTime,
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || finalTitle,
      description: seo.ogDescription || finalDescription,
      images: [featuredImage],
    },
  }
}
