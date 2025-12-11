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
    // Use dynamic host from the request - works with both localhost and VM IP
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.secure ? 'https' : 'http';
    return renderTrpcPanel(this.appRouter, {
      url: `${protocol}://${host}/trpc`,
      // Or if you want to hardcode for your VM, use WITHOUT trailing slash:
      // url: 'http://192.168.172.139:3000/trpc',
    });
  }
}