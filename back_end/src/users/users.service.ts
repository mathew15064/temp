
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user as User, Prisma } from '../../generated/prisma/client';
import {User as UserSchema} from './users.schema';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    {id, email} : {id?: number; email?: string}
  ): Promise < User | null > {
    
    const result = await this.prisma.user.findUnique({
      where: {
        id: id, 
      },
      select: {
        id: true,
        name: true,
      },
    });
    
    return result as User | null;
  }
  
  // async createUser(user: Prisma.UserCreateInput): Promise<User> {
  //   return this.prisma.user.create({user});
  // }
  
  
    async createUser(data: Prisma.userCreateInput): Promise<User> {
    return this.prisma.user.create({
      data
    })
  }

  // async users(params: {
  //   skip?: number;
  //   take?: number;
  //   cursor?: Prisma.UserWhereUniqueInput;
  //   where?: Prisma.UserWhereInput;
  //   orderBy?: Prisma.UserOrderByWithRelationInput;
  // }): Promise<User[]> {
  //   const { skip, take, cursor, where, orderBy } = params;
  //   return this.prisma.user.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy,
  //   });
  // }



  // async updateUser(params: {
  //   where: Prisma.UserWhereUniqueInput;
  //   data: Prisma.UserUpdateInput;
  // }): Promise<User> {
  //   const { where, data } = params;
  //   return this.prisma.user.update({
  //     data,
  //     where,
  //   });
  // }

  // async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
  //   return this.prisma.user.delete({
  //     where,
  //   });
  // }
}
