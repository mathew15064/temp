import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user as User, Prisma } from '../../generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @function findMany
   *
   * @description Find users with filters and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<{data: User[], total: number}>} Users list with total count
   */
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.userWhereInput;
    orderBy?: Prisma.userOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * @function findById
   *
   * @description Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<User | null>} User instance or null
   */
  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * @function findByEmail
   *
   * @description Find user by email
   * @param {string} email - User email
   * @returns {Promise<User | null>} User instance or null
   */
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * @function create
   *
   * @description Create user
   * @param {Prisma.userCreateInput} data - User data
   * @returns {Promise<User>} Created user instance
   */
  create(data: Prisma.userCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * @function update
   *
   * @description Update user
   * @param {number} id - User ID
   * @param {Prisma.userUpdateInput} data - Update data
   * @returns {Promise<User>} Updated user instance
   */
  update(id: number, data: Prisma.userUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * @function delete
   *
   * @description Delete user
   * @param {number} id - User ID
   * @returns {Promise<User>} Deleted user instance
   */
  delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  /**
   * @function updateRefreshToken
   *
   * @description Update user's refresh token
   * @param {number} userId - User id
   * @param {string} refreshToken - Hash refresh token
   * @returns {Promise<User>} Updated user instance
   */
  updateRefreshToken(userId: number, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });
  }

  /**
   * @function updateLogout
   *
   * @description Update user when logging out
   * @param {number} userId - User id
   * @returns {Promise<User>} Updated user instance
   */
  updateLogout(userId: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}