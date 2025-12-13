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
  RegisterInputSchemaType,
  LoginInputSchemaType,
  RefreshTokenInputSchemaType,
  authResponseSchema,
} from './auth.schema';
import { LoggerMiddleware } from '../trpc/middleware/logger.midleware';
import { AuthGuardMiddleware } from '../trpc/middleware/auth-guard.middleware';
import { IAppContext } from '../trpc/context/context.interface';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Author Router
@Router({ alias: 'auth' })
// Logger middleware applied to all routes in this router
@UseMiddlewares(LoggerMiddleware)

export class AuthRouter {
  constructor(private readonly authService: AuthService) {}


  /**
   * @function register
   *
   * @description Register a new user
   * @param {RegisterInputSchemaType} request - User name
   * @returns { Promise<User[]>} Created user instance
   */
  
  @Mutation({
    input: registerSchema,
    output: authResponseSchema,
  })
  async register(@Input() request: RegisterInputSchemaType) {
    try {
      
      return await this.authService.register(request);
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
  async login(@Input() input: LoginInputSchemaType) {
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
  async refresh(@Input() input: RefreshTokenInputSchemaType, @Ctx() context: IAppContext) {
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


  @Mutation({
    output: z.object({ success: z.boolean() }),
  })
  @UseMiddlewares(AuthGuardMiddleware)
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
  @UseMiddlewares(AuthGuardMiddleware)
  async me(@Ctx() context: IAppContext) {
    if (!context.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    return context.user;
  }

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
  @UseMiddlewares(AuthGuardMiddleware)
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