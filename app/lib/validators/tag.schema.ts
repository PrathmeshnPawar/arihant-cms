import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateTagSchema = createTagSchema.partial();
