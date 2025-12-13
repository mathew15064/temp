import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from 'src/users/user.repository';

// Auth Module
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'defaultSecretKey',
    }),
  ],
  providers: [AuthService, AuthRouter, JwtStrategy, UserRepository],
  exports: [AuthService, AuthRouter],
})
export class AuthModule {}
