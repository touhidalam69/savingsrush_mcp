import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const cliArgs = process.argv.slice(2);
const transportFromArgs = cliArgs.includes('--stdio')
  ? 'stdio'
  : cliArgs.includes('--http')
    ? 'http'
    : undefined;

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  baseUrl: process.env.BASE_URL || 'https://savingsrush.com/api/public',
  cacheTtl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 43200, // 12 hour
  environment: process.env.NODE_ENV || 'production',
  transport: transportFromArgs || (process.env.TRANSPORT === 'stdio' ? 'stdio' : 'http'),
};
