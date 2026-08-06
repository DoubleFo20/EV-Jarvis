import type { Server } from 'node:http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './lib/prisma';

let server: Server | undefined;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      logger.info('EV-JARVIS API started', {
        environment: env.NODE_ENV,
        port: env.PORT,
      });
    });
  } catch (error) {
    logger.error('Failed to start EV-JARVIS API', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

const shutdown = async (signal: string): Promise<void> => {
  logger.info('Shutdown requested', { signal });

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()));
    });
  }

  await disconnectDatabase();
  process.exit(0);
};

void startServer();

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message });
  process.exit(1);
});
