# 🚀 Torque — Cloudflare Deployment Guide

## Prerequisites
- [Cloudflare account](https://cloudflare.com) (free)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (already installed: `npm run wrangler`)
- Your code pushed to a GitHub repository

---

## Step 1: Login to Cloudflare via Wrangler

```bash
npx wrangler login
```

This opens your browser to authenticate.

---

## Step 2: Create a D1 Database

```bash
npx wrangler d1 create torque-db
```

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "torque-db"
database_id = "PASTE_YOUR_ID_HERE"   ← update this line
```

---

## Step 3: Run Database Migration

```bash
npm run db:migrate
```

This creates all tables and a default admin user:
- **Email:** `admin@torque.local`
- **Password:** `admin123`

> ⚠️ **Change this password immediately after first login!**

---

## Step 4: Create an R2 Bucket (for image uploads)

```bash
npx wrangler r2 bucket create torque-media
```

The `wrangler.toml` already has the `R2` binding configured.

---

## Step 5: Set Environment Variables

In your Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | A long random string (e.g., 64+ chars) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.pages.dev` |
| `NEXT_PUBLIC_SITE_NAME` | `Torque` |

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step 6: Connect GitHub to Cloudflare Pages

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**
3. Connect your GitHub account and select this repository
4. Configure build settings:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build:cf`
   - **Build output directory:** `.vercel/output/static`
5. Click **Save and Deploy**

---

## Step 7: Local Development

> 💡 **Windows Users:** `@cloudflare/next-on-pages` requires a Unix-compatible shell (`bash`) to compile the Vercel output. Please open **Git Bash** (installed with Git for Windows) or **WSL** in this project directory to run:
> ```bash
> # 1. Build Cloudflare assets
> npm run build:cf
> 
> # 2. Run local preview with D1/R2 bindings
> npm run preview
> ```

For local dev with a simulated D1 database:

```bash
# Run local D1 migration first
npm run db:migrate:local

# Start local dev server with Cloudflare bindings (after running build:cf in Git Bash)
npm run preview
```

Or for plain Next.js dev (no D1/R2, good for UI work):
```bash
npm run dev
```

---

## Custom Domain (Optional)

1. In Cloudflare Pages → Your Project → **Custom domains**
2. Add your domain (e.g., `blog.yourdomain.com`)
3. Cloudflare will automatically configure DNS (if your domain is on Cloudflare)
4. Update `NEXT_PUBLIC_SITE_URL` in environment variables

---

## First Login

1. Go to `https://your-project.pages.dev/login`
2. Login with:
   - Email: `admin@torque.local`
   - Password: `admin123`
3. Go to Admin → Users → Change your password and email

---

## Project Structure Summary

```
torque/
├── src/
│   ├── app/
│   │   ├── (blog)/          ← Public blog pages
│   │   ├── admin/           ← Admin dashboard
│   │   └── api/             ← Edge API routes
│   ├── components/          ← Reusable components
│   └── lib/
│       ├── auth.ts          ← JWT utilities
│       └── db/schema.ts     ← Drizzle ORM schema
├── db/migrations/           ← SQL migrations
├── wrangler.toml            ← Cloudflare config
└── open-next.config.ts      ← OpenNext config
```
