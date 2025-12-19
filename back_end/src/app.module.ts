import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import {PostsModule} from './posts/posts.module'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    // ConfigModule must be first to load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Serve thư mục uploads
      serveRoot: '/uploads',
    }),
    PrismaModule,
    TrpcModule,
    UsersModule,
    AuthModule,
    PostsModule
    
  ],
  controllers: [UploadController],
})
export class AppModule {}