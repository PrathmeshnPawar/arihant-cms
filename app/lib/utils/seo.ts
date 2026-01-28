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

  // 1. Determine the Best Image
  // Priority: Manual OG Image > Post Cover Image > Static Fallback
  const featuredImage =
    seo.ogImage?.url || post.coverImage?.url || '/default-og-image.png'

  const title = seo.metaTitle || post.title
  const description = seo.metaDescription || post.excerpt

  return {
    title,
    description,

    alternates: {
      canonical: seo.canonicalUrl || options?.canonical,
    },

    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: options?.url || options?.canonical,
      type: 'article',
      siteName: 'Arihant CMS',
      // 2. Always provide an image array with dimensions
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // 3. Add Twitter for better mobile link handling
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: [featuredImage],
    },
  }
}
