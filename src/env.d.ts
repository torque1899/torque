/// <reference types="@cloudflare/workers-types" />

// src/env.d.ts — Cloudflare bindings type definitions
interface CloudflareEnv {
  DB: D1Database;
  R2: R2Bucket;
  JWT_SECRET: string;
  NEXT_PUBLIC_SITE_NAME: string;
  NEXT_PUBLIC_SITE_URL: string;
}
