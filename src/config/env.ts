import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3500/api/v2'),
  NEXT_PUBLIC_DATADOG_APPLICATION_ID: z.string().optional(),
  NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_DATADOG_SITE: z.string().optional(),
  NEXT_PUBLIC_DATADOG_SERVICE: z.string().optional(),
  NEXT_PUBLIC_DATADOG_ENV: z.string().optional(),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
}

export const env = validateEnv();
