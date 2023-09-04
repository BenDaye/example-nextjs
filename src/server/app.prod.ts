import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';
import ws from 'ws';
import { createContext } from './context';
import {
  appLogger,
  env,
  launchShutdownTasks,
  launchStartupTasks,
  redis,
} from './modules';
import { appRouter } from './routers/_app';

const dev = env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto === 'http') {
      // redirect to ssl
      res.writeHead(303, {
        location: `https://` + req.headers.host + (req.headers.url ?? ''),
      });
      res.end();
      return;
    }

    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });
  const wss = new ws.Server({ server });
  const handler = applyWSSHandler({ wss, router: appRouter, createContext });

  redis.once('ready', async () => {
    appLogger.info(
      {
        host: redis.options.host,
        port: redis.options.port,
        db: redis.options.db,
      },
      '✅ Redis Ready',
    );

    await launchStartupTasks();
  });

  const gracefulShutdown = async () => {
    await launchShutdownTasks().finally(() => {
      handler.broadcastReconnectNotification();
    });
  };

  process.once('SIGINT', async () => {
    appLogger.warn('SIGINT');
    await gracefulShutdown();
    process.exit(0);
  });

  process.once('SIGTERM', async () => {
    appLogger.warn('SIGTERM');
    await gracefulShutdown();
    process.exit(0);
  });

  process.once('uncaughtException', async (err) => {
    appLogger.error({ err }, '🤬 Got uncaught exception, process will exit');
    await gracefulShutdown();
    process.exit(1);
  });

  process.once('unhandledRejection', async (err) => {
    appLogger.error({ err }, '🤬 Got unhandled rejection, process will exit');
    await gracefulShutdown();
    process.exit(1);
  });

  server.once('error', async (err) => {
    appLogger.error({ err }, '🤬 Got server error, process will exit');
    await gracefulShutdown();
    process.exit(1);
  });

  server.listen(env.PORT, () => {
    appLogger.info(
      `✅ Server listening at http://localhost:${env.PORT} as ${
        dev ? 'development' : env.NODE_ENV
      }`,
    );
  });
});
