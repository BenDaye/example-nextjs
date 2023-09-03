import path from 'path';
import { env } from './env';
import { pino, Logger } from 'pino';
import { existsSync, mkdirSync } from 'fs';

const LOG_DIR = path.join(process.cwd(), 'logs');
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

const pinoGlobal = global as typeof global & {
  appLogger?: Logger;
};

export const appLogger: Logger =
  pinoGlobal?.appLogger ??
  pino({
    msgPrefix: '[APP] ',
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: {
            colorize: false,
            destination: path.join(LOG_DIR, 'app.log'),
            mkdir: true,
          },
          level: 'warn',
        },
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
          level: 'debug',
        },
      ],
    },
  });

if (env.NODE_ENV !== 'production') {
  pinoGlobal.appLogger = appLogger;
}
