// front_end/lib/api/users.ts
import { apiClient } from '@/lib/axios';

export interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserQuery {
  email?: string;
  name?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'email' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  is_admin?: boolean;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  password?: string;
  is_admin?: boolean;
}

export interface PaginatedUsers {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const usersApi = {
  // Lấy danh sách users
    list: async (query?: UserQuery): Promise<PaginatedUsers> => {
    const response = await apiClient.get('/trpc/users.list', {
        params: {
        input: JSON.stringify(query || {}),
        },
    });
    
    return response.data.result.data; 
    },

  // Lấy 1 user theo ID
  getOne: async (id: number): Promise<User> => {
    const response = await apiClient.post('/trpc/users.findOne', { id });
    return response.data.result.data;
  },

  // Tạo user mới
  create: async (data: UserCreateInput): Promise<User> => {
    const response = await apiClient.post('/trpc/users.create', data);
    return response.data.result.data;
  },

  // Cập nhật user
  update: async (id: number, data: UserUpdateInput): Promise<User> => {
    const response = await apiClient.post('/trpc/users.update', {
      id,
      data,
    });
    return response.data.result.data;
  },

  // Xóa user
  delete: async (id: number): Promise<User> => {
    const response = await apiClient.post('/trpc/users.delete', { id });
    return response.data.result.data;
  },
};