import { Module } from '@nestjs/common';
import {  UsersService } from './users.service';
import { UsersRouter } from './users.router'; 
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrismaService, UsersService, UsersRouter],
})
export class UsersModule {}