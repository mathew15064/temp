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
  userQuerySchema,
  userIdSchema,
  userCreateSchema,
  userUpdateSchema,
  userSchema,
  paginatedUserSchema,
  UserQuerySchemaType,
  UserIdSchemaType,
  UserCreateInputSchemaType,
  UserUpdateSchemaType,
} from './users.schema';
import { LoggerMiddleware } from '../trpc/middleware/logger.midleware';
import { IAppContext } from 'src/trpc/context/context.interface';
import { AuthGuardMiddleware } from 'src/trpc/middleware/auth-guard.middleware';

// Users Router
@Router({ alias: 'users' })
// Logger middleware applied to all routes in this router
@UseMiddlewares(LoggerMiddleware)
// Auth guard middleware applied to all routes in this router
@UseMiddlewares(AuthGuardMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @function list
   *
   * @description Get all users with pagination and filters
   * @param {UserQuerySchemaType} query - Query parameters (email, name, page, limit, sortBy, sortOrder)
   * @returns {Promise<PaginatedUserSchemaType>} Paginated users list
   */
  @Query({
    input: userQuerySchema,
    output: paginatedUserSchema,
  })
  list(@Input() query: UserQuerySchemaType) {
    return this.usersService.findAll(query);
  }

  /**
   * @function findOne
   *
   * @description Find a user by ID
   * @param {UserIdSchemaType} params - User ID
   * @returns {Promise<UserSchemaType>} User instance
   */
  @Query({
    input: userIdSchema,
    output: userSchema,
  })
  findOne(@Input() params: UserIdSchemaType) {
    return this.usersService.findOne(params.id);
  }

  /**
   * @function create
   *
   * @description Create a new user
   * @param {UserCreateInputSchemaType} user - User data (email, name, password)
   * @param {IAppContext} context - Context app
   * @returns {Promise<UserSchemaType>} Created user instance
   */
  @Mutation({
    input: userCreateSchema,
    output: userSchema,
  })
  create(
    @Input() user: UserCreateInputSchemaType,
    @Ctx() context: IAppContext,
  ) {
    return this.usersService.create(user);
  }

  /**
   * @function update
   *
   * @description Update a user
   * @param {UserUpdateSchemaType} params - Update parameters (id, data)
   * @param {IAppContext} context - Context app
   * @returns {Promise<UserSchemaType>} Updated user instance
   */
  @Mutation({
    input: userUpdateSchema,
    output: userSchema,
  })
  update(
    @Input() params: UserUpdateSchemaType,
    @Ctx() context: IAppContext,
  ) {
    return this.usersService.update(params);
  }

  /**
   * @function delete
   *
   * @description Delete a user
   * @param {UserIdSchemaType} params - User ID
   * @param {IAppContext} context - Context app
   * @returns {Promise<UserSchemaType>} Deleted user instance
   */
  @Mutation({
    input: userIdSchema,
    output: userSchema,
  })
  delete(
    @Input() params: UserIdSchemaType,
    @Ctx() context: IAppContext,
  ) {
    return this.usersService.delete(params.id);
  }
}