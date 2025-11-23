/**
 * Mock environment variables for Jest tests
 * This avoids ESM issues with @t3-oss/env-nextjs in Jest
 */
export const env = {
  // Database configuration
  POSTGRES_URL: 'postgresql://test:test@localhost:5432/test',
  POSTGRES_PRISMA_URL: 'postgresql://test:test@localhost:5432/test',
  POSTGRES_URL_NON_POOLING: 'postgresql://test:test@localhost:5432/test',
  POSTGRES_USER: 'test',
  POSTGRES_HOST: 'localhost',
  POSTGRES_PASSWORD: 'test',
  POSTGRES_DATABASE: 'test',

  // Authentication configuration
  AUTH_SECRET: 'test-secret-key-for-testing-purposes-only',
  AUTH_URL: 'http://localhost:3000/api/auth',

  // Node environment
  NODE_ENV: 'test' as const,
};
