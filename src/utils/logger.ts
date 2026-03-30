export class Logger {
  static info(message: string, meta?: unknown): void {
    const timestamp = new Date().toISOString();
    console.error(`[INFO] [${timestamp}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static error(message: string, error?: unknown): void {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`, error ? JSON.stringify(error) : '');
  }

  static debug(message: string, meta?: unknown): void {
    if (process.env.DEBUG) {
      const timestamp = new Date().toISOString();
      console.error(`[DEBUG] [${timestamp}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
  }
}
