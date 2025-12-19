import { PrismaService } from '../../prisma/prisma.service';

export interface IAppContext {
  req: any;
  res: any;
  prisma: PrismaService;
  user: {
    id: number;
    email: string;
    name: string | null;
    is_admin: boolean | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}