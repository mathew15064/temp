import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Use individual environment variables
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306');
    const user = process.env.DB_USER|| 'root';
    const password = process.env.DB_PASSWORD || '123456';
    const database = process.env.DB_NAME || 'db_test';
    console.log(password, database);
    
    if (!user || !password || !database) {
      throw new Error('DB_USER, DB_PASSWORD, and DB_NAME must be defined in .env file');
    }

    // this.logger.log(`Connecting to ${database} at ${host}:${port}`);
    
    // Create adapter with individual variables
    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
      acquireTimeout: 10000,
      connectTimeout: 10000,
    });
    
    super({ 
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
    
    this.logger.log('PrismaService initialized with MariaDB adapter');
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
      
      // Test the connection
      await this.$queryRaw`SELECT 1 as test`;
      this.logger.log('✅ Database connection verified');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database');
      this.logger.error('Error:', error.message);
      this.logger.error(`Connection: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
      
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Database disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting from database:', error);
    }
  }
}