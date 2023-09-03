import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { IncomingMessage } from 'http';
import Redis from 'ioredis';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import ws from 'ws';
import { prisma, redis } from './modules';

export interface CreateContextOptions {
  session: Session | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions): Promise<
  CreateContextOptions & {
    prisma: PrismaClient;
    redis: Redis;
  }
> {
  return {
    session: _opts.session,
    prisma,
    redis,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts:
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
    | trpcNext.CreateNextContextOptions,
): Promise<Context> {
  const session = await getSession(opts);
  return await createContextInner({ session });
}
