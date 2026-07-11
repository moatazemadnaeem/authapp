import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface Context {
  req: any;
  res: any;
  user?: {
    userId: string;
    email: string;
    tokenVersion: number;
  };
}

@Injectable()
export class TrpcService {
  public readonly trpc = initTRPC.context<Context>().create();
  public readonly procedure = this.trpc.procedure;
  public readonly router = this.trpc.router;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public createContext = async (opts: CreateExpressContextOptions): Promise<Context> => {
    const { req, res } = opts;
    
    let user;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token);
        const dbUser = await this.usersService.findById(payload.sub);
        
        if (dbUser && dbUser.tokenVersion === payload.tokenVersion) {
           user = { userId: payload.sub, email: payload.email, tokenVersion: payload.tokenVersion };
        }
      } catch (err) {
        // Token invalid, user remains undefined
      }
    }
    
    return { req, res, user };
  };

  public readonly protectedProcedure = this.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}
