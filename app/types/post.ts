export interface PostSEO {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: {
    url: string
  }
  robotsIndex?: boolean
  robotsFollow?: boolean
}

export interface SEOResolvablePost {
  title: string
  excerpt?: string
  seo?: PostSEO

  // ✅ Added proper Date/string types
  publishedAt?: Date | string
  createdAt?: Date | string

  // ✅ Used as OG fallback
  coverImage?: {
    url: string
  }
}
