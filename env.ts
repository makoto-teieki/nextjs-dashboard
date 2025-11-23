import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Type-safe environment variable configuration
 * Using @t3-oss/env-nextjs for runtime validation and type inference
 */
export const env = createEnv({
  /**
   * Server-side environment variables
   * These are only available on the server and are validated at build time
   */
  server: {
    // Database configuration
    // Provide defaults to support build-time without actual env vars
    POSTGRES_URL: z.string().default(''),
    POSTGRES_PRISMA_URL: z.string().optional(),
    POSTGRES_URL_NON_POOLING: z.string().optional(),
    POSTGRES_USER: z.string().optional(),
    POSTGRES_HOST: z.string().optional(),
    POSTGRES_PASSWORD: z.string().optional(),
    POSTGRES_DATABASE: z.string().optional(),

    // Authentication configuration
    // Provide defaults to support build-time without actual env vars
    AUTH_SECRET: z.string().default(''),
    AUTH_URL: z.string().default('http://localhost:3000/api/auth'),

    // Node environment
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  /**
   * Client-side environment variables (NEXT_PUBLIC_*)
   * These are exposed to the browser
   */
  client: {
    // Add client-side environment variables here if needed
    // Example: NEXT_PUBLIC_API_URL: z.string().url(),
  },

  /**
   * Runtime environment variables mapping
   * This tells the library where to read the actual values from
   */
  runtimeEnv: {
    // Server
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    NODE_ENV: process.env.NODE_ENV,

    // Client (if any)
  },

  /**
   * Skip validation during build (optional)
   * Set to true during build if you want to skip validation
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
