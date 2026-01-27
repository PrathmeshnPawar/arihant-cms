// lib/seo.ts
import { Metadata } from "next";
import { SEOResolvablePost } from "@/app/types/post";

export function resolvePostSEO(
  post: SEOResolvablePost,
  options?: {
    canonical?: string;
    url?: string;
  }
): Metadata {
  const seo = post.seo ?? {};

  return {
    title: seo.metaTitle || post.title,
    description: seo.metaDescription || post.excerpt,

    alternates: {
      canonical: seo.canonicalUrl || options?.canonical,
    },

    openGraph: {
      title: seo.ogTitle || seo.metaTitle || post.title,
      description:
        seo.ogDescription || seo.metaDescription || post.excerpt,
      url: options?.url || options?.canonical,
      images: seo.ogImage
        ? [{ url: seo.ogImage.url }]
        : undefined,
      type: "article",
    },
  };
}
