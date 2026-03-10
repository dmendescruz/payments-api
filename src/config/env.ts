import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port: parseInt(optional('PORT', '3000')),
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction: process.env.NODE_ENV === 'production',

  jwt: {
    privateKeyPath: optional('JWT_PRIVATE_KEY_PATH', './keys/private.pem'),
    publicKeyPath: optional('JWT_PUBLIC_KEY_PATH', './keys/public.pem'),
    expiresIn: optional('JWT_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  database: {
    url: optional('DATABASE_URL', 'postgresql://localhost:5432/payments_api'),
  },

  redis: {
    url: optional('REDIS_URL', 'redis://localhost:6379'),
  },

  rateLimit: {
    windowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '60000')),
    maxRequests: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '30')),
  },
};