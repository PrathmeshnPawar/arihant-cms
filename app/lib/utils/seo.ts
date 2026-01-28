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

  // 1. Determine Title & Description
  const finalTitle = seo.metaTitle || post.title
  const finalDescription = seo.metaDescription || post.excerpt

  // 2. Resolve Image (Ensure absolute URL for WhatsApp)
  const featuredImage =
    seo.ogImage?.url || post.coverImage?.url || '/default-og-image.png'

  // 3. CRITICAL FIX: Safe Date Serialization
  // We extract the date and force it into an ISO string or null
  const rawDate = post.publishedAt || post.createdAt
  let formattedDate: string | undefined = undefined

  if (rawDate) {
    // If it's a MongoDB $date object from your JSON
    if (typeof rawDate === 'object' && '$date' in rawDate) {
      formattedDate = new Date(rawDate.$date as string).toISOString()
    }
    // If it's a standard Date object
    else if (rawDate instanceof Date) {
      formattedDate = rawDate.toISOString()
    }
    // If it's already a string
    else if (typeof rawDate === 'string') {
      formattedDate = rawDate
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
      // This ensures the inspector shows a string, not [object Object]
      publishedTime: formattedDate,
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
