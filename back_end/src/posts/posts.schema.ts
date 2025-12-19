import { z } from 'zod';

export const postCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  summary: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  thumbnail_url: z.string().optional(),
  is_featured: z.boolean().optional(),
});

export const postUpdateSchema = z.object({
  id: z.number({
    required_error: "ID bài viết là bắt buộc",
  }),
}).merge(postCreateSchema.partial()); 

export const postQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),    
  slug: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});