import { applyWSSHandler } from '@trpc/server/adapters/ws';
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

const wss = new ws.Server({ port: env.WS_PORT });
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on('connection', (ws) => {
  appLogger.debug(`🟢 Connection (${wss.clients.size})`);
  ws.once('close', () => {
    appLogger.debug(`🔴 Connection (${wss.clients.size})`);
  });
});
appLogger.debug(`✅ WebSocket Server listening on ${env.NEXT_PUBLIC_WS_URL}`);

redis.once('ready', async () => {
  appLogger.debug(redis.options, '✅ Redis Ready');

  await launchStartupTasks();
});

const gracefulShutdown = async () => {
  await launchShutdownTasks().finally(() => {
    handler.broadcastReconnectNotification();
    wss.close();
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
