// ====== Start import areas ======
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterInputSchemaType, LoginInputSchemaType, AuthResponseSchemaType } from './auth.schema';
import { UserRepository } from 'src/users/user.repository';
// ====== End import areas ======


@Injectable()
// Auth Service
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  /**
   * @function register
   *
   * @description Function handling user registration
   * @param {RegisterInputSchemaType} request - User name
   * @returns { Promise<User>} Created user instance
   */

  async register(request: RegisterInputSchemaType): Promise<AuthResponseSchemaType> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(request.email);

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // Create user
    const user = await this.userRepository.create({
        email: request.email,
        password: hashedPassword,
        name: request.name,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Save refresh token
    if (tokens.refreshToken) {
      await this.updateRefreshToken(user.id, tokens.refreshToken);
    }

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(input: LoginInputSchemaType): Promise<AuthResponseSchemaType> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, input.isRefreshLogin);

    // Save refresh token
    if (tokens.refreshToken) {
      await this.updateRefreshToken(user.id, tokens.refreshToken);
    }

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<AuthResponseSchemaType> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, true);

    if (tokens.refreshToken) {
      await this.updateRefreshToken(user.id, tokens.refreshToken);
    }

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }


  /**
   * @function generateTokens
   *
   * @description Function handling generation of access and refresh tokens
   * @param {number} userId - User id
   * @param {email} email - User name
   * @param {boolean} isRefreshLogin = false - User name
   * 
   * @returns {accessToken: string, refreshToken: string?} Object containing access and refresh tokens
   */

  private async generateTokens(userId: number, email: string, isRefreshLogin: boolean = false) {
    
    if (!isRefreshLogin) {
      // For refresh login, only generate access token
      const accessToken = await this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' },
      );
      return { accessToken, refreshToken: undefined };
    }
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}