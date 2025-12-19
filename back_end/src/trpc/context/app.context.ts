import { Injectable } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppContext implements TRPCContext {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(opt: ContextOptions) {
    let user: any = null;

    try {
      // Extract token from Authorization header
      const authHeader = opt.req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        // Verify token
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });

        // Get user from database
        user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true,
            email: true,
            name: true,
            is_admin: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      }
    } catch (error) {
      // Token is invalid or expired, user remains null
      console.log('Auth error:', error.message);
    }

    return {
      req: opt.req,
      res: opt.res,
      prisma: this.prisma,
      user,
    };
  }
}