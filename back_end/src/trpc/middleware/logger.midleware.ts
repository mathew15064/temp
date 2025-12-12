import { Injectable, Logger } from '@nestjs/common';
import { TRPCMiddleware } from 'nestjs-trpc';

@Injectable()
export class LoggerMiddleware implements TRPCMiddleware {
  private readonly logger = new Logger('TRPC');

  async use(opts: any) {
    const start = Date.now();
    const { path, type, next } = opts;

    this.logger.log(`→ ${type} ${path}`);

    try {
      const result = await next();
      const duration = Date.now() - start;
      
      this.logger.log(`✓ ${type} ${path} - ${duration}ms`);
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      // Log detailed error information
      this.logger.error(`✗ ${type} ${path} - ${duration}ms`);
      this.logger.error(`Error name: ${error?.name}`);
      this.logger.error(`Error message: ${error?.message}`);
      this.logger.error(`Error stack: ${error?.stack}`);
      
      // If it's a validation error, log the details
      if (error?.issues) {
        this.logger.error(`Validation issues: ${JSON.stringify(error.issues, null, 2)}`);
      }
      
      // Re-throw the error so tRPC can handle it
      throw error;
    }
  }
}