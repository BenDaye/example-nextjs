import z from 'zod';

/*eslint sort-keys: "warn"*/
export const envSchema = z.object({
  DATABASE_URL: z.string().url().describe('The url for database to connect to'),
  NEXTAUTH_SECRET: z.string().min(32).describe('The secret for next-auth'),
  NEXTAUTH_URL: z
    .string()
    .url()
    .default('http://localhost:3000/api/auth')
    .describe('The url for next-auth'),
  NEXTAUTH_URL_INTERNAL: z
    .string()
    .url()
    .optional()
    .describe('The internal url for next-auth'),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default('http://localhost:3000')
    .describe('The url for app to listen on'),
  NEXT_PUBLIC_APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+(-\S+)?(\+\S+)?$/)
    .default('0.0.0')
    .optional()
    .describe('The version of the app'),
  NEXT_PUBLIC_WS_URL: z
    .string()
    .url()
    .default('ws://localhost:3001')
    .describe('The url for websocket to listen on'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('The environment to run the server in'),
  PORT: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(3000)
    .describe('The port for app to listen on'),
  REDIS_URL: z.string().url().describe('The url for redis to connect to'),
  WS_PORT: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(3001)
    .describe('The port for websocket to listen on'),
});
export type EnvSchema = z.infer<typeof envSchema>;
