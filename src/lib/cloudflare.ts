// src/lib/cloudflare.ts
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function getCloudflareContext() {
  try {
    const ctx = getRequestContext();
    return {
      env: ctx.env as unknown as CloudflareEnv,
      cf: ctx.cf,
      ctx: ctx.ctx,
    };
  } catch (e) {
    // Fallback for local build process where request context might not be active
    return {
      env: process.env as unknown as CloudflareEnv,
      cf: {},
      ctx: {},
    };
  }
}
