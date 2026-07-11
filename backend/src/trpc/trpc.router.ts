import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpc: TrpcService) {}

  private createAppRouter() {
    return this.trpc.router({
      hello: this.trpc.procedure
        .input(z.object({ name: z.string().optional() }))
        .query(({ input }) => {
          return {
            greeting: `Hello ${input?.name ? input.name : 'World'}`,
          };
        }),
        
      secretMessage: this.trpc.protectedProcedure
        .query(({ ctx }) => {
          return {
            secret: `Shh! This is a secret message for ${ctx.user.email}!`,
          };
        }),
    });
  }

  public get appRouter() {
    return this.createAppRouter();
  }

  public get createContext() {
    return this.trpc.createContext;
  }
}

export type AppRouter = ReturnType<TrpcRouter['createAppRouter']>;
