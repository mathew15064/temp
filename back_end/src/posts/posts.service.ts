import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { postCreateSchema } from './posts.schema';
import { z } from 'zod';

@Injectable()
export class PostsService {
  constructor(private repo: PostsRepository) {}

  /**
   * Tạo slug từ tiêu đề bài viết (hỗ trợ tiếng Việt)
   */
  private generateSlug(title: string) {
    return title.toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') // Xử lý trường hợp nhiều dấu gạch ngang liên tiếp
      + '-' + Date.now();
  }

  /**
   * Helper để xử lý BigInt và các trường Nullable (Tránh lỗi TS18047)
   */
  private serialize(post: any) {
    return {
      ...post,
      id: post.id.toString(), // Luôn convert id BigInt
      // Sử dụng ?. và ?? để tránh lỗi "possibly null"
      view_count: post.view_count?.toString() ?? '0',
      like_count: post.like_count?.toString() ?? '0',
      comment_count: post.comment_count?.toString() ?? '0',
      category_id: post.category_id?.toString() ?? null,
      // Đảm bảo các field thời gian trả về đúng định dạng
      published_at: post.published_at ?? null,
    };
  }

  async findAll(query: { page: number; limit: number; search?: string; status?: any }) {
    const skip = (query.page - 1) * query.limit;
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { summary: { contains: query.search } },
        { slug: { contains: query.search } },
        
        
      ];
    }
    if (query.status) {
      where.status = query.status;
    }

    const { data, total } = await this.repo.findAll({ 
      skip, 
      take: query.limit, 
      where 
    });
    
    // Map qua data để serialize từng bài viết
    const serializedData = data.map(post => this.serialize(post));

    return {
      data: serializedData,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async create(userId: number, input: z.infer<typeof postCreateSchema>) {
    const slug = this.generateSlug(input.title);
    
    const post = await this.repo.create({
      ...input,
      slug,
      author: { connect: { id: userId } },
      published_at: input.status === 'published' ? new Date() : null,
    });

    return this.serialize(post);
  }

  async findById(id: number | bigint) {
    const post = await this.repo.findById(id);
    return post ? this.serialize(post) : null;
  }

  async findBySlug(slug: string) {
    const post = await this.repo.findBySlug(slug);
    return post ? this.serialize(post) : null;
  }
  async update(id: number | bigint, input: any) {
    const post = await this.repo.update(id, {
      ...input,
      // Nếu đổi title thì có thể generate lại slug hoặc không tùy bạn
      updated_at: new Date(),
    });
    return this.serialize(post);
  }

  async delete(id: number | bigint) {
    const post = await this.repo.delete(id);
    return this.serialize(post);
  }
}