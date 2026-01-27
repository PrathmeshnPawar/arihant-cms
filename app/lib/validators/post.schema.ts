import { z } from "zod";

const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),

  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().nullable().optional(),

  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(1),
  excerpt: z.string().optional(),

  coverImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),

  category: z.string().optional(), // ✅ singular
  tags: z.array(z.string()).optional(),

  status: z.enum(["draft", "published"]).optional(),

  seo: seoSchema.optional(),

  appFlow: z.array(z.any()).optional(), // or AppFlowStep schema
});


export const updatePostSchema = createPostSchema.partial();
