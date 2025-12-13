import { All, Controller, Inject, OnModuleInit, Req } from '@nestjs/common';
import { Request } from 'express';
import { renderTrpcPanel } from 'trpc-panel';
import { AnyRouter } from '@trpc/server';
import { AppRouterHost } from 'nestjs-trpc';
 
@Controller()
export class TrpcPanelController implements OnModuleInit {
  private appRouter!: AnyRouter;
 
  constructor(
    @Inject(AppRouterHost) private readonly appRouterHost: AppRouterHost,
  ) {}
 
  onModuleInit() {
    this.appRouter = this.appRouterHost.appRouter;
  }
 
  @All('/panel')
  panel(@Req() req: Request): string {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.secure ? 'https' : 'http';
    return renderTrpcPanel(this.appRouter, {
      url: `${protocol}://${host}/trpc`,
    });
  }
}