export interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    url: string;
  } | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export interface SEOResolvablePost {
  title: string;
  excerpt?: string;
  seo?: PostSEO;

  // ✅ used as OG fallback
  coverImage?: {
    url: string;
  };

}
