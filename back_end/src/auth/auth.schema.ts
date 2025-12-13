import { z } from 'zod';

// === Schemas ===

// Registration schema
export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),

  name: z.string().max(255, 'Name must be less than 255 characters').optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),

  isRefreshLogin: z.boolean().optional(),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Auth response schema
export const authResponseSchema = z.object({
  accessToken: z.string(),

  refreshToken: z.string().optional(),

  user: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string().nullable(),
  }),
});

// === Types ===
export type RegisterInputSchemaType = z.infer<typeof registerSchema>;
export type LoginInputSchemaType = z.infer<typeof loginSchema>;
export type RefreshTokenInputSchemaType = z.infer<typeof refreshTokenSchema>;
export type AuthResponseSchemaType = z.infer<typeof authResponseSchema>;
