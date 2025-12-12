import { Injectable, Logger } from '@nestjs/common';
import { TRPCMiddleware } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';

@Injectable()
export class AuthGuardMiddleware implements TRPCMiddleware {
  private readonly logger = new Logger('Auth');

  async use(opts: any) {
    const { path, type, next, ctx } = opts;

    // Check if user is authenticated
    if (!ctx.user) {
      this.logger.warn(`✗ Unauthorized access attempt to ${type} ${path}`);
      
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    // Log successful authentication
    this.logger.log(`✓ Authenticated user ${ctx.user.email} accessing ${type} ${path}`);

    try {
      const result = await next();
      return result;
    } catch (error) {
      // Log error but don't modify it
      this.logger.error(`✗ Error in authenticated route ${type} ${path}`);
      this.logger.error(`User: ${ctx.user.email}, Error: ${error?.message}`);
      
      throw error;
    }
  }
}