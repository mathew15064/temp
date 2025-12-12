import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ConfigModule must be first to load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      envFilePath: '.env', // Path to your .env file
    }),
    PrismaModule,
    TrpcModule,
    ProductsModule,
    UsersModule,
    AuthModule, // Add AuthModule
  ],
})
export class AppModule {}