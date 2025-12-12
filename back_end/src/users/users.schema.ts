import { z } from 'zod';

export const userSchema = z.object({

  email: z.string().email(),
  
  name: z.string().min(1, { message: "Name must not be empty" }).optional().nullable(),
  

});

export const userCreateSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string({ required_error: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" }),
  name: z.string().min(1, { message: "Name must not be empty" }).optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;

export type User = z.infer<typeof userSchema>;


export const UserWhereUniqueInputSchema = z.object({
  id: z.number().int().positive().optional(),
  email: z.string().email().optional(),
})
.refine(data => data.id || data.email, {
    message: "Phải cung cấp ít nhất một trường 'id' hoặc 'email' để xác định User.",
});



export const UserUpdateInputSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1, { message: "Name must not be empty" }).optional().nullable(),

}).partial();


export type UserWhereUniqueInputSchemaType = z.infer<typeof UserWhereUniqueInputSchema>