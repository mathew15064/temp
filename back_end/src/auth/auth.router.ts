import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc';
import { AuthService } from './auth.service';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  authResponseSchema,
} from './auth.schema';
import { LoggerMiddleware } from '../trpc/middleware/logger.midleware';
import { IAppContext } from '../trpc/context/context.interface';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

@Router({ alias: 'auth' })
@UseMiddlewares(LoggerMiddleware)
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: registerSchema,
    output: authResponseSchema,
  })
  async register(@Input() input: RegisterInput) {
    try {
      return await this.authService.register(input);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || 'Registration failed',
      });
    }
  }

    
  @Mutation({
    input: loginSchema,
    output: authResponseSchema,
  })
  async login(@Input() input: LoginInput) {
    try {
      return await this.authService.login(input);
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: error.message || 'Login failed',
      });
    }
  }


  @Mutation({
    input: refreshTokenSchema,
    output: authResponseSchema,
  })
  async refresh(@Input() input: RefreshTokenInput, @Ctx() context: IAppContext) {
    try {
      // Decode refresh token to get user ID
      const decoded = await this.authService['jwtService'].verifyAsync(
        input.refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );

      return await this.authService.refreshTokens(
        decoded.sub,
        input.refreshToken,
      );
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }
  }

  // ------------------------------------
  // MUTATION: Logout user
  // ------------------------------------
  @Mutation({
    input: z.void().optional(),
    output: z.object({ success: z.boolean() }),
  })
  async logout(@Ctx() context: IAppContext) {
    if (!context.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    await this.authService.logout(context.user.id);
    return { success: true };
  }

  // ------------------------------------
  // QUERY: Get current authenticated user
  // ------------------------------------
  @Query({
    input: z.void().optional(),
    output: z.object({
      id: z.number(),
      email: z.string(),
      name: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  })
  async me(@Ctx() context: IAppContext) {
    if (!context.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    return context.user;
  }

  // ------------------------------------
  // QUERY: Validate token (check if token is still valid)
  // ------------------------------------
  @Query({
    input: z.void().optional(),
    output: z.object({
      valid: z.boolean(),
      user: z.object({
        id: z.number(),
        email: z.string(),
        name: z.string().nullable(),
      }).nullable(),
    }),
  })
  async validateToken(@Ctx() context: IAppContext) {
    return {
      valid: !!context.user,
      user: context.user ? {
        id: context.user.id,
        email: context.user.email,
        name: context.user.name,
      } : null,
    };
  }
}