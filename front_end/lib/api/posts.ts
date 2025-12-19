import { apiClient } from '@/lib/axios';

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  thumbnail_url?: string;
  author?: { name: string };
  created_at: string;
}

// Thêm interface cho dữ liệu cập nhật
export interface PostUpdateInput {
  title?: string;
  summary?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
  thumbnail_url?: string;
}

export const postsApi = {
  list: async (params?: any) => {
    const response = await apiClient.get('/trpc/posts.list', {
      params: { input: JSON.stringify(params || {}) },
    });
    return response.data.result.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/trpc/posts.create', data);
    return response.data.result.data;
  },

  // THÊM API UPDATE TẠI ĐÂY
    update: async (id: number, data: PostUpdateInput) => {
        const response = await apiClient.post('/trpc/posts.update', {
        // Sửa lỗi cú pháp tại đây: gán giá trị cho key id
        id: Number(id), 
        ...data,
        });
        return response.data.result.data;
    },
  delete: async (id: number) => {
    const response = await apiClient.post('/trpc/posts.delete', { id });
    return response.data.result.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },
    getBySlug: async (slug: string): Promise<Post> => {
        const response = await apiClient.get('/trpc/posts.getBySlug', {
        params: { input: JSON.stringify({ slug }) },
        });
        return response.data.result.data;
    },
  
};