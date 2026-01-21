import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const updatePostSchema = createPostSchema.partial();
