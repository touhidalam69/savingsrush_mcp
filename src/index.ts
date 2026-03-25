import { HttpServer } from './server/http';
import { Logger } from './utils/logger';

async function main() {
  Logger.info('Starting SavingsRush MCP Application...');
  try {
    const httpServer = new HttpServer();
    await httpServer.start();
    Logger.info('Application is up and running.');

  } catch (error: any) {
    Logger.error('CRITICAL: Failed to start server', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection at:', promise);
  Logger.error('Reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

main();
