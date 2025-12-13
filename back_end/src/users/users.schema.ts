import { z } from 'zod';
// === Schemas ===


// User schema for filter list
export const userWhereUniqueInputSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().email().optional(),
});

/* User schema for create */
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


export const userSchema = z.object({
  email: z.string().email(),

  name: z
    .string()
    .min(1, { message: 'Name must not be empty' })
    .optional()
    .nullable(),
});


export const UserUpdateInputSchema = z
  .object({
    email: z.string().email().optional(),
    name: z
      .string()
      .min(1, { message: 'Name must not be empty' })
      .optional()
      .nullable(),
  })
  .partial();

// === Types ===

export type UserWhereUniqueInputSchemaType = z.infer<
  typeof userWhereUniqueInputSchema
>;
export type UserCreateInputSchemaType = z.infer<typeof userCreateSchema>;
export type User = z.infer<typeof userSchema>;
