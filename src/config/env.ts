import "server-only";

import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z
    .string()
    .refine((value) => value.startsWith("redis://") || value.startsWith("rediss://"), {
      message: "must use redis:// or rediss://",
    }),
  AUTH_SECRET: z.string().min(32),
});

const rawEnvironment = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
};

const parsedEnvironment = environmentSchema.safeParse(rawEnvironment);

if (!parsedEnvironment.success) {
  const invalidKeys = [
    ...new Set(parsedEnvironment.error.issues.map(({ path }) => path.join(".") || "environment")),
  ];

  throw new Error(`Invalid environment configuration: ${invalidKeys.join(", ")}`);
}

export const env = parsedEnvironment.data;

export type ServerEnvironment = z.infer<typeof environmentSchema>;
