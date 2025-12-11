// file: src/users/users.router.ts

import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc';
import { z } from 'zod';
import { UsersService } from './users.service';
import { User, userSchema, UserUpdateInputSchema, UserWhereUniqueInputSchemaType, UserWhereUniqueInputSchema, userCreateSchema, UserCreateInput } from './users.schema'
import { LoggerMiddleware } from '../trpc/middleware/logger.midleware'
import { IAppContext } from 'src/trpc/context/context.interface'


@Router({ alias: 'users' })
@UseMiddlewares(LoggerMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}


  @Query({
    input: UserWhereUniqueInputSchema,
    output: userSchema.nullable()
  })
  getOne(@Input() where: UserWhereUniqueInputSchemaType) {
    return this.usersService.user(where);
  }

  // ------------------------------------
  // QUERY: Lấy danh sách Users (Tương đương: users(params))
  // // ------------------------------------
  // @Query({
  //   // Input Schema cho các tham số phân trang/sắp xếp của Prisma
  //   input: z.object({
  //       skip: z.number().optional(),
  //       take: z.number().optional(),
  //       cursor: UserWhereUniqueInputSchema.optional(),
  //       where: z.any().optional(), // Quá phức tạp để định nghĩa Zod hoàn chỉnh
  //       orderBy: z.any().optional(),
  //   }).optional(), 
  //   output: z.array(userSchema),
  // })
  // getAll(@Input() params: any) {
  //   // Gọi hàm userservice bạn đã tạo
  //   return this.usersService.users(params || {});
  // }

  @Mutation({
    input: userCreateSchema,
    output: userSchema,
  })
  create(@Input() user: UserCreateInput, @Ctx() context: IAppContext) {
    console.log('App Context:', context);
    return this.usersService.createUser(user);
  }

  // // ------------------------------------
  // // MUTATION: Cập nhật User (Tương đương: updateUser(params))
  // // ------------------------------------
  // @Mutation({
  //   input: z.object({
  //     where: UserWhereUniqueInputSchema,
  //     data: UserUpdateInputSchema,
  //   }),
  //   output: userSchema,
  // })
  // update(@Input() params: { where: any; data: any }) {
  //   return this.usersService.updateUser(params);
  // }

  // // ------------------------------------
  // // MUTATION: Xóa User (Tương đương: deleteUser(where))
  // // ------------------------------------
  // @Mutation({
  //   input: UserWhereUniqueInputSchema,
  //   output: z.boolean(), // Trả về boolean (hoặc userSchema nếu muốn trả về đối tượng đã xóa)
  // })
  // delete(@Input() where: UserWhereUniqueInputSchema) {
  //   // Hàm deleteService trả về User, nhưng tRPC cần trả về boolean (thành công/thất bại)
  //   // Bạn có thể chỉnh sửa service hoặc chỉ cần bọc nó lại
  //   return this.usersService.deleteUser(where).then(() => true); 
  // }
}