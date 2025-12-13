// ====== Start import areas ======
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc';
import { UsersService } from './users.service';
import {
  userSchema,
  UserWhereUniqueInputSchemaType,
  userCreateSchema,
  userWhereUniqueInputSchema,
  UserCreateInputSchemaType,
} from './users.schema';
import { LoggerMiddleware } from '../trpc/middleware/logger.midleware';
import { IAppContext } from 'src/trpc/context/context.interface';
import { AuthGuardMiddleware } from 'src/trpc/middleware/auth-guard.middleware';

// ====== End import areas ======


// Users Router
@Router({ alias: 'users' })
// Logger middleware applied to all routes in this router
@UseMiddlewares(LoggerMiddleware)
// Auth guard middleware applied to all routes in this router
@UseMiddlewares(AuthGuardMiddleware)

export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @function getAll
   *
   * @description Get all list user
   * @param {UserWhereUniqueInputSchemaType} where - User name
   * @returns { Promise<User[]>} Created user instance
   */

  @Query({
    input: userWhereUniqueInputSchema,
    output: userSchema.nullable(),
  })
  getAll(@Input() where: UserWhereUniqueInputSchemaType) {
    return this.usersService.user(where);
  }

  /**
   * @function create
   *
   * @description Create a new user
   * @param {UserCreateInputSchemaType} user - User schema type
   * @param {IAppContext} context - context app
   * @returns {Promise<User>} Created user instance
   */

  @Mutation({
    input: userCreateSchema,
    output: userSchema,
  })
  create(@Input() user: UserCreateInputSchemaType, @Ctx() context: IAppContext) {
    return this.usersService.create(user);
  }
}
