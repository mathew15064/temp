import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, posts } from '../../generated/prisma/client'; // Import type 'posts'

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tìm danh sách bài viết
   * Sử dụng Prisma.postsWhereInput thay vì Prisma.PostWhereInput
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.postsWhereInput;
    orderBy?: Prisma.postsOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    
    const [data, total] = await Promise.all([
      // Sửa this.prisma.posts (số nhiều, viết thường)
      this.prisma.posts.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { created_at: 'desc' },
        include: { 
          author: { 
            select: { name: true, email: true } 
          } 
        },
      }),
      this.prisma.posts.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Tạo bài viết mới
   * Sử dụng Prisma.postsCreateInput
   */
  async create(data: Prisma.postsCreateInput) {
    return this.prisma.posts.create({
      data,
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    });
  }

  /**
   * Cập nhật bài viết
   * ID là bigint vì trong DB là BIGINT UNSIGNED
   */
  async update(id: number | bigint, data: Prisma.postsUpdateInput) {
    return this.prisma.posts.update({
      where: { id: BigInt(id) }, // Convert sang BigInt để khớp với Prisma Schema
      data,
    });
  }

  /**
   * Xóa bài viết
   */
  async delete(id: number | bigint) {
    return this.prisma.posts.delete({
      where: { id: BigInt(id) },
    });
  }

  /**
   * Tìm theo Slug
   */
  async findBySlug(slug: string) {
    return this.prisma.posts.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, email: true, id: true }
        }
      },
    });
  }
  
  /**
   * Tìm theo ID
   */
  async findById(id: number | bigint) {
    return this.prisma.posts.findUnique({
      where: { id: BigInt(id) },
      include: { author: true }
    });
  }
}