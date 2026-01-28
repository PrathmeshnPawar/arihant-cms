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

  // 1. Define single sources of truth
  const finalTitle = seo.metaTitle || post.title
  const finalDescription = seo.metaDescription || post.excerpt
  const finalUrl = options?.url || options?.canonical || seo.canonicalUrl

  // 2. Resolve Image (Ensure absolute URL)
  const featuredImage =
    seo.ogImage?.url || post.coverImage?.url || '/default-og-image.png'

  // 3. Resolve Date (Ensures string output for crawlers)
  const dateValue = post.publishedAt || post.createdAt
  const publishedTime =
    dateValue instanceof Date ? dateValue.toISOString() : (dateValue as string) // Cast because we know it's not an object anymore

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: finalUrl,
    },
    openGraph: {
      title: seo.ogTitle || finalTitle,
      description: seo.ogDescription || finalDescription,
      url: finalUrl,
      siteName: 'Arihant CMS',
      type: 'article',
      publishedTime,
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
