import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';

const startServer = () => {
  try {
    const port = env.PORT;

    app.listen(port, () => {
      logger.info(`=================================`);
      logger.info(`🚀 EV-JARVIS Server is running`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔌 Port: ${port}`);
      logger.info(`=================================`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unexpected closures
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});
