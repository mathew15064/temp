import { Router, Query, Mutation, Input, Ctx, UseMiddlewares } from 'nestjs-trpc';
import { PostsService } from './posts.service';
import { postCreateSchema, postQuerySchema, postUpdateSchema } from './posts.schema';
import { AuthGuardMiddleware } from '../trpc/middleware/auth-guard.middleware';
import { IAppContext } from '../trpc/context/context.interface';
import { z } from 'zod';

@Router({ alias: 'posts' })
export class PostsRouter {
  constructor(private service: PostsService) {}

  @Query({ input: postQuerySchema })
  async list(@Input() query: any) {
    return this.service.findAll(query);
  }

  @Mutation({ input: postCreateSchema })
  @UseMiddlewares(AuthGuardMiddleware)
  async create(@Input() input: any, @Ctx() ctx: IAppContext) {
    return this.service.create(ctx.user!.id, input);
  }

  // --- THÊM ROUTER UPDATE TẠI ĐÂY ---
  @Mutation({ input: postUpdateSchema })
  @UseMiddlewares(AuthGuardMiddleware)
  async update(@Input() input: any) {
    // Tách ID ra khỏi dữ liệu cập nhật
    const { id, ...updateData } = input;
    return this.service.update(id, updateData);
  }

  @Mutation({ input: z.object({ id: z.number() }) })
  @UseMiddlewares(AuthGuardMiddleware)
  async delete(@Input() input: { id: number }) {
      return this.service.delete(input.id);
  }
    
  @Query({ input: z.object({ slug: z.string() }) })
    async getBySlug(@Input() input: { slug: string }) {
    return this.service.findBySlug(input.slug);
  }
}