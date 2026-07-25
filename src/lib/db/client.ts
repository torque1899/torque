// src/lib/db/client.ts
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type Env = {
  DB: D1Database;
  R2: R2Bucket;
  JWT_SECRET: string;
};

export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}
