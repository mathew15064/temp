import { z } from 'zod';

// === Pagination Schema ===
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// === User Query Schema ===
export const userQuerySchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['createdAt', 'email', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// === User ID Schema ===
export const userIdSchema = z.object({
  id: z.number().int().positive(),
});

// === User Create Schema ===
export const userCreateSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  name: z
    .string({ required_error: 'Name is required' })
    .max(255, { message: 'Name must be less than 255 characters' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

// === User Update Schema ===
export const userUpdateSchema = z.object({
  id: z.number().int().positive(),
  data: z.object({
    email: z.string().email().optional(),
    name: z.string().max(255).optional(),
    password: z.string().min(6).optional(),
  }),
});

// === User Response Schema ===
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// === Paginated Response Schema ===
export const paginatedUserSchema = z.object({
  data: z.array(userSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// === Types ===
export type PaginationSchemaType = z.infer<typeof paginationSchema>;
export type UserQuerySchemaType = z.infer<typeof userQuerySchema>;
export type UserIdSchemaType = z.infer<typeof userIdSchema>;
export type UserCreateInputSchemaType = z.infer<typeof userCreateSchema>;
export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;
export type UserSchemaType = z.infer<typeof userSchema>;
export type PaginatedUserSchemaType = z.infer<typeof paginatedUserSchema>;