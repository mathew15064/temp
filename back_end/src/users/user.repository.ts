import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user as User, Prisma } from '../../generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: Prisma.userCreateInput) {
    return this.prisma.user.create({ data });
  }

  update(id: number, data: Prisma.userUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
