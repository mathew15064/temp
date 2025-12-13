import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  products: t.router({
    getProductById: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      details: z.object({
        description: z.string().optional(),
        rating: z.number().optional(),
      }),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAllProducts: publicProcedure.output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      details: z.object({
        description: z.string().optional(),
        rating: z.number().optional(),
      }),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateProduct: publicProcedure.input(z.object({
      id: z.string(),
      data: z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        details: z.object({
          description: z.string().optional(),
          rating: z.number().optional(),
        }),
      }).partial(),
    })).output(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      details: z.object({
        description: z.string().optional(),
        rating: z.number().optional(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createProduct: publicProcedure.input(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      details: z.object({
        description: z.string().optional(),
        rating: z.number().optional(),
      }),
    })).output(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      details: z.object({
        description: z.string().optional(),
        rating: z.number().optional(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteProduct: publicProcedure.input(z.object({ id: z.string() })).output(z.boolean()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  users: t.router({
    getAll: publicProcedure.input(z.object({
      email: z.string().email().optional(),
      name: z.string().email().optional(),
    })).output(z.object({
      email: z.string().email(),

      name: z
        .string()
        .min(1, { message: 'Name must not be empty' })
        .optional()
        .nullable(),
    }).nullable()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email format' }),
      name: z
        .string({ required_error: 'Name is required' })
        .max(255, { message: 'Name must be less than 255 characters' }),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters long' }),
    })).output(z.object({
      email: z.string().email(),

      name: z
        .string()
        .min(1, { message: 'Name must not be empty' })
        .optional()
        .nullable(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  auth: t.router({
    register: publicProcedure.input(z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address'),

      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),

      name: z.string().max(255, 'Name must be less than 255 characters').optional(),
    })).output(z.object({
      accessToken: z.string(),

      refreshToken: z.string().optional(),

      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string().nullable(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    login: publicProcedure.input(z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email address'),

      password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),

      isRefreshLogin: z.boolean().optional(),
    })).output(z.object({
      accessToken: z.string(),

      refreshToken: z.string().optional(),

      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string().nullable(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    refresh: publicProcedure.input(z.object({
      refreshToken: z.string(),
    })).output(z.object({
      accessToken: z.string(),

      refreshToken: z.string().optional(),

      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string().nullable(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    logout: publicProcedure.output(z.object({ success: z.boolean() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    me: publicProcedure.input(z.void().optional()).output(z.object({
      id: z.number(),
      email: z.string(),
      name: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    validateToken: publicProcedure.input(z.void().optional()).output(z.object({
      valid: z.boolean(),
      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string().nullable(),
      }).nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

