import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { JwtModule } from '@nestjs/jwt';
import { TrpcPanelController } from './trpc-panel.controller';
import { LoggerMiddleware } from './middleware/logger.midleware';
import { AuthGuardMiddleware } from './middleware/auth-guard.middleware';
import { AppContext } from './context/app.context';
import { PrismaModule } from '../prisma/prisma.module';
import { errorFormatter } from './error-formatter';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: 'src/trpc/@generated',
      context: AppContext,
      errorFormatter
    }),
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [TrpcPanelController],
  providers: [LoggerMiddleware, AuthGuardMiddleware, AppContext],
  exports: [AppContext],
})
export class TrpcModule {}