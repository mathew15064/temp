import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsRouter } from './posts.router';

// Users Module
@Module({
  providers: [PrismaService, PostsRepository, PostsService, PostsRouter],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}