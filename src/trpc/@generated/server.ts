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
    getOne: publicProcedure.input(z.object({
      id: z.number().int().positive().optional(),
      email: z.string().email().optional(),
    })
      .refine(data => data.id || data.email, {
        message: "Phải cung cấp ít nhất một trường 'id' hoặc 'email' để xác định User.",
      })).output(z.object({
        // ID thường là số nguyên và là trường bắt buộc sau khi được tạo

        // Email là chuỗi và phải tuân theo định dạng email hợp lệ
        email: z.string().email(),


        name: z.string().min(1, { message: "Name must not be empty" }).optional().nullable(),


      }).nullable()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email format" }),

      name: z.string().min(1, { message: "Name must not be empty" }).optional(),
    })).output(z.object({
      // ID thường là số nguyên và là trường bắt buộc sau khi được tạo

      // Email là chuỗi và phải tuân theo định dạng email hợp lệ
      email: z.string().email(),


      name: z.string().min(1, { message: "Name must not be empty" }).optional().nullable(),


    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

