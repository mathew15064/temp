import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '../../generated/prisma/client';
import {
  UserQuerySchemaType,
  UserCreateInputSchemaType,
  UserUpdateSchemaType,
  PaginatedUserSchemaType,
  UserSchemaType,
} from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * @function findAll
   *
   * @description Get all users with pagination and filters
   * @param {UserQuerySchemaType} query - Query parameters
   * @returns {Promise<PaginatedUserSchemaType>} Paginated users list
   */
  async findAll(query: UserQuerySchemaType): Promise<PaginatedUserSchemaType> {
    const { email, name, page, limit, sortBy, sortOrder } = query;

    // Build where clause
    const where: any = {};
    
    if (email) {
      where.email = { contains: email};
    }
    
    if (name) {
      where.name = { contains: name};
    }

    // Build orderBy clause
    const orderBy: any = {
      [sortBy]: sortOrder,
    };

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get data from repository
    const { data, total } = await this.userRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * @function findOne
   *
   * @description Find a user by ID
   * @param {number} id - User ID
   * @returns {Promise<UserSchemaType>} User instance
   */
  async findOne(id: number): Promise<UserSchemaType> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * @function create
   *
   * @description Create a new user
   * @param {UserCreateInputSchemaType} data - User data
   * @returns {Promise<UserSchemaType>} Created user instance
   */
  async create(data: UserCreateInputSchemaType): Promise<UserSchemaType> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      is_admin: data.is_admin
    });

    return user;
  }

  /**
   * @function update
   *
   * @description Update a user
   * @param {UserUpdateSchemaType} params - Update parameters
   * @returns {Promise<UserSchemaType>} Updated user instance
   */
  async update(params: UserUpdateSchemaType): Promise<UserSchemaType> {
    const { id, data } = params;

    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if provided
    const updateData: Prisma.userUpdateInput = {
      ...(data.email && { email: data.email }),
      ...(data.name && { name: data.name }),
      ...((data.is_admin || data.is_admin == false) && { is_admin: data.is_admin }),
      ...(data.password && { password: await bcrypt.hash(data.password, 10) }),
    };

    // Update user
    const user = await this.userRepository.update(id, updateData);

    return user;
  }

  /** 
   * @function delete
   *
   * @description Delete a user
   * @param {number} id - User ID
   * @returns {Promise<UserSchemaType>} Deleted user instance
   */
  async delete(id: number): Promise<UserSchemaType> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete user
    const user = await this.userRepository.delete(id);

    return user;
  }
}