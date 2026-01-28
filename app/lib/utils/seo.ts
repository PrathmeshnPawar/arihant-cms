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

  // 1. Ensure absolute image URL
  const featuredImage =
    seo.ogImage?.url || post.coverImage?.url || '/default-og-image.png'

  // 2. Fix the [object Object] bug for publishedTime
  const publishedTime = post.publishedAt || post.createdAt
  const formattedDate =
    publishedTime instanceof Date
      ? publishedTime.toISOString()
      : typeof publishedTime === 'string'
      ? publishedTime
      : undefined

  return {
    title: seo.metaTitle || post.title,
    description: seo.metaDescription || post.excerpt,
    alternates: {
      canonical: seo.canonicalUrl || options?.canonical,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || post.title,
      description: seo.ogDescription || seo.metaDescription || post.excerpt,
      url: options?.url || options?.canonical,
      siteName: 'Arihant CMS',
      type: 'article',
      publishedTime: formattedDate, // Now sends a clean string, not an object
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: seo.metaTitle || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || seo.metaTitle || post.title,
      description: seo.ogDescription || seo.metaDescription || post.excerpt,
      images: [featuredImage],
    },
  }
}
