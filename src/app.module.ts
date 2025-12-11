import { Module } from '@nestjs/common';
import { TrpcModule } from './trpc/trpc.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    TrpcModule,
    ProductsModule,
    UsersModule
  ],
})
export class AppModule {}
