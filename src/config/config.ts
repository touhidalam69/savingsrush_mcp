import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  baseUrl: process.env.BASE_URL || 'https://savingsrush.com/api/public',
  cacheTtl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 3600, // 1 hour
  environment: process.env.NODE_ENV || 'production',
};
