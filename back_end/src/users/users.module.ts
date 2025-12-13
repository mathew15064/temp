import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRouter } from './users.router';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

// Users Module
@Module({
  providers: [PrismaService, UserRepository, UsersService, UsersRouter],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}